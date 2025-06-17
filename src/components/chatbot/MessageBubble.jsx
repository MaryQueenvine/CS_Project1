// src/components/chatbot/MessageBubble.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const MessageBubble = ({ text, sender }) => {
  const isUser = sender === 'user';

  return (
    <Box
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      mb={1}
    >
      <Box
        p={1.5}
        borderRadius={2}
        maxWidth="70%"
        bgcolor={isUser ? '#1976d2' : '#f1f1f1'}
        color={isUser ? 'white' : 'black'}
      >
        <Typography variant="body2">{text}</Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
