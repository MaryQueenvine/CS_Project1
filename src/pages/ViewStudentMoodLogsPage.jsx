// src/pages/ViewStudentMoodLogsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, Chip, Divider, Button,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const ViewStudentMoodLogsPage = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [moodLogs, setMoodLogs] = useState([]);
  const [filterMood, setFilterMood] = useState('All');

  useEffect(() => {
    const allLogs = JSON.parse(localStorage.getItem('moodCheckIns')) || [];
    const patchedLogs = allLogs.map(log => ({
      ...log,
      flagged: typeof log.flagged === 'boolean' ? log.flagged : false
    }));
    localStorage.setItem('moodCheckIns', JSON.stringify(patchedLogs));
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
    <div className="page-container">
      <Header />

      {/* Top Banner */}
      <div className="animated-section" style={{
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        padding: '60px 20px',
        textAlign: 'center',
        color: 'white',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          📝 Mood Logs for {email}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Review and flag mood check-ins submitted by this student
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="left" sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/assigned-students')}
            sx={{
              borderColor: '#764ba2',
              color: '#764ba2',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#f3e5f5',
                borderColor: '#5e35b1'
              }
            }}
          >
            Back to Assigned Students
          </Button>
        </Box>

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
          <Typography variant="body1" color="text.secondary" align="center">
            No mood check-ins found for this student.
          </Typography>
        ) : (
          filteredLogs.map((log, idx) => (
            <Paper
              key={idx}
              elevation={4}
              className="animate-on-scroll"
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 4,
                background: log.flagged
                  ? 'linear-gradient(to right, #ffcdd2, #ef9a9a)'
                  : 'linear-gradient(to right, #e1f5fe, #ffffff)',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Mood: {log.mood}
                </Typography>
                <Chip
                  label={new Date(log.timestamp).toLocaleString()}
                  size="small"
                  color="info"
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="body2" color="text.secondary" mb={2}>
                {log.comment || 'No comment provided.'}
              </Typography>

              <Box display="flex" justifyContent="flex-end">
                {log.flagged ? (
                  <Chip
                    label="Flagged for Follow-up"
                    color="error"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#c62828',
                      color: '#fff',
                      px: 1.5
                    }}
                  />
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleFlag(idx)}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#e53935',
                      '&:hover': { backgroundColor: '#c62828' }
                    }}
                  >
                    Flag for Follow-up
                  </Button>
                )}
              </Box>
            </Paper>
          ))
        )}
      </Container>
    </div>
  );
};

export default ViewStudentMoodLogsPage;
