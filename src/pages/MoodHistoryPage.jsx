import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MoodHistory from '../components/student/MoodHistory';

const MoodHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/mood-checkin')}
        >
          Back to Mood Check-In
        </Button>
      </Box>

      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Mood History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your past check-ins and track your emotional patterns.
        </Typography>
      </Box>

      <MoodHistory />
    </Container>
  );
};

export default MoodHistoryPage;
