import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TriageSummaryView from './therapist/TriageSummaryView';

const TherapistDashboard = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box mb={3}>
        <Typography variant="h4" align="center">
          Therapist Dashboard
        </Typography>
      </Box>

      <TriageSummaryView />
    </Container>
  );
};

export default TherapistDashboard;
