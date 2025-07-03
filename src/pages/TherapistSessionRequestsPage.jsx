// src/pages/TherapistSessionRequestsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, Chip,
  Divider, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const urgencyColor = {
  High: 'error',
  Medium: 'warning',
  Low: 'success'
};

const urgencyPriority = {
  High: 1,
  Medium: 2,
  Low: 3
};

const TherapistSessionRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('sessionRequests')) || [];

    // Sort by urgency priority (High → Low)
    const sorted = [...all].sort((a, b) =>
      urgencyPriority[a.urgency] - urgencyPriority[b.urgency]
    );

    setRequests(sorted);
  }, []);

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
        Incoming Session Requests
      </Typography>

      {requests.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No session requests received yet.
        </Typography>
      ) : (
        requests.map((req, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">{req.topic}</Typography>
              <Chip label={req.urgency} color={urgencyColor[req.urgency]} />
            </Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Student: {req.studentId}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Preferred Time: {new Date(req.preferredTime).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Submitted: {new Date(req.submittedAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default TherapistSessionRequestsPage;
