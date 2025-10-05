import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Movie, GitHub, LinkedIn, Twitter, Email } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Movie sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={700}>
                MovieBook
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your one-stop destination for booking movie tickets online. Experience the magic of cinema with ease.
            </Typography>
            <Box>
              <IconButton size="small" sx={{ mr: 1 }} aria-label="GitHub">
                <GitHub />
              </IconButton>
              <IconButton size="small" sx={{ mr: 1 }} aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
              <IconButton size="small" sx={{ mr: 1 }} aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton size="small" aria-label="Email">
                <Email />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Home
              </Link>
              <Link href="/bookings" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                My Bookings
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                About Us
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Contact
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Help Center
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Terms & Conditions
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Privacy Policy
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Refund Policy
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Email: support@moviebook.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: +91 1234567890
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: Mumbai, India
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} MovieBook. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for movie lovers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;