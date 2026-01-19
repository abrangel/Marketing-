import React, { useContext, useEffect } from 'react';
import LeadContext from '../context/lead/leadContext';
import LeadItem from './LeadItem';
import { CircularProgress, Typography, Container } from '@mui/material';

const Leads = () => {
    const leadContext = useContext(LeadContext);
    const { leads, getLeads, loading } = leadContext;

    useEffect(() => {
        getLeads();
        // eslint-disable-next-line
    }, [getLeads]);

    if (leads !== null && leads.length === 0 && !loading) {
        return <Typography>Please add a lead</Typography>;
    }

    return (
        <Container>
            {leads !== null && !loading ? (
                <div>
                    {leads.map(lead => (
                        <LeadItem key={lead.id} lead={lead} />
                    ))}
                </div>
            ) : (
                <CircularProgress />
            )}
        </Container>
    );
};

export default Leads;
