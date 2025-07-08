import React, { useState } from 'react';

import '../pages/Landingpage.css'; // ✅ Fixed typo

import {
  Typography, TextField, Box, Alert
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Header from '../pages/Header';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt with:', { email: formData.email, passwordLength: formData.password.length });
    console.log('Firebase auth instance:', auth);

    try {
      // Test Firebase authentication
      console.log('Attempting Firebase authentication...');
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      console.log('Firebase authentication successful!');
      console.log('User details:', {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName
      });

      // Fetch user role from Django backend
      console.log('Fetching user role from Django...');
      const response = await fetch(`http://localhost:8000/users/api/get_user_role/${user.uid}`);

      console.log('Django response status:', response.status);
      console.log('Django response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Django API error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('User role data from Django:', data);

      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        role: data.role
      }));

      // Navigate based on role
      if (data.role === 'student') {
        console.log('Navigating to student dashboard...');
        navigate('/dashboard-student');
      } else if (data.role === 'therapist') {
        console.log('Navigating to therapist dashboard...');
        navigate('/dashboard-therapist');
      } else if (data.role === 'admin') {
        console.log('Navigating to admin dashboard...');
        navigate('/dashboard-admin');
      } else {
        console.error('Unknown role:', data.role);
        setError('Invalid user role. Please contact support.');
      }

    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        error: error
      });

      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address. Please check your email or register first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else if (error.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please check your email and password.');
      } else if (error.message.includes('HTTP error')) {
        setError('Unable to verify user role. Please try again.');
      } else {
        setError(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <Header />

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
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
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
              disabled={loading}
            />

            <Box mt={3}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </Box>
          </form>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account? <Link to="/register" style={{ color: '#764ba2', textDecoration: 'underline' }}>Register</Link>
            </Typography>
          </Box>

          {/* Debug info - remove in production */}
          <Box mt={2} textAlign="center">
            <Typography variant="caption" color="textSecondary">
              Debug: Try logging in with the email you just registered (lenny@gmail.com)
            </Typography>
          </Box>
        </Box>
      </main>
    </div>
  );
};

export default LoginPage;