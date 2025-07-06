import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField,
  Button, Chip, Divider
} from '@mui/material';

const flaggedKeywords = [
  'self-harm', 'suicide', 'hopeless', 'kill myself',
  'panic', 'worthless', 'jump off', 'hang myself',
  'km', 'cut myself'
];

const ChatbotTriage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi, I’m here to check in on how you’re feeling today. You can tell me anything.' }
  ]);
  const [input, setInput] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const studentMsg = { sender: 'student', text: input };
    const flagged = flaggedKeywords.some(kw =>
      input.toLowerCase().includes(kw)
    );

    const botResponse = {
      sender: 'bot',
      text: flagged
        ? "Thank you for sharing. I'm detecting something serious—please hold on as I notify a therapist."
        : "I understand where you are coming from. I am here to listen."
    };

    setMessages(prev => [...prev, studentMsg, botResponse]);
    setIsFlagged(prev => prev || flagged);
    setInput('');
  };

  const handleSubmit = () => {
    setFinished(true);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const newSummary = {
      studentId: currentUser?.email || 'anonymous@student.com',
      messages: messages,
      flagged: isFlagged,
      submittedAt: new Date().toISOString()
    };

    const existingSummaries = JSON.parse(localStorage.getItem('triageSummaries')) || [];
    existingSummaries.push(newSummary);
    localStorage.setItem('triageSummaries', JSON.stringify(existingSummaries));

    alert('Triage complete. Your responses have been flagged for therapist review.');
  };

  return (
    <Paper elevation={3} sx={{ p: 2, maxHeight: 400, overflowY: 'auto', mb: 2 }}>
      <Typography variant="h6" gutterBottom>Triage Conversation</Typography>
      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            alignSelf={msg.sender === 'student' ? 'flex-end' : 'flex-start'}
            sx={{
              bgcolor: msg.sender === 'student' ? '#e0f7fa' : '#f3e5f5',
              px: 2, py: 1, borderRadius: 2, maxWidth: '80%'
            }}
          >
            <Typography variant="body2">{msg.text}</Typography>
          </Box>
        ))}
      </Box>

      {!finished && (
        <>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Type your response..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" onClick={handleSend}>Send</Button>
            <Button
              variant="outlined"
              color="success"
              onClick={handleSubmit}
              disabled={messages.length < 3}
            >
              Submit for Review
            </Button>
          </Box>
        </>
      )}

      {isFlagged && (
        <Box mt={2}>
          <Chip label="⚠️ Flagged for Review" color="error" />
        </Box>
      )}
    </Paper>
  );
};

export default ChatbotTriage;
