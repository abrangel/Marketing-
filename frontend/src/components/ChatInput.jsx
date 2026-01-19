import React, { useState, useContext } from 'react';
import MessageContext from '../context/message/messageContext';
import { TextField, Button, Box, Alert, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoodIcon from '@mui/icons-material/Mood';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({ lead }) => {
    const messageContext = useContext(MessageContext);
    const { sendMessage, error, loading } = messageContext;

    const [message, setMessage] = useState('');
    const [localError, setLocalError] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
        setShowPicker(false);
    };

    const onChange = (e) => {
        setMessage(e.target.value);
        if (localError) setLocalError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
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
            await sendMessage(lead, message);
            setMessage('');
        } catch (err) {
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
        <Box sx={{ position: 'relative' }}>
            {showPicker && (
                <Box sx={{ position: 'absolute', bottom: 60, right: 0, zIndex: 1000 }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </Box>
            )}

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
                <IconButton onClick={() => setShowPicker(val => !val)}>
                    <MoodIcon />
                </IconButton>
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

export default ChatInput;
