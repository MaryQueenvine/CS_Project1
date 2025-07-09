// src/pages/AdminProfilePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Box,
  Avatar, TextField, Button, Divider
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

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
    alert('✅ Contact information updated successfully.');
  };

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #7b1fa2, #512da8)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          👨‍💼 Admin Profile
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View and update your admin contact information
        </Typography>
      </div>

      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/dashboard-admin')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to right, #ede7f6, #d1c4e9)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.6s ease-in-out'
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <AdminPanelSettingsIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4527a0' }}>
                Admin Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System administrator settings
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
            📧 Email: {currentUser.email}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            🛡️ Role: {currentUser.role}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📞 Contact Information
          </Typography>

          <TextField
            label="Phone Number"
            name="phone"
            fullWidth
            margin="normal"
            value={contactInfo.phone}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              background: 'linear-gradient(to right, #7b1fa2, #512da8)',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #5e35b1, #311b92)'
              }
            }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminProfilePage;
