import React, { useContext, useEffect, useRef, useState } from 'react';
import MessageContext from '../context/message/messageContext';
import AuthContext from '../context/auth/authContext';
import { Typography, Box, Paper } from '@mui/material';

const MessageHistory = ({ leadId }) => {
    const messageContext = useContext(MessageContext);
    const authContext = useContext(AuthContext);

    const { messages, loading, error, getMessages } = messageContext;
    const { user } = authContext;

    const messagesEndRef = useRef(null);
    const [localMessages, setLocalMessages] = useState([]);

    useEffect(() => {
        if (leadId) {
            console.log(`📥 Fetching messages for lead: ${leadId}`);
            getMessages(leadId);
        }
    }, [leadId]);

    // Sincronizar mensajes locales con el contexto
    useEffect(() => {
        if (messages && Array.isArray(messages)) {
            console.log(`📨 Messages updated:`, messages);
            setLocalMessages(messages);
        }
    }, [messages]);

    useEffect(() => {
        // Scroll to bottom cuando hay nuevos mensajes
        if (localMessages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [localMessages]);

    console.log('👤 User object:', user);
    console.log('💬 Local messages:', localMessages);

    if (loading && localMessages.length === 0) {
        return <Typography>Loading messages...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    if (!localMessages || localMessages.length === 0) {
        return <Typography color="textSecondary">No messages yet. Start the conversation!</Typography>;
    }

    return (
        <Box sx={{ padding: 1 }}>
            {localMessages.map((message, index) => {
                const isCurrentUser = message.sender_type === 'user' && message.sender_id === user?.id;
                
                return (
                    <Box
                        key={message.id || `msg-${index}-${message.sent_at}`}
                        sx={{
                            display: 'flex',
                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                            marginBottom: '0.5rem'
                        }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                padding: '0.5rem 1rem',
                                borderRadius: '1rem',
                                maxWidth: '70%',
                                backgroundColor: isCurrentUser ? '#e0f7fa' : '#f5f5f5',
                                border: isCurrentUser ? '1px solid #b2ebf2' : '1px solid #e0e0e0'
                            }}
                        >
                            <Typography variant="caption" color="textSecondary" display="block">
                                {isCurrentUser ? 'You' : 'Lead'} - {new Date(message.sent_at).toLocaleTimeString()}
                            </Typography>
                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                {message.body}
                            </Typography>
                        </Paper>
                    </Box>
                );
            })}
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default MessageHistory;