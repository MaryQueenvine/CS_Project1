import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button,
  Box, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
    licenseNumber: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const {
      name, email, password, role,
      faculty, year, specialty, experience,
      adminCode, licenseFile,
    } = formData;

    try {
      if (!name || !email || !password || !role) {
        throw new Error('Please fill in all required fields.');
      }

      if (role === 'Admin' && adminCode !== ADMIN_SECRET_CODE) {
        throw new Error('Invalid admin code. Access denied.');
      }

      if (role === 'Therapist' && !formData.licenseNumber) {
        throw new Error('Please enter your therapist ID number.');
      }

      // Firebase create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const [firstName, ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      // Use FormData for file + fields
      const formDataToSend = new FormData();
      formDataToSend.append('uid', uid);
      formDataToSend.append('email', email);
      formDataToSend.append('username', email);
      formDataToSend.append('first_name', firstName);
      formDataToSend.append('last_name', lastName);
      formDataToSend.append('role', role.toLowerCase());

      if (role === 'Student') {
        formDataToSend.append('faculty', faculty);
        formDataToSend.append('year', year);
      }

      if (role === 'Therapist') {
        formDataToSend.append('specialty', specialty);
        formDataToSend.append('experience', experience);
        formDataToSend.append('licenseNumber', formData.licenseNumber);
      }

      const response = await fetch('http://localhost:8000/users/api/register_user', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed.');
      }

      alert('Registration successful!');
      navigate('/login');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
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
              <TextField
                  name="licenseNumber"
                  label="Therapist ID Number"
                  fullWidth
                  margin="normal"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  />
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
