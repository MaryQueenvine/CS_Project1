// src/pages/TherapistSessionRequestsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Button, Chip, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

    // Filter only requests assigned to current therapist
    const myRequests = all.filter(
      req => req.therapistEmail === therapist?.email
    );

    setRequests(myRequests);
  }, [therapist?.email]);

  const updateStatus = (id, newStatus) => {
    const all = JSON.parse(localStorage.getItem('sessionRequests')) || [];

    const updated = all.map(req => {
      if (req.id === id) {
        return { ...req, status: newStatus };
      }
      return req;
    });

    localStorage.setItem('sessionRequests', JSON.stringify(updated));

    // Refresh filtered list
    const myRequests = updated.filter(req => req.therapistEmail === therapist?.email);
    setRequests(myRequests);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-therapist')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Session Requests Assigned to You
      </Typography>

      {requests.length === 0 ? (
        <Typography>No session requests submitted yet.</Typography>
      ) : (
        requests.map((req) => (
          <Paper key={req.id} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">{req.topic}</Typography>
              <Chip label={req.urgency} color={urgencyColor[req.urgency]} />
            </Box>

            <Typography variant="body2" mb={1}>
              Student: {req.studentId}
            </Typography>
            <Typography variant="body2" mb={1}>
              Preferred Time: {new Date(req.preferredTime).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Submitted: {new Date(req.submittedAt).toLocaleString()}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Request status and actions */}
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                label={`Status: ${req.status || 'pending'}`}
                color={statusColor[req.status || 'pending']}
              />

              {req.status !== 'approved' && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => updateStatus(req.id, 'approved')}
                >
                  Approve
                </Button>
              )}

              {req.status !== 'rejected' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => updateStatus(req.id, 'rejected')}
                >
                  Reject
                </Button>
              )}
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default TherapistSessionRequestsPage;
