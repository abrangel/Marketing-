import React, { useState, useContext, useEffect } from 'react';
import EmailContext from '../context/email/emailContext';
import { TextField, Button, Container, Typography } from '@mui/material';

const EmailTemplateForm = () => {
    const emailContext = useContext(EmailContext);
    const { addEmailTemplate, updateEmailTemplate, clearCurrentEmailTemplate, currentTemplate } = emailContext;

    useEffect(() => {
        if (currentTemplate !== null) {
            setTemplate(currentTemplate);
        } else {
            setTemplate({
                name: '',
                subject: '',
                body: ''
            });
        }
    }, [emailContext, currentTemplate]);

    const [template, setTemplate] = useState({
        name: '',
        subject: '',
        body: ''
    });

    const { name, subject, body } = template;

    const onChange = e => setTemplate({ ...template, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (currentTemplate === null) {
            addEmailTemplate(template);
        } else {
            updateEmailTemplate(template);
        }
        clearAll();
    };

    const clearAll = () => {
        clearCurrentEmailTemplate();
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" component="h2" gutterBottom>
                {currentTemplate ? 'Edit Email Template' : 'Add Email Template'}
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Template Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <TextField
                    label="Subject"
                    name="subject"
                    value={subject}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <TextField
                    label="Body"
                    name="body"
                    value={body}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={6}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {currentTemplate ? 'Update Template' : 'Add Template'}
                </Button>
                {currentTemplate && (
                    <Button variant="outlined" fullWidth onClick={clearAll} style={{ marginTop: '1rem' }}>
                        Cancel
                    </Button>
                )}
            </form>
        </Container>
    );
};

export default EmailTemplateForm;
