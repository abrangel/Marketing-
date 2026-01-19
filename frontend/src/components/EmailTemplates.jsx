import React, { useContext, useEffect } from 'react';
import EmailContext from '../context/email/emailContext';
import EmailTemplateItem from './EmailTemplateItem';
import { CircularProgress, Typography, Container, Grid } from '@mui/material';

const EmailTemplates = () => {
    const emailContext = useContext(EmailContext);
    const { templates, getEmailTemplates, loading } = emailContext;

    useEffect(() => {
        getEmailTemplates();
        // eslint-disable-next-line
    }, []);

    if (templates !== null && templates.length === 0 && !loading) {
        return <Typography>Please create an email template</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Email Templates
            </Typography>
            {templates !== null && !loading ? (
                <Grid container spacing={2}>
                    {templates.map(template => (
                        <Grid item xs={12} sm={6} md={4} key={template.id}>
                            <EmailTemplateItem template={template} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <CircularProgress />
            )}
        </Container>
    );
};

export default EmailTemplates;
