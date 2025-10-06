import { sequelize } from '../config/database.js';
import { User, Cinema, Screen, Movie, Show } from '../models/index.js';
import 'dotenv/config';

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@moviebooking.com',
      password: 'admin123',
      role: 'admin'
    });

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });
    
    console.log('Users created');

    const cinema1 = await Cinema.create({
      name: 'PVR Cinemas',
      location: 'Central Mall',
      address: '123 Main Street, Central Mall',
      city: 'Mumbai',
      facilities: ['Parking', 'Food Court', 'Wheelchair Access']
    });

    const cinema2 = await Cinema.create({
      name: 'INOX Megaplex',
      location: 'Phoenix Market City',
      address: '456 Phoenix Mall Road',
      city: 'Mumbai',
      facilities: ['Parking', 'Premium Seats', 'Dolby Atmos']
    });

    const cinema3 = await Cinema.create({
      name: 'Cinepolis',
      location: 'Viviana Mall',
      address: '789 Viviana Complex',
      city: 'Thane',
      facilities: ['IMAX', 'Recliner Seats', 'Food Court']
    });

    console.log('Cinemas created');

    const screen1 = await Screen.create({
      name: 'Screen 1',
      cinemaId: cinema1.id,
      totalRows: 10,
      totalColumns: 10,
      screenType: 'Standard'
    });

    const screen2 = await Screen.create({
      name: 'Screen 2',
      cinemaId: cinema1.id,
      totalRows: 10,
      totalColumns: 10,
      screenType: 'Premium'
    });

    const screen3 = await Screen.create({
      name: 'Screen 1',
      cinemaId: cinema2.id,
      totalRows: 10,
      totalColumns: 10,
      screenType: 'IMAX'
    });

    const screen4 = await Screen.create({
      name: 'Screen 1',
      cinemaId: cinema3.id,
      totalRows: 10,
      totalColumns: 10,
      screenType: 'Standard'
    });

    console.log('Screens created');

    const movie1 = await Movie.create({
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology',
      duration: 148,
      genre: 'Sci-Fi',
      language: 'English',
      rating: 8.8,
      releaseDate: '2010-07-16',
      posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
      director: 'Christopher Nolan'
    });

    const movie2 = await Movie.create({
      title: 'The Dark Knight',
      description: 'Batman raises the stakes in his war on crime',
      duration: 152,
      genre: 'Action',
      language: 'English',
      rating: 9.0,
      releaseDate: '2008-07-18',
      posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      director: 'Christopher Nolan'
    });

    const movie3 = await Movie.create({
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space',
      duration: 169,
      genre: 'Sci-Fi',
      language: 'English',
      rating: 8.6,
      releaseDate: '2014-11-07',
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      director: 'Christopher Nolan'
    });

    console.log('Movies created');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await Show.create({
      movieId: movie1.id,
      cinemaId: cinema1.id,
      screenId: screen1.id,
      showDate: today.toISOString().split('T')[0],
      showTime: '10:00:00',
      price: 250,
      availableSeats: 100
    });

    await Show.create({
      movieId: movie1.id,
      cinemaId: cinema1.id,
      screenId: screen1.id,
      showDate: today.toISOString().split('T')[0],
      showTime: '14:30:00',
      price: 300,
      availableSeats: 100
    });

    await Show.create({
      movieId: movie2.id,
      cinemaId: cinema1.id,
      screenId: screen2.id,
      showDate: today.toISOString().split('T')[0],
      showTime: '18:00:00',
      price: 350,
      availableSeats: 100
    });

    await Show.create({
      movieId: movie2.id,
      cinemaId: cinema2.id,
      screenId: screen3.id,
      showDate: today.toISOString().split('T')[0],
      showTime: '21:00:00',
      price: 450,
      availableSeats: 100
    });

    await Show.create({
      movieId: movie3.id,
      cinemaId: cinema2.id,
      screenId: screen3.id,
      showDate: tomorrow.toISOString().split('T')[0],
      showTime: '11:00:00',
      price: 400,
      availableSeats: 100
    });

    await Show.create({
      movieId: movie3.id,
      cinemaId: cinema3.id,
      screenId: screen4.id,
      showDate: tomorrow.toISOString().split('T')[0],
      showTime: '15:30:00',
      price: 280,
      availableSeats: 100
    });

    console.log('Shows created');
    console.log('\n=== Sample Data ===');
    console.log('Admin credentials: admin@moviebooking.com / admin123');
    console.log('User credentials: john@example.com / password123');
    console.log('\nDatabase seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
