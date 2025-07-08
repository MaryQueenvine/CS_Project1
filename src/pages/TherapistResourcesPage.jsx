// src/pages/TherapistResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button,
  Paper, List, ListItem, ListItemText, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import './Landingpage.css';

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
        setResources(response.data);
        setError(null);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch resources';
        setError(errorMessage);
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
      const response = await axios.post('/api/resources/', { title, link }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources([response.data, ...resources]);
      setTitle('');
      setLink('');
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add resource';
      setError(errorMessage);
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
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete resource';
      setError(errorMessage);
    }
  };

  return (
    <div className="page-container">
      <Header />

      <div className="animated-section" style={{ background: 'linear-gradient(to right, #6a1b9a, #283593)' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          📁 Therapist Resources
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Upload and manage support resources visible to students.
        </Typography>
      </div>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/dashboard-therapist')}
          sx={{
            mb: 3,
            borderColor: '#7e57c2',
            color: '#7e57c2',
            '&:hover': {
              backgroundColor: '#f3e5f5',
              borderColor: '#5e35b1'
            }
          }}
        >
          Back to Dashboard
        </Button>

        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to right, #ede7f6, #d1c4e9)',
            mb: 5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            ➕ Add New Resource
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          )}

          <TextField
            label="Resource Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
          />

          <TextField
            label="Resource Link"
            fullWidth
            variant="outlined"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            sx={{ mb: 3, backgroundColor: 'white', borderRadius: 1 }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(to right, #7b1fa2, #512da8)',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(to right, #5e35b1, #311b92)'
              }
            }}
            onClick={handleAdd}
          >
            Add Resource
          </Button>
        </Paper>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          📚 Uploaded Resources
        </Typography>

        {isLoading ? (
          <Typography>Loading resources...</Typography>
        ) : resources.length === 0 ? (
          <Typography color="text.secondary">No resources uploaded yet.</Typography>
        ) : (
          <List>
            {resources.map((res, idx) => (
              <React.Fragment key={res.id || idx}>
                <ListItem
                  sx={{
                    background: '#f3e5f5',
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#512da8' }}>
                        {res.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <a href={res.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3949ab' }}>
                          {res.link}
                        </a>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Uploaded on {res.created_at ? new Date(res.created_at).toLocaleString() : 'N/A'}
                        </Typography>
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
              </React.Fragment>
            ))}
          </List>
        )}
      </Container>
    </div>
  );
};

export default TherapistResourcesPage;
