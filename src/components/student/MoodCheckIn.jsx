import React, { useState } from 'react';
import {
  Typography, Box, Slider, TextField, Button,
  FormGroup, FormControlLabel, Checkbox, Alert, Paper
} from '@mui/material';

const moodTags = ['Happy', 'Sad', 'Anxious', 'Tired', 'Angry', 'Calm', 'Stressed', 'Excited', 'Bored', 'Confused'];

const reflectionPrompts = [
  "📘 What happened today that may have affected your mood?",
  "📘 Are there any thoughts or worries you've been carrying since yesterday?",
  "📘 What would help you feel even a little better right now?"
];

const MoodCheckIn = () => {
  const [moodValue, setMoodValue] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    const checkInData = {
      timestamp: new Date().toISOString(),
      moodValue,
      tags: selectedTags,
      comment
    };

    const existing = JSON.parse(localStorage.getItem('moodCheckIns') || '[]');
    localStorage.setItem('moodCheckIns', JSON.stringify([...existing, checkInData]));

    setSubmitted(true);
    setSelectedTags([]);
    setComment('');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Mood Check-In
      </Typography>

      <Box mb={3}>
        <Typography gutterBottom>How is your mood today on a scale of 1-10 (1 = low, 10 = high)</Typography>
        <Slider
          value={moodValue}
          onChange={(e, val) => setMoodValue(val)}
          step={1}
          marks
          min={1}
          max={10}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box mb={3}>
        <Typography gutterBottom>How are you feeling? (select all that apply)</Typography>
        <FormGroup row>
          {moodTags.map(tag => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
              }
              label={tag}
            />
          ))}
        </FormGroup>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle2" gutterBottom>Need help reflecting? Consider these:</Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {reflectionPrompts.map((q, i) => (
            <Typography key={i} variant="body2" sx={{ color: 'text.secondary' }}>
              {q}
            </Typography>
          ))}
        </Box>
      </Box>

      <TextField
        label="Optional comment"
        multiline
        rows={3}
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={submitted}
        fullWidth
      >
        Submit Check-In
      </Button>

      {submitted && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Mood check-in has been saved! You did a good job. Keep taking care of yourself.
        </Alert>
      )}
    </Paper>
  );
};

export default MoodCheckIn;
