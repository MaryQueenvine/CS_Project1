import React from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Box, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

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
    <div className="page-container">
      <Header />

      {/* Banner Section */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          Assigned Students
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View and manage the students currently under your care.
        </Typography>
      </div>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box textAlign="left" sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard-therapist')}
            variant="outlined"
            sx={{
              borderColor: '#764ba2',
              color: '#764ba2',
              '&:hover': {
                backgroundColor: '#f3e5f5',
                borderColor: '#764ba2'
              }
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Grid container spacing={4}>
          {mockStudents.map((student, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  background: 'linear-gradient(to right, #f5f5ff, #ffffff)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: '#764ba2' }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#4a148c' }}>
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Faculty:</strong> {student.faculty}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Year:</strong> {student.year}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: '#764ba2',
                      '&:hover': {
                        backgroundColor: '#5e3f9b'
                      }
                    }}
                    onClick={() =>
                      navigate(`/student-mood-logs/${encodeURIComponent(student.email)}`)
                    }
                  >
                    View Mood Logs
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default AssignedStudentsPage;
