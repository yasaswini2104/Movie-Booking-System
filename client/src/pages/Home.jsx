import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardActionArea, Typography, Box, Chip, CircularProgress, Alert } from '@mui/material';
import { LocationOn, TheaterComedy } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const response = await axios.get('/api/cinemas');
      setCinemas(response.data?.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      setError('Unable to connect to the server. Please make sure the backend is running.');
      toast.error('Failed to load cinemas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Typography variant="body1" color="text.secondary" align="center">
          Please ensure:
          <br />
          1. Backend server is running on http://localhost:5000
          <br />
          2. Database is connected
          <br />
          3. Run: <code>npm run dev</code> in the backend folder
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Select Cinema
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose your preferred cinema to view available movies and showtimes
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(cinemas) && cinemas.map((cinema) => (
          <Grid item xs={12} sm={6} md={4} key={cinema?.id || Math.random()}>
            <Card 
              elevation={0}
              sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}
            >
              <CardActionArea 
                onClick={() => cinema?.id && navigate(`/cinema/${cinema.id}`)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <TheaterComedy sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" fontWeight={600} gutterBottom>
                        {cinema?.name || 'Unknown Cinema'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {cinema?.location || 'Location not available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {cinema?.address || 'Address not available'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    <Chip
                      label={`${cinema?.Screens?.length || 0} Screens`}
                      size="small"
                      sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 500 }}
                    />
                    {Array.isArray(cinema?.facilities) && cinema.facilities.slice(0, 2).map((facility, idx) => (
                      <Chip
                        key={idx}
                        label={facility}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {(!Array.isArray(cinemas) || cinemas.length === 0) && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No cinemas available at the moment
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please run the database seeder: <code>node seeders/seedData.js</code>
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;