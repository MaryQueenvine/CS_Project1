// src/pages/SessionRequestPage.jsx
import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button,
  MenuItem, Box, Alert, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css'; // For fade-in, animated-section, etc.

const urgencies = ['Low', 'Medium', 'High'];

const SessionRequestPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: '',
    preferredTime: '',
    urgency: 'Medium'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.topic || !formData.preferredTime) {
      setError('Please fill in all required fields.');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const newRequest = {
      studentId: currentUser?.email || 'anonymous@student.com',
      ...formData,
      submittedAt: new Date().toISOString()
    };

    const existingRequests = JSON.parse(localStorage.getItem('sessionRequests')) || [];
    existingRequests.push(newRequest);
    localStorage.setItem('sessionRequests', JSON.stringify(existingRequests));

    setSuccess(true);
    setFormData({ topic: '', preferredTime: '', urgency: 'Medium' });
  };

  return (
    <div className="page-container">
      <Header />

      {/* Hero Section */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Request a Therapy Session
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Submit a confidential request to speak with a therapist
        </Typography>
      </div>

      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }} className="fade-in">
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Session request submitted!</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              name="topic"
              label="Topic / Concern"
              placeholder="e.g., Anxiety, Stress, Time Management..."
              fullWidth
              margin="normal"
              value={formData.topic}
              onChange={handleChange}
              required
            />

            <TextField
              name="preferredTime"
              label="Preferred Time"
              type="datetime-local"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.preferredTime}
              onChange={handleChange}
              required
            />

            <TextField
              select
              name="urgency"
              label="Urgency Level"
              fullWidth
              margin="normal"
              value={formData.urgency}
              onChange={handleChange}
            >
              {urgencies.map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(to right, #667eea, #764ba2)',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(to right, #5a67d8, #6b46c1)'
                  }
                }}
              >
                Submit Request
              </Button>
            </Box>

            <Box mt={2} textAlign="center">
              <Button
                variant="text"
                onClick={() => navigate('/dashboard-student')}
                sx={{ color: '#667eea' }}
              >
                Back to Dashboard
              </Button>
            </Box>

            {success && (
              <Box mt={2} textAlign="center">
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => navigate('/session-requests')}
                >
                  View My Requests
                </Button>
              </Box>
            )}
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default SessionRequestPage;
