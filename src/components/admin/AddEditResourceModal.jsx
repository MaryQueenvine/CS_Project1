// src/components/admin/AddEditResourceModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';

const AddEditResourceModal = ({ open, onClose, onSave, editData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setDescription(editData.description);
      setLink(editData.link || '');
    } else {
      setTitle('');
      setDescription('');
      setLink('');
    }
  }, [editData]);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    onSave({
      id: editData?.id || Date.now(),
      title: title.trim(),
      description: description.trim(),
      link: link.trim()
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editData ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          multiline
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditResourceModal;
