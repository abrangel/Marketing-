import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import MessageContext from './messageContext';
import messageReducer from './messageReducer';
import {
    GET_MESSAGES,
    MESSAGE_ERROR,
    CLEAR_MESSAGES,
    SET_LOADING
} from '../types';

let pollingInterval = null;

const MessageState = (props) => {
    const initialState = {
        messages: [],
        error: null,
        loading: false
    };

    const [state, dispatch] = useReducer(messageReducer, initialState);

    // OBTENER TOKEN SIEMPRE
    const getConfig = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        };
    };

    // OBTENER MENSAJES
    const getMessages = useCallback(async (leadId) => {
        if (!leadId) return;
        try {
            const res = await axios.get(`/api/messages/${leadId}`, getConfig());
            dispatch({
                type: GET_MESSAGES,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: MESSAGE_ERROR,
                payload: err.response?.data?.error || 'Error al cargar mensajes'
            });
        }
    }, []);

    // ENVIAR MENSAJE
    const sendMessage = useCallback(async (lead, messageBody) => {
        if (!lead?.id || !messageBody) return;

        // Determinar el endpoint basado en si el lead tiene gv_email
        const endpoint = lead.gv_email
            ? `/api/messages/gv-reply/${lead.id}`
            : `/api/messages/lead/${lead.id}`;

        console.log(`Enviando a: ${endpoint}`); // Log para depuración

        try {
            // Enviamos mensaje al endpoint correcto
            const res = await axios.post(
                endpoint,
                { message: messageBody },
                getConfig()
            );

            // INMEDIATAMENTE recargamos la lista de mensajes para verlo en pantalla
            if (res.data) {
                getMessages(lead.id);
            }
            return res.data;

        } catch (err) {
            console.error("Error enviando:", err);
            dispatch({
                type: MESSAGE_ERROR,
                payload: err.response?.data?.error || 'Error enviando mensaje'
            });
            // Re-throw para que el componente sepa del error
            throw err; 
        }
    }, [getMessages]);
    
    const clearMessages = useCallback(() => {
        dispatch({ type: CLEAR_MESSAGES });
    }, []);

    // POLLING
    const startPolling = useCallback((leadId) => {
        if (pollingInterval) clearInterval(pollingInterval); // Limpia si ya existe
        pollingInterval = setInterval(() => {
            getMessages(leadId);
        }, 3000); // Cada 3 segundos
    }, [getMessages]);

    const stopPolling = useCallback(() => {
        if (pollingInterval) clearInterval(pollingInterval);
        pollingInterval = null;
    }, []);


    return (
        <MessageContext.Provider
            value={{
                messages: state.messages,
                error: state.error,
                loading: state.loading,
                getMessages,
                sendMessage,
                clearMessages,
                startPolling,
                stopPolling
            }}
        >
            {props.children}
        </MessageContext.Provider>
    );
};

export default MessageState;