// src/pages/GlobalFlaggedMoodLogsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, Chip, Divider,
  Button, TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const GlobalFlaggedMoodLogsPage = () => {
  const navigate = useNavigate();
  const [groupedLogs, setGroupedLogs] = useState({});

  useEffect(() => {
    const allLogs = JSON.parse(localStorage.getItem('moodCheckIns')) || [];
    const flagged = allLogs.filter(log => log.flagged === true);

    const grouped = flagged.reduce((acc, log) => {
      const studentKey = log.studentId || 'unknown@student.com';
      if (!acc[studentKey]) {
        acc[studentKey] = [];
      }
      acc[studentKey].push(log);
      return acc;
    }, {});

    setGroupedLogs(grouped);
  }, []);

  const handleNoteChange = (studentId, timestamp, value) => {
    const updated = { ...groupedLogs };
    updated[studentId] = updated[studentId].map(log => {
      if (log.timestamp === timestamp) {
        return { ...log, therapistNote: value };
      }
      return log;
    });
    setGroupedLogs(updated);

    const all = JSON.parse(localStorage.getItem('moodCheckIns')) || [];
    const updatedAll = all.map(log => {
      if (log.timestamp === timestamp && log.studentId === studentId) {
        return { ...log, therapistNote: value };
      }
      return log;
    });
    localStorage.setItem('moodCheckIns', JSON.stringify(updatedAll));
  };

  const hasLogs = Object.keys(groupedLogs).length > 0;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-therapist')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Flagged Mood Logs (Grouped by Student)
      </Typography>

      {!hasLogs ? (
        <Typography variant="body1" color="text.secondary">
          No flagged mood logs found.
        </Typography>
      ) : (
        Object.entries(groupedLogs).map(([studentId, logs]) => (
          <Box key={studentId} sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Student: {studentId}
            </Typography>

            {logs.map((log, idx) => (
              <Paper key={idx} sx={{ p: 3, mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1">Mood: {log.mood}</Typography>
                  <Box display="flex" gap={1}>
                    <Chip
                      label={new Date(log.timestamp).toLocaleString()}
                      size="small"
                      color="info"
                    />
                    <Chip label="Flagged" color="error" size="small" />
                  </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {log.comment || 'No comment provided.'}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Therapist Note"
                  value={log.therapistNote || ''}
                  onChange={(e) => handleNoteChange(studentId, log.timestamp, e.target.value)}
                />
              </Paper>
            ))}
          </Box>
        ))
      )}
    </Container>
  );
};

export default GlobalFlaggedMoodLogsPage;
