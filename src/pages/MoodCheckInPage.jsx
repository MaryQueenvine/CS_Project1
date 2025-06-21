import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MoodCheckIn from '../components/student/MoodCheckIn';
import MoodHistory from '../components/student/MoodHistory';
import { Link } from 'react-router-dom';

const MoodCheckInPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/dashboard-student')}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Mood Check-In
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reflect on your emotional state and let us know how you're feeling today.
        </Typography>
      </Box>

      <MoodCheckIn />

      <Box mt={4} mb={4} textAlign="center">
  <Button
    variant="outlined"
    color="primary"
    component={Link}
    to="/mood-history"
  >
    View Mood History
  </Button>
</Box>

    </Container>
  );
};

export default MoodCheckInPage;
