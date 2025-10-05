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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const ScreenManagement = () => {
  const [screens, setScreens] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cinemaId: '',
    totalRows: 10,
    totalColumns: 10,
    screenType: 'Standard',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [screensRes, cinemasRes] = await Promise.all([
        axios.get('/api/screens'),
        axios.get('/api/cinemas')
      ]);
      setScreens(screensRes.data.data);
      setCinemas(cinemasRes.data.data);
    } catch (error) {
        console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (screen = null) => {
    if (screen) {
      setEditingScreen(screen);
      setFormData({
        name: screen.name,
        cinemaId: screen.cinemaId,
        totalRows: screen.totalRows,
        totalColumns: screen.totalColumns,
        screenType: screen.screenType,
      });
    } else {
      setEditingScreen(null);
      setFormData({
        name: '',
        cinemaId: '',
        totalRows: 10,
        totalColumns: 10,
        screenType: 'Standard',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingScreen(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingScreen) {
        await axios.put(`/api/screens/${editingScreen.id}`, formData);
        toast.success('Screen updated successfully');
      } else {
        await axios.post('/api/screens', formData);
        toast.success('Screen created successfully');
      }

      handleCloseDialog();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this screen?')) return;

    try {
      await axios.delete(`/api/screens/${id}`);
      toast.success('Screen deleted successfully');
      fetchData();
    } catch (error) {
        console.error('Error deleting screen:', error);
      toast.error('Failed to delete screen');
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
          Add Screen
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Cinema</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Dimensions</TableCell>
              <TableCell>Total Seats</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {screens.map((screen) => (
              <TableRow key={screen.id}>
                <TableCell>{screen.name}</TableCell>
                <TableCell>{screen.Cinema?.name}</TableCell>
                <TableCell>{screen.screenType}</TableCell>
                <TableCell>{screen.totalRows} × {screen.totalColumns}</TableCell>
                <TableCell>{screen.totalRows * screen.totalColumns}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(screen)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(screen.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingScreen ? 'Edit Screen' : 'Add Screen'}</DialogTitle>
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
            select
            label="Cinema"
            value={formData.cinemaId}
            onChange={(e) => setFormData({ ...formData, cinemaId: e.target.value })}
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
            label="Screen Type"
            value={formData.screenType}
            onChange={(e) => setFormData({ ...formData, screenType: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="Premium">Premium</MenuItem>
            <MenuItem value="IMAX">IMAX</MenuItem>
            <MenuItem value="3D">3D</MenuItem>
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Total Rows"
            value={formData.totalRows}
            onChange={(e) => setFormData({ ...formData, totalRows: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Total Columns"
            value={formData.totalColumns}
            onChange={(e) => setFormData({ ...formData, totalColumns: parseInt(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingScreen ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScreenManagement;