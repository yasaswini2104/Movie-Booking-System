import { Box, Typography, IconButton } from '@mui/material';
import { Instagram, Movie } from '@mui/icons-material';
import XIcon from '@mui/icons-material/X'; 

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderTop: '1px solid #e0e0e0',
        color: '#333',
        py: 1.5,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1201,
      }}
    >
      {/* Left: Brand */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Movie sx={{ fontSize: 22, color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight={600}>
          MovieBook
        </Typography>
      </Box>
\
      <Typography variant="caption" sx={{ color: '#666', textAlign: 'center' }}>
        © {new Date().getFullYear()} MovieBook • Made with ❤️ for movie lovers
      </Typography>

      <Box>
        <IconButton size="small" color="inherit" aria-label="Instagram">
          <Instagram sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton size="small" color="inherit" aria-label="X">
          <XIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
