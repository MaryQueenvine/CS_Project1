// src/components/LoginPage.jsx
import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button,
  Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = login(formData.email, formData.password);

    if (!user) {
      setError('Invalid credentials. Try student@example.com, therapist@example.com, or admin@example.com');
      return;
    }

    if (user.role === 'Student') navigate('/dashboard-student');
    else if (user.role === 'Therapist') navigate('/dashboard-therapist');
    else if (user.role === 'Admin') navigate('/dashboard-admin');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Box mt={3}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don’t have an account? <a href="/register">Register</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
