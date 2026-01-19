import React, { useContext } from 'react';
import LeadContext from '../context/lead/leadContext';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

const LeadItem = ({ lead }) => {
    const leadContext = useContext(LeadContext);
    const { deleteLead, setCurrent, clearCurrent } = leadContext;

    const { id, name, email, phone, status } = lead;

    const onDelete = () => {
        deleteLead(id);
        clearCurrent();
    };

    return (
        <Card style={{ margin: '1rem 0' }}>
            <CardContent>
                <Typography variant="h6" component="h3">
                    {name}
                </Typography>
                {email && <Typography color="textSecondary">{email}</Typography>}
                {phone && <Typography color="textSecondary">{phone}</Typography>}
                <Typography variant="body2" component="p">
                    Status: {status}
                </Typography>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => setCurrent(lead)}>
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

export default LeadItem;
