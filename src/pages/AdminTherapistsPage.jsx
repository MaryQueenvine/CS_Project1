// src/pages/AdminTherapistsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const AdminTherapistsPage = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const therapistUsers = users.filter(user => user.role === 'Therapist');
    setTherapists(therapistUsers);
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
        All Registered Therapists
      </Typography>

      {therapists.length === 0 ? (
        <Typography>No therapists registered yet.</Typography>
      ) : (
        therapists.map((therapist, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{therapist.name}</Typography>
            <Typography variant="body2" color="text.secondary">{therapist.email}</Typography>
            <Divider sx={{ mt: 1 }} />
          </Paper>
        ))
      )}
    </Container>
  );
};

export default AdminTherapistsPage;
