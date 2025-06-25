import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Paper, TextField,
  Button, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const PreSessionChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const therapistEmail = 'therapist@example.com'; // Simulated assignment
  const threadId = `${currentUser.email}|${therapistEmail}`;

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('messages')) || [];
    const thread = all.find(t => t.threadId === threadId);
    if (thread) setMessages(thread.messages);
  }, [threadId]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      from: 'student',
      text: input,
      time: new Date().toISOString()
    };

    const all = JSON.parse(localStorage.getItem('messages')) || [];
    let thread = all.find(t => t.threadId === threadId);

    if (thread) {
      thread.messages.push(newMsg);
    } else {
      thread = { threadId, messages: [newMsg] };
      all.push(thread);
    }

    localStorage.setItem('messages', JSON.stringify(all));
    setMessages([...thread.messages]);
    setInput('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-student')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h5" gutterBottom>
        Message Your Therapist
      </Typography>

      <Paper sx={{ p: 2, mb: 2, minHeight: 200 }}>
        {messages.length === 0 ? (
          <Typography color="text.secondary">No messages yet.</Typography>
        ) : (
          messages.map((msg, idx) => (
            <Box
              key={idx}
              alignSelf={msg.from === 'student' ? 'flex-end' : 'flex-start'}
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.from === 'student' ? '#e3f2fd' : '#ede7f6',
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
    </Container>
  );
};

export default PreSessionChatPage;
