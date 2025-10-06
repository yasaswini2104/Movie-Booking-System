# Movie Booking System

A full-stack web application for booking movie tickets with real-time seat selection, built with modern web technologies. The system supports user authentication, cinema management, show scheduling, and secure booking transactions.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
## Tech Stack

### Backend
- **Runtime Environment**: Node.js 
- **Framework**: Express.js
- **Database**: MySQL 
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens), Passport.js (Google OAuth 2.0)
- **Real-time Communication**: Socket.IO
- **Security**: bcryptjs for password hashing
- **Environment Management**: dotenv

### Frontend
- **Library**: Reactjs
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI) 
- **State Management**: Context API
- **Routing**: React Router 
- **HTTP Client**: Axios
- **Real-time Client**: Socket.IO Client
- **Notifications**: React Toastify

## Features

### Core Functionality
- User registration and authentication with JWT
- Google OAuth 2.0 integration for single sign-on
- Browse available cinemas and their locations
- View movies and showtimes for selected cinemas
- Interactive seat selection with 10x10 grid layout
- Maximum 6 seats per booking restriction
- Booking confirmation with unique booking number
- View booking history and booking details
- Cancel confirmed bookings with automatic seat release

### Advanced Features
- **Real-time Seat Blocking**: Temporarily locks seats when selected by users for 5 minutes
- **Live Updates**: Real-time synchronization across all connected clients using WebSocket
- **Admin Panel**: Complete CRUD operations for cinemas, screens, movies, and shows
- **Admin Analytics**: View seat layouts with booking details, hover to see user information
- **Transaction Management**: Atomic database operations ensuring data consistency
- **Role-based Access Control**: Separate permissions for users and administrators

## System Architecture

The application follows a client-server architecture with the following components:

1. **Client Layer**: React-based SPA serving the user interface
2. **API Layer**: RESTful Express.js server handling HTTP requests
3. **WebSocket Layer**: Socket.IO server managing real-time communications
4. **Database Layer**: MySQL database with Sequelize ORM
5. **Authentication Layer**: JWT-based stateless authentication with OAuth support

## Database Schema

### Entity Relationship Overview

The database consists of seven main tables with the following relationships:

### Users Table
Stores user account information and authentication credentials.

```
Users
├── id (Primary Key)
├── name
├── email (Unique)
├── password (Hashed)
├── googleId (Unique, Nullable)
├── role (Enum: 'user', 'admin')
├── profilePicture
└── timestamps (createdAt, updatedAt)
```

### Cinemas Table
Manages cinema locations and facilities.

```
Cinemas
├── id (Primary Key)
├── name
├── location
├── address
├── city
├── facilities (JSON Array)
└── timestamps
```

### Screens Table
Defines screening rooms within cinemas.

```
Screens
├── id (Primary Key)
├── name
├── cinemaId (Foreign Key -> Cinemas)
├── totalRows (Default: 10)
├── totalColumns (Default: 10)
├── screenType
└── timestamps
```

### Movies Table
Contains movie information and metadata.

```
Movies
├── id (Primary Key)
├── title
├── description
├── duration (in minutes)
├── genre
├── language
├── rating
├── releaseDate
├── posterUrl
├── trailerUrl
├── cast (JSON Array)
├── director
└── timestamps
```

### Shows Table
Represents specific movie showtimes.

```
Shows
├── id (Primary Key)
├── movieId (Foreign Key -> Movies)
├── cinemaId (Foreign Key -> Cinemas)
├── screenId (Foreign Key -> Screens)
├── showDate
├── showTime
├── price (Decimal)
├── availableSeats
└── timestamps
```

### Bookings Table
Records user ticket bookings.

```
Bookings
├── id (Primary Key)
├── userId (Foreign Key -> Users)
├── showId (Foreign Key -> Shows)
├── bookingNumber (Unique)
├── seats (JSON Array of {row, column})
├── totalAmount (Decimal)
├── status (Enum: 'confirmed', 'cancelled')
├── paymentStatus (Enum: 'pending', 'completed', 'refunded')
├── bookingDate
└── timestamps
```

### SeatBlocks Table
Manages temporary seat reservations for real-time blocking.

```
SeatBlocks
├── id (Primary Key)
├── ShowId (Foreign Key -> Shows)
├── seatRow
├── seatColumn
├── socketId
├── expiresAt
└── timestamps
```

### Key Relationships

- **One-to-Many**: Cinema → Screens (One cinema has multiple screens)
- **One-to-Many**: Screen → Shows (One screen hosts multiple shows)
- **One-to-Many**: Movie → Shows (One movie has multiple shows)
- **One-to-Many**: Cinema → Shows (One cinema has multiple shows)
- **One-to-Many**: User → Bookings (One user can have multiple bookings)
- **One-to-Many**: Show → Bookings (One show can have multiple bookings)
- **One-to-Many**: Show → SeatBlocks (One show can have multiple blocked seats)

### Database Indexes

The following indexes are implemented for optimized query performance:

- **SeatBlocks**: Composite index on (ShowId, seatRow, seatColumn)
- **SeatBlocks**: Index on expiresAt for efficient cleanup
- **Users**: Unique index on email and googleId
- **Bookings**: Unique index on bookingNumber

## Installation and Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd movie-booking-system
```

### Step 2: Database Setup

Create a MySQL database for the application:

```bash
mysql -u root -p
```

Execute the following SQL command either in MySql Cli or MySql Workbench:

```sql
CREATE DATABASE mbs;
```

### Step 3: Backend Configuration

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create an environment configuration file:

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mbs
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 4: Seed Database with Sample Data

Run the seeder script to populate the database with initial data:

```bash
node seeders/seedData.js
```
or
```bash
node run seed
```

This will create:
- Admin user (email: admin@moviebooking.com, password: admin123)
- Regular user (email: john@example.com, password: password123)
- 3 sample cinemas with screens
- 3 sample movies
- Multiple shows for testing

### Step 5: Frontend Configuration

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
npm install
```

## Running the Application

### Starting the Backend Server

From the backend directory:

```bash
npm run dev
```

The server will start on http://localhost:5000

Expected console output:
```
MySQL Database connected successfully
Database synchronized
Server running on port 5000
Environment: development
```

### Starting the Frontend Development Server

From the frontend directory (in a separate terminal):

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Accessing the Application

1. Open your browser and navigate to http://localhost:5173
2. Register a new account or use the seeded credentials:
   - Admin: admin@moviebooking.com / admin123
   - User: john@example.com / password123

## API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          Register a new user
POST   /api/auth/login             Authenticate user
GET    /api/auth/profile           Get current user profile (Protected)
GET    /api/auth/google            Initiate Google OAuth flow
GET    /api/auth/google/callback   Google OAuth callback
```

### Cinema Endpoints

```
GET    /api/cinemas                Get all cinemas
GET    /api/cinemas/:id            Get cinema by ID
POST   /api/cinemas                Create cinema (Admin only)
PUT    /api/cinemas/:id            Update cinema (Admin only)
DELETE /api/cinemas/:id            Delete cinema (Admin only)
```

### Screen Endpoints

```
GET    /api/screens                Get all screens
GET    /api/screens/:id            Get screen by ID
POST   /api/screens                Create screen (Admin only)
PUT    /api/screens/:id            Update screen (Admin only)
DELETE /api/screens/:id            Delete screen (Admin only)
```

### Movie Endpoints

```
GET    /api/movies                 Get all movies
GET    /api/movies/:id             Get movie by ID
POST   /api/movies                 Create movie (Admin only)
PUT    /api/movies/:id             Update movie (Admin only)
DELETE /api/movies/:id             Delete movie (Admin only)
```

### Show Endpoints

```
GET    /api/shows/cinema/:id       Get shows by cinema
GET    /api/shows/:id              Get show details with booked seats
GET    /api/shows/:id/seats-bookings  Get seat map with user details (Admin only)
POST   /api/shows                  Create show (Admin only)
PUT    /api/shows/:id              Update show (Admin only)
DELETE /api/shows/:id              Delete show (Admin only)
```

### Booking Endpoints

```
POST   /api/bookings               Create new booking (Protected)
GET    /api/bookings               Get user bookings (Protected)
GET    /api/bookings/:id           Get booking details (Protected)
PUT    /api/bookings/:id/cancel    Cancel booking (Protected)
```

### WebSocket Events

**Client to Server:**
- `join-show`: Join a specific show room
- `block-seat`: Temporarily block a seat
- `unblock-seat`: Release a blocked seat
- `unblock-all-seats`: Release all user's blocked seats

**Server to Client:**
- `current-blocks`: Initial state of blocked seats
- `seat-blocked`: Notification when a seat is blocked
- `seat-unblocked`: Notification when a seat is released
- `seat-block-failed`: Notification when blocking fails

## Google OAuth Setup (Optional)

To enable Google OAuth authentication:

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Set application type to "Web application"
7. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
8. Add authorized JavaScript origin: `http://localhost:5173` (frontend running URL)
9. Copy the Client ID and Client Secret to your `.env` file
10. Restart the backend server

### Security Considerations
- All passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days (configurable)
- API endpoints are protected with authentication middleware
- Role-based access control for admin operations
- SQL injection prevention through Sequelize ORM
- CORS configured to allow only frontend origin

## Troubleshooting

### Database Connection Issues
If the backend fails to connect to MySQL:
1. Verify MySQL service is running
2. Check database credentials in `.env`
3. Ensure database exists and user has proper permissions
4. Verify DB_HOST and DB_PORT are correct

### WebSocket Connection Failures
If real-time features are not working:
1. Ensure backend server is running
2. Check browser console for connection errors
3. Verify FRONTEND_URL in backend `.env`
4. Clear browser cache and reload

### Booking Creation Errors
If bookings fail to create:
1. Check backend console for detailed error messages
2. Verify user is authenticated (JWT token is valid)
3. Ensure selected seats are available
4. Check seat count does not exceed 6
