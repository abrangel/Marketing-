import React, { useContext, useEffect } from 'react';
import { Grid, Container } from '@mui/material';
import Leads from './Leads';
import LeadForm from './LeadForm';
import AuthContext from '../context/auth/authContext';

const Home = () => {
    const authContext = useContext(AuthContext);

    useEffect(() => {
        authContext.loadUser();
        // eslint-disable-next-line
    }, []);

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <LeadForm />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Leads />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
