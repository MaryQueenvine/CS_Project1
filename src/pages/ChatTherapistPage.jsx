// src/pages/ChatTherapistPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const ChatTherapistPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Load conversation from localStorage
    const saved = JSON.parse(localStorage.getItem('therapistChat')) || [];
    setMessages(saved);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      sender: 'student',
      text: input.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem('therapistChat', JSON.stringify(updated));
    setInput('');

    // Simulate reply
    setTimeout(() => {
      const reply = {
        sender: 'therapist',
        text: "Thanks for your message. I'll get back to you shortly.",
        timestamp: new Date().toISOString()
      };
      const next = [...updated, reply];
      setMessages(next);
      localStorage.setItem('therapistChat', JSON.stringify(next));
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="page-container">
      <Header />

      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Chat With Your Therapist
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Send and receive messages in a safe space
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={4}
          sx={{
            height: '60vh',
            overflowY: 'auto',
            p: 3,
            mb: 2,
            borderRadius: 3,
            backgroundColor: '#f3f5ff',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              alignSelf={msg.sender === 'student' ? 'flex-end' : 'flex-start'}
              sx={{
                bgcolor: msg.sender === 'student' ? '#d1e7ff' : '#e8dffb',
                px: 2,
                py: 1,
                borderRadius: 2,
                mb: 1,
                maxWidth: '70%',
                boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {msg.sender === 'student' ? 'You' : 'Therapist'}
              </Typography>
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          ))}
          <div ref={scrollRef}></div>
        </Paper>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={sendMessage}
            sx={{ px: 3 }}
          >
            Send
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default ChatTherapistPage;
