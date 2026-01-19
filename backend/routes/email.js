const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');
const nodemailer = require('nodemailer');

// --- Email Templates Routes ---

// @route   GET api/email/templates
// @desc    Get all user's email templates
// @access  Private
router.get('/templates', auth, async (req, res) => {
    try {
        const templates = await pool.query('SELECT * FROM email_templates WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(templates.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/email/templates
// @desc    Create a new email template
// @access  Private
router.post('/templates', auth, async (req, res) => {
    const { name, subject, body } = req.body;

    try {
        const newTemplate = await pool.query(
            'INSERT INTO email_templates (user_id, name, subject, body) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, name, subject, body]
        );
        res.json(newTemplate.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/email/templates/:id
// @desc    Update an email template
// @access  Private
router.put('/templates/:id', auth, async (req, res) => {
    const { name, subject, body } = req.body;

    try {
        let template = await pool.query('SELECT * FROM email_templates WHERE id = $1', [req.params.id]);

        if (template.rows.length === 0) return res.status(404).json({ msg: 'Email template not found' });

        if (template.rows[0].user_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updatedTemplate = await pool.query(
            'UPDATE email_templates SET name = $1, subject = $2, body = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [name, subject, body, req.params.id]
        );

        res.json(updatedTemplate.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/email/templates/:id
// @desc    Delete an email template
// @access  Private
router.delete('/templates/:id', auth, async (req, res) => {
    try {
        let template = await pool.query('SELECT * FROM email_templates WHERE id = $1', [req.params.id]);

        if (template.rows.length === 0) return res.status(404).json({ msg: 'Email template not found' });

        if (template.rows[0].user_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await pool.query('DELETE FROM email_templates WHERE id = $1', [req.params.id]);

        res.json({ msg: 'Email template removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Email Campaigns Routes ---

// @route   GET api/email/campaigns
// @desc    Get all user's email campaigns
// @access  Private
router.get('/campaigns', auth, async (req, res) => {
    try {
        const campaigns = await pool.query('SELECT c.*, et.name as template_name FROM campaigns c JOIN email_templates et ON c.template_id = et.id WHERE c.user_id = $1 ORDER BY c.created_at DESC', [req.user.id]);
        res.json(campaigns.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/email/campaigns
// @desc    Create a new email campaign
// @access  Private
router.post('/campaigns', auth, async (req, res) => {
    const { name, template_id, scheduled_at, recipients } = req.body; // Destructure recipients

    try {
        const newCampaign = await pool.query(
            'INSERT INTO campaigns (user_id, name, template_id, scheduled_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, name, template_id, scheduled_at]
        );

        if (!newCampaign.rows || newCampaign.rows.length === 0) {
            throw new Error('Failed to create campaign - no data returned');
        }
        const campaignId = newCampaign.rows[0].id;

        // Insert recipients into campaign_recipients table
        if (recipients && recipients.length > 0) {
            for (const leadId of recipients) {
                await pool.query(
                    'INSERT INTO campaign_recipients (campaign_id, lead_id) VALUES ($1, $2)',
                    [campaignId, leadId]
                );
            }
        }

        res.json(newCampaign.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/email/campaigns/:id
// @desc    Update an email campaign
// @access  Private
router.put('/campaigns/:id', auth, async (req, res) => {
    const { name, template_id, scheduled_at, status, recipients } = req.body; // Destructure recipients

    try {
        let campaign = await pool.query('SELECT * FROM campaigns WHERE id = $1', [req.params.id]);

        if (campaign.rows.length === 0) return res.status(404).json({ msg: 'Email campaign not found' });

        if (campaign.rows[0].user_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updatedCampaign = await pool.query(
            'UPDATE campaigns SET name = $1, template_id = $2, scheduled_at = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [name, template_id, scheduled_at, status, req.params.id]
        );

        // Update recipients in campaign_recipients table
        // First, delete existing recipients for this campaign
        await pool.query('DELETE FROM campaign_recipients WHERE campaign_id = $1', [req.params.id]);

        // Then, insert new recipients
        if (recipients && recipients.length > 0) {
            for (const leadId of recipients) {
                await pool.query(
                    'INSERT INTO campaign_recipients (campaign_id, lead_id) VALUES ($1, $2)',
                    [req.params.id, leadId]
                );
            }
        }

        res.json(updatedCampaign.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/email/campaigns/:id
// @desc    Delete an email campaign
// @access  Private
router.delete('/campaigns/:id', auth, async (req, res) => {
    try {
        let campaign = await pool.query('SELECT * FROM campaigns WHERE id = $1', [req.params.id]);

        if (campaign.rows.length === 0) return res.status(404).json({ msg: 'Email campaign not found' });

        if (campaign.rows[0].user_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await pool.query('DELETE FROM campaigns WHERE id = $1', [req.params.id]);

        res.json({ msg: 'Email campaign removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/email/campaigns/:id/send
// @desc    Send an email campaign
// @access  Private
router.post('/campaigns/:id/send', auth, async (req, res) => {
    try {
        const campaignId = req.params.id;

        // Fetch campaign details
        const campaignResult = await pool.query(
            'SELECT c.id, c.name as campaign_name, c.template_id, et.subject, et.body FROM campaigns c JOIN email_templates et ON c.template_id = et.id WHERE c.id = $1 AND c.user_id = $2',
            [campaignId, req.user.id]
        );

        if (campaignResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Campaign not found or not authorized' });
        }
        const campaign = campaignResult.rows[0];

        // Fetch leads for this campaign
        const leadsResult = await pool.query(
            'SELECT l.id, l.name, l.email FROM leads l JOIN campaign_recipients cr ON l.id = cr.lead_id WHERE cr.campaign_id = $1',
            [campaignId]
        );
        const leads = leadsResult.rows;

        if (leads.length === 0) {
            return res.status(400).json({ msg: 'No leads associated with this campaign' });
        }

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true', // Use 'true' or 'false' in .env
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send emails to all leads
        for (const lead of leads) {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: lead.email,
                subject: campaign.subject,
                html: campaign.body.replace('{{lead_name}}', lead.name || 'there'), // Basic personalization
            };

            try {
                await transporter.sendMail(mailOptions);
                // Update campaign_recipients status to 'Sent'
                await pool.query(
                    'UPDATE campaign_recipients SET status = $1, sent_at = CURRENT_TIMESTAMP WHERE campaign_id = $2 AND lead_id = $3',
                    ['Sent', campaignId, lead.id]
                );
            } catch (emailErr) {
                console.error(`Failed to send email to ${lead.email}:`, emailErr.message);
                // Update campaign_recipients status to 'Failed'
                await pool.query(
                    'UPDATE campaign_recipients SET status = $1, sent_at = CURRENT_TIMESTAMP WHERE campaign_id = $2 AND lead_id = $3',
                    ['Failed', campaignId, lead.id]
                );
            }
        }

        // Update campaign status to 'Sent'
        await pool.query(
            'UPDATE campaigns SET status = $1, sent_at = CURRENT_TIMESTAMP WHERE id = $2',
            ['Sent', campaignId]
        );

        res.json({ msg: 'Campaign emails sent successfully (or attempted)' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
