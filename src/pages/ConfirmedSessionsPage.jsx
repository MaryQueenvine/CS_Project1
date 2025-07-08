// src/pages/ConfirmedSessionsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const ConfirmedSessionsPage = () => {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const allConfirmed = JSON.parse(localStorage.getItem('confirmedSessions')) || [];

    const studentSessions = allConfirmed.filter(
      session => session.studentEmail === currentUser?.email
    );

    setConfirmed(studentSessions);
  }, []);

  return (
    <div className="page-container">
      <Header />

      {/* Top Banner */}
      <div className="animated-section" style={{ padding: '60px 20px' }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>
          My Confirmed Sessions
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 1, color: '#e0f7fa', opacity: 0.9 }}
        >
          A summary of your scheduled therapy appointments
        </Typography>
      </div>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box textAlign="left" sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/dashboard-student')}
            sx={{
              borderColor: '#0288d1',
              color: '#0288d1',
              '&:hover': {
                backgroundColor: '#e1f5fe',
                borderColor: '#0288d1'
              }
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {confirmed.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            You don’t have any confirmed sessions yet.
          </Typography>
        ) : (
          confirmed.map((session, idx) => (
            <Card
              key={idx}
              elevation={3}
              sx={{
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(to right, #e1f5fe, #ffffff)'
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: '#0288d1', fontWeight: 'bold', mb: 1 }}>
                  {session.topic}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  📅 Scheduled: {new Date(session.scheduledTime).toLocaleString()}
                </Typography>

                {session.therapistName && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    🧑‍⚕️ Therapist: <strong>{session.therapistName}</strong>
                  </Typography>
                )}

                <Divider sx={{ my: 1 }} />

                <Typography
                  variant="caption"
                  sx={{
                    color: '#2e7d32',
                    fontWeight: 'bold',
                    backgroundColor: '#c8e6c9',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'inline-block'
                  }}
                >
                  ✅ Status: Confirmed
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
};

export default ConfirmedSessionsPage;
