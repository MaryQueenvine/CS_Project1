// src/pages/TherapistChatPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Paper, TextField,
  Button, Divider, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TherapistChatPage = () => {
  const navigate = useNavigate();
  const therapist = JSON.parse(localStorage.getItem('user'));
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const studentAssignments = JSON.parse(localStorage.getItem('studentAssignments')) || [];
    const assigned = studentAssignments.filter(entry => entry.therapistEmail === therapist?.email);
    setAssignedStudents(assigned);
  }, [therapist?.email]);

  useEffect(() => {
    if (!selectedStudent) return;

    const threadId = `${selectedStudent}|${therapist.email}`;
    const allThreads = JSON.parse(localStorage.getItem('messages')) || [];
    const thread = allThreads.find(t => t.threadId === threadId);

    setMessages(thread?.messages || []);
  }, [selectedStudent, therapist.email]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      from: 'therapist',
      text: input,
      time: new Date().toISOString()
    };

    const threadId = `${selectedStudent}|${therapist.email}`;
    const allThreads = JSON.parse(localStorage.getItem('messages')) || [];
    let thread = allThreads.find(t => t.threadId === threadId);

    if (thread) {
      thread.messages.push(newMsg);
    } else {
      thread = { threadId, messages: [newMsg] };
      allThreads.push(thread);
    }

    localStorage.setItem('messages', JSON.stringify(allThreads));
    setMessages([...thread.messages]);
    setInput('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-therapist')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h5" gutterBottom>
        Therapist-Student Messaging
      </Typography>

      {/* Student Selector */}
      <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
        <InputLabel>Select Student</InputLabel>
        <Select
          value={selectedStudent}
          label="Select Student"
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          {assignedStudents.map((entry, idx) => (
            <MenuItem key={idx} value={entry.studentEmail}>
              {entry.studentEmail}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedStudent && (
        <>
          {/* Messages */}
          <Paper sx={{ p: 2, mb: 2, minHeight: 200 }}>
            {messages.length === 0 ? (
              <Typography color="text.secondary">No messages yet.</Typography>
            ) : (
              messages.map((msg, idx) => (
                <Box
                  key={idx}
                  alignSelf={msg.from === 'therapist' ? 'flex-end' : 'flex-start'}
                  sx={{
                    mb: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.from === 'therapist' ? '#e8f5e9' : '#e3f2fd',
                    maxWidth: '80%'
                  }}
                >
                  <Typography variant="body2">
                    <strong>{msg.from}:</strong> {msg.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(msg.time).toLocaleTimeString()}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>

          <Divider sx={{ mb: 2 }} />

          {/* Input */}
          <TextField
            fullWidth
            placeholder="Type your message..."
            multiline
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Box mt={2}>
            <Button variant="contained" onClick={handleSend} fullWidth>
              Send
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default TherapistChatPage;
