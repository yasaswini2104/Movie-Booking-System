import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  seats: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of seat objects with row and column'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'refunded'),
    defaultValue: 'completed'
  },
  bookingDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

Booking.beforeValidate((booking) => {
  if (!booking.bookingNumber) {
    booking.bookingNumber = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
  }
});

export default Booking;
