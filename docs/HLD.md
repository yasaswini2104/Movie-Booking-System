# High Level Design Document
## Movie Booking System

**Version:** 1.0  
**Date:** October 2025  
**Author:** Development Team

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [System Architecture](#3-system-architecture)
4. [Component Design](#4-component-design)
5. [Data Flow](#5-data-flow)
6. [Technology Stack](#6-technology-stack)
7. [Security Architecture](#7-security-architecture)
8. [Scalability Considerations](#8-scalability-considerations)
9. [Integration Points](#9-integration-points)
10. [Non-Functional Requirements](#10-non-functional-requirements)

---

## 1. Introduction

### 1.1 Purpose
This document provides a high-level design overview of the Movie Booking System, a web-based application that enables users to browse cinemas, select movies, book seats in real-time, and manage their bookings. The system includes an administrative interface for managing cinema operations.

### 1.2 Scope
The system encompasses:
- User authentication and authorization
- Cinema and movie management
- Real-time seat selection and booking
- Payment simulation
- Booking history and cancellation
- Administrative dashboard for cinema operations

### 1.3 Definitions and Acronyms
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **OAuth**: Open Authorization
- **REST**: Representational State Transfer
- **SPA**: Single Page Application
- **WebSocket**: Full-duplex communication protocol
- **ORM**: Object-Relational Mapping
- **CRUD**: Create, Read, Update, Delete

---

## 2. System Overview

### 2.1 System Context
The Movie Booking System operates as a web-based platform accessible through standard web browsers. It serves two primary user groups:

1. **End Users**: Individuals who browse cinemas, select movies, book tickets, and manage their bookings
2. **Administrators**: Cinema operators who manage cinema infrastructure, movies, screens, and shows

### 2.2 Key Features

#### User Features
- User registration with email/password
- Google OAuth 2.0 social login
- Browse available cinemas by location
- View movies and showtimes
- Interactive seat selection with real-time availability
- Secure booking with unique confirmation number
- View booking history
- Cancel confirmed bookings

#### Administrative Features
- Complete cinema management (add, edit, delete)
- Screen configuration and management
- Movie catalog management
- Show scheduling and pricing
- View booking analytics
- Seat occupancy visualization with user details

#### Real-time Features
- Temporary seat locking during selection
- Live seat availability updates
- Automatic release of abandoned seats
- Multi-user synchronization

---

## 3. System Architecture

### 3.1 Architecture Pattern
The system follows a **three-tier architecture** pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│                    (React SPA Frontend)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/WSS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│           (Node.js/Express API + Socket.IO Server)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                            │
│                    (MySQL Database)                         │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Architectural Layers

#### 3.2.1 Presentation Layer
- **Technology**: React 18 with Material-UI
- **Responsibilities**:
  - User interface rendering
  - User interaction handling
  - Client-side state management
  - Real-time UI updates via WebSocket
  - Route management and navigation

#### 3.2.2 Application Layer
- **Technology**: Node.js with Express.js and Socket.IO
- **Responsibilities**:
  - RESTful API endpoints
  - Business logic processing
  - Authentication and authorization
  - Real-time WebSocket communication
  - Data validation
  - Transaction management

#### 3.2.3 Data Layer
- **Technology**: MySQL with Sequelize ORM
- **Responsibilities**:
  - Data persistence
  - Data integrity enforcement
  - Transaction support
  - Query optimization
  - Relational data management

### 3.3 Communication Protocols

#### HTTP/HTTPS
Used for standard request-response operations:
- User authentication
- CRUD operations on entities
- Data retrieval and submission

#### WebSocket (Socket.IO)
Used for real-time bidirectional communication:
- Seat blocking notifications
- Live availability updates
- Multi-user synchronization

---

## 4. Component Design

### 4.1 Frontend Components

#### 4.1.1 Authentication Module
**Purpose**: Manage user authentication and session state

**Components**:
- Login Page
- Registration Page
- OAuth Callback Handler
- Authentication Context Provider

**Key Responsibilities**:
- User credential validation
- JWT token management
- Session persistence
- Google OAuth flow handling

#### 4.1.2 Cinema Browsing Module
**Purpose**: Display available cinemas and their details

**Components**:
- Cinema List View
- Cinema Detail View
- Location Filter

**Key Responsibilities**:
- Fetch and display cinema data
- Navigate to cinema-specific shows
- Present cinema facilities and information

#### 4.1.3 Show Selection Module
**Purpose**: Display available movies and showtimes

**Components**:
- Movie List View
- Show Time Grid
- Movie Detail Card

**Key Responsibilities**:
- Display movies playing at selected cinema
- Show available time slots
- Navigate to seat selection

#### 4.1.4 Seat Selection Module
**Purpose**: Interactive seat booking interface

**Components**:
- Seat Grid Visualizer
- Booking Summary Panel
- Real-time Seat Status

**Key Responsibilities**:
- Render seat layout
- Handle seat selection/deselection
- Communicate with WebSocket for blocking
- Display pricing and selection count
- Process booking confirmation

#### 4.1.5 Booking Management Module
**Purpose**: Display and manage user bookings

**Components**:
- Booking History List
- Booking Detail View
- Cancellation Dialog

**Key Responsibilities**:
- Fetch user bookings
- Display booking details
- Handle cancellation requests
- Show booking status

#### 4.1.6 Admin Dashboard Module
**Purpose**: Administrative interface for system management

**Components**:
- Cinema Management Panel
- Screen Management Panel
- Movie Management Panel
- Show Management Panel
- Seat Analytics View

**Key Responsibilities**:
- CRUD operations on all entities
- Show scheduling
- Booking analytics
- User identification for booked seats

### 4.2 Backend Components

#### 4.2.1 Authentication Service
**Purpose**: Handle user authentication and authorization

**Responsibilities**:
- User registration and login
- JWT token generation and validation
- Google OAuth integration
- Password hashing and verification
- Role-based access control

#### 4.2.2 Cinema Management Service
**Purpose**: Manage cinema entities

**Responsibilities**:
- Cinema CRUD operations
- Screen association
- Facility management
- Location-based queries

#### 4.2.3 Movie Management Service
**Purpose**: Manage movie catalog

**Responsibilities**:
- Movie CRUD operations
- Metadata management
- Movie-show association

#### 4.2.4 Show Management Service
**Purpose**: Manage show scheduling

**Responsibilities**:
- Show creation and modification
- Pricing management
- Screen-movie-time association
- Availability calculation

#### 4.2.5 Booking Service
**Purpose**: Handle ticket bookings

**Responsibilities**:
- Booking creation with validation
- Seat availability verification
- Transaction management
- Booking confirmation generation
- Cancellation processing

#### 4.2.6 Real-time Seat Management Service
**Purpose**: Manage temporary seat locks

**Responsibilities**:
- Seat block creation
- Block expiration handling
- WebSocket event broadcasting
- Conflict resolution

---

## 5. Data Flow

### 5.1 User Booking Flow

```
User → Select Cinema → View Movies → Choose Show → Select Seats → Confirm Booking
  │                                                      │
  └──────────────────────────────────────────────────────┘
                    Real-time Seat Updates
```

#### Detailed Flow:
1. User browses and selects a cinema
2. System retrieves movies and shows for that cinema
3. User selects a specific show
4. System fetches seat layout and booked seats
5. User selects desired seats (max 6)
6. WebSocket broadcasts seat blocks to all clients
7. User confirms booking
8. System validates availability
9. Transaction creates booking record
10. System updates show availability
11. Confirmation sent to user

### 5.2 Real-time Seat Blocking Flow

```
User A Selects Seat
        │
        ▼
    WebSocket Event
        │
        ▼
    Server Validates
        │
        ▼
    Create SeatBlock Record
        │
        ▼
    Broadcast to All Clients
        │
        ├─────────────┬─────────────┐
        ▼             ▼             ▼
    User A       User B         User C
   (Selected)   (Blocked)     (Blocked)
```

### 5.3 Admin Show Management Flow

```
Admin Creates Show
        │
        ▼
    Validate Cinema/Screen/Movie
        │
        ▼
    Calculate Total Seats
        │
        ▼
    Create Show Record
        │
        ▼
    Return to Admin Dashboard
```

---

## 6. Technology Stack

### 6.1 Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI library | 18.x |
| Vite | Build tool | 5.x |
| Material-UI | UI components | 5.x |
| React Router | Navigation | 6.x |
| Axios | HTTP client | 1.x |
| Socket.IO Client | WebSocket | 4.x |
| Context API | State management | Built-in |

### 6.2 Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 16+ |
| Express.js | Web framework | 4.x |
| Sequelize | ORM | 6.x |
| MySQL | Database | 8.x |
| Socket.IO | WebSocket | 4.x |
| JWT | Authentication | 9.x |
| Passport.js | OAuth | 0.7.x |
| bcryptjs | Password hashing | 2.x |

### 6.3 Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version control |
| npm | Package management |
| Postman | API testing |
| MySQL Workbench | Database management |

---

## 7. Security Architecture

### 7.1 Authentication Mechanisms

#### JWT-based Authentication
- Stateless token-based authentication
- Token expiration after 7 days
- Refresh mechanism not implemented (for simplicity)
- Tokens stored in browser localStorage

#### Google OAuth 2.0
- Third-party authentication
- No password storage for OAuth users
- Account linking based on email

### 7.2 Authorization Model

#### Role-Based Access Control (RBAC)
Two roles defined:
1. **User**: Can browse, book, and cancel their own bookings
2. **Admin**: Full system access including management operations

### 7.3 Security Measures

| Layer | Security Measure |
|-------|------------------|
| Transport | HTTPS (production) |
| Authentication | JWT with secure secret |
| Password | bcrypt hashing (10 rounds) |
| Database | SQL injection prevention via ORM |
| API | Route-level authentication middleware |
| CORS | Restricted to frontend origin |
| Input | Server-side validation |

### 7.4 Data Protection

- Passwords never stored in plain text
- JWT secrets stored in environment variables
- Database credentials separated from codebase
- User personal data access restricted by ownership

---

## 8. Scalability Considerations

### 8.1 Horizontal Scaling

#### Application Layer
- Stateless API design enables multiple server instances
- Load balancer distribution
- Session management via JWT (no server-side sessions)

#### WebSocket Layer
- Socket.IO supports Redis adapter for multi-server setup
- Shared state across server instances
- Horizontal scaling with sticky sessions

### 8.2 Vertical Scaling

#### Database
- MySQL supports read replicas
- Connection pooling for efficient resource use
- Query optimization through indexes

### 8.3 Caching Strategy

Potential caching layers:
- Cinema and movie data (rarely changes)
- Show listings with short TTL
- Seat layout structure (immutable)

### 8.4 Performance Optimization

- Database indexes on frequently queried columns
- Eager loading of related entities
- Pagination for large datasets
- WebSocket event throttling
- Frontend code splitting and lazy loading

---

## 9. Integration Points

### 9.1 External Integrations

#### Google OAuth API
- **Purpose**: Third-party authentication
- **Protocol**: OAuth 2.0
- **Data Exchange**: User profile information
- **Security**: Client credentials via environment variables

### 9.2 Internal Integrations

#### REST API Integration
- Frontend communicates with backend via Axios
- Base URL configured for environment
- Interceptors for authentication headers

#### WebSocket Integration
- Persistent connection for real-time updates
- Event-driven communication
- Automatic reconnection handling

---

## 10. Non-Functional Requirements

### 10.1 Performance Requirements

| Metric | Target |
|--------|--------|
| API Response Time | < 500ms (95th percentile) |
| Page Load Time | < 2 seconds |
| WebSocket Latency | < 100ms |
| Concurrent Users | 100+ per show |
| Database Query Time | < 100ms |

### 10.2 Reliability Requirements

- System uptime: 99.5%
- Data backup frequency: Daily
- Transaction rollback on failure
- Automatic seat block cleanup

### 10.3 Usability Requirements

- Intuitive navigation with max 3 clicks to booking
- Responsive design for mobile and desktop
- Real-time feedback on user actions
- Clear error messages
- Accessible UI components

### 10.4 Maintainability Requirements

- Modular architecture for easy updates
- Comprehensive error logging
- Code documentation
- Environment-based configuration
- Database migration support

### 10.5 Compatibility Requirements

- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile responsive design
- Desktop screen resolutions: 1366x768 and above
- Mobile screen resolutions: 375x667 and above

---

## Conclusion

This High Level Design document provides a comprehensive overview of the Movie Booking System architecture, components, and design decisions. The system is designed to be scalable, maintainable, and secure while providing an excellent user experience for both end-users and administrators.

The modular architecture allows for future enhancements such as payment gateway integration, email notifications, advanced analytics, and mobile application development.