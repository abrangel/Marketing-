import React from 'react';
import { Grid, Container } from '@mui/material';
import EmailTemplates from './EmailTemplates';
import EmailTemplateForm from './EmailTemplateForm';

const EmailTemplatePage = () => {
    return (
        <Container style={{ marginTop: '2rem' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <EmailTemplateForm />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EmailTemplates />
                </Grid>
            </Grid>
        </Container>
    );
};

export default EmailTemplatePage;
