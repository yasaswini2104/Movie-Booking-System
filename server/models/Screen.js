import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Screen = sequelize.define('Screen', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalRows: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    allowNull: false
  },
  totalColumns: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    allowNull: false
  },
  screenType: {
    type: DataTypes.STRING,
    defaultValue: 'Standard'
  }
}, {
  timestamps: true
});

export default Screen;
