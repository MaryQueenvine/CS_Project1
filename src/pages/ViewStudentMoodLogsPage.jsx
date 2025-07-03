import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Chip, Divider, Button, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';

const ViewStudentMoodLogsPage = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [moodLogs, setMoodLogs] = useState([]);
  const [filterMood, setFilterMood] = useState('All');

  useEffect(() => {
    // Fetch all logs
    const allLogs = JSON.parse(localStorage.getItem('moodCheckIns')) || [];

    // Ensure each log has a 'flagged' field
    const patchedLogs = allLogs.map(log => ({
      ...log,
      flagged: typeof log.flagged === 'boolean' ? log.flagged : false
    }));

    // Save back patched logs to localStorage
    localStorage.setItem('moodCheckIns', JSON.stringify(patchedLogs));

    // Filter for this specific student's logs
    const filtered = patchedLogs.filter(log => log.studentId === email);
    setMoodLogs(filtered);
  }, [email]);

  const handleFlag = (index) => {
    const updatedLogs = [...moodLogs];
    updatedLogs[index].flagged = true;
    setMoodLogs(updatedLogs);

    const allLogs = JSON.parse(localStorage.getItem('moodCheckIns')) || [];
    const updatedAll = allLogs.map(log => {
      if (log.studentId === email && log.timestamp === updatedLogs[index].timestamp) {
        return { ...log, flagged: true };
      }
      return log;
    });
    localStorage.setItem('moodCheckIns', JSON.stringify(updatedAll));
  };

  const filteredLogs = filterMood === 'All'
    ? moodLogs
    : moodLogs.filter(log => log.mood === filterMood);

  const moodOptions = Array.from(new Set(moodLogs.map(log => log.mood)));

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/assigned-students')}
        sx={{ mb: 3 }}
      >
        Back to Assigned Students
      </Button>

      <Typography variant="h4" gutterBottom>
        Mood Logs for: {email}
      </Typography>

      {moodOptions.length > 0 && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="filter-label">Filter by Mood</InputLabel>
          <Select
            labelId="filter-label"
            value={filterMood}
            label="Filter by Mood"
            onChange={(e) => setFilterMood(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {moodOptions.map((mood, idx) => (
              <MenuItem key={idx} value={mood}>{mood}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {filteredLogs.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No mood check-ins found for this student.
        </Typography>
      ) : (
        filteredLogs.map((log, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">Mood: {log.mood}</Typography>
              <Chip
                label={new Date(log.timestamp).toLocaleString()}
                size="small"
                color="info"
              />
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary" mb={2}>
              {log.comment || 'No comment provided.'}
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              {log.flagged === true ? (
                <Chip label="Flagged for Follow-up" color="error" />
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleFlag(idx)}
                >
                  Flag for Follow-up
                </Button>
              )}
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default ViewStudentMoodLogsPage;
