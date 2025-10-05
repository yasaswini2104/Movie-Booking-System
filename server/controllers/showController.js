import { Show, Movie, Cinema, Screen, Booking, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getShowsByCinema = async (req, res) => {
  try {
    const { cinemaId } = req.params;

    const shows = await Show.findAll({
      where: {
        cinemaId,
        showDate: {
          [Op.gte]: new Date().toISOString().split('T')[0]
        }
      },
      include: [
        {
          model: Movie,
          attributes: ['id', 'title', 'duration', 'genre', 'language', 'posterUrl', 'rating']
        },
        {
          model: Screen,
          attributes: ['id', 'name', 'screenType', 'totalRows', 'totalColumns']
        }
      ],
      order: [['showDate', 'ASC'], ['showTime', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shows',
      error: error.message
    });
  }
};

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findByPk(req.params.id, {
      include: [
        {
          model: Movie,
          attributes: ['id', 'title', 'duration', 'genre', 'language', 'posterUrl', 'rating']
        },
        {
          model: Screen,
          attributes: ['id', 'name', 'screenType', 'totalRows', 'totalColumns']
        },
        {
          model: Cinema,
          attributes: ['id', 'name', 'location', 'address']
        }
      ]
    });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    const bookedSeats = await Booking.findAll({
      where: {
        showId: req.params.id,
        status: 'confirmed'
      },
      attributes: ['seats']
    });

    const bookedSeatsList = bookedSeats.flatMap(booking => booking.seats);

    res.status(200).json({
      success: true,
      data: {
        ...show.toJSON(),
        bookedSeats: bookedSeatsList
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching show',
      error: error.message
    });
  }
};

export const createShow = async (req, res) => {
  try {
    const { movieId, cinemaId, screenId, showDate, showTime, price } = req.body;

    const screen = await Screen.findByPk(screenId);
    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    const totalSeats = screen.totalRows * screen.totalColumns;

    const show = await Show.create({
      movieId,
      cinemaId,
      screenId,
      showDate,
      showTime,
      price,
      availableSeats: totalSeats
    });

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      data: show
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating show',
      error: error.message
    });
  }
};

export const updateShow = async (req, res) => {
  try {
    const show = await Show.findByPk(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    await show.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      data: show
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating show',
      error: error.message
    });
  }
};

export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByPk(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    await show.destroy();

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting show',
      error: error.message
    });
  }
};

export const getShowSeatsWithBookings = async (req, res) => {
  try {
    const show = await Show.findByPk(req.params.id, {
      include: [
        {
          model: Screen,
          attributes: ['totalRows', 'totalColumns']
        }
      ]
    });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    const bookings = await Booking.findAll({
      where: {
        showId: req.params.id,
        status: 'confirmed'
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    const seatMap = {};
    bookings.forEach(booking => {
      booking.seats.forEach(seat => {
        const key = `${seat.row}-${seat.column}`;
        seatMap[key] = {
          user: booking.User,
          bookingNumber: booking.bookingNumber,
          bookingDate: booking.bookingDate
        };
      });
    });

    res.status(200).json({
      success: true,
      data: {
        show,
        seatMap
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching show seats',
      error: error.message
    });
  }
};
