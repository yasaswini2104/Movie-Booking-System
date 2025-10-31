# Low Level Design Document
## Movie Booking System

**Version:** 1.0  
**Date:** October 2025  
**Author:** Development Team

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Database Design](#2-database-design)
3. [API Design](#3-api-design)
4. [Component Design](#4-component-design)
5. [Algorithm Design](#5-algorithm-design)
6. [State Management](#6-state-management)
7. [Error Handling](#7-error-handling)
8. [Real-time Communication](#8-real-time-communication)

---

## 1. Introduction

### 1.1 Purpose
This document provides detailed low-level design specifications for the Movie Booking System, including database schemas, API contracts, component implementations, algorithms, and design patterns used throughout the application.

### 1.2 Scope
This document covers:
- Detailed database schema with constraints
- Complete API endpoint specifications
- Component-level design and interactions
- Algorithm implementations
- State management patterns
- Error handling strategies
- Real-time communication protocols

---

## 2. Database Design

### 2.1 Entity-Relationship Diagram

```
┌─────────┐         ┌──────────┐         ┌─────────┐
│  Users  │────────>│ Bookings │<────────│  Shows  │
└─────────┘    1:N  └──────────┘   N:1   └─────────┘
                                              │ N:1
                                              ▼
                    ┌──────────┐         ┌─────────┐
                    │  Movies  │<────────│  Shows  │
                    └──────────┘   1:N   └─────────┘
                                              │ N:1
                                              ▼
┌─────────┐         ┌──────────┐         ┌─────────┐
│ Cinemas │────────>│ Screens  │<────────│  Shows  │
└─────────┘    1:N  └──────────┘   N:1   └─────────┘
                                              │ 1:N
                                              ▼
                                        ┌──────────────┐
                                        │  SeatBlocks  │
                                        └──────────────┘
```

### 2.2 Table Definitions

#### 2.2.1 Users Table

```sql
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    googleId VARCHAR(255) UNIQUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    profilePicture VARCHAR(500),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_googleId (googleId)
);
```

**Constraints:**
- Email must be unique and valid format
- Password nullable (for OAuth users)
- Default role is 'user'
- Timestamps automatically managed

**Relationships:**
- One-to-Many with Bookings

#### 2.2.2 Cinemas Table

```sql
CREATE TABLE Cinemas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    facilities JSON,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_city (city),
    INDEX idx_name (name)
);
```

**Constraints:**
- Name and location required
- Facilities stored as JSON array
- City indexed for location-based queries

**Relationships:**
- One-to-Many with Screens
- One-to-Many with Shows

#### 2.2.3 Screens Table

```sql
CREATE TABLE Screens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    cinemaId INT NOT NULL,
    totalRows INT NOT NULL DEFAULT 10,
    totalColumns INT NOT NULL DEFAULT 10,
    screenType VARCHAR(50) DEFAULT 'Standard',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cinemaId) REFERENCES Cinemas(id) ON DELETE CASCADE,
    INDEX idx_cinemaId (cinemaId)
);
```

**Constraints:**
- Screen name required
- Must belong to a cinema (foreign key)
- Default 10x10 seat layout
- Cascade delete with cinema

**Relationships:**
- Many-to-One with Cinema
- One-to-Many with Shows

#### 2.2.4 Movies Table

```sql
CREATE TABLE Movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    genre VARCHAR(100) NOT NULL,
    language VARCHAR(50) NOT NULL,
    rating FLOAT DEFAULT 0,
    releaseDate DATE NOT NULL,
    posterUrl VARCHAR(500),
    trailerUrl VARCHAR(500),
    cast JSON,
    director VARCHAR(255),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_title (title),
    INDEX idx_releaseDate (releaseDate),
    INDEX idx_genre (genre)
);
```

**Constraints:**
- Title, duration, genre, language required
- Duration stored as integer (minutes)
- Rating between 0-10
- Cast stored as JSON array

**Relationships:**
- One-to-Many with Shows

#### 2.2.5 Shows Table

```sql
CREATE TABLE Shows (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movieId INT NOT NULL,
    cinemaId INT NOT NULL,
    screenId INT NOT NULL,
    showDate DATE NOT NULL,
    showTime TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availableSeats INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (movieId) REFERENCES Movies(id) ON DELETE CASCADE,
    FOREIGN KEY (cinemaId) REFERENCES Cinemas(id) ON DELETE CASCADE,
    FOREIGN KEY (screenId) REFERENCES Screens(id) ON DELETE CASCADE,
    
    INDEX idx_showDate (showDate),
    INDEX idx_movieId (movieId),
    INDEX idx_cinemaId (cinemaId),
    INDEX idx_composite (cinemaId, showDate, showTime)
);
```

**Constraints:**
- All foreign keys required
- Show date and time required
- Price as decimal for precision
- Composite index for common queries

**Relationships:**
- Many-to-One with Movie
- Many-to-One with Cinema
- Many-to-One with Screen
- One-to-Many with Bookings
- One-to-Many with SeatBlocks

#### 2.2.6 Bookings Table

```sql
CREATE TABLE Bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    showId INT NOT NULL,
    bookingNumber VARCHAR(50) NOT NULL UNIQUE,
    seats JSON NOT NULL COMMENT 'Array of {row, column} objects',
    totalAmount DECIMAL(10, 2) NOT NULL,
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    paymentStatus ENUM('pending', 'completed', 'refunded') DEFAULT 'completed',
    bookingDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (showId) REFERENCES Shows(id) ON DELETE CASCADE,
    
    INDEX idx_userId (userId),
    INDEX idx_showId (showId),
    INDEX idx_bookingNumber (bookingNumber),
    INDEX idx_status (status)
);
```

**Constraints:**
- Booking number unique and auto-generated
- Seats stored as JSON array
- Status defaults to 'confirmed'
- Payment status defaults to 'completed'

**Relationships:**
- Many-to-One with User
- Many-to-One with Show

#### 2.2.7 SeatBlocks Table

```sql
CREATE TABLE SeatBlocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ShowId INT NOT NULL,
    seatRow INT NOT NULL,
    seatColumn INT NOT NULL,
    socketId VARCHAR(255) NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ShowId) REFERENCES Shows(id) ON DELETE CASCADE,
    
    INDEX idx_show_seat (ShowId, seatRow, seatColumn),
    INDEX idx_expiresAt (expiresAt),
    INDEX idx_socketId (socketId)
);
```

**Constraints:**
- Show, row, column required
- Socket ID identifies the blocking client
- Expires at timestamp for automatic cleanup
- Composite index for seat lookup

**Relationships:**
- Many-to-One with Show

---

## 3. API Design

### 3.1 Authentication APIs

#### 3.1.1 Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
    "name": "string (required, min: 2, max: 255)",
    "email": "string (required, email format)",
    "password": "string (required, min: 6)"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": "integer",
        "name": "string",
        "email": "string",
        "role": "string",
        "token": "string (JWT)"
    }
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "User already exists with this email"
}
```

**Business Logic:**
1. Validate request body
2. Check if email already exists
3. Hash password using bcrypt (10 rounds)
4. Create user record with role 'user'
5. Generate JWT token (7 days expiry)
6. Return user data with token

#### 3.1.2 Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "email": "string (required, email format)",
    "password": "string (required)"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "id": "integer",
        "name": "string",
        "email": "string",
        "role": "string",
        "token": "string (JWT)"
    }
}
```

**Error Response (401):**
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

**Business Logic:**
1. Validate request body
2. Find user by email
3. Compare password using bcrypt
4. Generate JWT token
5. Return user data with token

#### 3.1.3 Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": "integer",
        "name": "string",
        "email": "string",
        "role": "string",
        "profilePicture": "string | null"
    }
}
```

**Error Response (401):**
```json
{
    "success": false,
    "message": "Not authorized to access this route"
}
```

**Business Logic:**
1. Extract JWT from Authorization header
2. Verify and decode JWT
3. Find user by ID from token
4. Return user data (excluding password)

### 3.2 Booking APIs

#### 3.2.1 Create Booking

**Endpoint:** `POST /api/bookings`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
    "showId": "integer (required)",
    "seats": [
        {
            "row": "integer (required, >= 0)",
            "column": "integer (required, >= 0)"
        }
    ]
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Booking confirmed successfully",
    "data": {
        "id": "integer",
        "bookingNumber": "string",
        "seats": "array",
        "totalAmount": "decimal",
        "status": "string",
        "Show": {
            "id": "integer",
            "showDate": "date",
            "showTime": "time",
            "price": "decimal",
            "Movie": {
                "title": "string",
                "posterUrl": "string"
            },
            "Cinema": {
                "name": "string",
                "location": "string"
            },
            "Screen": {
                "name": "string"
            }
        }
    }
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Some seats are already booked",
    "conflicts": ["2-3", "2-4"]
}
```

**Business Logic (with Transaction):**
1. Start database transaction
2. Validate user authentication
3. Validate seat count (1-6 seats)
4. Fetch show with screen details
5. Validate seat positions within screen bounds
6. Fetch existing bookings for the show
7. Check for seat conflicts
8. Calculate total amount
9. Create booking record with unique booking number
10. Update show available seats
11. Delete temporary seat blocks
12. Commit transaction
13. Return booking details with relationships

**Transaction Rollback Triggers:**
- Invalid seat count
- Show not found
- Seat conflicts detected
- Seat position out of bounds
- Any database error

#### 3.2.2 Get User Bookings

**Endpoint:** `GET /api/bookings`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
    "success": true,
    "count": "integer",
    "data": [
        {
            "id": "integer",
            "bookingNumber": "string",
            "seats": "array",
            "totalAmount": "decimal",
            "status": "string",
            "bookingDate": "datetime",
            "Show": { "..." }
        }
    ]
}
```

**Business Logic:**
1. Extract user ID from JWT
2. Fetch all bookings for user
3. Include Show, Movie, Cinema, Screen details
4. Order by creation date descending
5. Return bookings array

#### 3.2.3 Cancel Booking

**Endpoint:** `PUT /api/bookings/:id/cancel`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
        "id": "integer",
        "status": "cancelled",
        "paymentStatus": "refunded"
    }
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Cannot cancel booking for past shows"
}
```

**Business Logic (with Transaction):**
1. Start database transaction
2. Find booking by ID and user ID
3. Check booking status (not already cancelled)
4. Validate show is not in the past
5. Update booking status to 'cancelled'
6. Update payment status to 'refunded'
7. Increment show available seats
8. Commit transaction
9. Return updated booking

### 3.3 Show APIs

#### 3.3.1 Get Shows by Cinema

**Endpoint:** `GET /api/shows/cinema/:cinemaId`

**Response (200):**
```json
{
    "success": true,
    "count": "integer",
    "data": [
        {
            "id": "integer",
            "showDate": "date",
            "showTime": "time",
            "price": "decimal",
            "availableSeats": "integer",
            "Movie": {
                "id": "integer",
                "title": "string",
                "duration": "integer",
                "genre": "string",
                "language": "string",
                "posterUrl": "string",
                "rating": "float"
            },
            "Screen": {
                "id": "integer",
                "name": "string",
                "screenType": "string",
                "totalRows": "integer",
                "totalColumns": "integer"
            }
        }
    ]
}
```

**Business Logic:**
1. Validate cinema ID
2. Fetch shows where showDate >= today
3. Include Movie and Screen details
4. Order by date and time ascending
5. Return shows array

#### 3.3.2 Get Show Details with Booked Seats

**Endpoint:** `GET /api/shows/:id`

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": "integer",
        "showDate": "date",
        "showTime": "time",
        "price": "decimal",
        "availableSeats": "integer",
        "Movie": { "..." },
        "Screen": { "..." },
        "Cinema": { "..." },
        "bookedSeats": [
            {"row": 0, "column": 5},
            {"row": 0, "column": 6}
        ]
    }
}
```

**Business Logic:**
1. Fetch show by ID with relationships
2. Fetch all confirmed bookings for show
3. Flatten seats from all bookings
4. Return show data with booked seats array

---

## 4. Component Design

### 4.1 Backend Components

#### 4.1.1 Authentication Middleware

**File:** `middleware/auth.js`

**Function:** `protect`

**Purpose:** Verify JWT token and attach user to request

**Algorithm:**
```javascript
1. Extract token from Authorization header (Bearer scheme)
2. If no token, return 401 Unauthorized
3. Try to verify token with JWT_SECRET
4. If verification fails, return 401
5. Extract user ID from decoded token
6. Fetch user from database by ID
7. If user not found, return 401
8. Attach user object to request (req.user)
9. Call next() to proceed to route handler
```

**Function:** `adminOnly`

**Purpose:** Verify user has admin role

**Algorithm:**
```javascript
1. Check if req.user exists
2. Check if req.user.role === 'admin'
3. If yes, call next()
4. If no, return 403 Forbidden
```

#### 4.1.2 Booking Controller

**File:** `controllers/bookingController.js`

**Function:** `createBooking`

**Pseudocode:**
```
BEGIN TRANSACTION

VALIDATE:
    - seats array not empty
    - seats count <= 6
    - user authenticated

FETCH show with screen

FOR each seat in seats:
    IF seat.row >= screen.totalRows OR seat.column >= screen.totalColumns:
        ROLLBACK
        RETURN error "Invalid seat position"

FETCH all confirmed bookings for show

CREATE bookedSeats array from existing bookings

FOR each requested seat:
    IF seat exists in bookedSeats:
        ADD to conflicts array

IF conflicts not empty:
    ROLLBACK
    RETURN error with conflicts

CALCULATE totalAmount = show.price * seats.length

CREATE booking record:
    - userId from req.user
    - showId from request
    - seats array
    - totalAmount
    - status = 'confirmed'
    - paymentStatus = 'completed'
    - auto-generate bookingNumber

UPDATE show.availableSeats = availableSeats - seats.length

DELETE all SeatBlocks for selected seats

COMMIT TRANSACTION

FETCH complete booking with relationships

RETURN booking data

ON ERROR:
    ROLLBACK TRANSACTION
    RETURN error message
```

#### 4.1.3 Socket Handler

**File:** `socket/seatBlockHandler.js`

**Function:** `setupSeatBlockSocket`

**Event Handlers:**

**1. Connection Event**
```
ON client connects:
    LOG socket ID
    STORE socket reference
```

**2. Join Show Event**
```
ON 'join-show' with showId:
    JOIN socket to room 'show-{showId}'
    CLEAN expired blocks
    FETCH current blocks for show
    EMIT 'current-blocks' to this socket
```

**3. Block Seat Event**
```
ON 'block-seat' with {showId, seatRow, seatColumn}:
    FETCH existing block for seat
    
    IF block exists AND block.socketId != current socket:
        EMIT 'seat-block-failed' to this socket
        RETURN
    
    IF block exists AND block.socketId == current socket:
        UPDATE block.expiresAt = now + 5 minutes
    ELSE:
        CREATE new SeatBlock:
            - ShowId = showId
            - seatRow
            - seatColumn
            - socketId = current socket
            - expiresAt = now + 5 minutes
    
    BROADCAST 'seat-blocked' to room 'show-{showId}'
```

**4. Unblock Seat Event**
```
ON 'unblock-seat' with {showId, seatRow, seatColumn}:
    DELETE SeatBlock WHERE:
        - ShowId = showId
        - seatRow = seatRow
        - seatColumn = seatColumn
        - socketId = current socket
    
    BROADCAST 'seat-unblocked' to room 'show-{showId}'
```

**5. Disconnect Event**
```
ON disconnect:
    FETCH all SeatBlocks for this socket
    
    FOR each block:
        EMIT 'seat-unblocked' to room 'show-{block.ShowId}'
    
    DELETE all SeatBlocks for this socket
```

**Background Job:**
```
EVERY 30 seconds:
    DELETE SeatBlocks WHERE expiresAt < NOW()
```

### 4.2 Frontend Components

#### 4.2.1 Authentication Context

**File:** `context/AuthContext.jsx`

**State:**
```javascript
{
    user: object | null,
    token: string | null,
    loading: boolean
}
```

**Methods:**

**login(email, password)**
```
1. Call API POST /api/auth/login
2. Extract token and user data
3. Store token in localStorage
4. Set axios default header
5. Update state with user and token
6. Show success toast
7. Return {success: true/false}
```

**register(name, email, password)**
```
1. Call API POST /api/auth/register
2. Extract token and user data
3. Store token in localStorage
4. Set axios default header
5. Update state with user and token
6. Show success toast
7. Return {success: true/false}
```

**logout()**
```
1. Remove token from localStorage
2. Clear axios default header
3. Set user and token to null
4. Show info toast
```

**fetchUserProfile()**
```
1. Call API GET /api/auth/profile
2. Update user state with response
3. Handle errors by calling logout
```

#### 4.2.2 Socket Context

**File:** `context/SocketContext.jsx`

**State:**
```javascript
{
    socket: Socket | null,
    connected: boolean,
    blockedSeats: array
}
```

**Initialization:**
```
1. Create Socket.IO connection to backend
2. Configure transports: ['websocket', 'polling']
3. Enable reconnection with 5 attempts
4. Set up event listeners
5. Return cleanup function on unmount
```

**Methods:**

**joinShow(showId)**
```
IF socket AND socket.connected:
    EMIT 'join-show' with showId
```

**blockSeat(showId, row, column)**
```
IF socket AND socket.connected:
    EMIT 'block-seat' with {showId, seatRow: row, seatColumn: column}
```

**unblockSeat(showId, row, column)**
```
IF socket AND socket.connected:
    EMIT 'unblock-seat' with {showId, seatRow: row, seatColumn: column}
```

**isSeatBlocked(row, column)**
```
RETURN blockedSeats.some(seat => 
    seat.seatRow === row AND 
    seat.seatColumn === column AND 
    seat.socketId !== socket.id
)
```

**Event Listeners:**
```
ON 'connect':
    SET connected = true
    LOG connection

ON 'disconnect':
    SET connected = false

ON 'current-blocks':
    SET blockedSeats = received data

ON 'seat-blocked':
    IF seat not in blockedSeats:
        ADD seat to blockedSeats

ON 'seat-unblocked':
    REMOVE seat from blockedSeats
```

#### 4.2.3 Seat Selection Component

**File:** `pages/SeatSelection.jsx`

**State:**
```javascript
{
    show: object | null,
    bookedSeats: array,
    loading: boolean
}
```

**Component Lifecycle:**

**On Mount:**
```
1. Check if user is authenticated
2. Fetch show details
3. Join WebSocket show room
4. Set up cleanup function
```

**On Unmount:**
```
1. Unblock all selected seats via WebSocket
2. Clear selected seats from context
```

**Seat Rendering Algorithm:**
```
FOR row = 0 to totalRows - 1:
    FOR column = 0 to totalColumns - 1:
        status = getSeatStatus(row, column)
        color = getSeatColor(status)
        
        RENDER seat box with:
            - background color based on status
            - onClick handler
            - hover effects
            - disabled if booked/blocked
```

**getSeatStatus(row, column)**
```
IF seat is booked:
    RETURN 'booked'
ELSE IF seat is selected by user:
    RETURN 'selected'
ELSE IF seat is blocked by me (via Socket):
    RETURN 'selected'
ELSE IF seat is blocked by others:
    RETURN 'blocked'
ELSE:
    RETURN 'available'
```

**handleSeatClick(row, column)**
```
IF seat is booked:
    SHOW toast "This seat is already booked"
    RETURN

IF seat is blocked by others:
    SHOW toast "This seat is being selected by another user"
    RETURN

IF seat is selected:
    REMOVE seat from selected
    EMIT 'unblock-seat' via WebSocket
ELSE:
    IF selected seats count >= 6:
        SHOW toast "Maximum 6 seats can be selected"
        RETURN
    
    ADD seat to selected
    EMIT 'block-seat' via WebSocket
```

**handleBooking()**
```
IF no seats selected:
    SHOW toast "Please select at least one seat"
    RETURN

CALL createBooking API with:
    - showId
    - selected seats array

IF success:
    EMIT 'unblock-all-seats'
    CLEAR selected seats
    NAVIGATE to confirmation page
ELSE:
    SHOW error toast
```

---

## 5. Algorithm Design

### 5.1 Booking Number Generation

**Purpose:** Generate unique booking identifier

**Algorithm:**
```
PREFIX = "BK"
TIMESTAMP = current time in milliseconds
RANDOM = random number between 0-999

bookingNumber = PREFIX + TIMESTAMP + RANDOM

Example: BK1696234567890123
```

**Uniqueness:** Combination of timestamp and random ensures uniqueness

### 5.2 Seat Conflict Detection

**Purpose:** Detect if requested seats are already booked

**Input:** 
- requestedSeats: array of {row, column}
- existingBookings: array of booking objects

**Algorithm:**
```
bookedSeats = []

FOR each booking in existingBookings:
    FOR each seat in booking.seats:
        ADD "row-column" to bookedSeats array

conflicts = []

FOR each seat in requestedSeats:
    seatKey = seat.row + "-" + seat.column
    IF seatKey in bookedSeats:
        ADD seatKey to conflicts

RETURN conflicts
```

**Time Complexity:** O(n × m) where n = bookings, m = average seats per booking

### 5.3 Expired Block Cleanup

**Purpose:** Remove expired temporary seat locks

**Algorithm:**
```
FUNCTION cleanExpiredBlocks():
    currentTime = NOW()
    
    DELETE FROM SeatBlocks
    WHERE expiresAt < currentTime
    
    RETURN number of deleted rows

RUN cleanExpiredBlocks() EVERY 30 seconds
```

### 5.4 Seat Availability Calculation

**Purpose:** Calculate available seats for a show

**Algorithm:**
```
totalSeats = screen.totalRows × screen.totalColumns

bookedSeatsCount = SUM of all confirmed booking seat counts

availableSeats = totalSeats - bookedSeatsCount

UPDATE show.availableSeats = availableSeats
```

### 5.5 Password Hashing

**Purpose:** Securely hash user passwords

**Algorithm:** bcrypt with 10 salt rounds
```
FUNCTION hashPassword(plainPassword):
    salt = generateSalt(10)
    hashedPassword = bcrypt.hash(plainPassword, salt)
    RETURN hashedPassword

FUNCTION verifyPassword(plainPassword, hashedPassword):
    isValid = bcrypt.compare(plainPassword, hashedPassword)
    RETURN isValid
```

**Security:** 
- Salt rounds = 10
- One-way hashing (irreversible)
- Timing attack resistant

---

## 6. State Management

### 6.1 Frontend State Architecture

**Pattern:** Context API with Provider Pattern

**State Distribution:**

```
App Component
│
├── AuthContext (Global)
│   ├── user
│   ├── token
│   └── methods: login, logout, register
│
├── BookingContext (Global)
│   ├── selectedSeats
│   ├── bookings
│   └── methods: addSeat, removeSeat, createBooking, cancelBooking
│
└── SocketContext (Global)
    ├── socket
    ├── connected
    ├── blockedSeats
    └── methods: joinShow, blockSeat, unblockSeat
```

### 6.2 Local Component State

**Seat Selection Page:**
- show details
- booked seats
- loading state

**Cinema Shows Page:**
- cinema data
- shows array
- loading state

**My Bookings Page:**
- booking list
- cancel dialog state
- selected booking for cancellation

### 6.3 State Persistence

**LocalStorage:**
- JWT token (key: 'token')

**SessionStorage:**
- None used

**Database:**
- All persistent data

---

## 7. Error Handling

### 7.1 Backend Error Handling

**Strategy:** Centralized error handling with try-catch blocks

**Error Response Format:**
```json
{
    "success": false,
    "message": "Error description",
    "error": "Detailed error (development only)"
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

**Transaction Rollback:**
```javascript
try {
    await transaction.commit();
} catch (error) {
    await transaction.rollback();
    res.status(500).json({error});
}
```

### 7.2 Frontend Error Handling

**Axios Interceptor:**
```javascript
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Logout user
        }
        return Promise.reject(error);
    }
);
```

**Component Error Handling:**
```javascript
try {
    const response = await axios.get('/api/endpoint');
    setData(response.data.data);
} catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Operation failed');
}
```

**User Feedback:**
- Toast notifications for all operations
- Loading states during async operations
- Inline validation messages
- Error boundaries for component crashes

---

## 8. Real-time Communication

### 8.1 WebSocket Protocol

**Library:** Socket.IO

**Connection:**
```javascript
const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
});
```

### 8.2 Event Flow Diagram

```
User A                    Server                    User B
  |                         |                         |
  |--- join-show ---------->|                         |
  |<-- current-blocks ------|                         |
  |                         |                         |
  |--- block-seat --------->|                         |
  |                         |--- seat-blocked ------->|
  |<-- seat-blocked --------|                         |
  |                         |                         |
  |--- unblock-seat ------->|                         |
  |                         |--- seat-unblocked ----->|
  |<-- seat-unblocked ------|                         |
```

### 8.3 Room Management

**Room Naming Convention:** `show-{showId}`

**Benefits:**
- Isolate events per show
- Efficient broadcasting
- Easy cleanup

**Implementation:**
```javascript
socket.join(`show-${showId}`);
io.to(`show-${showId}`).emit('event', data);
```

### 8.4 Data Synchronization

**Seat Block Expiry:** 5 minutes (300,000 milliseconds)

**Synchronization Points:**
1. User joins show → Receive current blocks
2. User selects seat → Broadcast to all
3. User deselects seat → Broadcast to all
4. User disconnects → Release all blocks
5. Block expires → Automatic cleanup

---

## Conclusion

This Low Level Design document provides comprehensive technical specifications for implementing the Movie Booking System. All algorithms, data structures, APIs, and component interactions are detailed to enable development without ambiguity.

The design emphasizes:
- Data integrity through transactions
- Real-time synchronization via WebSocket
- Security through authentication and authorization
- Scalability through stateless design
- Maintainability through modular architecture