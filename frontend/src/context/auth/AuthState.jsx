import React, { useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types';

const AuthState = props => {
    console.log('AuthState: Renderizado');
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: localStorage.getItem('token') ? true : null, // Asumir autenticado si hay token
        loading: localStorage.getItem('token') ? false : true, // No cargar si ya hay token
        user: null,
        error: null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User - useCallback para mantener la referencia estable
    const loadUser = useCallback(async () => {
        console.log('AuthState: loadUser llamado');
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get(`/api/auth?_t=${Date.now()}`);

            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        } catch (err) {
            dispatch({ type: AUTH_ERROR });
        }
    }, []); // Dependencias vacías para mantener referencia estable

    // useEffect corregido - solo se ejecuta una vez al montar el componente
    useEffect(() => {
        console.log('AuthState: useEffect ejecutado');
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            loadUser();
        } else {
            dispatch({ type: AUTH_ERROR });
        }
        // eslint-disable-next-line
    }, []); // Array de dependencias VACÍO para evitar re-renders infinitos

    // Register User - useCallback para optimización
    const register = useCallback(async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/users/register', formData, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });

            if (res.data.token) {
                setAuthToken(res.data.token);
                loadUser();
            }
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.msg
            });
        }
    }, [loadUser]); // loadUser como dependencia

    // Login User - useCallback para optimización
    const login = useCallback(async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/users/login', formData, config);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

            if (res.data.token) {
                setAuthToken(res.data.token);
                loadUser();
            }
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: err.response.data.msg
            });
        }
    }, [loadUser]); // loadUser como dependencia

    // Logout - useCallback para optimización
    const logout = useCallback(() => {
        dispatch({ type: LOGOUT });
    }, []);

    // Clear Errors - useCallback para optimización
    const clearErrors = useCallback(() => {
        dispatch({ type: CLEAR_ERRORS });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                loadUser,
                login,
                logout,
                clearErrors
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;