"# Uber Backend API

A professional-grade Node.js/Express backend service providing secure user authentication, profile management, and token-based authorization for ride-sharing applications.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Overview

This backend API provides a robust foundation for a ride-sharing platform, featuring:

- **Secure Authentication**: JWT-based token authentication with password hashing
- **User Management**: User registration, login, logout, and profile retrieval
- **Token Blacklisting**: Secure logout mechanism preventing token reuse
- **Database Integration**: MongoDB for persistent data storage
- **Input Validation**: Express-validator for comprehensive request validation
- **Security**: CORS, HTTP-only cookies, and bcrypt password hashing

## Features

✅ User Registration with email validation  
✅ Secure Login with password hashing  
✅ JWT-based Authentication  
✅ Token Blacklisting on Logout  
✅ Profile Management  
✅ Input Validation & Error Handling  
✅ MongoDB Integration  
✅ CORS Configuration  
✅ Cookie-based Token Storage

## Tech Stack

| Layer                | Technology              |
| -------------------- | ----------------------- |
| **Runtime**          | Node.js                 |
| **Framework**        | Express.js 5.2+         |
| **Database**         | MongoDB + Mongoose 9.7+ |
| **Authentication**   | JWT (jsonwebtoken 9.0+) |
| **Password Hashing** | Bcrypt 6.0+             |
| **Validation**       | Express-validator 7.3+  |
| **Middleware**       | Cookie-parser, CORS     |
| **Dev Tools**        | Nodemon                 |

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd uber

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables (see Environment Variables section)

# Start the development server
npm run dev
```

The server will run on `http://localhost:5001` (or your configured PORT).

## Project Structure

```
uber/
├── server.js                 # Application entry point
├── package.json             # Project dependencies
├── .env                     # Environment variables
├── README.md               # Project documentation
├── src/
│   ├── app.js              # Express app configuration
│   ├── controllers/        # Request handlers
│   │   └── user.controller.js
│   ├── models/             # MongoDB schemas
│   │   ├── user.model.js
│   │   └── blacklistToke.model.js
│   ├── services/           # Business logic
│   │   └── user.service.js
│   ├── routes/             # API routes
│   │   └── user.routes.js
│   ├── middlewares/        # Custom middleware
│   │   └── auth.middleware.js
│   └── db/                 # Database connection
│       └── connectDB.js
└── docs/                   # Documentation
    ├── API_DOCUMENTATION.md
    ├── ARCHITECTURE.md
    ├── DATABASE.md
    └── INSTALLATION.md
```

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - Complete API endpoint reference with examples
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[DATABASE.md](docs/DATABASE.md)** - Database schema and model documentation
- **[INSTALLATION.md](docs/INSTALLATION.md)** - Detailed setup and configuration guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5001

# Database Configuration
MONGO_URI=mongodb://localhost:27017/uber

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Environment
NODE_ENV=development
```

### Security Notes

⚠️ **Important**: Never commit `.env` files to version control. The `.env` file should contain sensitive information like:

- `JWT_SECRET`: Use a strong, randomly generated string (minimum 32 characters)
- `MONGO_URI`: Should point to your MongoDB instance

For production:

- Use environment-specific `.env` files (.env.production)
- Store secrets in a secure secrets management system (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate JWT secrets periodically
- Use strong, unique passwords for MongoDB

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Run tests (if configured)
npm test
```

## API Endpoints Summary

| Method | Endpoint               | Description       | Auth Required |
| ------ | ---------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register`   | Register new user | ❌            |
| POST   | `/api/auth/login`      | User login        | ❌            |
| GET    | `/api/auth/getProfile` | Get user profile  | ✅            |
| GET    | `/api/auth/logout`     | Logout user       | ✅            |

For detailed endpoint documentation, see [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## Development Workflow

### Running the Server

```bash
npm run dev
```

The server will restart automatically when you make changes (thanks to nodemon).

### Testing Endpoints

Use tools like:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/)
- [cURL](https://curl.se/)

Example:

```bash
# Register a new user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"password123"}'
```

## Error Handling

The API returns standardized error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

Common HTTP Status Codes:

- `200` - Success
- `201` - Resource Created
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Server Error

## Security Considerations

### Implemented

✅ JWT token-based authentication  
✅ Bcrypt password hashing (10 salt rounds)  
✅ Token blacklisting on logout  
✅ Input validation using express-validator  
✅ CORS configuration  
✅ HTTP-only cookies support  
✅ Password field excluded from default queries

### Recommended Enhancements

- Implement rate limiting to prevent brute force attacks
- Add refresh token mechanism for extended sessions
- Implement request logging and monitoring
- Add email verification for new registrations
- Implement password reset functionality
- Add 2FA (Two-Factor Authentication)
- Use HTTPS in production
- Implement request signing for additional security

## Performance Optimization

- Mongoose indexing on frequently queried fields (email)
- Token expiration set to 24 hours
- Database connection pooling via Mongoose
- Request validation before database queries

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Change PORT in .env or use:
PORT=5002 npm run dev
```

**MongoDB connection failed:**

- Verify `MONGO_URI` in `.env`
- Ensure MongoDB service is running
- Check network connectivity to MongoDB instance

**JWT verification failed:**

- Verify `JWT_SECRET` matches between server and client
- Check token expiration (24 hours)
- Ensure token is sent in correct format

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Future Enhancements

- [ ] Role-based access control (RBAC)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Refresh token mechanism
- [ ] Automated testing suite
- [ ] API documentation with Swagger/OpenAPI
- [ ] Request rate limiting
- [ ] Comprehensive logging system
- [ ] Deployment guides (Docker, AWS, Heroku)

## License

ISC License - See LICENSE file for details

## Author

Rabbi

## Support

For issues and questions, please open an issue in the repository or contact the development team.

---

**Last Updated**: June 2026  
**Version**: 1.0.0"
