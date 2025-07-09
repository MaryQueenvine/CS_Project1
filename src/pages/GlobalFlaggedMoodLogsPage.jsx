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
    return currentUser?.role === 'Admin' ? '/dashboard-admin' : '/dashboard-therapist';
  };

  return (
    <div className="page-container">
      <Header />

      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #7b1fa2, #512da8)',
          color: '#fff'
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
            borderColor: '#7b1fa2',
            color: '#7b1fa2',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f3e5f5',
              borderColor: '#512da8'
            }
          }}
        >
          Back to Dashboard
        </Button>

        {Object.keys(groupedLogs).length === 0 ? (
          <Typography align="center" color="text.secondary">
            No flagged mood logs found.
          </Typography>
        ) : (
          Object.entries(groupedLogs).map(([studentId, logs]) => (
            <Box key={studentId} sx={{ mb: 6 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: '#512da8',
                  borderLeft: '5px solid #7b1fa2',
                  pl: 2,
                  fontWeight: 'bold'
                }}
              >
                Student: {studentId}
              </Typography>

              {logs.map((log, idx) => (
                <Paper
                  key={idx}
                  elevation={4}
                  sx={{
                    p: 3,
                    mb: 3,
                    background: 'linear-gradient(to right, #ede7f6, #f3e5f5)',
                    borderLeft: '6px solid #7b1fa2',
                    borderRadius: 2
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Mood: {log.mood}
                    </Typography>
                    <Box>
                      <Chip
                        label={new Date(log.timestamp).toLocaleString()}
                        size="small"
                        color="info"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label="Flagged"
                        size="small"
                        sx={{
                          backgroundColor: '#7b1fa2',
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography color="text.secondary" sx={{ mb: 2 }}>
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
