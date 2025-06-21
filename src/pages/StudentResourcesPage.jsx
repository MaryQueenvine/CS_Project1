import React from 'react';
import {
  Container, Box, Typography, Button, Paper, Link, Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const sampleResources = [
  {
    title: "Managing Exam Anxiety",
    type: "article",
    description: "Simple tips for dealing with academic stress.",
    link: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/self-care-for-anxiety/"
  },
  {
    title: "Grounding Techniques PDF",
    type: "pdf",
    description: "Printable worksheet for emotional regulation.",
    link: "https://www.therapistaid.com/worksheets/grounding-techniques.pdf"
  },
  {
    title: "Coping with Depression (YouTube)",
    type: "video",
    description: "Therapist explains strategies for low mood.",
    link: "https://www.youtube.com/watch?v=5k3FVbz1rLE"
  }
];

const StudentResourcesPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/dashboard-student')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Therapist-Curated Resources
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explore helpful content provided by licensed therapists to support your mental wellness.
      </Typography>

      <Grid container spacing={3}>
        {sampleResources.map((res, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>{res.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {res.description}
              </Typography>
              <Link href={res.link} target="_blank" rel="noopener" underline="hover">
                View {res.type === 'pdf' ? 'PDF' : res.type === 'video' ? 'Video' : 'Article'}
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentResourcesPage;
