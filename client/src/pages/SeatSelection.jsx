import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, Grid, Chip, CircularProgress, Card, CardContent } from '@mui/material';
import { EventSeat, CheckCircle, Cancel, Block} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useSocket } from '../context/SocketContext';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedSeats, addSeat, removeSeat, clearSeats, isSeatSelected, createBooking, loading: bookingLoading } = useBooking();
  const { joinShow, blockSeat, unblockSeat, unblockAllSeats, isSeatBlocked, isSeatBlockedByMe } = useSocket();
  const [show, setShow] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to book seats');
      navigate('/login');
      return;
    }

    fetchShowDetails();
    joinShow(parseInt(showId));

    return () => {
      unblockAllSeats(parseInt(showId));
      clearSeats();
    };
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      const response = await axios.get(`/api/shows/${showId}`);
      setShow(response.data.data);
      setBookedSeats(response.data.data.bookedSeats || []);
    } catch (error) {
      console.error('Error fetching show:', error);
      toast.error('Failed to load show details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const isSeatBooked = (row, column) => {
    return bookedSeats.some(seat => seat.row === row && seat.column === column);
  };

  const handleSeatClick = (row, column) => {
    if (isSeatBooked(row, column)) {
      toast.warning('This seat is already booked');
      return;
    }

    if (isSeatBlocked(row, column)) {
      toast.warning('This seat is being selected by another user');
      return;
    }

    if (isSeatSelected(row, column)) {
      removeSeat({ row, column });
      unblockSeat(parseInt(showId), row, column);
    } else {
      const added = addSeat({ row, column });
      if (added) {
        blockSeat(parseInt(showId), row, column);
      }
    }
  };

  const getSeatStatus = (row, column) => {
    if (isSeatBooked(row, column)) return 'booked';
    if (isSeatSelected(row, column)) return 'selected';
    if (isSeatBlockedByMe(row, column)) return 'selected';
    if (isSeatBlocked(row, column)) return 'blocked';
    return 'available';
  };

  const getSeatColor = (status) => {
    switch (status) {
      case 'booked': return '#ef4444';
      case 'selected': return '#10b981';
      case 'blocked': return '#f59e0b';
      default: return '#e5e7eb';
    }
  };

  const handleBooking = async () => {
    const result = await createBooking(parseInt(showId));
    if (result.success) {
      unblockAllSeats(parseInt(showId));
      navigate(`/booking-confirmation/${result.data.id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const rows = show?.Screen?.totalRows || 10;
  const columns = show?.Screen?.totalColumns || 10;
  const totalAmount = selectedSeats.length * (show?.price || 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {show?.Movie?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {show?.Cinema?.name} • {show?.Screen?.name} • {new Date(show?.showDate).toDateString()} • {show?.showTime?.slice(0, 5)}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  width: '80%', 
                  height: 8, 
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  mx: 'auto',
                  mb: 1,
                  background: 'linear-gradient(to bottom, #2563eb, #60a5fa)',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                SCREEN
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <Box key={rowIndex} sx={{ display: 'flex', flexDirection: 'column', mx: 0.3 }}>
                  {Array.from({ length: columns }).map((_, colIndex) => {
                    const status = getSeatStatus(rowIndex, colIndex);
                    return (
                      <Box
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSeatClick(rowIndex, colIndex)}
                        sx={{
                          width: 32,
                          height: 32,
                          m: 0.3,
                          borderRadius: 1.5,
                          bgcolor: getSeatColor(status),
                          cursor: status === 'booked' || status === 'blocked' ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: status !== 'booked' && status !== 'blocked' ? 'scale(1.1)' : 'none',
                          },
                        }}
                      >
                        {status === 'selected' && <CheckCircle sx={{ fontSize: 16, color: 'white' }} />}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#e5e7eb', borderRadius: 1 }} />
                <Typography variant="caption">Available</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#10b981', borderRadius: 1 }} />
                <Typography variant="caption">Selected</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#ef4444', borderRadius: 1 }} />
                <Typography variant="caption">Booked</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#f59e0b', borderRadius: 1 }} />
                <Typography variant="caption">Blocked</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Booking Summary
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Selected Seats ({selectedSeats.length}/6)
              </Typography>
              {selectedSeats.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {selectedSeats.map((seat, idx) => (
                    <Chip
                      key={idx}
                      label={`${String.fromCharCode(65 + seat.row)}${seat.column + 1}`}
                      size="small"
                      onDelete={() => {
                        removeSeat(seat);
                        unblockSeat(parseInt(showId), seat.row, seat.column);
                      }}
                      color="success"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  No seats selected
                </Typography>
              )}
            </Box>

            <Box sx={{ my: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Ticket Price</Typography>
                <Typography variant="body2">₹{show?.price}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Number of Seats</Typography>
                <Typography variant="body2">{selectedSeats.length}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                <Typography variant="h6" fontWeight={600}>Total</Typography>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  ₹{totalAmount}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || bookingLoading}
              sx={{ mt: 2 }}
            >
              {bookingLoading ? 'Processing...' : 'Pay Now'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeatSelection;