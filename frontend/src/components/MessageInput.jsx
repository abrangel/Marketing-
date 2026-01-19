import React, { useState, useContext } from 'react';
import MessageContext from '../context/message/messageContext';
import { TextField, Button, Box, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ lead }) => {
    const messageContext = useContext(MessageContext);
    const { sendMessage, error, loading } = messageContext;

    const [message, setMessage] = useState('');
    const [localError, setLocalError] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value);
        if (localError) setLocalError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        console.log('🟡 [MessageInput] Submitting form...');
        console.log('🟡 Lead:', lead);
        console.log('🟡 Mensaje:', message);

        if (!lead || !lead.id) {
            setLocalError('No hay lead seleccionado');
            return;
        }

        if (!lead.phone) {
            setLocalError('El lead no tiene número de teléfono');
            return;
        }

        if (message.trim() === '') {
            setLocalError('El mensaje no puede estar vacío');
            return;
        }

        try {
            setLocalError('');
            console.log('🟡 Llamando a sendMessage...');
            
            await sendMessage(lead, message);
            
            console.log('✅ Mensaje enviado desde frontend');
            setMessage('');
            
        } catch (err) {
            console.error('❌ Error en onSubmit:', err);
            setLocalError('Error enviando mensaje: ' + err.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <Box>
            {(error || localError) && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {localError || error}
                </Alert>
            )}
            
            <Box 
                component="form" 
                onSubmit={onSubmit} 
                display="flex" 
                alignItems="center" 
                gap={1}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Escribe tu mensaje..."
                    value={message}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    error={!!localError}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    endIcon={<SendIcon />}
                    disabled={loading || !message.trim()}
                >
                    {loading ? 'Enviando...' : 'Enviar'}
                </Button>
            </Box>
        </Box>
    );
};

export default MessageInput;