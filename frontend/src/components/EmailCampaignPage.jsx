import React, { useEffect, useContext } from 'react';
import { Grid, Container } from '@mui/material';
import EmailCampaigns from './EmailCampaigns';
import EmailCampaignForm from './EmailCampaignForm';
import EmailContext from '../context/email/emailContext';
import LeadContext from '../context/lead/leadContext';

const EmailCampaignPage = () => {
    const emailContext = useContext(EmailContext);
    const leadContext = useContext(LeadContext);

    useEffect(() => {
        emailContext.getEmailTemplates();
        leadContext.getLeads();
        // eslint-disable-next-line
    }, []);

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <EmailCampaignForm />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EmailCampaigns />
                </Grid>
            </Grid>
        </Container>
    );
};

export default EmailCampaignPage;
