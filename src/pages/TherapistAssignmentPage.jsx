import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TherapistAssignmentPage = () => {
  const navigate = useNavigate();
  const [assignedTherapist, setAssignedTherapist] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const allAssignments = JSON.parse(localStorage.getItem('therapistAssignments')) || [];

    const therapist = allAssignments.find(entry => entry.studentEmail === currentUser?.email);
    setAssignedTherapist(therapist || null);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-student')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        My Assigned Therapist
      </Typography>

      {assignedTherapist ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{assignedTherapist.therapistName}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>{assignedTherapist.email}</Typography>
          <Typography variant="body2" color="text.secondary">
            Specialty: {assignedTherapist.specialty}
          </Typography>
        </Paper>
      ) : (
        <Typography variant="body1" color="text.secondary">
          You haven’t been assigned a therapist yet.
        </Typography>
      )}
    </Container>
  );
};

export default TherapistAssignmentPage;
