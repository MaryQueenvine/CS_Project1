// src/pages/AdminSessionRequestsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Divider,
  Box, Chip, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const AdminSessionRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('sessionRequests')) || [];
    setRequests(stored);
  }, []);

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
      <div
        className="animated-section"
        style={{ background: 'linear-gradient(to right, #7b1fa2, #512da8)' }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          📅 All Session Requests
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Review all therapy session submissions from students
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => navigate('/dashboard-admin')}
        >
          Back to Dashboard
        </Button>

        {requests.length === 0 ? (
          <Typography>No session requests submitted.</Typography>
        ) : (
          requests.map((req, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(to right, #ede7f6, #d1c4e9)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                animation: 'fadeIn 0.5s ease-in-out'
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4527a0' }}>
                  {req.topic}
                </Typography>
                <Chip
                  label={req.status?.toUpperCase() || 'PENDING'}
                  color={req.status === 'approved' ? 'success' : 'info'}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                👤 Student: {req.studentId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🧠 Therapist: {req.therapistEmail}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                ⏰ Preferred Time:{' '}
                <strong>{new Date(req.preferredTime).toLocaleString()}</strong>
              </Typography>

              <Divider sx={{ mt: 2 }} />
            </Paper>
          ))
        )}
      </Container>
    </div>
  );
};

export default AdminSessionRequestsPage;
