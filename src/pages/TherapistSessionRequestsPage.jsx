// src/pages/TherapistSessionRequestsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Chip, Button, Box, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Landingpage.css';

const urgencyColor = {
  High: 'error',
  Medium: 'warning',
  Low: 'success'
};

const statusColor = {
  pending: 'warning',
  approved: 'success',
  rejected: 'default'
};

const TherapistSessionRequestsPage = () => {
  const navigate = useNavigate();
  const therapist = JSON.parse(localStorage.getItem('user'));
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('sessionRequests')) || [];
    const myRequests = all.filter(req => req.therapistEmail === therapist?.email);
    setRequests(myRequests);
  }, [therapist?.email]);

  const updateStatus = (id, newStatus) => {
    const all = JSON.parse(localStorage.getItem('sessionRequests')) || [];
    const updated = all.map(req =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    localStorage.setItem('sessionRequests', JSON.stringify(updated));
    setRequests(updated.filter(req => req.therapistEmail === therapist?.email));
  };

  return (
    <div className="page-container">
      <Header />

      {/* Top Animated Banner */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #7b1fa2, #512da8)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          📅 Session Requests
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Review and manage your students' requests for sessions.
        </Typography>
      </div>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard-therapist')}
          variant="outlined"
          sx={{
            mb: 3,
            borderColor: '#673ab7',
            color: '#673ab7',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f3e5f5',
              borderColor: '#512da8'
            }
          }}
        >
          Back to Dashboard
        </Button>

        {requests.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            No session requests found.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {requests.map(req => (
              <Grid item xs={12} sm={6} md={4} key={req.id}>
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(to right, #ede7f6, #d1c4e9)',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                    animation: 'fadeIn 0.6s ease-in-out'
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Avatar sx={{ bgcolor: `${urgencyColor[req.urgency]}.main` }}>
                        <CalendarMonthIcon />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ color: '#4527a0', fontWeight: 'bold' }}
                        >
                          {req.topic}
                        </Typography>
                        <Chip
                          label={req.urgency}
                          color={urgencyColor[req.urgency]}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2">
                      <strong>Student:</strong> {req.studentId}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Preferred Time:</strong>{' '}
                      {new Date(req.preferredTime).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Submitted: {new Date(req.submittedAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      px: 2,
                      pb: 2
                    }}
                  >
                    <Chip
                      label={`Status: ${req.status}`}
                      color={statusColor[req.status]}
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Box display="flex" gap={1}>
                      {req.status !== 'approved' && (
                        <Button
                          size="small"
                          color="success"
                          onClick={() => updateStatus(req.id, 'approved')}
                          variant="contained"
                        >
                          Approve
                        </Button>
                      )}
                      {req.status !== 'rejected' && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => updateStatus(req.id, 'rejected')}
                          variant="outlined"
                        >
                          Reject
                        </Button>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default TherapistSessionRequestsPage;
