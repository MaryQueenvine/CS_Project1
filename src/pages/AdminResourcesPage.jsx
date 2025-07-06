// src/pages/AdminResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Button, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ResourceCard from '../components/admin/ResourceCard';
import AddEditResourceModal from '../components/admin/AddEditResourceModal';

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
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Curated Resources</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Resource
        </Button>
      </Box>

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

      <AddEditResourceModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        editData={editResource}
      />
    </Container>
  );
};

export default AdminResourcesPage;

