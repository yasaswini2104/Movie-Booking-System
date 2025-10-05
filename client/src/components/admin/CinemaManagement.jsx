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
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const CinemaManagement = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    city: '',
    facilities: '',
  });

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const response = await axios.get('/api/cinemas');
      setCinemas(response.data.data);
    } catch (error) {
        console.error('Error fetching cinemas:', error);
      toast.error('Failed to fetch cinemas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (cinema = null) => {
    if (cinema) {
      setEditingCinema(cinema);
      setFormData({
        name: cinema.name,
        location: cinema.location,
        address: cinema.address,
        city: cinema.city,
        facilities: cinema.facilities?.join(', ') || '',
      });
    } else {
      setEditingCinema(null);
      setFormData({
        name: '',
        location: '',
        address: '',
        city: '',
        facilities: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCinema(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f),
      };

      if (editingCinema) {
        await axios.put(`/api/cinemas/${editingCinema.id}`, data);
        toast.success('Cinema updated successfully');
      } else {
        await axios.post('/api/cinemas', data);
        toast.success('Cinema created successfully');
      }

      handleCloseDialog();
      fetchCinemas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cinema?')) return;

    try {
      await axios.delete(`/api/cinemas/${id}`);
      toast.success('Cinema deleted successfully');
      fetchCinemas();
    } catch (error) {
        console.error('Error deleting cinema:', error);
      toast.error('Failed to delete cinema');
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
          Add Cinema
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Screens</TableCell>
              <TableCell>Facilities</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cinemas.map((cinema) => (
              <TableRow key={cinema.id}>
                <TableCell>{cinema.name}</TableCell>
                <TableCell>{cinema.location}</TableCell>
                <TableCell>{cinema.city}</TableCell>
                <TableCell>{cinema.Screens?.length || 0}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {cinema.facilities?.slice(0, 2).map((facility, idx) => (
                      <Chip key={idx} label={facility} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(cinema)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cinema.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCinema ? 'Edit Cinema' : 'Add Cinema'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Facilities (comma separated)"
            value={formData.facilities}
            onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
            placeholder="Parking, Food Court, 3D"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCinema ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CinemaManagement;