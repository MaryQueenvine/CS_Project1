// src/pages/SessionRequestListPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Button, Chip, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css'; // fade-in + global design consistency

const urgencyColor = {
  High: 'error',
  Medium: 'warning',
  Low: 'success'
};

const SessionRequestListPage = () => {
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const allRequests = JSON.parse(localStorage.getItem('sessionRequests')) || [];

    const filtered = currentUser?.email
      ? allRequests.filter(req => req.studentId === currentUser.email)
      : [];

    setMyRequests(filtered);
  }, []);

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
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
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          My Session Requests
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View your submitted therapy session requests and their details
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/dashboard-student')}
          >
            Back to Dashboard
          </Button>
        </Box>

        {myRequests.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You haven’t submitted any session requests yet.
          </Typography>
        ) : (
          <Box className="fade-in">
            {myRequests.map((req, idx) => (
              <Paper
                key={idx}
                elevation={4}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  borderLeft: `6px solid ${
                    urgencyColor[req.urgency] === 'error'
                      ? '#e53935'
                      : urgencyColor[req.urgency] === 'warning'
                      ? '#fbc02d'
                      : '#43a047'
                  }`,
                  backgroundColor: '#f9f9ff'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {req.topic}
                  </Typography>
                  <Chip
                    label={req.urgency}
                    color={urgencyColor[req.urgency]}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  🕒 Preferred Time:{' '}
                  <strong>{new Date(req.preferredTime).toLocaleString()}</strong>
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" color="text.secondary">
                  📅 Submitted on: {new Date(req.submittedAt).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </div>
  );
};

export default SessionRequestListPage;
