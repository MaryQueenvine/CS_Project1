import React from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Box, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const features = [
  {
    title: 'Assigned Students',
    description: 'Manage your assigned student list.',
    icon: <AssignmentIndIcon fontSize="large" />,
    action: 'View Students',
    route: '/assigned-students',
    color: 'primary'
  },
  {
    title: 'Session Requests',
    description: 'Review and approve session bookings.',
    icon: <EventAvailableIcon fontSize="large" />,
    action: 'Review Requests',
    route: '/therapist-session-requests',
    color: 'info'
  },
  {
    title: 'Triage Summaries',
    description: 'Analyze submitted triage conversations.',
    icon: <ReportProblemIcon fontSize="large" />,
    action: 'Open Summaries',
    route: '/triage-reviews',
    color: 'secondary'
  },
  {
    title: 'Flagged Mood Logs',
    description: 'Review logs with flagged mood concerns.',
    icon: <MoodBadIcon fontSize="large" />,
    action: 'View Mood Flags',
    route: '/global-flagged-mood-logs',
    color: 'error'
  },
  {
    title: 'Messaging',
    description: 'Communicate with students directly.',
    icon: <ChatIcon fontSize="large" />,
    action: 'Open Chat',
    route: '/chat-student',
    color: 'success'
  },
  {
    title: 'Manage Resources',
    description: 'Upload support materials for students.',
    icon: <LibraryBooksIcon fontSize="large" />,
    action: 'Upload Resources',
    route: '/therapist-resources',
    color: 'warning'
  },
  {
    title: 'Profile Settings',
    description: 'Edit your contact info and license file.',
    icon: <SettingsIcon fontSize="large" />,
    action: 'Edit Profile',
    route: '/therapist-profile',
    color: 'secondary'
  }
];

const TherapistDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
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
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          Therapist Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Welcome back! Manage your sessions, reviews, and profile settings.
        </Typography>
      </div>

      {/* Feature Cards */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  backgroundColor: '#f5f5ff',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: `${feature.color}.main`, mr: 2 }}>
                      {feature.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    color={feature.color}
                    fullWidth
                    onClick={() => navigate(feature.route)}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default TherapistDashboard;
