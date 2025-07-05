// src/pages/AdminSessionRequestsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Divider, Box, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const AdminSessionRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('sessionRequests')) || [];
    setRequests(stored);
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => navigate('/dashboard-admin')}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        All Session Requests
      </Typography>

      {requests.length === 0 ? (
        <Typography>No session requests submitted.</Typography>
      ) : (
        requests.map((req, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">{req.topic}</Typography>
              <Chip label={req.status || 'pending'} color="info" />
            </Box>
            <Typography variant="body2" color="text.secondary">Student: {req.studentId}</Typography>
            <Typography variant="body2" color="text.secondary">Therapist: {req.therapistEmail}</Typography>
            <Typography variant="body2">Preferred: {new Date(req.preferredTime).toLocaleString()}</Typography>
            <Divider sx={{ mt: 1 }} />
          </Paper>
        ))
      )}
    </Container>
  );
};

export default AdminSessionRequestsPage;
