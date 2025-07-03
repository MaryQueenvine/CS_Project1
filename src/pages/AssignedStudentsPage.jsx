import React from 'react';
import {
  Container, Typography, Grid, Paper, Box, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const mockStudents = [
  {
    name: 'Jane Wambui',
    email: 'jane@student.com',
    faculty: 'Health Sciences',
    year: '3'
  },
  {
    name: 'Brian Otieno',
    email: 'brian@student.com',
    faculty: 'Computer Science',
    year: '2'
  },
  {
    name: 'Amina Yusuf',
    email: 'amina@student.com',
    faculty: 'Business',
    year: '4'
  }
];

const AssignedStudentsPage = () => {
  const navigate = useNavigate();

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
        Assigned Students
      </Typography>

      <Grid container spacing={3}>
        {mockStudents.map((student, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{student.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {student.email}
              </Typography>
              <Box mt={1}>
                <Typography variant="body2">Faculty: {student.faculty}</Typography>
                <Typography variant="body2">Year: {student.year}</Typography>
              </Box>
              <Box mt={2} display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(`/student-mood-logs/${encodeURIComponent(student.email)}`)}
                >
                  View Mood Logs
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AssignedStudentsPage;
