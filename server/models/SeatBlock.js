import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const SeatBlock = sequelize.define('SeatBlock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  seatRow: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seatColumn: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  socketId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['ShowId', 'seatRow', 'seatColumn']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

export default SeatBlock;