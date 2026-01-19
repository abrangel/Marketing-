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
    CLEAR_EMAIL_STATE,
    SET_LOADING
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case GET_EMAIL_TEMPLATES:
            return {
                ...state,
                templates: action.payload,
                loading: false
            };
        case ADD_EMAIL_TEMPLATE:
            return {
                ...state,
                templates: [action.payload, ...state.templates],
                loading: false
            };
        case UPDATE_EMAIL_TEMPLATE:
            return {
                ...state,
                templates: state.templates.map(template =>
                    template.id === action.payload.id ? action.payload : template
                ),
                loading: false
            };
        case DELETE_EMAIL_TEMPLATE:
            return {
                ...state,
                templates: state.templates.filter(template => template.id !== action.payload),
                loading: false
            };
        case GET_EMAIL_CAMPAIGNS:
            return {
                ...state,
                campaigns: action.payload,
                loading: false
            };
        case ADD_EMAIL_CAMPAIGN:
            return {
                ...state,
                campaigns: [action.payload, ...state.campaigns],
                loading: false
            };
        case UPDATE_EMAIL_CAMPAIGN:
            return {
                ...state,
                campaigns: state.campaigns.map(campaign =>
                    campaign.id === action.payload.id ? action.payload : campaign
                ),
                loading: false
            };
        case DELETE_EMAIL_CAMPAIGN:
            return {
                ...state,
                campaigns: state.campaigns.filter(campaign => campaign.id !== action.payload),
                loading: false
            };
        case SET_CURRENT_EMAIL_TEMPLATE:
            return {
                ...state,
                currentTemplate: action.payload
            };
        case CLEAR_CURRENT_EMAIL_TEMPLATE:
            return {
                ...state,
                currentTemplate: null
            };
        case SET_CURRENT_EMAIL_CAMPAIGN:
            return {
                ...state,
                currentCampaign: action.payload
            };
        case CLEAR_CURRENT_EMAIL_CAMPAIGN:
            return {
                ...state,
                currentCampaign: null
            };
        case EMAIL_TEMPLATE_ERROR:
        case EMAIL_CAMPAIGN_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case CLEAR_EMAIL_STATE:
            return {
                ...state,
                templates: null,
                campaigns: null,
                currentTemplate: null,
                currentCampaign: null,
                error: null,
                loading: true
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
};
