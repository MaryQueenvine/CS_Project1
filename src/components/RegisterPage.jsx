import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../pages/Lnadingpage.css';
import {
  Typography, TextField, Box, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { firebaseConfig } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseConfig, formData.email, formData.password);
      const user = userCredential.user;

      const response = await fetch('/api/register_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          faculty: formData.faculty,
          year: formData.year,
          licenseNumber: formData.licenseNumber,
          specialty: formData.specialty,
          experience: formData.experience
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register user in the database');
      }

      alert('Registered successfully!');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <header style={{ background: 'rgba(255,255,255,0.95)', padding: '1rem 0' }}>
        <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo">Student MindCare</div>
          <div>
            <Link to="/login" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        </nav>
      </header>

      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          sx={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%',
            mt: 4
          }}
        >
          <Typography variant="h4" align="center" gutterBottom style={{ color: '#764ba2' }}>
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
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
              </button>
            </Box>
          </form>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Already have an account? <Link to="/login" style={{ color: '#764ba2', textDecoration: 'underline' }}>Login</Link>
            </Typography>
          </Box>
        </Box>
      </main>
    </div>
  );
};

export default RegisterPage;
