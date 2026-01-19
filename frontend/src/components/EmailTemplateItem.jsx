import React, { useContext } from 'react';
import EmailContext from '../context/email/emailContext';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

const EmailTemplateItem = ({ template }) => {
    const emailContext = useContext(EmailContext);
    const { deleteEmailTemplate, setCurrentEmailTemplate } = emailContext;

    const { id, name, subject, body } = template;

    const onDelete = () => {
        deleteEmailTemplate(id);
    };

    return (
        <Card style={{ margin: '1rem 0' }}>
            <CardContent>
                <Typography variant="h6" component="h3">
                    {name}
                </Typography>
                <Typography color="textSecondary">Subject: {subject}</Typography>
                <Typography variant="body2" component="p">
                    {body.substring(0, 100)}...
                </Typography>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => setCurrentEmailTemplate(template)}>
                            Edit
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={onDelete}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default EmailTemplateItem;
