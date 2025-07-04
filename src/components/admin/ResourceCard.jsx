// src/components/admin/ResourceCard.jsx
import React from 'react';
import {
  Card, CardContent, Typography, CardActions, Button, Box
} from '@mui/material';

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {resource.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resource.description}
        </Typography>
        {resource.link && (
          <Box mt={1}>
            <Typography variant="caption" color="primary">
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                Open Resource
              </a>
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(resource)}>Edit</Button>
        <Button size="small" color="error" onClick={() => onDelete(resource.id)}>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default ResourceCard;
