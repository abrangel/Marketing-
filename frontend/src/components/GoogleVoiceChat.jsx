import React, { useContext, useEffect, useState } from 'react';
import { Grid, Container, Typography, List, ListItem, ListItemButton, ListItemText, Paper, Box, CircularProgress, Badge } from '@mui/material';
import LeadContext from '../context/lead/leadContext';
import MessageContext from '../context/message/messageContext';
import MessageHistory from './MessageHistory';
import ChatInput from './ChatInput';

const GoogleVoiceChat = () => {
    const leadContext = useContext(LeadContext);
    const messageContext = useContext(MessageContext);

    const { leads, getGoogleVoiceLeads, loading: leadsLoading } = leadContext;
    const { getMessages, clearMessages, startPolling, stopPolling, messages } = messageContext;

    const [selectedLead, setSelectedLead] = useState(null);
    const [lastViewed, setLastViewed] = useState({});

    // 1. Cargar los contactos de Google Voice
    useEffect(() => {
        getGoogleVoiceLeads();

        return () => {
            if (stopPolling) stopPolling();
            clearMessages();
        };
        // eslint-disable-next-line
    }, []);

    // 2. Efecto para actualizar la lista de leads cuando llegan nuevos mensajes
    useEffect(() => {
      // Si hay un polling activo, significa que estamos en un chat.
      // Recargamos la lista de leads para que el orden (por actividad) se actualice.
      if (messages.length > 0) {
        getGoogleVoiceLeads();
      }
      // eslint-disable-next-line
    }, [messages]);


    // 3. Manejar la selección de un lead
    useEffect(() => {
        if (selectedLead) {
            getMessages(selectedLead.id);
            if (startPolling) startPolling(selectedLead.id);
        } else {
            clearMessages();
            if (stopPolling) stopPolling();
        }
    }, [selectedLead, getMessages, startPolling, stopPolling, clearMessages]);

    const handleLeadSelect = (lead) => {
        setSelectedLead(lead);
        // Marcar como visto
        setLastViewed(prev => ({ ...prev, [lead.id]: new Date().toISOString() }));
    };

    if (leadsLoading) {
        return (
            <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando Chats de Google Voice...</Typography>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Google Voice Chats
            </Typography>
            <Grid container spacing={3}>
                {/* PANEL IZQUIERDO: LISTA DE CONTACTOS */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} style={{ padding: '1rem', height: '70vh', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>Conversaciones</Typography>
                        
                        {leads && leads.length > 0 ? (
                            <List>
                                {leads.map(lead => {
                                    const hasNewMessages = new Date(lead.conversation_updated_at) > new Date(lastViewed[lead.id] || 0);

                                    return (
                                        <ListItem key={lead.id} disablePadding>
                                            <ListItemButton 
                                                onClick={() => handleLeadSelect(lead)}
                                                selected={selectedLead && selectedLead.id === lead.id}
                                            >
                                                <ListItemText 
                                                    primary={lead.name} 
                                                    secondary={lead.phone || lead.email} 
                                                />
                                                {hasNewMessages && (!selectedLead || selectedLead.id !== lead.id) && (
                                                    <Badge color="primary" variant="dot" />
                                                )}
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography color="textSecondary">
                                    No se encontraron conversaciones de Google Voice.
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
                            
                            <ChatInput lead={selectedLead} />
                        </Paper>
                    ) : (
                        <Paper elevation={3} style={{ padding: '1rem', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <Typography variant="h5" color="textSecondary" gutterBottom>
                                💬
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                Selecciona una conversación para ver el chat
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default GoogleVoiceChat;
