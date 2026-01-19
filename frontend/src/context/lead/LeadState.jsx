import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import LeadContext from './leadContext';
import leadReducer from './leadReducer';
import {
    GET_LEADS,
    ADD_LEAD,
    DELETE_LEAD,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_LEAD,
    FILTER_LEADS,
    CLEAR_FILTER,
    LEAD_ERROR,
    CLEAR_LEADS
} from '../types';

const LeadState = props => {
    const initialState = {
        leads: null,
        current: null,
        filtered: null,
        error: null,
        loading: true
    };

    const [state, dispatch] = useReducer(leadReducer, initialState);

    // --- FUNCIÓN AUXILIAR PARA OBTENER EL CONFIG CON EL TOKEN ---
    // Esto asegura que el Token SIEMPRE viaje en la petición
    const getConfig = () => {
        const token = localStorage.getItem('token'); // Buscamos el token guardado
        return {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token // Lo pegamos explícitamente
            }
        };
    };

    // Get Leads
    const getLeads = useCallback(async () => {
        try {
            // Usamos getConfig() aquí para asegurarnos de tener autorización
            const res = await axios.get(`/api/leads?_t=${Date.now()}`, getConfig());
            
            dispatch({
                type: GET_LEADS,
                payload: res.data
            });
        } catch (err) {
            console.error('Error en getLeads:', err.response?.data);
            dispatch({
                type: LEAD_ERROR,
                payload: err.response?.data?.msg || 'Error obteniendo leads'
            });
        }
    }, []);

    // Add Lead
    const addLead = useCallback(async lead => {
        try {
            const res = await axios.post('/api/leads', lead, getConfig());
            dispatch({
                type: ADD_LEAD,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: LEAD_ERROR,
                payload: err.response?.data?.msg
            });
        }
    }, []);

    // Delete Lead
    const deleteLead = useCallback(async id => {
        try {
            // Axios delete necesita el config como segundo argumento
            await axios.delete(`/api/leads/${id}`, getConfig());
            dispatch({
                type: DELETE_LEAD,
                payload: id
            });
        } catch (err) {
            dispatch({
                type: LEAD_ERROR,
                payload: err.response?.data?.msg
            });
        }
    }, []);

    // Update Lead
    const updateLead = useCallback(async lead => {
        try {
            const res = await axios.put(`/api/leads/${lead.id}`, lead, getConfig());
            dispatch({
                type: UPDATE_LEAD,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: LEAD_ERROR,
                payload: err.response?.data?.msg
            });
        }
    }, []);

    // Clear Leads
    const clearLeads = useCallback(() => {
        dispatch({ type: CLEAR_LEADS });
    }, []);

    // Set Current Lead
    const setCurrent = useCallback(lead => {
        dispatch({ type: SET_CURRENT, payload: lead });
    }, []);

    // Clear Current Lead
    const clearCurrent = useCallback(() => {
        dispatch({ type: CLEAR_CURRENT });
    }, []);

    // Filter Leads
    const filterLeads = useCallback(text => {
        dispatch({ type: FILTER_LEADS, payload: text });
    }, []);

    // Clear Filter
    const clearFilter = useCallback(() => {
        dispatch({ type: CLEAR_FILTER });
    }, []);

    // Get Google Voice Leads
    const getGoogleVoiceLeads = useCallback(async () => {
        try {
            const res = await axios.get(`/api/leads/gv-leads`, getConfig());
            
            dispatch({
                type: GET_LEADS, // Reusing GET_LEADS is fine
                payload: res.data
            });
        } catch (err) {
            console.error('Error en getGoogleVoiceLeads:', err.response?.data);
            dispatch({
                type: LEAD_ERROR,
                payload: err.response?.data?.msg || 'Error obteniendo leads de GV'
            });
        }
    }, []);

    return (
        <LeadContext.Provider
            value={{
                leads: state.leads,
                current: state.current,
                filtered: state.filtered,
                error: state.error,
                loading: state.loading,
                addLead,
                deleteLead,
                setCurrent,
                clearCurrent,
                updateLead,
                filterLeads,
                clearFilter,
                getLeads,
                clearLeads,
                getGoogleVoiceLeads
            }}
        >
            {props.children}
        </LeadContext.Provider>
    );
};

export default LeadState;