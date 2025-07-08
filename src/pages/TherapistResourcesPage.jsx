import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button,
  Paper, List, ListItem, ListItemText, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';
const TherapistResourcesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchResources = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }
    const response = await axios.get('/api/resources/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Resources data:', response.data);
    setResources(response.data);
    setError(null);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch resources';
    setError(errorMessage);
    console.error('Error details:', error.response || error);
  } finally {
    setIsLoading(false);
  }
};
  fetchResources();
}, []);

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const handleAdd = async () => {
  if (!title.trim() || !link.trim()) {
    setError('Please provide both a title and a valid link.');
    return;
  }
  if (!isValidUrl(link)) {
    setError('Please enter a valid URL (e.g., https://example.com).');
    return;
  }
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }
    const response = await axios.post('/api/resources/', {
      title,
      link,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setResources([response.data, ...resources]);
    setTitle('');
    setLink('');
    setError(null);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to add resource';
    setError(errorMessage);
    console.error('Error details:', error.response || error);
  }
};

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }
    await axios.delete(`/api/resources/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setResources(resources.filter((res) => res.id !== id));
    setError(null);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete resource';
    setError(errorMessage);
    console.error('Error details:', error.response || error);
  }
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
        {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
        )}
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
      {isLoading ? (
          <Typography>Loading resources...</Typography>
      ) : resources.length === 0 ? (
          <Typography>No resources uploaded yet.</Typography>
      ) : (
          <List>
            {resources.map((res, idx) => (
                <React.Fragment key={res.id || idx}>
                  <ListItem>
                    <ListItemText
                        primary={res.title}
                        secondary={
                      <>
                        <a href={res.link} target="_blank" rel="noopener noreferrer">
                          {res.link}
                        </a>
                        <br />
                        Uploaded on {res.created_at ? new Date(res.created_at).toLocaleString() : 'Date not available'}
                      </>
                    }
                    />
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(res.id)}
                        sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
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
