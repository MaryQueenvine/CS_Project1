// src/pages/AdminProfilePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Box,
  Avatar, TextField, Button, Divider
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const [contactInfo, setContactInfo] = useState({ phone: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('adminContactInfo')) || {};
    setContactInfo(stored);
  }, []);

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('adminContactInfo', JSON.stringify(contactInfo));
    alert('Contact information updated successfully.');
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

      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <AdminPanelSettingsIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Admin Profile</Typography>
            <Typography variant="body2" color="text.secondary">
              System administrator settings
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" gutterBottom>
          Email: {currentUser.email}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Role: {currentUser.role}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>

        <TextField
          label="Phone Number"
          name="phone"
          fullWidth
          margin="normal"
          value={contactInfo.phone}
          onChange={handleChange}
        />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSave}>
          Save Changes
        </Button>
      </Paper>
    </Container>
  );
};

export default AdminProfilePage;
