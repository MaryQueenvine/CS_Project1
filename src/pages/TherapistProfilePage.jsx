// src/pages/TherapistProfilePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, TextField,
  Button, Box, Grid, Avatar, InputAdornment
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Header from './Header';
import './Landingpage.css';

const TherapistProfilePage = () => {
  const [therapist, setTherapist] = useState({ email: '', name: '', licenseFile: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const storedProfiles = JSON.parse(localStorage.getItem('therapistProfiles')) || {};
    const profile = storedProfiles[user?.email] || { email: user?.email, name: '', licenseFile: '' };
    setTherapist(profile);
  }, []);

  const handleChange = (e) => {
    setTherapist({ ...therapist, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTherapist({ ...therapist, licenseFile: file.name });
    }
  };

  const handleSave = () => {
    const storedProfiles = JSON.parse(localStorage.getItem('therapistProfiles')) || {};
    storedProfiles[therapist.email] = therapist;
    localStorage.setItem('therapistProfiles', JSON.stringify(storedProfiles));
    alert('Profile updated!');
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
          🧾 Therapist Profile
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View or update your personal and licensing information
        </Typography>
      </div>

      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(to right, #ede7f6, #d1c4e9)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.6s ease-in-out'
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <BadgeIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4527a0' }}>
                  Therapist Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your personal details and license file
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  variant="outlined"
                  value={therapist.name}
                  onChange={handleChange}
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label=""
                  variant="outlined"
                  value={therapist.email}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#7e57c2' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  fullWidth
                  sx={{
                    borderColor: '#7e57c2',
                    color: '#7e57c2',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#ede7f6',
                      borderColor: '#5e35b1'
                    }
                  }}
                >
                  Upload License File
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
                {therapist.licenseFile && (
                  <Typography variant="body2" mt={1} color="text.secondary">
                    Current: {therapist.licenseFile}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(to right, #7b1fa2, #512da8)',
                    color: 'white',
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
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default TherapistProfilePage;
