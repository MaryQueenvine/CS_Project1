import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Paper, Divider, Chip, IconButton,
  Tooltip, Button, Slider, TextField, Collapse
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const MoodHistory = () => {
  const [history, setHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ moodValue: 5, comment: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('moodCheckIns') || '[]');
    setHistory(stored.reverse());
  }, []);

  const updateStorage = (newData) => {
    localStorage.setItem('moodCheckIns', JSON.stringify([...newData].reverse()));
  };

  const handleDelete = (indexToDelete) => {
    const updated = [...history];
    updated.splice(indexToDelete, 1);
    updateStorage(updated);
    setHistory(updated);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({
      moodValue: history[index].moodValue,
      comment: history[index].comment || ''
    });
  };

  const handleSave = () => {
    const updated = [...history];
    updated[editIndex].moodValue = editData.moodValue;
    updated[editIndex].comment = editData.comment;
    setHistory(updated);
    updateStorage(updated);
    setEditIndex(null);
  };

  const handleCancel = () => setEditIndex(null);

  if (history.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" mt={2}>
        No mood check-ins available yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Mood Check-In History
      </Typography>

      {history.map((entry, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 2, position: 'relative' }}>
          {editIndex === idx ? (
            <>
              <Typography variant="subtitle2">
                {new Date(entry.timestamp).toLocaleString()}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                Edit Mood Rating:
              </Typography>
              <Slider
                value={editData.moodValue}
                onChange={(e, val) => setEditData({ ...editData, moodValue: val })}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                sx={{ width: '70%', mt: 1 }}
              />

              <TextField
                label="Edit Comment"
                multiline
                fullWidth
                rows={2}
                value={editData.comment}
                onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                sx={{ mt: 2 }}
              />

              <Box mt={2} display="flex" gap={1}>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Tooltip title="Delete entry">
                <IconButton
                  size="small"
                  color="error"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => handleDelete(idx)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit entry">
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ position: 'absolute', top: 8, right: 45 }}
                  onClick={() => handleEdit(idx)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Typography variant="subtitle2" gutterBottom>
                {new Date(entry.timestamp).toLocaleString()}
              </Typography>

              <Typography variant="body2" gutterBottom>
                Mood Rating: <strong>{entry.moodValue} / 10</strong>
              </Typography>

              <Typography variant="body2">Emotions:</Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                {entry.tags.map((tag, i) => (
                  <Chip key={i} label={tag} color="primary" size="small" />
                ))}
              </Box>

              {entry.comment && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" fontStyle="italic">
                    "{entry.comment}"
                  </Typography>
                </>
              )}
            </>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default MoodHistory;
