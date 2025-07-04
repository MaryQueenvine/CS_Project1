import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Paper, TextField,
  Button, Divider, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';

const TherapistChatPage = () => {
  const navigate = useNavigate();
  const therapist = JSON.parse(localStorage.getItem('user'));
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const threadId = `${selectedStudent}|${therapist?.email}`;

  useEffect(() => {
    const assignments = JSON.parse(localStorage.getItem('studentAssignments')) || [];
    console.log('🧠 Loaded assignments from localStorage:', assignments);

    const myStudents = assignments.filter(entry => entry.therapistEmail === therapist?.email);
    console.log('✅ Matched assigned students for therapist:', myStudents);

    setAssignedStudents(myStudents);
  }, [therapist?.email]);

  const loadMessages = () => {
    const threads = JSON.parse(localStorage.getItem('messages')) || [];
    const thread = threads.find(t => t.threadId === threadId);
    setMessages(thread?.messages || []);
  };

  useEffect(() => {
    if (selectedStudent) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedStudent]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      from: 'therapist',
      text: input,
      time: new Date().toISOString()
    };

    const allThreads = JSON.parse(localStorage.getItem('messages')) || [];
    let thread = allThreads.find(t => t.threadId === threadId);

    if (thread) {
      thread.messages.push(newMsg);
    } else {
      thread = { threadId, messages: [newMsg] };
      allThreads.push(thread);
    }

    localStorage.setItem('messages', JSON.stringify(allThreads));
    setInput('');
    loadMessages();
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

      {/* 🔎 Debug Info */}
      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle2">🧑 Logged-in Therapist:</Typography>
        <Typography variant="body2">{therapist?.email || 'Not logged in'}</Typography>
        <Typography variant="subtitle2" sx={{ mt: 1 }}>🎓 Assigned Students:</Typography>
        {assignedStudents.length > 0 ? (
          assignedStudents.map((s, i) => (
            <Typography key={i} variant="body2">• {s.studentEmail}</Typography>
          ))
        ) : (
          <Typography color="error" variant="body2">❗ No students assigned.</Typography>
        )}
      </Box>

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
          <Paper sx={{ p: 2, mb: 2, minHeight: 200 }}>
            {messages.length === 0 ? (
              <Typography color="text.secondary">No messages yet.</Typography>
            ) : (
              messages.map((msg, idx) => (
                <ChatBubble key={idx} {...msg} />
              ))
            )}
          </Paper>

          <Divider sx={{ mb: 2 }} />

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
