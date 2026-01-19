import React, { useContext } from 'react';
import EmailContext from '../context/email/emailContext';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import axios from 'axios';

const EmailCampaignItem = ({ campaign }) => {
    const emailContext = useContext(EmailContext);
    const { deleteEmailCampaign, setCurrentEmailCampaign, getEmailCampaigns } = emailContext;

    const { id, name, template_name, status, scheduled_at, sent_at } = campaign;

    const onDelete = () => {
        deleteEmailCampaign(id);
    };

    // Function to send campaign
    const onSend = async () => {
        try {
            await axios.post(`/api/email/campaigns/${id}/send`);
            console.log(`Campaign ${name} (ID: ${id}) sent successfully.`);
            getEmailCampaigns(); // Refresh campaigns list
        } catch (err) {
            console.error(`Failed to send campaign ${name} (ID: ${id}):`, err.response.data.msg);
        }
    };


    return (
        <Card style={{ margin: '1rem 0' }}>
            <CardContent>
                <Typography variant="h6" component="h3">
                    {name}
                </Typography>
                <Typography color="textSecondary">Template: {template_name}</Typography>
                <Typography variant="body2" component="p">
                    Status: {status}
                </Typography>
                {scheduled_at && <Typography variant="body2" component="p">Scheduled: {new Date(scheduled_at).toLocaleString()}</Typography>}
                {sent_at && <Typography variant="body2" component="p">Sent: {new Date(sent_at).toLocaleString()}</Typography>}
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => setCurrentEmailCampaign(campaign)}>
                            Edit
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={onDelete}>
                            Delete
                        </Button>
                    </Grid>
                    {status === 'Draft' && (
                        <Grid item>
                            <Button variant="contained" color="success" onClick={onSend}>
                                Send Now
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default EmailCampaignItem;
