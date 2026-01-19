import React, { useState, useContext, useEffect } from 'react';
import EmailContext from '../context/email/emailContext';
import LeadContext from '../context/lead/leadContext'; // To get leads for recipients
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';

const EmailCampaignForm = () => {
    const emailContext = useContext(EmailContext);
    const leadContext = useContext(LeadContext);
    const { addEmailCampaign, updateEmailCampaign, clearCurrentEmailCampaign, currentCampaign, templates, getEmailTemplates } = emailContext;
    const { leads, getLeads } = leadContext;

    useEffect(() => {
        if (currentCampaign !== null) {
            setCampaign(currentCampaign);
            // Assuming currentCampaign has a leads array or similar for pre-selection
            // setRecipients(currentCampaign.recipients.map(lead => lead.id));
        } else {
            setCampaign({
                name: '',
                template_id: '',
                scheduled_at: '',
            });
            // setRecipients([]);
        }
    }, [currentCampaign]);

    const [campaign, setCampaign] = useState({
        name: '',
        template_id: '',
        scheduled_at: '',
    });
    const [recipients, setRecipients] = useState([]); // For selected lead IDs

    const { name, template_id } = campaign;

    // Helper to format date for datetime-local input
    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Adjust for local timezone offset to display correctly in datetime-local input
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    };

    const scheduled_at_value = formatDateTimeLocal(campaign.scheduled_at);

    const onChange = e => {
        if (e.target.name === 'scheduled_at' && e.target.value) {
            // Convert local datetime-local string to UTC ISO string for storage
            const localDate = new Date(e.target.value);
            setCampaign({ ...campaign, [e.target.name]: localDate.toISOString() });
        } else {
            setCampaign({ ...campaign, [e.target.name]: e.target.value });
        }
    };

    const handleRecipientChange = (event) => {
        setRecipients(event.target.value);
    };

    const onSubmit = e => {
        e.preventDefault();
        const campaignData = { ...campaign, recipients }; // Attach recipients to campaign data
        if (currentCampaign === null) {
            addEmailCampaign(campaignData);
        } else {
            updateEmailCampaign(campaignData);
        }
        clearAll();
    };

    const clearAll = () => {
        clearCurrentEmailCampaign();
        setRecipients([]);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" component="h2" gutterBottom>
                {currentCampaign ? 'Edit Email Campaign' : 'Create Email Campaign'}
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Campaign Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="template-select-label">Email Template</InputLabel>
                    <Select
                        labelId="template-select-label"
                        id="template-select"
                        name="template_id"
                        value={template_id}
                        label="Email Template"
                        onChange={onChange}
                    >
                        {templates && templates.map(template => (
                            <MenuItem key={template.id} value={template.id}>
                                {template.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Scheduled At"
                    name="scheduled_at"
                    type="datetime-local"
                    value={scheduled_at_value}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {/* Lead Recipient Selection */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="recipients-select-label">Select Leads</InputLabel>
                    <Select
                        labelId="recipients-select-label"
                        multiple
                        value={recipients}
                        onChange={handleRecipientChange}
                        renderValue={(selected) => selected.map(id => leads.find(lead => lead.id === id)?.name).join(', ')}
                    >
                        {leads && leads.map((lead) => (
                            <MenuItem key={lead.id} value={lead.id}>
                                <Checkbox checked={recipients.indexOf(lead.id) > -1} />
                                <ListItemText primary={lead.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {currentCampaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
                {currentCampaign && (
                    <Button variant="outlined" fullWidth onClick={clearAll} style={{ marginTop: '1rem' }}>
                        Cancel
                    </Button>
                )}
            </form>
        </Container>
    );
};

export default EmailCampaignForm;
