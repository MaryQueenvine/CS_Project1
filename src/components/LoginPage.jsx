import React, { useState } from 'react';
import '../pages/Lnadingpage.css';
import {
  Typography, TextField, Box, Alert
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { firebaseConfig } from '../firebaseConfig';
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

      const response = await fetch(`/api/get_user_role/${user.uid}`);
      const data = await response.json();

      if (data.role === 'Student') navigate('/dashboard-student');
      else if (data.role === 'Therapist') navigate('/dashboard-therapist');
      else if (data.role === 'Admin') navigate('/dashboard-admin');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
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
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Login
              </button>
            </Box>
          </form>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Don’t have an account? <Link to="/register" style={{ color: '#764ba2', textDecoration: 'underline' }}>Register</Link>
            </Typography>
          </Box>
        </Box>
      </main>
    </div>
  );
};

export default LoginPage;
