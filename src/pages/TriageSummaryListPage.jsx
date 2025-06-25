import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Button, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TriageSummaryListPage = () => {
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const all = JSON.parse(localStorage.getItem('triageSummaries')) || [];
    const filtered = all.filter(summary => summary.studentId === currentUser?.email);
    setSummaries(filtered);
  }, []);

  const openSummary = (summary) => {
    setSelected(summary);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelected(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-student')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        My Triage Summaries
      </Typography>

      {summaries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You haven't submitted any triage summaries yet.
        </Typography>
      ) : (
        summaries.map((summary, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">
                {new Date(summary.submittedAt).toLocaleString()}
              </Typography>
              {summary.flagged && <Chip label="Flagged" color="error" />}
            </Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Preview: {summary.messages[1]?.text.slice(0, 80)}...
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Button variant="text" onClick={() => openSummary(summary)}>
              View Full Conversation
            </Button>
          </Paper>
        ))
      )}

      {/* Modal */}
      <Dialog open={openModal} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>Full Triage Conversation</DialogTitle>
        <DialogContent dividers>
          {selected?.messages.map((msg, idx) => (
            <Box
              key={idx}
              alignSelf={msg.sender === 'student' ? 'flex-end' : 'flex-start'}
              sx={{
                bgcolor: msg.sender === 'student' ? '#e0f7fa' : '#f3e5f5',
                px: 2, py: 1, borderRadius: 2, mb: 1, maxWidth: '100%'
              }}
            >
              <Typography variant="body2"><strong>{msg.sender}:</strong> {msg.text}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TriageSummaryListPage;
