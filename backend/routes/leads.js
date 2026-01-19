const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

// @route   GET api/leads
// @desc    Get all user's leads
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const leads = await pool.query('SELECT * FROM leads WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(leads.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/leads
// @desc    Add new lead
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, email, phone, status } = req.body;

    try {
        const newLead = await pool.query(
            'INSERT INTO leads (user_id, name, email, phone, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, name, email, phone, status]
        );
        res.json(newLead.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, status } = req.body;

    // Build lead object
    const leadFields = {};
    if (name) leadFields.name = name;
    if (email) leadFields.email = email;
    if (phone) leadFields.phone = phone;
    if (status) leadFields.status = status;

    try {
        let lead = await pool.query('SELECT * FROM leads WHERE id = $1', [req.params.id]);

        if (lead.rows.length === 0) return res.status(404).json({ msg: 'Lead not found' });

        // Make sure user owns lead
        if (lead.rows[0].user_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updatedLead = await pool.query(
            'UPDATE leads SET name = $1, email = $2, phone = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [
                name || lead.rows[0].name,
                email || lead.rows[0].email,
                phone || lead.rows[0].phone,
                status || lead.rows[0].status,
                req.params.id
            ]
        );

        res.json(updatedLead.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let lead = await pool.query('SELECT * FROM leads WHERE id = $1', [req.params.id]);

        if (lead.rows.length === 0) return res.status(404).json({ msg: 'Lead not found' });

        // Make sure user owns lead
        if (lead.rows[0].user_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await pool.query('DELETE FROM leads WHERE id = $1', [req.params.id]);

        res.json({ msg: 'Lead removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/leads/gv-leads
// @desc    Get all user's leads that have a Google Voice email, ordered by conversation activity
// @access  Private
router.get('/gv-leads', auth, async (req, res) => {
    try {
        const leads = await pool.query(
            `SELECT
                l.id,
                l.user_id,
                l.name,
                l.email,
                l.phone,
                l.gv_email,
                c.updated_at AS conversation_updated_at
            FROM
                leads l
            JOIN
                conversations c ON l.id = c.lead_id
            WHERE
                l.user_id = $1 AND l.gv_email IS NOT NULL
            ORDER BY
                c.updated_at DESC`, 
            [req.user.id]
        );
        res.json(leads.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
