// src/components/TherapistDashboard.jsx
import React from 'react';
import {
  Container, Typography, Box, Button, Stack, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TriageSummaryView from './therapist/TriageSummaryView';
import { logout } from '../services/authService';

const TherapistDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Page Title */}
      <Box mb={3}>
        <Typography variant="h4" align="center">
          Therapist Dashboard
        </Typography>
      </Box>

      {/* Group 1: Student and Session Management */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>Student Management</Typography>
        <Stack spacing={2} direction="row" flexWrap="wrap">
          <Button variant="outlined" color="primary" onClick={() => navigate('/assigned-students')}>
            View Assigned Students
          </Button>
          <Button variant="outlined" color="info" onClick={() => navigate('/therapist-session-requests')}>
            View Session Requests
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/chat-student')}>
            Chat with Students
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Group 2: Review and Insights */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>Review & Insights</Typography>
        <Stack spacing={2} direction="row" flexWrap="wrap">
          <Button variant="contained" color="primary" onClick={() => navigate('/triage-reviews')}>
            View All Triage Reviews
          </Button>
          <Button variant="outlined" color="error" onClick={() => navigate('/global-flagged-mood-logs')}>
            View Flagged Mood Logs
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Group 3: Profile and Logout */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>Account</Typography>
        <Stack spacing={2} direction="row" flexWrap="wrap">
          <Button variant="text" onClick={() => navigate('/therapist-profile')}>
            Profile Settings
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Embedded Summary View */}
      <TriageSummaryView />
    </Container>
  );
};

export default TherapistDashboard;
