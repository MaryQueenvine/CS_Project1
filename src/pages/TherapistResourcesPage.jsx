// src/pages/TherapistResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button,
  Paper, List, ListItem, ListItemText, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TherapistResourcesPage = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('therapistResources')) || [];
    setResources(saved);
  }, []);

  const handleAdd = () => {
    if (!title.trim() || !link.trim()) return;
    const newResource = { title, link, createdAt: new Date().toISOString() };
    const updated = [newResource, ...resources];
    setResources(updated);
    localStorage.setItem('therapistResources', JSON.stringify(updated));
    setTitle('');
    setLink('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-therapist')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Manage Student Resources
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Upload useful resources that will be visible to students.
      </Typography>

      <Paper sx={{ p: 3, mt: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Add New Resource</Typography>
        <TextField
          label="Resource Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Resource Link"
          fullWidth
          value={link}
          onChange={(e) => setLink(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleAdd}>Add Resource</Button>
      </Paper>

      <Typography variant="h6" gutterBottom>Uploaded Resources</Typography>
      {resources.length === 0 ? (
        <Typography>No resources uploaded yet.</Typography>
      ) : (
        <List>
          {resources.map((res, idx) => (
            <React.Fragment key={idx}>
              <ListItem>
                <ListItemText
                  primary={res.title}
                  secondary={
                    <>
                      <a href={res.link} target="_blank" rel="noopener noreferrer">
                        {res.link}
                      </a>
                      <br />
                      Uploaded on {new Date(res.createdAt).toLocaleString()}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default TherapistResourcesPage;
