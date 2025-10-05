import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const addSeat = (seat) => {
    if (selectedSeats.length >= 6) {
      toast.warning('Maximum 6 seats can be selected');
      return false;
    }
    
    const exists = selectedSeats.find(
      s => s.row === seat.row && s.column === seat.column
    );
    
    if (!exists) {
      setSelectedSeats([...selectedSeats, seat]);
      return true;
    }
    return false;
  };

  const removeSeat = (seat) => {
    setSelectedSeats(
      selectedSeats.filter(s => !(s.row === seat.row && s.column === seat.column))
    );
  };

  const clearSeats = () => {
    setSelectedSeats([]);
  };

  const isSeatSelected = (row, column) => {
    return selectedSeats.some(s => s.row === row && s.column === column);
  };

  const createBooking = async (showId) => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return { success: false };
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/bookings', {
        showId: parseInt(showId),
        seats: selectedSeats
      });
      
      toast.success(`Booking confirmed! Booking Number: ${response.data.data.bookingNumber}`);
      clearSeats();
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Booking Error:', error.response || error);
      const message = error.response?.data?.message || 'Booking failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // **FIX: Wrapped fetchBookings in useCallback to give it a stable function reference.**
  // This prevents components that depend on it from re-rendering unnecessarily.
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Don't show an error toast if it's just an initial failed fetch before auth is ready.
      // The component will retry once authenticated.
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created only once.

  // **FIX: Wrapped cancelBooking in useCallback for consistency and stability.**
  const cancelBooking = useCallback(async (bookingId) => {
    setLoading(true);
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      await fetchBookings(); // We can safely call fetchBookings here
      return { success: true };
    } catch (error) {
      console.error('Cancel Error:', error);
      const message = error.response?.data?.message || 'Cancellation failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [fetchBookings]); // It depends on the stable fetchBookings function.

  const value = {
    selectedSeats,
    bookings,
    loading,
    addSeat,
    removeSeat,
    clearSeats,
    isSeatSelected,
    createBooking,
    fetchBookings,
    cancelBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
