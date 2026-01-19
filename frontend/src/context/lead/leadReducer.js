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

export default (state, action) => {
    switch (action.type) {
        case GET_LEADS:
            return {
                ...state,
                leads: action.payload,
                loading: false
            };
        case ADD_LEAD:
            return {
                ...state,
                leads: [action.payload, ...state.leads],
                loading: false
            };
        case UPDATE_LEAD:
            return {
                ...state,
                leads: state.leads.map(lead =>
                    lead.id === action.payload.id ? action.payload : lead
                ),
                loading: false
            };
        case DELETE_LEAD:
            return {
                ...state,
                leads: state.leads.filter(lead => lead.id !== action.payload),
                loading: false
            };
        case CLEAR_LEADS:
            return {
                ...state,
                leads: null,
                filtered: null,
                error: null,
                current: null
            };
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload
            };
        case CLEAR_CURRENT:
            return {
                ...state,
                current: null
            };
        case FILTER_LEADS:
            return {
                ...state,
                filtered: state.leads.filter(lead => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return lead.name.match(regex) || lead.email.match(regex);
                })
            };
        case CLEAR_FILTER:
            return {
                ...state,
                filtered: null
            };
        case LEAD_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};
