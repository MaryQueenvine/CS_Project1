// src/pages/StudentProfilePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button,
  Box, Card, CardContent, Avatar, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css'; // Shared landing style

const StudentProfilePage = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    name: '',
    faculty: '',
    year: ''
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('studentProfiles')) || {};
    if (currentUser?.email && profiles[currentUser.email]) {
      setFormData(profiles[currentUser.email]);
    }
  }, [currentUser?.email]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    const profiles = JSON.parse(localStorage.getItem('studentProfiles')) || {};
    profiles[currentUser.email] = formData;
    localStorage.setItem('studentProfiles', JSON.stringify(profiles));
    setSuccess(true);
  };

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View and edit your personal information below
        </Typography>
      </div>

      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/dashboard-student')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        {/* Avatar + Name */}
        <Card
          elevation={4}
          sx={{
            mb: 3,
            p: 3,
            textAlign: 'center',
            background: '#f5f5ff',
            borderRadius: 3
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 2,
              backgroundColor: '#764ba2',
              fontSize: 36
            }}
          >
            {formData.name ? formData.name[0].toUpperCase() : '👤'}
          </Avatar>
          <Typography variant="h6">
            {formData.name || 'No name set'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.email}
          </Typography>
        </Card>

        {/* Editable Info Form */}
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Edit Your Details
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Profile updated successfully!
              </Alert>
            )}

            <TextField
              name="name"
              label="Full Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              name="faculty"
              label="Faculty"
              fullWidth
              margin="normal"
              value={formData.faculty}
              onChange={handleChange}
            />

            <TextField
              name="year"
              label="Year of Study"
              fullWidth
              margin="normal"
              value={formData.year}
              onChange={handleChange}
            />

            <Box mt={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSave}
                sx={{
                  backgroundColor: '#764ba2',
                  '&:hover': {
                    backgroundColor: '#5e3f9b'
                  }
                }}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default StudentProfilePage;
