import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, Button, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

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
        My Confirmed Sessions
      </Typography>

      {confirmed.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You don’t have any confirmed sessions yet.
        </Typography>
      ) : (
        confirmed.map((session, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">{session.topic}</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Scheduled Time: {new Date(session.scheduledTime).toLocaleString()}
            </Typography>
            {session.therapistName && (
              <Typography variant="body2">
                Therapist: {session.therapistName}
              </Typography>
            )}
            <Divider sx={{ mt: 1 }} />
            <Typography variant="caption" color="success.main">
              Status: Confirmed
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default ConfirmedSessionsPage;
