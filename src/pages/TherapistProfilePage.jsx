// src/pages/TherapistProfilePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, TextField,
  Button, Box, Grid, Avatar
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card elevation={4}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <BadgeIcon />
            </Avatar>
            <Box>
              <Typography variant="h5">Therapist Profile</Typography>
              <Typography variant="body2" color="text.secondary">
                Update your personal details and license file
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={therapist.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={therapist.email}
                disabled
                InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1 }} /> }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                fullWidth
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
                color="primary"
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TherapistProfilePage;
