import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Button, Chip, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const urgencyColor = {
  High: 'error',
  Medium: 'warning',
  Low: 'success'
};

const SessionRequestListPage = () => {
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const allRequests = JSON.parse(localStorage.getItem('sessionRequests')) || [];
    const filtered = allRequests.filter(req => req.studentId === currentUser?.email);
    setMyRequests(filtered);
  }, []);

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
        My Session Requests
      </Typography>

      {myRequests.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You haven’t submitted any session requests yet.
        </Typography>
      ) : (
        myRequests.map((req, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">{req.topic}</Typography>
              <Chip label={req.urgency} color={urgencyColor[req.urgency]} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Preferred Time: {new Date(req.preferredTime).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Submitted on: {new Date(req.submittedAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default SessionRequestListPage;
