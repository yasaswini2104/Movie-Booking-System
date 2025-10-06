# Movie Booking System - Backend

A comprehensive backend API for a movie booking system with real-time seat blocking, Google OAuth, and admin panel features.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT + Passport (Google OAuth)
- **Real-time**: Socket.IO
- **Password Hashing**: bcryptjs

## Features

### Core Features
- User authentication (Email/Password + Google OAuth)
- Cinema, Screen, Movie, Show management
- Seat booking system with maximum 6 seats per booking
- Booking history and management
- Transaction tracking

### Advanced Features
- **Real-time Seat Blocking**: Temporarily blocks seats for 5 minutes when selected
- **Admin Panel**: Full CRUD operations for cinemas, screens, and movies
- **Admin Show Management**: View seat layouts with booking details
- **Booking Cancellation**: Users can cancel bookings (refund seats)
- **Role-based Access Control**: Admin and User roles

## Database Schema

### Users
- id, name, email, password, googleId, role, profilePicture

### Cinemas
- id, name, location, address, city, facilities

### Screens
- id, name, cinemaId, totalRows, totalColumns, screenType

### Movies
- id, title, description, duration, genre, language, rating, releaseDate, posterUrl, trailerUrl, cast, director

### Shows
- id, movieId, cinemaId, screenId, showDate, showTime, price, availableSeats

### Bookings
- id, userId, showId, bookingNumber, seats, totalAmount, status, paymentStatus, bookingDate

### SeatBlocks
- id, ShowId, seatRow, seatColumn, socketId, expiresAt

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=movie_booking
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session
SESSION_SECRET=your_session_secret

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 3. Create MySQL Database

```sql
CREATE DATABASE movie_booking;
```

### 4. Seed Sample Data

```bash
node seeders/seedData.js
```

This will create:
- Admin user: `admin@moviebooking.com` / `admin123`
- Regular user: `john@example.com` / `password123`
- 3 Cinemas with screens
- 3 Movies with multiple shows

### 5. Run the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Cinemas
- `GET /api/cinemas` - Get all cinemas
- `GET /api/cinemas/:id` - Get cinema by ID
- `POST /api/cinemas` - Create cinema (Admin only)
- `PUT /api/cinemas/:id` - Update cinema (Admin only)
- `DELETE /api/cinemas/:id` - Delete cinema (Admin only)

### Screens
- `GET /api/screens` - Get all screens
- `GET /api/screens/:id` - Get screen by ID
- `POST /api/screens` - Create screen (Admin only)
- `PUT /api/screens/:id` - Update screen (Admin only)
- `DELETE /api/screens/:id` - Delete screen (Admin only)

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Shows
- `GET /api/shows/cinema/:cinemaId` - Get shows by cinema
- `GET /api/shows/:id` - Get show details with booked seats
- `GET /api/shows/:id/seats-bookings` - Get seat map with user details (Admin only)
- `POST /api/shows` - Create show (Admin only)
- `PUT /api/shows/:id` - Update show (Admin only)
- `DELETE /api/shows/:id` - Delete show (Admin only)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get user's bookings (Protected)
- `GET /api/bookings/:id` - Get booking details (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)

## Socket.IO Events

### Client to Server
- `join-show` - Join a show room
- `block-seat` - Block a seat temporarily
- `unblock-seat` - Unblock a specific seat
- `unblock-all-seats` - Unblock all user's seats
- `disconnect` - Auto cleanup on disconnect

### Server to Client
- `current-blocks` - Initial blocked seats state
- `seat-blocked` - Seat blocked by someone
- `seat-unblocked` - Seat unblocked
- `seat-block-failed` - Seat blocking failed

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## Key Implementation Details

### Real-time Seat Blocking
- Uses Socket.IO for bidirectional communication
- Seats are temporarily blocked for 5 minutes
- Automatic cleanup on disconnect or expiration
- Prevents double bookings effectively

### Transaction Management
- Uses Sequelize transactions for booking creation
- Atomic operations ensure data consistency
- Rollback on any error during booking

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- SQL injection protection via Sequelize

### Admin Features
- Complete CRUD operations for cinema management
- View seat layout with booking information
- Hover to see which user booked specific seats

## Notes

- All seat layouts are 10x10 (100 seats) by default
- Maximum 6 seats per booking
- Bookings cannot be cancelled for past shows
- Temporary seat blocks expire after 5 minutes
- Admin role required for management operations

## Development Tips

1. Use Postman or Thunder Client to test APIs
2. Monitor Socket.IO events in browser console
3. Check database for data consistency
4. Use `npm run dev` for auto-reload during development
