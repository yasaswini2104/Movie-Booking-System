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
  CircularProgress,
  Avatar,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: '',
    language: '',
    rating: '',
    releaseDate: '',
    posterUrl: '',
    trailerUrl: '',
    cast: '',
    director: '',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/api/movies');
      setMovies(response.data.data);
    } catch (error) {
        console.error('Error fetching movies:', error);
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title,
        description: movie.description || '',
        duration: movie.duration,
        genre: movie.genre,
        language: movie.language,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
        posterUrl: movie.posterUrl || '',
        trailerUrl: movie.trailerUrl || '',
        cast: movie.cast?.join(', ') || '',
        director: movie.director || '',
      });
    } else {
      setEditingMovie(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        genre: '',
        language: '',
        rating: '',
        releaseDate: '',
        posterUrl: '',
        trailerUrl: '',
        cast: '',
        director: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMovie(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        duration: parseInt(formData.duration),
        rating: parseFloat(formData.rating),
        cast: formData.cast.split(',').map(c => c.trim()).filter(c => c),
      };

      if (editingMovie) {
        await axios.put(`/api/movies/${editingMovie.id}`, data);
        toast.success('Movie updated successfully');
      } else {
        await axios.post('/api/movies', data);
        toast.success('Movie created successfully');
      }

      handleCloseDialog();
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await axios.delete(`/api/movies/${id}`);
      toast.success('Movie deleted successfully');
      fetchMovies();
    } catch (error) {
        console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie');
    }
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
          Add Movie
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Poster</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>
                  <Avatar
                    src={movie.posterUrl}
                    variant="rounded"
                    sx={{ width: 50, height: 70 }}
                  />
                </TableCell>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.genre}</TableCell>
                <TableCell>{movie.language}</TableCell>
                <TableCell>{movie.duration} min</TableCell>
                <TableCell>{movie.rating}</TableCell>
                <TableCell>{new Date(movie.releaseDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(movie)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(movie.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingMovie ? 'Edit Movie' : 'Add Movie'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Director"
              value={formData.director}
              onChange={(e) => setFormData({ ...formData, director: e.target.value })}
            />
            <TextField
              fullWidth
              label="Genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />
            <TextField
              fullWidth
              label="Language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Rating"
              inputProps={{ step: 0.1, min: 0, max: 10 }}
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              label="Release Date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Poster URL"
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
            />
          </Box>
          <TextField
            fullWidth
            label="Cast (comma separated)"
            value={formData.cast}
            onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Trailer URL"
            value={formData.trailerUrl}
            onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMovie ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieManagement;