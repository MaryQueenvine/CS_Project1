import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Chip, Divider, MenuItem, Select,
  InputLabel, FormControl
} from '@mui/material';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const TriageSummaryReviewPage = () => {
  const [triageSummaries, setTriageSummaries] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [filteredSummaries, setFilteredSummaries] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('all');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const summaries = JSON.parse(localStorage.getItem('triageSummaries')) || [];
    const allStudents = JSON.parse(localStorage.getItem('assignedStudents')) || [];

    const assigned = allStudents.filter(s => s.therapistEmail === currentUser?.email);
    const studentEmails = assigned.map(s => s.email);
    const summariesFromAssigned = summaries.filter(s => studentEmails.includes(s.studentId));

    setAssignedStudents(assigned);
    setTriageSummaries(summariesFromAssigned);
    setFilteredSummaries(summariesFromAssigned);
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedStudent(value);

    if (value === 'all') {
      setFilteredSummaries(triageSummaries);
    } else {
      setFilteredSummaries(triageSummaries.filter(s => s.studentId === value));
    }
  };

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #764ba2, #667eea)',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          Triage Summary Reviews
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Review submissions from your assigned students
        </Typography>
      </div>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 5 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Student</InputLabel>
          <Select
            value={selectedStudent}
            label="Select Student"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            {assignedStudents.map((student, idx) => (
              <MenuItem key={idx} value={student.email}>
                {student.name} ({student.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {filteredSummaries.length === 0 ? (
          <Typography color="text.secondary">
            No triage summaries submitted by assigned students.
          </Typography>
        ) : (
          filteredSummaries.map((summary, idx) => (
            <Paper
              key={idx}
              elevation={4}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                backgroundColor: summary.flagged ? '#fff3f3' : '#fafafa',
                boxShadow: summary.flagged
                  ? '0 0 10px rgba(255,0,0,0.2)'
                  : '0 4px 10px rgba(0,0,0,0.06)'
              }}
            >
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {summary.studentId} — {new Date(summary.submittedAt).toLocaleString()}
                </Typography>
                {summary.flagged && <Chip label="⚠️ Flagged" color="error" />}
              </Box>

              <Divider sx={{ my: 1 }} />

              {summary.messages.map((msg, i) => (
                <Box
                  key={i}
                  alignSelf={msg.sender === 'student' ? 'flex-end' : 'flex-start'}
                  sx={{
                    bgcolor: msg.sender === 'student' ? '#e3f2fd' : '#ede7f6',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    my: 1,
                    maxWidth: '100%'
                  }}
                >
                  <Typography variant="body2">
                    <strong>{msg.sender}</strong>: {msg.text}
                  </Typography>
                </Box>
              ))}
            </Paper>
          ))
        )}
      </Container>
    </div>
  );
};

export default TriageSummaryReviewPage;
