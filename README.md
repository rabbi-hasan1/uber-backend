# Uber Clone

A full-stack ride-sharing application inspired by Uber, built with Node.js, Express.js, MongoDB, and React.
This project is for educational purposes only.

## Features

### User Features

- User Registration & Login
- JWT Authentication
- User Profile Management
- Secure Logout

### Upcoming Features

- Captain/Driver Registration
- Ride Booking
- Real-time Ride Tracking
- Live Location Updates
- Fare Calculation
- Ride History
- Payment Integration

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- express-validator

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd uber-clone
```

### Install Dependencies

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd Frontend
npm install
```

### Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Run the Project

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

## API Endpoints

### Authentication

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | `/api/auth/register`   | Register User    |
| POST   | `/api/auth/login`      | Login User       |
| GET    | `/api/auth/getProfile` | Get User Profile |
| GET    | `/api/auth/logout`     | Logout User      |

## Project Status

🚧 Currently under development.

Completed:

- User Authentication
- JWT Authorization
- Protected Routes

In Progress:

- Captain Module
- Ride Management
- Socket.IO Integration

## License

This project is for educational purposes only.
