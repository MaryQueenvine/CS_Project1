import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button,
  MenuItem, Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Request a Therapy Session
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Session request submitted!</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          name="topic"
          label="Topic / Concern"
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
          label="Urgency"
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Request
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Button onClick={() => navigate('/dashboard-student')}>
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
    </Container>
  );
};

export default SessionRequestPage;
