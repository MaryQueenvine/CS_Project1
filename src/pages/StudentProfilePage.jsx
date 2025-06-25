import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button,
  Box, Paper, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

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
    // Load stored student info if any
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
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-student')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Your Profile
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
          <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentProfilePage;
