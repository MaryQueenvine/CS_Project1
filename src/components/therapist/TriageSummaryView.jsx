import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Chip, Box, Divider, Alert
} from '@mui/material';

const TriageSummaryView = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('triageSummary');
    if (stored) {
      setSummary(JSON.parse(stored));
    }
  }, []);

  if (!summary) {
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        No triage summary available yet.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Latest Triage Summary
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Flag status */}
      <Box mb={2}>
        {summary.flagged ? (
          <Alert severity="error">
            🚨 This session was flagged for therapist attention.
          </Alert>
        ) : (
          <Alert severity="success">
            ✅ No critical issues flagged in this session.
          </Alert>
        )}
      </Box>

      {/* Flagged keywords */}
      {summary.flaggedWords.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2">Flagged Keywords:</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {summary.flaggedWords.map((word, idx) => (
              <Chip key={idx} label={word} color="error" />
            ))}
          </Box>
        </Box>
      )}

      {/* Conversation log */}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        Conversation History:
      </Typography>
      <Box
        sx={{
          maxHeight: 300,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 1,
          backgroundColor: '#f5f5f5',
          borderRadius: 1
        }}
      >
        {summary.conversation.map((msg, idx) => (
          <Box
            key={idx}
            alignSelf={msg.sender === 'student' ? 'flex-end' : 'flex-start'}
            sx={{
              backgroundColor: msg.sender === 'student' ? '#e3f2fd' : '#fce4ec',
              px: 2, py: 1, borderRadius: 2, maxWidth: '70%'
            }}
          >
            <Typography variant="body2">
              <strong>{msg.sender === 'student' ? 'Student' : 'Bot'}:</strong> {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default TriageSummaryView;
