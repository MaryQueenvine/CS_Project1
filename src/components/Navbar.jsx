import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Student MindCare
        </Typography>

        <Box>
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{
              fontWeight: isActive('/login') ? 'bold' : 'normal',
              textDecoration: isActive('/login') ? 'underline' : 'none'
            }}
          >
            Login
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/register"
            sx={{
              fontWeight: isActive('/register') ? 'bold' : 'normal',
              textDecoration: isActive('/register') ? 'underline' : 'none'
            }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
