// src/pages/NotificationsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch simulated notifications from localStorage
    const saved = JSON.parse(localStorage.getItem('studentNotifications')) || [];
    setNotifications(saved);
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
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          My Notifications
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Stay updated with important system messages and session alerts
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 5 }}>
        {notifications.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: '#f5f5ff'
            }}
          >
            <NotificationsActiveIcon sx={{ fontSize: 60, color: '#764ba2', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No New Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You’re all caught up! Check back later for updates.
            </Typography>
          </Paper>
        ) : (
          notifications.map((notif, idx) => (
            <Paper
              key={idx}
              elevation={4}
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 3,
                backgroundColor: '#fff6fc'
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: '#764ba2', mr: 2 }}>
                  <NotificationsActiveIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {notif.title || 'Notification'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notif.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ color: '#4a4a4a' }}>
                {notif.message}
              </Typography>
            </Paper>
          ))
        )}
      </Container>
    </div>
  );
};

export default NotificationsPage;
