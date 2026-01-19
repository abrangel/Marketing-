// messageReducer.js - VERIFICAR
import {
  GET_MESSAGES,
  CLEAR_MESSAGES,
  SET_LOADING,
  MESSAGE_ERROR
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      console.log('🔄 Reducer: GET_MESSAGES', action.payload.length, 'mensajes');
      return {
        ...state,
        messages: action.payload,
        loading: false,
        error: null
      };
    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case MESSAGE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};