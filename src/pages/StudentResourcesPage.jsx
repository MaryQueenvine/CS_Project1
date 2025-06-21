import React, { useState } from 'react';
import {
  Container, Box, Typography, Button, Paper, Link, Grid,
  ToggleButton, ToggleButtonGroup, Dialog, DialogTitle,
  DialogContent, DialogActions
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
  },
  {
    title: "Healthy Sleep Habits",
    type: "article",
    description: "Explore how sleep affects your mental health.",
    link: "https://www.sleepfoundation.org/sleep-hygiene"
  },
  {
    title: "Mindfulness for Students",
    type: "pdf",
    description: "A guide to practicing mindfulness during exams.",
    link: "https://www.therapistaid.com/worksheets/mindfulness-exercises.pdf"
  },
  {
    title: "You Are Not Alone (Video)",
    type: "video",
    description: "Powerful message for students feeling isolated.",
    link: "https://www.youtube.com/watch?v=VTTIhv6e_HU"
  }
];

const getBorderColor = (type) => {
  switch (type) {
    case 'article': return '#1976d2'; // blue
    case 'pdf': return '#d32f2f';     // red
    case 'video': return '#388e3c';   // green
    default: return '#888';
  }
};

const StudentResourcesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const handleFilterChange = (_, newFilter) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const filteredResources = filter === 'all'
    ? sampleResources
    : sampleResources.filter(res => res.type === filter);

  const handleOpenModal = (resource) => {
    setSelectedResource(resource);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedResource(null);
  };

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
        Therapist-Curated Resources
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Explore helpful content provided by licensed therapists to support your mental wellness.
      </Typography>

      {/* Filter Section */}
      <Box textAlign="center" sx={{ mb: 4 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          color="primary"
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="article">Articles</ToggleButton>
          <ToggleButton value="pdf">PDFs</ToggleButton>
          <ToggleButton value="video">Videos</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Resource Cards */}
      <Grid container spacing={3}>
        {filteredResources.map((res, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper
              sx={{
                p: 2,
                height: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `6px solid ${getBorderColor(res.type)}`,
                transition: 'transform 0.2s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              elevation={2}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom noWrap>{res.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {res.description}
                </Typography>
              </Box>

              <Box mt="auto">
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleOpenModal(res)}
                  sx={{ color: 'primary.main', textTransform: 'none' }}
                >
                  Read More
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Read More Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedResource?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedResource?.description}
          </Typography>
          <Link
            href={selectedResource?.link}
            target="_blank"
            rel="noopener"
            underline="hover"
            sx={{ color: 'primary.main' }}
          >
            Open {selectedResource?.type === 'pdf'
              ? 'PDF'
              : selectedResource?.type === 'video'
              ? 'Video'
              : 'Article'}
          </Link>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentResourcesPage;
