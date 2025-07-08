import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, TextField,
  Select, MenuItem, InputLabel, FormControl, Button, Divider
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
    const myStudents = assignments.filter(entry => entry.therapistEmail === therapist?.email);
    setAssignedStudents(myStudents);
  }, [therapist?.email]);

  useEffect(() => {
    if (selectedStudent) {
      const interval = setInterval(loadMessages, 5000);
      loadMessages();
      return () => clearInterval(interval);
    }
  }, [selectedStudent]);

  const loadMessages = () => {
    const threads = JSON.parse(localStorage.getItem('messages')) || [];
    const thread = threads.find(t => t.threadId === threadId);
    setMessages(thread?.messages || []);
  };

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

      <FormControl fullWidth sx={{ my: 2 }}>
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

          <Divider sx={{ my: 2 }} />

          <TextField
            fullWidth
            placeholder="Type your message..."
            multiline
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Box mt={2}>
            <Button variant="contained" fullWidth onClick={handleSend}>
              Send
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default TherapistChatPage;
