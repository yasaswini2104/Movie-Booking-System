import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box, Chip, Button, CircularProgress, Divider} from '@mui/material';
import { AccessTime, CalendarToday, Star, LocalMovies } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const CinemaShows = () => {
  const { cinemaId } = useParams();
  const navigate = useNavigate();
  const [cinema, setCinema] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCinemaAndShows();
  }, [cinemaId]);

  const fetchCinemaAndShows = async () => {
    try {
      const [cinemaRes, showsRes] = await Promise.all([
        axios.get(`/api/cinemas/${cinemaId}`),
        axios.get(`/api/shows/cinema/${cinemaId}`)
      ]);
      
      setCinema(cinemaRes.data.data);
      setShows(showsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load cinema details');
    } finally {
      setLoading(false);
    }
  };

  const groupShowsByMovie = () => {
    const grouped = {};
    shows.forEach(show => {
      const movieId = show.Movie.id;
      if (!grouped[movieId]) {
        grouped[movieId] = {
          movie: show.Movie,
          shows: []
        };
      }
      grouped[movieId].shows.push(show);
    });
    return Object.values(grouped);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const movieGroups = groupShowsByMovie();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {cinema?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {cinema?.location} • {cinema?.address}
        </Typography>
      </Box>

      {movieGroups.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LocalMovies sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No shows available at this cinema
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {movieGroups.map(({ movie, shows: movieShows }) => (
            <Grid item xs={12} key={movie.id}>
              <Card elevation={0}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: { xs: '100%', md: 200 },
                      height: { xs: 250, md: 300 },
                      objectFit: 'cover'
                    }}
                    image={movie.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={movie.title}
                  />
                  
                  <Box sx={{ flex: 1 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                          {movie.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip 
                            icon={<Star sx={{ fontSize: 18 }} />}
                            label={movie.rating} 
                            size="small" 
                            sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}
                          />
                          <Chip label={movie.genre} size="small" variant="outlined" />
                          <Chip label={movie.language} size="small" variant="outlined" />
                          <Chip label={`${movie.duration} min`} size="small" variant="outlined" />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                        Select Showtime
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {movieShows.map(show => (
                          <Box key={show.id}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              {formatDate(show.showDate)}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="medium"
                              onClick={() => navigate(`/show/${show.id}/seats`)}
                              sx={{ 
                                minWidth: 100,
                                fontWeight: 600,
                              }}
                            >
                              {formatTime(show.showTime)}
                            </Button>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              ₹{show.price}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CinemaShows;