// src/pages/GlobalFlaggedMoodLogsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Chip, Divider,
  Button, TextField, Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const GlobalFlaggedMoodLogsPage = () => {
  const navigate = useNavigate();
  const [groupedLogs, setGroupedLogs] = useState({});

  useEffect(() => {
    const allLogs = JSON.parse(localStorage.getItem('moodCheckIns')) || [];
    const flagged = allLogs.filter(log => log.flagged === true);

    const grouped = flagged.reduce((acc, log) => {
      const studentKey = log.studentId || 'unknown@student.com';
      if (!acc[studentKey]) acc[studentKey] = [];
      acc[studentKey].push(log);
      return acc;
    }, {});

    setGroupedLogs(grouped);
  }, []);

  const handleNoteChange = (studentId, timestamp, value) => {
    const updated = { ...groupedLogs };
    updated[studentId] = updated[studentId].map(log =>
      log.timestamp === timestamp ? { ...log, therapistNote: value } : log
    );
    setGroupedLogs(updated);

    const all = JSON.parse(localStorage.getItem('moodCheckIns')) || [];
    const updatedAll = all.map(log =>
      log.timestamp === timestamp && log.studentId === studentId
        ? { ...log, therapistNote: value }
        : log
    );
    localStorage.setItem('moodCheckIns', JSON.stringify(updatedAll));
  };

  const getDashboardPath = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return '/login';
    return currentUser.role === 'Admin'
      ? '/dashboard-admin'
      : '/dashboard-therapist';
  };

  const hasLogs = Object.keys(groupedLogs).length > 0;

  return (
    <div className="page-container">
      <Header />

      {/* Top Animated Banner */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #ef5350, #d32f2f)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          🚨 Flagged Mood Logs
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Review and manage critical emotional alerts across all students.
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(getDashboardPath())}
          sx={{
            mb: 3,
            borderColor: '#e53935',
            color: '#e53935',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#fdecea',
              borderColor: '#c62828'
            }
          }}
        >
          Back to Dashboard
        </Button>

        {!hasLogs ? (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            No flagged mood logs found.
          </Typography>
        ) : (
          Object.entries(groupedLogs).map(([studentId, logs]) => (
            <Box key={studentId} sx={{ mb: 6 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: '#c62828',
                  borderLeft: '5px solid #c62828',
                  pl: 2,
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}
              >
                Student: {studentId}
              </Typography>

              {logs.map((log, idx) => (
                <Paper key={idx} elevation={4} className="alert-card">
                  <div className="log-header">
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: '#333' }}
                    >
                      Mood: {log.mood}
                    </Typography>
                    <div className="chip-group">
                      <Chip
                        label={new Date(log.timestamp).toLocaleString()}
                        size="small"
                        color="info"
                      />
                      <Chip
                        label="Flagged"
                        size="small"
                        sx={{
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </div>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {log.comment || 'No comment provided.'}
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Therapist Note"
                    variant="outlined"
                    value={log.therapistNote || ''}
                    onChange={(e) =>
                      handleNoteChange(studentId, log.timestamp, e.target.value)
                    }
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        borderColor: '#ccc'
                      }
                    }}
                  />
                </Paper>
              ))}
            </Box>
          ))
        )}
      </Container>
    </div>
  );
};

export default GlobalFlaggedMoodLogsPage;
