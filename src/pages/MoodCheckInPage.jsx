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
  Divider,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { MOODS, getMoodByValue, getMoodCategory } from '../services/moods';

const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [todaysMoods, setTodaysMoods] = useState([]);
  const [streakCount, setStreakCount] = useState(0);

  // Fetch today's moods and streak on component mount
  useEffect(() => {
    fetchTodaysMoods();
    fetchStreakCount();
  }, []);

  const fetchTodaysMoods = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/mood-checkin/today/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTodaysMoods(data.moods || []);
      }
    } catch (error) {
      console.error('Error fetching today\'s moods:', error);
    }
  };

  const fetchStreakCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/mood-checkin/streak/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setSnackbar({
          open: true,
          message: 'Mood submitted successfully! 🎉',
          severity: 'success'
        });

        // Reset form
        setSelectedMood(null);
        setNote('');

        // Refresh today's moods and streak
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
    setSnackbar({ ...snackbar, open: false });
  };

  const selectedMoodData = selectedMood ? getMoodByValue(selectedMood) : null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          How are you feeling today?
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Track your emotional wellbeing with daily mood check-ins
        </Typography>
      </Box>

      {/* Streak Counter */}
      <Card sx={{ mb: 3, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" sx={{ color: 'white', mr: 2 }}>
              🔥 Current Streak: {streakCount} {streakCount === 1 ? 'day' : 'days'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Today's Moods Summary */}
      {todaysMoods.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today's Mood Journey
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {todaysMoods.map((mood, index) => {
                const moodData = getMoodByValue(mood.mood);
                return (
                  <Chip
                    key={index}
                    label={`${moodData?.icon} ${moodData?.label}`}
                    sx={{
                      backgroundColor: moodData?.color || '#grey',
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

      {/* Mood Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Your Current Mood
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {MOODS.map((mood) => (
              <Grid item xs={6} sm={4} md={3} key={mood.value}>
                <Paper
                  elevation={selectedMood === mood.value ? 6 : 2}
                  onClick={() => setSelectedMood(mood.value)}
                  sx={{
                    cursor: 'pointer',
                    padding: 2,
                    textAlign: 'center',
                    border: selectedMood === mood.value ? `3px solid ${mood.color}` : 'none',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    backgroundColor: selectedMood === mood.value ? `${mood.color}20` : 'white',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      elevation: 4,
                    }
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 1 }}>
                    {mood.icon}
                  </Typography>
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

      {/* Selected Mood Display */}
      {selectedMoodData && (
        <Card sx={{ mb: 3, backgroundColor: `${selectedMoodData.color}10` }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h5" sx={{ mr: 2 }}>
                {selectedMoodData.icon}
              </Typography>
              <Typography variant="h6">
                You're feeling {selectedMoodData.label.toLowerCase()}
              </Typography>
              <Chip
                label={getMoodCategory(selectedMoodData.value)}
                size="small"
                sx={{
                  ml: 2,
                  backgroundColor: selectedMoodData.color,
                  color: 'white'
                }}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Note Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Add a note about your mood (optional)"
            placeholder="What's on your mind? How are you feeling and why?"
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            Adding notes helps you track patterns and understand your emotional journey better.
          </Typography>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!selectedMood || loading}
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

      {/* Loading Progress */}
      {loading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MoodCheckIn;