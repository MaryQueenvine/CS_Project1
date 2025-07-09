// src/pages/AdminTherapistsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Divider, Avatar, Grid, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const AdminTherapistsPage = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const therapistUsers = users.filter(user => user.role === 'Therapist');
    setTherapists(therapistUsers);
  }, []);

  return (
    <div className="page-container">
      <Header />

      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #7b1fa2, #512da8)',
          color: '#fff'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          🧠 Registered Therapists
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Review therapist registrations and credentials
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/dashboard-admin')}
          sx={{
            mb: 3,
            borderColor: '#7b1fa2',
            color: '#7b1fa2',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f3e5f5',
              borderColor: '#512da8'
            }
          }}
        >
          Back to Dashboard
        </Button>

        {therapists.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No therapists registered yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {therapists.map((therapist, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderLeft: '6px solid #7b1fa2',
                    borderRadius: 3,
                    background: 'linear-gradient(to right, #ede7f6, #f3e5f5)'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: '#512da8' }}>
                      <SupervisorAccountIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4527a0' }}>
                        {therapist.name || 'Unnamed Therapist'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {therapist.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2, display: 'block' }}
                  >
                    Role: Therapist
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default AdminTherapistsPage;
