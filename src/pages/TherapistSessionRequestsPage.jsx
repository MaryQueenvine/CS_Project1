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

const TherapistSessionRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('sessionRequests')) || [];
    setRequests(all);
  }, []);

  const handleApprove = (idx) => {
    const updated = [...requests];
    updated[idx].approved = true;
    setRequests(updated);
    localStorage.setItem('sessionRequests', JSON.stringify(updated));
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
        All Session Requests
      </Typography>

      {requests.length === 0 ? (
        <Typography>No session requests submitted yet.</Typography>
      ) : (
        requests.map((req, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 3 }}>
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

            {req.approved ? (
              <Chip label="✅ Approved" color="success" />
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleApprove(idx)}
              >
                Mark as Approved
              </Button>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
};

export default TherapistSessionRequestsPage;
