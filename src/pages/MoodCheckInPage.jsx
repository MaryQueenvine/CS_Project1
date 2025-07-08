// src/pages/MoodCheckInPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { MOODS, getMoodByValue, getMoodCategory } from '../services/moods';
import Header from '../pages/Header'; // ✅ Include global header
import '../pages/Landingpage.css'; // ✅ Reuse landing page styles

const MoodCheckInPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [todaysMoods, setTodaysMoods] = useState([]);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    fetchTodaysMoods();
    fetchStreakCount();
  }, []);

  const fetchTodaysMoods = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/mood-checkin/today/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setTodaysMoods(data.moods || []);
      }
    } catch (error) {
      console.error("Error fetching today's moods:", error);
    }
  };

  const fetchStreakCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/mood-checkin/streak/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setStreakCount(data.streak || 0);
      }
    } catch (error) {
      console.error('Error fetching streak count:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      setSnackbar({
        open: true,
        message: 'Please select a mood first',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);

    const payload = {
      mood: selectedMood,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8000/api/mood-checkin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Mood submitted successfully! 🎉',
          severity: 'success'
        });
        setSelectedMood(null);
        setNote('');
        await fetchTodaysMoods();
        await fetchStreakCount();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit mood');
      }
    } catch (error) {
      console.error('Error submitting mood:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error submitting mood. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const selectedMoodData = selectedMood ? getMoodByValue(selectedMood) : null;

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        {/* Header Section */}
        <Box mb={4} textAlign="center">
          <Typography variant="h4" fontWeight="bold">
            How are you feeling today?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your emotional wellbeing with daily mood check-ins
          </Typography>
        </Box>

        {/* Streak Display */}
        <Card sx={{ mb: 3, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
          <CardContent>
            <Typography variant="h6" align="center" color="white">
              🔥 Current Streak: {streakCount} {streakCount === 1 ? 'day' : 'days'}
            </Typography>
          </CardContent>
        </Card>

        {/* Today's Mood History */}
        {todaysMoods.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Mood Journey
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {todaysMoods.map((mood, i) => {
                  const moodData = getMoodByValue(mood.mood);
                  return (
                    <Chip
                      key={i}
                      label={`${moodData?.icon} ${moodData?.label}`}
                      sx={{
                        backgroundColor: moodData?.color || 'gray',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Mood Grid */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Select Your Current Mood
            </Typography>
            <Grid container spacing={2} mt={1}>
              {MOODS.map((mood) => (
                <Grid item xs={6} sm={4} md={3} key={mood.value}>
                  <Paper
                    elevation={selectedMood === mood.value ? 6 : 1}
                    onClick={() => setSelectedMood(mood.value)}
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: selectedMood === mood.value ? `3px solid ${mood.color}` : 'none',
                      borderRadius: 2,
                      backgroundColor: selectedMood === mood.value ? `${mood.color}20` : 'white',
                      transition: '0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Typography variant="h2">{mood.icon}</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: selectedMood === mood.value ? 'bold' : 'normal',
                        color: selectedMood === mood.value ? mood.color : 'inherit'
                      }}
                    >
                      {mood.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Selected Mood Result */}
        {selectedMoodData && (
          <Card sx={{ mb: 3, backgroundColor: `${selectedMoodData.color}10` }}>
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h5" mr={2}>{selectedMoodData.icon}</Typography>
                <Typography variant="h6">
                  You're feeling {selectedMoodData.label.toLowerCase()}
                </Typography>
                <Chip
                  label={getMoodCategory(selectedMoodData.value)}
                  size="small"
                  sx={{ ml: 2, backgroundColor: selectedMoodData.color, color: 'white' }}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Optional Note */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              label="Add a note (optional)"
              placeholder="What's on your mind today?"
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              Adding a note helps you reflect deeper and track emotional patterns.
            </Typography>
          </CardContent>
        </Card>

        {/* Submit */}
        <Box textAlign="center" mb={2}>
          <Button
            variant="contained"
            size="large"
            disabled={!selectedMood || loading}
            onClick={handleSubmit}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              backgroundColor: selectedMoodData?.color || '#1976d2',
              '&:hover': {
                backgroundColor: selectedMoodData?.color || '#1565c0',
                opacity: 0.9
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Submitting...
              </>
            ) : (
              'Submit Mood Check-In'
            )}
          </Button>
        </Box>

        {loading && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress />
          </Box>
        )}

        {/* Snackbar Feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default MoodCheckInPage;
