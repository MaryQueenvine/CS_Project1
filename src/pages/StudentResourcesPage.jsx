// src/pages/StudentResourcesPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, Grid,
  Button, Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const StudentResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('therapistResources')) || [];
    setResources(saved);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-student')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Curated Support Resources
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Browse helpful materials shared by therapists to support your mental well-being.
      </Typography>

      {resources.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 3 }}>
          No resources have been shared yet. Please check again later.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {resources.map((res, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {res.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Shared on {new Date(res.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Resource
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default StudentResourcesPage;
