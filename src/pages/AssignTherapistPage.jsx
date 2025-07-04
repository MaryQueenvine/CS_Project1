import React, { useEffect, useState } from 'react';
import {
  Container, Typography, FormControl, InputLabel,
  Select, MenuItem, Button, Box, Paper, Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const AssignTherapistPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const studentList = users.filter(u => u.role === 'Student');
    const therapistList = users.filter(u => u.role === 'Therapist');

    setStudents(studentList);
    setTherapists(therapistList);
  }, []);

  const handleAssign = () => {
    if (!selectedStudent || !selectedTherapist) return;

    const assignments = JSON.parse(localStorage.getItem('studentAssignments')) || [];

    const updated = [
      ...assignments.filter(a => a.studentEmail !== selectedStudent),
      {
        studentEmail: selectedStudent,
        therapistEmail: selectedTherapist
      }
    ];

    localStorage.setItem('studentAssignments', JSON.stringify(updated));

    setSelectedStudent('');
    setSelectedTherapist('');
    alert('✅ Assignment saved!');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-admin')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Assign Student to Therapist
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
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
            <FormControl fullWidth>
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
              color="primary"
              fullWidth
              onClick={handleAssign}
              disabled={!selectedStudent || !selectedTherapist}
            >
              Assign
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AssignTherapistPage;
