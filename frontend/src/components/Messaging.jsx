// Messaging.jsx - CORREGIDO Y OPTIMIZADO
import React, { useContext, useEffect, useState } from 'react';
import { Grid, Container, Typography, List, ListItem, ListItemButton, ListItemText, Paper, Box, CircularProgress } from '@mui/material';
import LeadContext from '../context/lead/leadContext';
import MessageContext from '../context/message/messageContext';
import MessageHistory from './MessageHistory';
import MessageInput from './MessageInput';

const Messaging = () => {
    const leadContext = useContext(LeadContext);
    const messageContext = useContext(MessageContext);

    // Extraemos las funciones y estados del contexto
    const { leads, getLeads, loading: leadsLoading } = leadContext;
    const { getMessages, clearMessages, startPolling, stopPolling } = messageContext;

    const [selectedLead, setSelectedLead] = useState(null);

    // 1. EFECTO PARA CARGAR LOS CONTACTOS (LEADS)
    useEffect(() => {
        console.log('Messaging: Cargando leads...');
        getLeads(); // <--- ESTA LÍNEA ES OBLIGATORIA PARA QUITAR EL LOADING

        // Limpieza al salir del componente
        return () => {
            clearMessages();
            if (stopPolling && typeof stopPolling === 'function') {
                stopPolling();
            }
        };
        // eslint-disable-next-line
    }, []); // Se ejecuta solo una vez al montar

    // 2. EFECTO PARA MANEJAR LA SELECCIÓN DE UN LEAD
    useEffect(() => {
        console.log('🔄 Messaging.jsx: selectedLead cambió:', selectedLead);
        
        if (selectedLead) {
            console.log('🔄 Messaging.jsx: Obteniendo mensajes para:', selectedLead.id);
            getMessages(selectedLead.id);
            
            // Iniciar Polling si existe la función
            if (startPolling && typeof startPolling === 'function') {
                startPolling(selectedLead.id);
            }
        } else {
            // Si no hay lead seleccionado, limpiamos
            clearMessages();
            if (stopPolling && typeof stopPolling === 'function') {
                stopPolling();
            }
        }
    }, [selectedLead]); // Solo depende de selectedLead para evitar re-renderizados locos

    const handleLeadSelect = (lead) => {
        setSelectedLead(lead);
    };

    // Renderizado condicional de carga
    if (leadsLoading) {
        return (
            <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando contactos...</Typography>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Messaging
            </Typography>
            <Grid container spacing={3}>
                {/* PANEL IZQUIERDO: LISTA DE CONTACTOS */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} style={{ padding: '1rem', height: '70vh', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>Your Leads</Typography>
                        
                        {leads && leads.length > 0 ? (
                            <List>
                                {leads.map(lead => (
                                    <ListItem key={lead.id} disablePadding>
                                        <ListItemButton 
                                            onClick={() => handleLeadSelect(lead)}
                                            selected={selectedLead && selectedLead.id === lead.id}
                                        >
                                            <ListItemText 
                                                primary={lead.name} 
                                                secondary={lead.phone || lead.email} 
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography color="textSecondary">
                                    No leads found. Create one to start messaging!
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* PANEL DERECHO: CHAT */}
                <Grid item xs={12} md={8}>
                    {selectedLead ? (
                        <Paper elevation={3} style={{ padding: '1rem', height: '70vh', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                                Chat con: <strong>{selectedLead.name}</strong>
                                {selectedLead.phone && ` (${selectedLead.phone})`}
                            </Typography>
                            
                            <Box style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                                <MessageHistory leadId={selectedLead.id} />
                            </Box>
                            
                            <MessageInput lead={selectedLead} />
                        </Paper>
                    ) : (
                        <Paper elevation={3} style={{ padding: '1rem', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <Typography variant="h5" color="textSecondary" gutterBottom>
                                💬
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                Selecciona un contacto para ver el chat
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Messaging;