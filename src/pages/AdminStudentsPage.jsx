// src/pages/AdminStudentsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const studentUsers = users.filter(user => user.role === 'Student');
    setStudents(studentUsers);
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => navigate('/dashboard-admin')}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        All Registered Students
      </Typography>

      {students.length === 0 ? (
        <Typography>No students registered yet.</Typography>
      ) : (
        students.map((student, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{student.name}</Typography>
            <Typography variant="body2" color="text.secondary">{student.email}</Typography>
            <Divider sx={{ mt: 1 }} />
          </Paper>
        ))
      )}
    </Container>
  );
};

export default AdminStudentsPage;
