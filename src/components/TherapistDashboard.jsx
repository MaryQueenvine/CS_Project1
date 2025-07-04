// src/components/TherapistDashboard.jsx
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TriageSummaryView from './therapist/TriageSummaryView';

const TherapistDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Page Title */}
      <Box mb={3}>
        <Typography variant="h4" align="center">
          Therapist Dashboard
        </Typography>
      </Box>

      {/* Navigation Buttons */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Triage Summaries</Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/assigned-students')}
          >
            View Assigned Students
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/triage-reviews')}
          >
            View All Triage Reviews
          </Button>


            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate('/therapist-session-requests')}
            >
              View Session Requests
            </Button>

            <Button
               variant="outlined"
               color="primary"
               onClick={() => navigate('/chat-student')}
            >
              Chat with Students
            </Button>



          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate('/global-flagged-mood-logs')}
          >
            View Flagged Mood Logs
          </Button>
        </Box>
      </Box>

      {/* Default Summary Section */}
      <TriageSummaryView />
    </Container>
  );
};

export default TherapistDashboard;
