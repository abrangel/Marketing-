import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import EmailContext from './emailContext';
import emailReducer from './emailReducer';
import {
    GET_EMAIL_TEMPLATES,
    ADD_EMAIL_TEMPLATE,
    DELETE_EMAIL_TEMPLATE,
    UPDATE_EMAIL_TEMPLATE,
    EMAIL_TEMPLATE_ERROR,
    GET_EMAIL_CAMPAIGNS,
    ADD_EMAIL_CAMPAIGN,
    DELETE_EMAIL_CAMPAIGN,
    UPDATE_EMAIL_CAMPAIGN,
    EMAIL_CAMPAIGN_ERROR,
    SET_CURRENT_EMAIL_TEMPLATE,
    CLEAR_CURRENT_EMAIL_TEMPLATE,
    SET_CURRENT_EMAIL_CAMPAIGN,
    CLEAR_CURRENT_EMAIL_CAMPAIGN,
    CLEAR_EMAIL_STATE
} from '../types';

const EmailState = props => {
    const initialState = {
        templates: null,
        campaigns: null,
        currentTemplate: null,
        currentCampaign: null,
        error: null,
        loading: true
    };

    const [state, dispatch] = useReducer(emailReducer, initialState);

    // Get Email Templates
    const getEmailTemplates = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true }); // Assuming SET_LOADING will be defined
        try {
            const res = await axios.get(`/api/email/templates?_t=${Date.now()}`);
            dispatch({
                type: GET_EMAIL_TEMPLATES,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: EMAIL_TEMPLATE_ERROR,
                payload: err.response?.data?.msg || err.message
            });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false }); // Assuming SET_LOADING will be defined
        }
    }, []);

    // Add Email Template
    const addEmailTemplate = useCallback(async template => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/email/templates', template, config);
            dispatch({
                type: ADD_EMAIL_TEMPLATE,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: EMAIL_TEMPLATE_ERROR,
                payload: err.response?.data?.msg || err.message
            });
        }
    }, []);

    // Delete Email Template
    const deleteEmailTemplate = useCallback(async id => {
        try {
            await axios.delete(`/api/email/templates/${id}`);
            dispatch({
                type: DELETE_EMAIL_TEMPLATE,
                payload: id
            });
        } catch (err) {
            dispatch({
                type: EMAIL_TEMPLATE_ERROR,
                payload: err.response?.data?.msg || err.message
            });
        }
    }, []);

    // Update Email Template
    const updateEmailTemplate = useCallback(async template => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.put(`/api/email/templates/${template.id}`, template, config);
            dispatch({
                type: UPDATE_EMAIL_TEMPLATE,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: EMAIL_TEMPLATE_ERROR,
                payload: err.response?.data?.msg || err.message
            });
        }
    }, []);

    // Get Email Campaigns
    const getEmailCampaigns = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true }); // Assuming SET_LOADING will be defined
        try {
            const res = await axios.get(`/api/email/campaigns?_t=${Date.now()}`);
            dispatch({
                type: GET_EMAIL_CAMPAIGNS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: EMAIL_CAMPAIGN_ERROR,
                payload: err.response?.data?.msg || err.message
            });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false }); // Assuming SET_LOADING will be defined
        }
    }, []);

    // Add Email Campaign
    const addEmailCampaign = useCallback(async campaign => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/email/campaigns', campaign, config);
            dispatch({
                type: ADD_EMAIL_CAMPAIGN,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: EMAIL_CAMPAIGN_ERROR,
                payload: err.response.msg
            });
        }
    }, []);

    // Delete Email Campaign
    const deleteEmailCampaign = useCallback(async id => {
        try {
            await axios.delete(`/api/email/campaigns/${id}`);
            dispatch({
                type: DELETE_EMAIL_CAMPAIGN,
                payload: id
            });
        } catch (err) {
            dispatch({
                type: EMAIL_CAMPAIGN_ERROR,
                payload: err.response.msg
            });
        }
    }, []);

    // Update Email Campaign
    const updateEmailCampaign = useCallback(async campaign => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.put(`/api/email/campaigns/${campaign.id}`, campaign, config);
            dispatch({
                type: UPDATE_EMAIL_CAMPAIGN,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: EMAIL_CAMPAIGN_ERROR,
                payload: err.response.msg
            });
        }
    }, []);

    // Set Current Email Template
    const setCurrentEmailTemplate = useCallback(template => {
        dispatch({ type: SET_CURRENT_EMAIL_TEMPLATE, payload: template });
    }, []);

    // Clear Current Email Template
    const clearCurrentEmailTemplate = useCallback(() => {
        dispatch({ type: CLEAR_CURRENT_EMAIL_TEMPLATE });
    }, []);

    // Set Current Email Campaign
    const setCurrentEmailCampaign = useCallback(campaign => {
        dispatch({ type: SET_CURRENT_EMAIL_CAMPAIGN, payload: campaign });
    }, []);

    // Clear Current Email Campaign
    const clearCurrentEmailCampaign = useCallback(() => {
        dispatch({ type: CLEAR_CURRENT_EMAIL_CAMPAIGN });
    }, []);

    // Clear Email State
    const clearEmailState = useCallback(() => {
        dispatch({ type: CLEAR_EMAIL_STATE });
    }, []);

    return (
        <EmailContext.Provider
            value={{
                templates: state.templates,
                campaigns: state.campaigns,
                currentTemplate: state.currentTemplate,
                currentCampaign: state.currentCampaign,
                error: state.error,
                loading: state.loading,
                getEmailTemplates,
                addEmailTemplate,
                deleteEmailTemplate,
                updateEmailTemplate,
                getEmailCampaigns,
                addEmailCampaign,
                deleteEmailCampaign,
                updateEmailCampaign,
                setCurrentEmailTemplate,
                clearCurrentEmailTemplate,
                setCurrentEmailCampaign,
                clearCurrentEmailCampaign,
                clearEmailState
            }}
        >
            {props.children}
        </EmailContext.Provider>
    );
};

export default EmailState;
