import User from './User.js';
import Cinema from './Cinema.js';
import Screen from './Screen.js';
import Movie from './Movie.js';
import Show from './Show.js';
import Booking from './Booking.js';
import SeatBlock from './SeatBlock.js';

Cinema.hasMany(Screen, { foreignKey: 'cinemaId', onDelete: 'CASCADE' });
Screen.belongsTo(Cinema, { foreignKey: 'cinemaId' });

Screen.hasMany(Show, { foreignKey: 'screenId', onDelete: 'CASCADE' });
Show.belongsTo(Screen, { foreignKey: 'screenId' });

Movie.hasMany(Show, { foreignKey: 'movieId', onDelete: 'CASCADE' });
Show.belongsTo(Movie, { foreignKey: 'movieId' });

Cinema.hasMany(Show, { foreignKey: 'cinemaId', onDelete: 'CASCADE' });
Show.belongsTo(Cinema, { foreignKey: 'cinemaId' });

User.hasMany(Booking, { foreignKey: 'userId', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Show.hasMany(Booking, { foreignKey: 'showId', onDelete: 'CASCADE' });
Booking.belongsTo(Show, { foreignKey: 'showId' });

Show.hasMany(SeatBlock, { foreignKey: 'ShowId', onDelete: 'CASCADE' });
SeatBlock.belongsTo(Show, { foreignKey: 'ShowId' });

export {
  User,
  Cinema,
  Screen,
  Movie,
  Show,
  Booking,
  SeatBlock
};
