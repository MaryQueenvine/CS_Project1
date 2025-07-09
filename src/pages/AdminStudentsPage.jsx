// src/pages/AdminStudentsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Divider, Avatar, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const studentUsers = users.filter(user => user.role === 'Student');
    setStudents(studentUsers);
  }, []);

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
      <div
        className="animated-section"
        style={{ background: 'linear-gradient(to right, #7b1fa2, #512da8)' }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          🎓 All Registered Students
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View the list of students registered on the platform
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/dashboard-admin')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        {students.length === 0 ? (
          <Typography>No students registered yet.</Typography>
        ) : (
          students.map((student, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(to right, #ede7f6, #d1c4e9)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                animation: 'fadeIn 0.5s ease-in-out'
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4527a0' }}>
                    {student.name || 'Unnamed Student'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📧 {student.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Paper>
          ))
        )}
      </Container>
    </div>
  );
};

export default AdminStudentsPage;
