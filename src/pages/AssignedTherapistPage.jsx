// src/pages/AssignedTherapistPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import Header from '../pages/Header';
import '../pages/Landingpage.css'; // corrected path if needed

const AssignedTherapistPage = () => {
  const [assignedTherapist, setAssignedTherapist] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const assignments = JSON.parse(localStorage.getItem('therapistAssignments')) || {};
    const therapist = assignments[currentUser?.email] || null;
    setAssignedTherapist(therapist);
  }, []);

  return (
    <div className="page-container">
      <Header />

      {/* Hero Section */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Assigned Therapist
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View your assigned therapist’s profile and connect for support.
        </Typography>
      </div>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        {!assignedTherapist ? (
          <Typography variant="body1" color="text.secondary" align="center">
            You haven’t been assigned a therapist yet. Please check again soon.
          </Typography>
        ) : (
          <Card
            elevation={5}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: '#f4f2ff',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: '#764ba2',
                fontSize: 40
              }}
            >
              {assignedTherapist.name?.[0]?.toUpperCase() || '👤'}
            </Avatar>

            <Typography variant="h6" gutterBottom>
              {assignedTherapist.name || 'Therapist Name'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {assignedTherapist.email}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box textAlign="left" sx={{ px: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Specialty:</strong> {assignedTherapist.specialty || 'Not specified'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Phone:</strong> {assignedTherapist.phone || 'Not provided'}
              </Typography>
              <Typography variant="body1">
                <strong>Institution:</strong> {assignedTherapist.institution || 'N/A'}
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: '#764ba2',
                '&:hover': { backgroundColor: '#5c3a8d' }
              }}
              href={`mailto:${assignedTherapist.email}`}
            >
              Contact Therapist
            </Button>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default AssignedTherapistPage;
