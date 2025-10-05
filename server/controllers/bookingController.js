import { Booking, Show, Movie, Cinema, Screen, SeatBlock } from '../models/index.js';
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';

export const createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { showId, seats } = req.body;
    const userId = req.user.id;

    if (!seats || seats.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat'
      });
    }

    if (seats.length > 6) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Maximum 6 seats can be booked at once'
      });
    }

    const show = await Show.findByPk(showId, {
      include: [{ model: Screen }],
      transaction
    });

    if (!show) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    const existingBookings = await Booking.findAll({
      where: {
        showId,
        status: 'confirmed'
      },
      attributes: ['seats'],
      transaction
    });

    const bookedSeats = existingBookings.flatMap(booking =>
      booking.seats.map(seat => `${seat.row}-${seat.column}`)
    );

    const requestedSeats = seats.map(seat => `${seat.row}-${seat.column}`);
    const conflicts = requestedSeats.filter(seat => bookedSeats.includes(seat));

    if (conflicts.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Some seats are already booked',
        conflicts
      });
    }

    const totalAmount = show.price * seats.length;

    const booking = await Booking.create({
      userId,
      showId,
      seats,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'completed'
    }, { transaction });

    show.availableSeats = show.availableSeats - seats.length;
    await show.save({ transaction });

    await SeatBlock.destroy({
      where: {
        ShowId: showId,
        [Op.or]: seats.map(seat => ({
          seatRow: seat.row,
          seatColumn: seat.column
        }))
      },
      transaction
    });

    await transaction.commit();

    const bookingDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Show,
          include: [
            { model: Movie, attributes: ['title', 'posterUrl'] },
            { model: Cinema, attributes: ['name', 'location', 'address'] },
            { model: Screen, attributes: ['name'] }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: bookingDetails
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Show,
          include: [
            { model: Movie, attributes: ['title', 'posterUrl', 'duration'] },
            { model: Cinema, attributes: ['name', 'location', 'address'] },
            { model: Screen, attributes: ['name'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Show,
          include: [
            { model: Movie, attributes: ['title', 'posterUrl', 'duration'] },
            { model: Cinema, attributes: ['name', 'location', 'address'] },
            { model: Screen, attributes: ['name'] }
          ]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: Show }],
      transaction
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    const showDateTime = new Date(`${booking.Show.showDate} ${booking.Show.showTime}`);
    const currentDateTime = new Date();

    if (showDateTime <= currentDateTime) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking for past shows'
      });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save({ transaction });

    booking.Show.availableSeats = booking.Show.availableSeats + booking.seats.length;
    await booking.Show.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};
