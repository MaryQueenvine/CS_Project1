import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button,
  Box, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const roles = ['Student', 'Therapist', 'Admin'];
const ADMIN_SECRET_CODE = '143200';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    faculty: '',
    year: '',
    specialty: '',
    experience: '',
    adminCode: '',
    licenseFile: null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const { name, email, password, role, faculty, year, specialty, experience, adminCode, licenseFile } = formData;

      // Basic field check
      if (!name || !email || !password || !role) {
        setError('Please fill in all required fields.');
        return;
      }

      // Therapist-specific file check
      if (role === 'Therapist' && !licenseFile) {
        setError('Please upload a copy of your license.');
        return;
      }

      // Admin secret code check
      if (role === 'Admin' && adminCode !== ADMIN_SECRET_CODE) {
        setError('Invalid admin code. Access denied.');
        return;
      }

      // In real case: send FormData to Django backend
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

          {/* Student Fields */}
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

          {/* Therapist Fields */}
          {formData.role === 'Therapist' && (
            <>
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
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Upload License (PDF, PNG, JPG)
                </Typography>
                <input
                  type="file"
                  name="licenseFile"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={handleChange}
                />
              </Box>
            </>
          )}

          {/* Admin Code Field */}
          {formData.role === 'Admin' && (
            <TextField
              name="adminCode"
              label="Admin Access Code"
              type="password"
              fullWidth
              margin="normal"
              value={formData.adminCode}
              onChange={handleChange}
              required
            />
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
