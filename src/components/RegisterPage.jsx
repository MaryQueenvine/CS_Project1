import React, { useState } from 'react';
import '../pages/Lnadingpage.css';
import {
  Container, Typography, TextField, Button,
  Box, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebaseConfig';

const roles = ['Student', 'Therapist', 'Admin'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      //Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      //Send data to Django backend
     const response = await fetch('http://localhost:8000/users/api/register_user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    uid: user.uid,
    username: formData.email,
    email: formData.email,
    first_name: formData.name.split(' ')[0],
    last_name: formData.name.split(' ').slice(1).join(' ') || '',
    role: formData.role.toLowerCase(),
    faculty: formData.faculty,
    year: formData.year,
    licenseNumber: formData.licenseNumber,
    specialty: formData.specialty,
    experience: formData.experience
  }),
});


      if (!response.ok) {
        const errorData = await response.json();
        console.error("DB registration error:", errorData);
        throw new Error('Failed to register user in the database');
      }

      alert('Registered successfully!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="gradient-bg" minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={2}>
      <Container maxWidth="sm">
        <Box p={4} borderRadius={3} boxShadow={3} bgcolor="white">
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#764ba2', fontWeight: 'bold' }}>
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
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
              </Button>
            </Box>
          </form>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account? <a href="/login" style={{ color: '#764ba2' }}>Login</a>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
