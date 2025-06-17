// src/components/StudentDashboard.jsx
import React from 'react';
import {
  Container, Typography, Box, Paper, Button
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoodIcon from '@mui/icons-material/Mood';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      {/* Centered Welcome Heading */}
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold">
          Welcome to Student MindCare
        </Typography>
      </Box>

      {/* Triage Chatbot Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <ChatIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Triage Chatbot</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          Begin your mental health check-in through a guided chatbot.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate('/triage-chatbot')}
        >
          Start Triage
        </Button>
      </Paper>

      {/* Mood Check-in */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <MoodIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h6">Mood Check-In</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          Optional daily mood reflection to track emotional trends.
        </Typography>
        <Button variant="outlined" color="secondary" fullWidth>Check In</Button>
      </Paper>

      {/* Upcoming Session */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <ScheduleIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="h6">Upcoming Session</Typography>
        </Box>
        <Typography variant="body2" mb={2}>
          No session scheduled. Please book through your therapist panel.
        </Typography>
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
        <Button variant="text" fullWidth>View Materials</Button>
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
        <Button variant="contained" color="error" fullWidth>
          Alert Admin & Therapist
        </Button>
      </Paper>
    </Container>
  );
};

export default StudentDashboard;
