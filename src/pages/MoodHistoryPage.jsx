// src/pages/MoodHistoryPage.jsx
import React from 'react';
import { Container, Box, Typography, Button, Paper, Card, CardContent } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MoodHistory from '../components/student/MoodHistory';
import Header from '../pages/Header';
import '../pages/Landingpage.css'; // for animations and layout styles

const MoodHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />

      {/* Motivational Banner */}
      <div className="animated-section" style={{
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
        borderRadius: '0 0 12px 12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      }}>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold' }}>
          Your Mood Journey
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          "Tracking your moods helps you understand yourself better."
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back Button */}
        <Box mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/mood-checkin')}
          >
            Back to Mood Check-In
          </Button>
        </Box>

        {/* Mood History Card Section */}
        <Card className="fade-in" sx={{ p: 3, borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Review Your Past Check-Ins
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This section helps you track patterns in your emotional state over time.
            </Typography>

            <Box mt={3}>
              <MoodHistory />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default MoodHistoryPage;
