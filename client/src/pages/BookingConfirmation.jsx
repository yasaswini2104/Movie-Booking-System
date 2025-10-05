// client\src\pages\BookingConfirmation.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, Chip, Divider, CircularProgress} from '@mui/material';
import { CheckCircle, Movie, CalendarToday, AccessTime, EventSeat, Receipt} from '@mui/icons-material';
import axios from 'axios';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
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

  if (!booking) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Booking not found</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Booking Confirmed!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your tickets have been successfully booked
        </Typography>

        <Chip 
          icon={<Receipt />}
          label={`Booking #${booking.bookingNumber}`}
          sx={{ mb: 4, fontWeight: 600, fontSize: '0.9rem', py: 2.5, px: 1 }}
        />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Movie sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Movie
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {booking.Show.Movie.title}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Date & Time
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {new Date(booking.Show.showDate).toDateString()} • {booking.Show.showTime.slice(0, 5)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventSeat sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Seats
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {booking.seats.map((seat, idx) => (
                  <Chip
                    key={idx}
                    label={`${String.fromCharCode(65 + seat.row)}${seat.column + 1}`}
                    size="small"
                    color="success"
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ mr: 2, width: 24 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Cinema
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {booking.Show.Cinema.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {booking.Show.Screen.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Total Amount Paid
          </Typography>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            ₹{booking.totalAmount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button fullWidth variant="outlined" onClick={() => navigate('/bookings')}>
            View All Bookings
          </Button>
          <Button fullWidth variant="contained" onClick={() => navigate('/')}>
            Book More
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;