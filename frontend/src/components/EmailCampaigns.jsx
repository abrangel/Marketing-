import React, { useContext, useEffect } from 'react';
import EmailContext from '../context/email/emailContext';
import EmailCampaignItem from './EmailCampaignItem';
import { CircularProgress, Typography, Container, Grid } from '@mui/material';

const EmailCampaigns = () => {
    const emailContext = useContext(EmailContext);
    const { campaigns, getEmailCampaigns, loading } = emailContext;

    useEffect(() => {
        getEmailCampaigns();
        // eslint-disable-next-line
    }, []);

    if (campaigns !== null && campaigns.length === 0 && !loading) {
        return <Typography>Please create an email campaign</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Email Campaigns
            </Typography>
            {campaigns !== null && !loading ? (
                <Grid container spacing={2}>
                    {campaigns.map(campaign => (
                        <Grid item xs={12} sm={6} md={4} key={campaign.id}>
                            <EmailCampaignItem campaign={campaign} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <CircularProgress />
            )}
        </Container>
    );
};

export default EmailCampaigns;
