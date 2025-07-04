// src/components/ChatBubble.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const ChatBubble = ({ from, text, time }) => {
  const isTherapist = from === 'therapist';
  return (
    <Box
      alignSelf={isTherapist ? 'flex-end' : 'flex-start'}
      sx={{
        mb: 1,
        p: 1.5,
        borderRadius: 2,
        bgcolor: isTherapist ? '#e8f5e9' : '#e3f2fd',
        maxWidth: '80%'
      }}
    >
      <Typography variant="body2">
        <strong>{from}:</strong> {text}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {new Date(time).toLocaleTimeString()}
      </Typography>
    </Box>
  );
};

export default ChatBubble;
