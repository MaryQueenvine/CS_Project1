import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, Chip,
  Button, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TherapistStudentListPage = () => {
  const navigate = useNavigate();
  const [assignedStudents, setAssignedStudents] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const allAssignments = JSON.parse(localStorage.getItem('studentAssignments')) || [];

    const filtered = allAssignments.filter(
      entry => entry.therapistEmail === currentUser?.email
    );

    setAssignedStudents(filtered);
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
        My Assigned Students
      </Typography>

      {assignedStudents.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You have not been assigned any students yet.
        </Typography>
      ) : (
        assignedStudents.map((entry, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">{entry.studentEmail}</Typography>
              <Chip label="Assigned" color="success" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Assigned on: {new Date(entry.assignedAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default TherapistStudentListPage;
