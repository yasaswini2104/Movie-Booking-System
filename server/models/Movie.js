import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes'
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  releaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  posterUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trailerUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cast: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  director: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Movie;
