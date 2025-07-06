// src/pages/EmergencyAlertReviewPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Chip, Divider, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const EmergencyAlertReviewPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('emergencyAlerts')) || [];
    setAlerts(saved);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard-admin')}
        sx={{ mb: 3 }}
      >
        Back to Admin Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Emergency Alerts
      </Typography>

      {alerts.length === 0 ? (
        <Typography>No emergency alerts have been triggered yet.</Typography>
      ) : (
        alerts.map((alert, index) => (
          <Paper key={index} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Student: {alert.studentEmail}
              </Typography>
              <Chip label="🚨 ALERT" color="error" />
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
              <Typography variant="body2" mt={1}>
                <strong>Keywords Detected:</strong> {alert.keywords.join(', ')}
              </Typography>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
};

export default EmergencyAlertReviewPage;
