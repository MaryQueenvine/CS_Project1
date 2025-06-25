// src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Menu, MenuItem, Divider, Tooltip
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../services/authService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const isActive = (path) => location.pathname === path;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const goToProfile = () => {
    handleMenuClose();
    if (currentUser?.role === 'Student') navigate('/student-profile');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Student MindCare
        </Typography>

        {!currentUser ? (
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
        ) : (
          <Box>
            <Tooltip title="Account Menu">
              <IconButton color="inherit" onClick={handleMenuClick}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={goToProfile}>👤 Profile</MenuItem>
              <Divider />

              <MenuItem onClick={() => { navigate('/assigned-therapist'); handleMenuClose(); }}>
                🧑‍⚕️ View Assigned Therapist
              </MenuItem>
              <MenuItem onClick={() => { navigate('/confirmed-sessions'); handleMenuClose(); }}>
                📅 Confirmed Sessions
              </MenuItem>
              <MenuItem onClick={() => { navigate('/notifications'); handleMenuClose(); }}>
                🔔 Notifications
              </MenuItem>
              <MenuItem onClick={() => { navigate('/chat-therapist'); handleMenuClose(); }}>
                💬 Message My Therapist
              </MenuItem>
              <Divider />

              <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
