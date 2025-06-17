// src/pages/TriageChatbotPage.jsx
import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ChatbotTriage from '../components/chatbot/ChatbotTriage';

const TriageChatbotPage = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate('/dashboard-student');

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={handleBack}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Triage Chatbot
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Begin your mental health check-in using our guided chatbot assistant.
        </Typography>
      </Box>

      {/* Replace placeholder with real chatbot */}
      <ChatbotTriage />
    </Container>
  );
};

export default TriageChatbotPage;
