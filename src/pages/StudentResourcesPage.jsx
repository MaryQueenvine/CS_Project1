// src/pages/StudentResourcesPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, Grid,
  Button, Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import '../pages/Landingpage.css'; // Ensure this includes fade-in, responsive section styles

const StudentResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('therapistResources')) || [];
    setResources(saved);
  }, []);

  return (
    <div className="page-container">
      <Header />

      {/* Hero banner */}
      <div
        className="animated-section"
        style={{
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Curated Resources for You
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Find helpful articles, videos, and guides from trusted therapists.
        </Typography>
      </div>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Box mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/dashboard-student')}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* No resources case */}
        {resources.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 3 }}>
            No resources have been shared yet. Please check again later.
          </Typography>
        ) : (
          <Grid container spacing={4} className="fade-in">
            {resources.map((res, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {res.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Shared on {new Date(res.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none'
                      }}
                    >
                      Open Resource
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default StudentResourcesPage;
