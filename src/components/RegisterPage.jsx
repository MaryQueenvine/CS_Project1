import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button,
  Box, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const roles = ['Student', 'Therapist', 'Admin'];

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    faculty: '',
    year: '',
    licenseNumber: '',
    specialty: '',
    experience: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);

      if (!formData.name || !formData.email || !formData.password || !formData.role) {
        setError('Please fill in all required fields.');
        return;
      }

      // In real case, send data to Django API here
      alert('Registered successfully!');
      navigate('/login');
    }, 1000);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Register Account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            name="email"
            label="Email"
            type="email"
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

          <TextField
            select
            name="role"
            label="Register As"
            fullWidth
            margin="normal"
            value={formData.role}
            onChange={handleChange}
            required
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>

          {/* Conditional fields */}
          {formData.role === 'Student' && (
            <>
              <TextField
                name="faculty"
                label="Faculty"
                fullWidth
                margin="normal"
                value={formData.faculty}
                onChange={handleChange}
                required
              />
              <TextField
                name="year"
                label="Year of Study"
                fullWidth
                margin="normal"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </>
          )}

          {formData.role === 'Therapist' && (
            <>
              <TextField
                name="licenseNumber"
                label="License Number"
                fullWidth
                margin="normal"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
              <TextField
                name="specialty"
                label="Specialty"
                fullWidth
                margin="normal"
                value={formData.specialty}
                onChange={handleChange}
                required
              />
              <TextField
                name="experience"
                label="Years of Experience"
                fullWidth
                margin="normal"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </>
          )}

          <Box mt={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
