import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import AuthContext from '../context/auth/authContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const { register, error, clearErrors, isAuthenticated } = authContext;

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
        password2: '',
    });

    const { email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (password !== password2) {
            console.log('Passwords do not match'); // Replace with proper alert/notification
        } else {
            register({
                email,
                password
            });
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Register
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
                    minLength="6"
                />
                <TextField
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    value={password2}
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    minLength="6"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default Register;
