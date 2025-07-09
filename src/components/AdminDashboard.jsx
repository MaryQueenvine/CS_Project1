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
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    therapists: 0,
    sessionRequests: 0,
    alerts: 0,
    flaggedLogs: 0
  });

  const navigate = useNavigate();

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
      gradient: 'linear-gradient(to right, #42a5f5, #1e88e5)',
      onClick: () => navigate('/admin-students')
    },
    {
      title: 'Total Therapists',
      value: stats.therapists,
      icon: <SupervisorAccountIcon />,
      gradient: 'linear-gradient(to right, #26c6da, #00acc1)',
      onClick: () => navigate('/admin-therapists')
    },
    {
      title: 'Session Requests',
      value: stats.sessionRequests,
      icon: <EventIcon />,
      gradient: 'linear-gradient(to right, #7e57c2, #5e35b1)',
      onClick: () => navigate('/admin-session-requests')
    },
    {
      title: 'Emergency Alerts',
      value: stats.alerts,
      icon: <WarningIcon />,
      gradient: 'linear-gradient(to right, #ef5350, #e53935)',
      onClick: () => navigate('/admin-alerts')
    },
    {
      title: 'Flagged Mood Logs',
      value: stats.flaggedLogs,
      icon: <FlagIcon />,
      gradient: 'linear-gradient(to right, #ffb300, #f57c00)',
      onClick: () => navigate('/admin-flagged-logs')
    },
    {
      title: 'Manage Resources',
      value: '',
      icon: <LibraryBooksIcon />,
      gradient: 'linear-gradient(to right, #66bb6a, #43a047)',
      onClick: () => navigate('/admin-resources')
    },
    {
      title: 'Admin Profile',
      value: '',
      icon: <AdminPanelSettingsIcon />,
      gradient: 'linear-gradient(to right, #ab47bc, #8e24aa)',
      onClick: () => navigate('/admin-profile')
    }
  ];

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #7e57c2, #5e35b1)',
          color: 'white'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          🛠️ Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Monitor system activity, manage users, alerts, and resources
        </Typography>
      </div>

      <Container sx={{ py: 5 }}>
        <Grid container spacing={3}>
          {cards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                elevation={4}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: card.gradient,
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-6px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'white', color: '#333' }}>
                      {card.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {card.title}
                      </Typography>
                      {card.value !== '' && (
                        <Typography variant="h4">{card.value}</Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={card.onClick}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: 'white',
                      color: '#333',
                      '&:hover': {
                        backgroundColor: '#f3e5f5',
                        color: '#5e35b1'
                      }
                    }}
                  >
                    Go to Page
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

export default AdminDashboard;
