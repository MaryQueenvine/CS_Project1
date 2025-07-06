// src/pages/AssignedStudentsPage.jsx
import React from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Box, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
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
    <Container sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard-therapist')}
        variant="outlined"
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
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar color="primary">
                    <SchoolIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{student.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{student.email}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2">Faculty: {student.faculty}</Typography>
                <Typography variant="body2">Year: {student.year}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/student-mood-logs/${encodeURIComponent(student.email)}`)}
                >
                  View Mood Logs
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AssignedStudentsPage;
