import React, { useState, useContext, useEffect } from 'react';
import LeadContext from '../context/lead/leadContext';
import { TextField, Button, Container, Typography } from '@mui/material';

const LeadForm = () => {
    const leadContext = useContext(LeadContext);
    const { addLead, updateLead, clearCurrent, current } = leadContext;

    useEffect(() => {
        if (current !== null) {
            setLead(current);
        } else {
            setLead({
                name: '',
                email: '',
                phone: '',
                status: 'New'
            });
        }
    }, [leadContext, current]);

    const [lead, setLead] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'New'
    });

    const { name, email, phone, status } = lead;

    const onChange = e => setLead({ ...lead, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (current === null) {
            addLead(lead);
        } else {
            updateLead(lead);
        }
        clearAll();
    };

    const clearAll = () => {
        clearCurrent();
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" component="h2" gutterBottom>
                {current ? 'Edit Lead' : 'Add Lead'}
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
                <TextField
                    label="Status"
                    name="status"
                    value={status}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {current ? 'Update Lead' : 'Add Lead'}
                </Button>
                {current && (
                    <Button variant="outlined" fullWidth onClick={clearAll} style={{ marginTop: '1rem' }}>
                        Cancel
                    </Button>
                )}
            </form>
        </Container>
    );
};

export default LeadForm;
