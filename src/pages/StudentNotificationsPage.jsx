import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Button, Divider, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const typeColor = {
  'Session Approved': 'success',
  'Triage Flag': 'error',
  'New Resource': 'info',
  'Session Scheduled': 'warning'
};

const StudentNotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const all = JSON.parse(localStorage.getItem('notifications')) || [];
    const filtered = all.filter(n => n.studentEmail === currentUser?.email);
    setNotifications(filtered);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-student')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        My Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No notifications at the moment.
        </Typography>
      ) : (
        notifications.map((note, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{note.message}</Typography>
              <Chip label={note.type} color={typeColor[note.type] || 'default'} />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(note.date).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default StudentNotificationsPage;

