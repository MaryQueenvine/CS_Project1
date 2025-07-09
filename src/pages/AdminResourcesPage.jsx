// src/pages/AdminResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Button, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ResourceCard from '../components/admin/ResourceCard';
import AddEditResourceModal from '../components/admin/AddEditResourceModal';
import Header from '../pages/Header';
import '../pages/Landingpage.css';

const AdminResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editResource, setEditResource] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('resources')) || [];
    setResources(stored);
  }, []);

  const saveResources = (updated) => {
    localStorage.setItem('resources', JSON.stringify(updated));
    setResources(updated);
  };

  const handleAdd = () => {
    setEditResource(null);
    setOpenModal(true);
  };

  const handleSave = (resource) => {
    let updated;
    if (editResource) {
      updated = resources.map((r) => (r.id === resource.id ? resource : r));
    } else {
      updated = [...resources, { ...resource, id: Date.now() }];
    }
    saveResources(updated);
    setOpenModal(false);
  };

  const handleEdit = (resource) => {
    setEditResource(resource);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    const updated = resources.filter(r => r.id !== id);
    saveResources(updated);
  };

  return (
    <div className="page-container">
      <Header />

      {/* Hero Banner */}
      <div
        className="animated-section"
        style={{ background: 'linear-gradient(to right, #7b1fa2, #512da8)' }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          📚 Manage Curated Resources
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Upload and manage resources available to students
        </Typography>
      </div>

      <Container sx={{ py: 5 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="h5" sx={{ color: '#4527a0', fontWeight: 'bold' }}>
            Uploaded Resources
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(to right, #7b1fa2, #512da8)',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(to right, #5e35b1, #311b92)'
              }
            }}
          >
            Add Resource
          </Button>
        </Box>

        {resources.length === 0 ? (
          <Typography color="text.secondary">
            No resources uploaded yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {resources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource.id}>
                <ResourceCard
                  resource={resource}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <AddEditResourceModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        editData={editResource}
      />
    </div>
  );
};

export default AdminResourcesPage;
