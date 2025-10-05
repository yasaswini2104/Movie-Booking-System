import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip,
  Typography,
  Grid,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShowManagement = () => {
  const [shows, setShows] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seatMap, setSeatMap] = useState({});
  const [formData, setFormData] = useState({
    movieId: '',
    cinemaId: '',
    screenId: '',
    showDate: '',
    showTime: '',
    price: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cinemasRes, moviesRes] = await Promise.all([
        axios.get('/api/cinemas'),
        axios.get('/api/movies')
      ]);
      setCinemas(cinemasRes.data.data);
      setMovies(moviesRes.data.data);
      
      if (cinemasRes.data.data.length > 0) {
        fetchShowsByCinema(cinemasRes.data.data[0].id);
      }
    } catch (error) {
        console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchShowsByCinema = async (cinemaId) => {
    try {
      const response = await axios.get(`/api/shows/cinema/${cinemaId}`);
      setShows(response.data.data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    }
  };

  const fetchScreensByCinema = async (cinemaId) => {
    try {
      const cinema = cinemas.find(c => c.id === parseInt(cinemaId));
      setScreens(cinema?.Screens || []);
    } catch (error) {
      console.error('Error fetching screens:', error);
    }
  };

  const handleCinemaChange = (cinemaId) => {
    setFormData({ ...formData, cinemaId, screenId: '' });
    fetchScreensByCinema(cinemaId);
  };

  const handleOpenDialog = (show = null) => {
    if (show) {
      setEditingShow(show);
      setFormData({
        movieId: show.movieId,
        cinemaId: show.cinemaId,
        screenId: show.screenId,
        showDate: show.showDate,
        showTime: show.showTime.slice(0, 5),
        price: show.price,
      });
      fetchScreensByCinema(show.cinemaId);
    } else {
      setEditingShow(null);
      setFormData({
        movieId: '',
        cinemaId: '',
        screenId: '',
        showDate: '',
        showTime: '',
        price: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingShow(null);
  };

  const handleViewShow = async (show) => {
    try {
      const response = await axios.get(`/api/shows/${show.id}/seats-bookings`);
      setSelectedShow(response.data.data.show);
      setSeatMap(response.data.data.seatMap);
      setViewDialogOpen(true);
    } catch (error) {
        console.error('Error fetching seat details:', error);
      toast.error('Failed to load seat details');
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingShow) {
        await axios.put(`/api/shows/${editingShow.id}`, data);
        toast.success('Show updated successfully');
      } else {
        await axios.post('/api/shows', data);
        toast.success('Show created successfully');
      }

      handleCloseDialog();
      if (formData.cinemaId) {
        fetchShowsByCinema(formData.cinemaId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;

    try {
      await axios.delete(`/api/shows/${id}`);
      toast.success('Show deleted successfully');
      fetchData();
    } catch (error) {
        console.error('Error deleting show:', error);
      toast.error('Failed to delete show');
    }
  };

  const getSeatStatus = (row, col) => {
    const key = `${row}-${col}`;
    return seatMap[key];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Show
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie</TableCell>
              <TableCell>Cinema</TableCell>
              <TableCell>Screen</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Available</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shows.map((show) => (
              <TableRow key={show.id}>
                <TableCell>{show.Movie?.title}</TableCell>
                <TableCell>{show.Cinema?.name}</TableCell>
                <TableCell>{show.Screen?.name}</TableCell>
                <TableCell>{new Date(show.showDate).toLocaleDateString()}</TableCell>
                <TableCell>{show.showTime.slice(0, 5)}</TableCell>
                <TableCell>₹{show.price}</TableCell>
                <TableCell>{show.availableSeats}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Seat Map">
                    <IconButton onClick={() => handleViewShow(show)} size="small" color="info">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => handleOpenDialog(show)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(show.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingShow ? 'Edit Show' : 'Add Show'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Movie"
            value={formData.movieId}
            onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id}>
                {movie.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Cinema"
            value={formData.cinemaId}
            onChange={(e) => handleCinemaChange(e.target.value)}
            sx={{ mb: 2 }}
          >
            {cinemas.map((cinema) => (
              <MenuItem key={cinema.id} value={cinema.id}>
                {cinema.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Screen"
            value={formData.screenId}
            onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
            sx={{ mb: 2 }}
            disabled={!formData.cinemaId}
          >
            {screens.map((screen) => (
              <MenuItem key={screen.id} value={screen.id}>
                {screen.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="date"
            label="Show Date"
            value={formData.showDate}
            onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="time"
            label="Show Time"
            value={formData.showTime}
            onChange={(e) => setFormData({ ...formData, showTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingShow ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Seat Layout - {selectedShow?.Movie?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Hover over booked seats to see booking details
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {selectedShow && Array.from({ length: selectedShow.Screen.totalRows }).map((_, rowIndex) => (
              <Box key={rowIndex} sx={{ display: 'flex', flexDirection: 'column', mx: 0.2 }}>
                {Array.from({ length: selectedShow.Screen.totalColumns }).map((_, colIndex) => {
                  const seatInfo = getSeatStatus(rowIndex, colIndex);
                  return (
                    <Tooltip
                      key={`${rowIndex}-${colIndex}`}
                      title={seatInfo ? `Booked by: ${seatInfo.user.name} (${seatInfo.user.email})` : 'Available'}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          m: 0.2,
                          borderRadius: 1,
                          bgcolor: seatInfo ? '#ef4444' : '#e5e7eb',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s',
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowManagement;