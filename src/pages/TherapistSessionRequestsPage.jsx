// src/pages/TherapistSessionRequestsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Chip, Button, Box, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';

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
    const updated = all.map(req => req.id === id ? { ...req, status: newStatus } : req);
    localStorage.setItem('sessionRequests', JSON.stringify(updated));
    setRequests(updated.filter(req => req.therapistEmail === therapist?.email));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard-therapist')}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Session Requests
      </Typography>

      <Grid container spacing={3}>
        {requests.length === 0 ? (
          <Typography>No session requests found.</Typography>
        ) : (
          requests.map(req => (
            <Grid item xs={12} sm={6} md={4} key={req.id}>
              <Card elevation={3}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar sx={{ bgcolor: `${urgencyColor[req.urgency]}.main` }}>
                      <CalendarMonthIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{req.topic}</Typography>
                      <Chip label={req.urgency} color={urgencyColor[req.urgency]} size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2">Student: {req.studentId}</Typography>
                  <Typography variant="body2">Preferred: {new Date(req.preferredTime).toLocaleString()}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Submitted: {new Date(req.submittedAt).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip label={`Status: ${req.status}`} color={statusColor[req.status]} />
                  <Box>
                    {req.status !== 'approved' && (
                      <Button size="small" color="success" onClick={() => updateStatus(req.id, 'approved')}>
                        Approve
                      </Button>
                    )}
                    {req.status !== 'rejected' && (
                      <Button size="small" color="error" onClick={() => updateStatus(req.id, 'rejected')}>
                        Reject
                      </Button>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default TherapistSessionRequestsPage;
