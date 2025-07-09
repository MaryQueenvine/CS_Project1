// src/pages/AssignTherapistPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, FormControl, InputLabel,
  Select, MenuItem, Button, Box, Paper, Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Header from '../pages/Header';
import { useNavigate } from 'react-router-dom';
import '../pages/Landingpage.css';

const AssignTherapistPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setStudents(users.filter(u => u.role === 'Student'));
    setTherapists(users.filter(u => u.role === 'Therapist'));
  }, []);

  const handleAssign = () => {
    if (!selectedStudent || !selectedTherapist) return;
    const assignments = JSON.parse(localStorage.getItem('studentAssignments')) || [];
    const updated = [
      ...assignments.filter(a => a.studentEmail !== selectedStudent),
      { studentEmail: selectedStudent, therapistEmail: selectedTherapist }
    ];
    localStorage.setItem('studentAssignments', JSON.stringify(updated));
    setSelectedStudent('');
    setSelectedTherapist('');
    alert('✅ Assignment saved!');
  };

  return (
    <div className="page-container">
      <Header />

      <div
        className="animated-section"
        style={{ background: 'linear-gradient(to right, #7b1fa2, #512da8)' }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          🧑‍⚕️ Assign Therapist
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Match each student to a mental health professional
        </Typography>
      </div>

      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to right, #ede7f6, #d1c4e9)',
            animation: 'fadeIn 0.5s ease-in-out',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <SupervisorAccountIcon fontSize="large" color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4527a0' }}>
              Assign Student to Therapist
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white', borderRadius: 1 }}>
                <InputLabel>Select Student</InputLabel>
                <Select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  label="Select Student"
                >
                  {students.map((s, i) => (
                    <MenuItem key={i} value={s.email}>
                      {s.email} — {s.name || 'Unnamed'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white', borderRadius: 1 }}>
                <InputLabel>Select Therapist</InputLabel>
                <Select
                  value={selectedTherapist}
                  onChange={(e) => setSelectedTherapist(e.target.value)}
                  label="Select Therapist"
                >
                  {therapists.map((t, i) => (
                    <MenuItem key={i} value={t.email}>
                      {t.email} — {t.name || 'Unnamed'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAssign}
                disabled={!selectedStudent || !selectedTherapist}
                sx={{
                  background: 'linear-gradient(to right, #7b1fa2, #512da8)',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(to right, #5e35b1, #311b92)'
                  }
                }}
              >
                Assign Therapist
              </Button>
            </Grid>
          </Grid>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard-admin')}
            variant="outlined"
            sx={{ mt: 3 }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default AssignTherapistPage;
