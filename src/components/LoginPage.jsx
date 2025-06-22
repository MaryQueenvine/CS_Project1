import React, { useState } from 'react';
import '../pages/Lnadingpage.css';
import {
  Container, Typography, TextField, Button,
  Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { firebaseConfig } from '../firebaseConfig'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth';


const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(firebaseConfig, formData.email, formData.password);
      const user = userCredential.user;

      // After successful login, you can fetch user data from your PostgreSQL database
      // For example, you can call your Django API to get user role
      const response = await fetch(`/api/get_user_role/${user.uid}`); // Adjust the endpoint as needed
      const data = await response.json();

      if (data.role === 'Student') navigate('/dashboard-student');
      else if (data.role === 'Therapist') navigate('/dashboard-therapist');
      else if (data.role === 'Admin') navigate('/dashboard-admin');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
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
