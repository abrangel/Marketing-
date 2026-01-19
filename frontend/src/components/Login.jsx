import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import AuthContext from '../context/auth/authContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const { login, error, clearErrors, isAuthenticated } = authContext;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to dashboard or home
        }

        if (error) {
            console.log(error); // Replace with proper alert/notification
            clearErrors();
        }
        // eslint-disable-next-line
    }, [error, isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        login({
            email,
            password
        });
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;
