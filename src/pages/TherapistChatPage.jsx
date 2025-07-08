import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, TextField,
  Select, MenuItem, InputLabel, FormControl, Button, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import Header from './Header';
import './Landingpage.css';

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
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
      <div
        className="animated-section"
        style={{ background: 'linear-gradient(to right, #7b1fa2, #512da8)' }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          💬 Therapist Chat
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Send and receive messages from your assigned students
        </Typography>
      </div>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/dashboard-therapist')}
          sx={{
            mb: 3,
            borderColor: '#7e57c2',
            color: '#7e57c2',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f3e5f5',
              borderColor: '#5e35b1'
            }
          }}
        >
          Back to Dashboard
        </Button>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Student</InputLabel>
          <Select
            value={selectedStudent}
            label="Select Student"
            onChange={(e) => setSelectedStudent(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
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
            <Paper
              sx={{
                p: 2,
                mb: 2,
                minHeight: 240,
                backgroundColor: '#f8f9ff',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                maxHeight: 300,
                overflowY: 'auto'
              }}
            >
              {messages.length === 0 ? (
                <Typography color="text.secondary">No messages yet.</Typography>
              ) : (
                messages.map((msg, idx) => (
                  <Box
                    key={idx}
                    className={`chat-bubble ${msg.from === 'therapist' ? 'user' : 'bot'}`}
                    sx={{
                      maxWidth: '80%',
                      ml: msg.from === 'therapist' ? 'auto' : 0,
                      mr: msg.from !== 'therapist' ? 'auto' : 0
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                    <Typography variant="caption" sx={{ float: 'right', fontSize: '0.7rem', opacity: 0.6 }}>
                      {new Date(msg.time).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))
              )}
            </Paper>

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              multiline
              rows={2}
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />

            <Box mt={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSend}
                sx={{
                  background: 'linear-gradient(to right, #7b1fa2, #512da8)',
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(to right, #5e35b1, #311b92)'
                  }
                }}
              >
                Send
              </Button>
            </Box>
          </>
        )}
      </Container>
    </div>
  );
};

export default TherapistChatPage;
