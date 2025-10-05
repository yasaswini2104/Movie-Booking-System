import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar,  Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Container } from '@mui/material';
import { Movie, AdminPanelSettings, History, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Movie sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
            }}
          >
            MovieBook
          </Typography>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button
                  startIcon={<AdminPanelSettings />}
                  onClick={() => navigate('/admin')}
                  sx={{ mr: 2, color: 'text.primary' }}
                >
                  Admin Panel
                </Button>
              )}

              <IconButton
                size="large"
                onClick={handleMenu}
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" fontWeight={600}>
                    {user?.name}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/bookings'); }}>
                  <History sx={{ mr: 1.5, fontSize: 20 }} />
                  My Bookings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box>
              <Button
                component={Link}
                to="/login"
                sx={{ mr: 1, color: 'text.primary' }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;