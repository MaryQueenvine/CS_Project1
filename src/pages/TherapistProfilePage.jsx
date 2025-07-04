// src/pages/TherapistProfilePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button,
  Paper, Box, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';

const TherapistProfilePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [bio, setBio] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [savedLicenseName, setSavedLicenseName] = useState('');

  useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem(`therapistProfile-${user.email}`));
    if (profileData) {
      setBio(profileData.bio || '');
      setSavedLicenseName(profileData.licenseFileName || '');
    }
  }, [user.email]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseFile(file);
    }
  };

  const handleSave = () => {
    const profileData = {
      bio,
      licenseFileName: licenseFile ? licenseFile.name : savedLicenseName
    };

    localStorage.setItem(`therapistProfile-${user.email}`, JSON.stringify(profileData));

    if (licenseFile) {
      setSavedLicenseName(licenseFile.name);
      setLicenseFile(null); // Clear after save
    }

    alert('Profile saved successfully!');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-therapist')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Therapist Profile Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Email</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{user.email}</Typography>

        <Divider sx={{ my: 2 }} />

        <TextField
          fullWidth
          label="Bio / Description"
          multiline
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Upload License
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>

          {licenseFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {licenseFile.name}
            </Typography>
          )}

          {!licenseFile && savedLicenseName && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Current: {savedLicenseName}
            </Typography>
          )}
        </Box>

        <Button variant="contained" onClick={handleSave} fullWidth>
          Save Profile
        </Button>
      </Paper>
    </Container>
  );
};

export default TherapistProfilePage;
