// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  CardActions, Button, Avatar, Box
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import WarningIcon from '@mui/icons-material/Warning';
import FlagIcon from '@mui/icons-material/Flag';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    therapists: 0,
    sessionRequests: 0,
    alerts: 0,
    flaggedLogs: 0
  });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const sessionRequests = JSON.parse(localStorage.getItem('sessionRequests')) || [];
    const alerts = JSON.parse(localStorage.getItem('emergencyAlerts')) || [];
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];

    const students = users.filter(u => u.role === 'Student').length;
    const therapists = users.filter(u => u.role === 'Therapist').length;
    const flagged = moodLogs.filter(log => log.flagged).length;

    setStats({
      students,
      therapists,
      sessionRequests: sessionRequests.length,
      alerts: alerts.length,
      flaggedLogs: flagged
    });
  }, []);

  const cards = [
    {
      title: 'Total Students',
      value: stats.students,
      icon: <PeopleIcon />,
      color: 'primary'
    },
    {
      title: 'Total Therapists',
      value: stats.therapists,
      icon: <SupervisorAccountIcon />,
      color: 'info'
    },
    {
      title: 'Session Requests',
      value: stats.sessionRequests,
      icon: <EventIcon />,
      color: 'secondary'
    },
    {
      title: 'Emergency Alerts',
      value: stats.alerts,
      icon: <WarningIcon />,
      color: 'error'
    },
    {
      title: 'Flagged Mood Logs',
      value: stats.flaggedLogs,
      icon: <FlagIcon />,
      color: 'warning'
    }
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        System overview: users, alerts, and mood summaries
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: `${card.color}.main` }}>
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{card.title}</Typography>
                    <Typography variant="h5">{card.value}</Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="outlined" color={card.color}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
