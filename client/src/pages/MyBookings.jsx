import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Chip, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { Movie, CalendarToday, AccessTime, EventSeat, Cancel, Receipt} from '@mui/icons-material';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { bookings, loading: bookingsLoading, fetchBookings, cancelBooking } = useBooking();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [cancelDialog, setCancelDialog] = useState({ open: false, bookingId: null });

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, fetchBookings]);

  const handleCancelClick = (bookingId) => {
    setCancelDialog({ open: true, bookingId });
  };

  const handleCancelConfirm = async () => {
    // **FIX: Called cancelBooking without assigning its return value to the unused 'result' variable.**
    await cancelBooking(cancelDialog.bookingId);
    setCancelDialog({ open: false, bookingId: null });
  };

  const isPastShow = (showDate, showTime) => {
    const showDateTime = new Date(`${showDate}T${showTime}`);
    return showDateTime < new Date();
  };

  if (authLoading || bookingsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Receipt sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No bookings yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Book your first movie to see it here
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking.id}>
              <Card elevation={0}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mr: 2 }}>
                          {booking.Show.Movie.title}
                        </Typography>
                        <Chip
                          label={booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                          color={booking.status === 'confirmed' ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Booking #{booking.bookingNumber}
                      </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      ₹{booking.totalAmount}
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Date
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {new Date(booking.Show.showDate).toDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Time
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {booking.Show.showTime.slice(0, 5)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Movie sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Cinema
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {booking.Show.Cinema.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventSeat sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Screen
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {booking.Show.Screen.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Seats
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {booking.seats.map((seat, idx) => (
                        <Chip
                          key={idx}
                          label={`${String.fromCharCode(65 + seat.row)}${seat.column + 1}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {booking.status === 'confirmed' && !isPastShow(booking.Show.showDate, booking.Show.showTime) && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => handleCancelClick(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, bookingId: null })}
      >
        <DialogTitle>Cancel Booking?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, bookingId: null })}>
            No, Keep It
          </Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookings;

