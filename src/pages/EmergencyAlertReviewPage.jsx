// src/pages/EmergencyAlertReviewPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Chip, Divider, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const EmergencyAlertReviewPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('emergencyAlerts')) || [];
    setAlerts(saved);
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
          🚨 Emergency Alerts Review
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Urgent mental health alerts triggered by students
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard-admin')}
          sx={{
            mb: 3,
            borderColor: '#7b1fa2',
            color: '#7b1fa2',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#ede7f6',
              borderColor: '#512da8'
            }
          }}
        >
          Back to Admin Dashboard
        </Button>

        {alerts.length === 0 ? (
          <Typography>No emergency alerts have been triggered yet.</Typography>
        ) : (
          alerts.map((alert, index) => (
            <Paper
              key={index}
              elevation={4}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                background: 'linear-gradient(to right, #ede7f6, #f3e5f5)',
                borderLeft: '6px solid #7b1fa2'
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ color: '#512da8', fontWeight: 600 }}>
                  Student: {alert.studentEmail}
                </Typography>
                <Chip label="🚨 ALERT" color="secondary" variant="outlined" />
              </Box>

              <Typography variant="body2" mt={1}>
                <strong>Triggered On:</strong>{' '}
                {new Date(alert.timestamp).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                <strong>Flagged Message:</strong> {alert.message}
              </Typography>

              {Array.isArray(alert.keywords) && alert.keywords.length > 0 && (
                <Typography variant="body2" mt={2} sx={{ color: '#7b1fa2' }}>
                  <strong>Keywords Detected:</strong>{' '}
                  {alert.keywords.map((word, i) => (
                    <Chip
                      key={i}
                      label={word}
                      size="small"
                      color="secondary"
                      sx={{ mr: 1, mt: 1 }}
                    />
                  ))}
                </Typography>
              )}
            </Paper>
          ))
        )}
      </Container>
    </div>
  );
};

export default EmergencyAlertReviewPage;
