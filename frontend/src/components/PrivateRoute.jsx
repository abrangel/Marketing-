import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

import MainLayout from '../layout/MainLayout';

const PrivateRoute = () => {
    console.log('PrivateRoute: Renderizado');
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loading } = authContext;

    if (loading) return <div>Loading...</div>; // Or a spinner component
    
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
