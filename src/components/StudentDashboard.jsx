import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert
} from '@mui/material';

import ChatIcon from '@mui/icons-material/Chat';
import MoodIcon from '@mui/icons-material/Mood';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleEmergencyClick = () => setOpenConfirm(true);

  const handleSendAlert = () => {
    setOpenConfirm(false);
    setAlertSent(true);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const newAlert = {
      studentId: currentUser?.email || 'anonymous@student.com',
      timestamp: new Date().toISOString(),
      reason: 'Triggered from Emergency Button',
      reviewed: false
    };

    const existingAlerts = JSON.parse(localStorage.getItem('emergencyAlerts')) || [];
    existingAlerts.push(newAlert);
    localStorage.setItem('emergencyAlerts', JSON.stringify(existingAlerts));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold">
          Welcome to Student MindCare
        </Typography>
      </Box>

      {/* Triage */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <ChatIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Triage Chatbot</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          Begin your mental health check-in through a guided chatbot.
        </Typography>
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/triage-chatbot')}>
          Start Triage
        </Button>
        <Button
         variant="text"
          fullWidth
          onClick={() => navigate('/triage-summaries')}
          >
          View Past Triage Summaries
          </Button>

          



      </Paper>

      {/* Mood Check-In */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <MoodIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h6">Mood Check-In</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          Optional daily mood reflection to track emotional trends.
        </Typography>
        <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate('/mood-checkin')}>
          Check In
        </Button>
      </Paper>

      {/* Request Session */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <CalendarMonthIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="h6">Request a Session</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          Choose a time to speak to your assigned therapist.
        </Typography>
        <Button variant="outlined" color="info" fullWidth onClick={() => navigate('/request-session')}>
          Request Session
        </Button>
            <Button
              variant="text"
            fullWidth
            onClick={() => navigate('/assigned-therapist')}
            >
            View Assigned Therapist
            </Button>
            <Button
             variant="text"
             fullWidth
              onClick={() => navigate('/confirmed-sessions')} 
             >
              View Confirmed Sessions
            </Button>

      </Paper>

      {/* Resources */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <ArticleIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="h6">Resources</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          Access therapist-curated content to help you cope and grow.
        </Typography>
        <Button variant="text" fullWidth onClick={() => navigate('/student-resources')}>
          View Materials
        </Button>
      </Paper>

        {/* Notifications */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <ArticleIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          Access your notifications for important updates and messages.
        </Typography>
        <Button
          variant="outlined"
          color="info"
          fullWidth
          onClick={() => navigate('/notifications')}
          >
         View Notifications
        </Button>
      </Paper>

              {/* Pre-session chat with therapist */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <ArticleIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="h6">Chat with therapist</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          Chat with your therapist before your session to discuss any concerns or topics.
        </Typography>
          <Button
           variant="outlined"
           color="primary"
          fullWidth
           onClick={() => navigate('/chat-therapist')}
           >
           Message My Therapist
            </Button>

      </Paper>

      {/* Emergency Support */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#ffeaea' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <NotificationsActiveIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">Emergency Support</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          If you are in distress or need urgent help, click below.
        </Typography>
        <Button variant="contained" color="error" fullWidth onClick={handleEmergencyClick}>
          Alert Admin & Therapist
        </Button>
      </Paper>

      {/* Emergency Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Emergency Alert</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to send an emergency alert? Your assigned therapist and system admin will be notified immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleSendAlert} color="error" variant="contained">
            Yes, Send Alert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar open={alertSent} autoHideDuration={5000} onClose={() => setAlertSent(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Emergency alert sent! Help is on the way.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentDashboard;
