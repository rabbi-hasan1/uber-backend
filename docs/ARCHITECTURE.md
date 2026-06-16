# Architecture Documentation

System design, patterns, and architectural decisions.

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│              (Mobile App / Web Application)                 │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS Requests
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express Server                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Layer                        │   │
│  │  ├─ CORS Handler                                    │   │
│  │  ├─ Body Parser (JSON/URL Encoded)                  │   │
│  │  ├─ Cookie Parser                                   │   │
│  │  └─ Authentication Middleware                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Route Layer                            │   │
│  │  └─ /api/auth/register                             │   │
│  │  └─ /api/auth/login                                │   │
│  │  └─ /api/auth/getProfile                           │   │
│  │  └─ /api/auth/logout                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Controller Layer (Business Logic)           │   │
│  │  ├─ register() - User registration                 │   │
│  │  ├─ login() - User authentication                  │   │
│  │  ├─ getProfile() - Profile retrieval               │   │
│  │  └─ logout() - Session termination                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Service Layer (Data Logic)               │   │
│  │  └─ userService - User CRUD operations             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ Database Queries
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Mongoose (ODM)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Data Models Layer                        │   │
│  │  ├─ User Schema                                     │   │
│  │  └─ BlacklistToken Schema                           │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ MongoDB Wire Protocol
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Database                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections                                         │   │
│  │  ├─ users (User documents)                          │   │
│  │  └─ blacklisttokes (Blacklisted JWT tokens)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Layered Architecture Pattern

This project follows a **layered (N-tier) architecture** with clear separation of concerns:

### 1. **Presentation Layer** (Routes)

- File: `src/routes/user.routes.js`
- **Responsibility**: Define HTTP endpoints and apply validation
- **Key Features**:
  - Express validators for input validation
  - Route definitions and HTTP method mapping
  - Middleware attachment (authentication checks)

### 2. **Controller Layer**

- File: `src/controllers/user.controller.js`
- **Responsibility**: Handle HTTP requests and responses
- **Key Functions**:
  - `register()` - Processes registration requests
  - `login()` - Handles authentication
  - `getProfile()` - Returns user profile
  - `logout()` - Manages session termination
- **Characteristics**:
  - Validates errors from input validation
  - Calls service layer for business logic
  - Formats responses and handles errors
  - Returns HTTP status codes

### 3. **Service Layer**

- File: `src/services/user.service.js`
- **Responsibility**: Encapsulate business logic
- **Key Functions**:
  - `createUser()` - Creates new user with validation
  - Database abstraction
  - Reusable logic for multiple controllers
- **Characteristics**:
  - No HTTP specifics
  - Can be reused by different controllers
  - Contains business rules validation

### 4. **Model Layer** (Data Access)

- Files: `src/models/user.model.js`, `src/models/blacklistToke.model.js`
- **Responsibility**: Define data schemas and database interactions
- **Key Features**:
  - Mongoose schema definitions
  - Instance methods: `generateAuthToken()`, `comparePassword()`
  - Static methods: `hashPassword()`
  - Database validation and constraints

### 5. **Database Layer**

- File: `src/db/connectDB.js`
- **Responsibility**: Manage database connections
- **Features**:
  - MongoDB connection management
  - Error handling for connection failures
  - Connection pooling via Mongoose

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                         │
└────────────────────┬─────────────────────────────────────────┘
                     │
         ┌───────────▼────────────┐
         │   Middleware: CORS,    │
         │   Body Parser, Cookies │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   Route Validation     │
         │  (express-validator)   │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  Controller Function   │
         │  (register/login/etc)  │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   Password Hashing     │
         │    (bcrypt - 10 salt)  │
         │  or Password Compare   │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  Service Layer CRUD    │
         │  (Database Queries)    │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  JWT Token Generated   │
         │ (24-hour expiration)   │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  HTTP Response + Token │
         │  (Cookie + JSON Body)  │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  CLIENT RECEIVES TOKEN │
         │  (Stores securely)     │
         └────────────────────────┘
```

### Protected Route Access

```
┌──────────────────────────────────────────────────────────────┐
│              CLIENT REQUEST WITH TOKEN                       │
│  (Authorization: Bearer <token> OR Cookie: token=<token>)    │
└────────────────────┬─────────────────────────────────────────┘
                     │
         ┌───────────▼────────────┐
         │   Auth Middleware      │
         │   checkAuth()          │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  Token Extracted from  │
         │  Cookie or Header      │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │ Check Token in         │
         │ Blacklist Collection   │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │ Verify JWT Signature   │
         │ (with JWT_SECRET)      │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │ Extract User ID from   │
         │ Token Payload          │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │ Query User from DB     │
         │ and Attach to req.user │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │ Route Handler Executes │
         │ with req.user available│
         └────────────────────────┘
```

---

## Data Models

### User Schema

```javascript
{
  fullname: {
    firstname: String,     // Min 3 chars
    lastname: String       // Min 3 chars
  },
  email: String,          // Unique, required
  password: String,       // Hashed (bcrypt), not selected by default
  socketId: String,       // For real-time features (future)
  timestamps: {
    createdAt: Date,      // Auto-generated
    updatedAt: Date       // Auto-updated
  }
}
```

### BlacklistToken Schema

```javascript
{
  token: String,         // JWT token string
  createdAt: Date,       // Auto TTL index (86400s = 24h)
  // Auto-expires after 24 hours
}
```

---

## Security Architecture

### 1. **Password Security**

```
User Input (Plain Password)
           ↓
    bcrypt.hash(password, 10)
           ↓
    Hashed Password (Stored in DB)

On Login:
    User Input + DB Hashed Password
           ↓
    bcrypt.compare()
           ↓
    Match/No Match Result
```

### 2. **Token Security**

```
User Authenticated
           ↓
    JWT.sign({ _id }, JWT_SECRET, { expiresIn: "24h" })
           ↓
    Token Sent to Client
           ↓
    Stored in HttpOnly Cookie/Header
           ↓
    On Each Protected Request
           ↓
    JWT.verify(token, JWT_SECRET)
           ↓
    Token Valid → Request Proceeds
    Token Invalid → 401 Unauthorized
```

### 3. **Logout Security**

```
User Logout Request
           ↓
    Extract Token from Cookie/Header
           ↓
    Store Token in Blacklist Collection
           ↓
    Clear Cookie from Client
           ↓
    24-Hour TTL Removes Old Tokens
```

---

## File Structure & Responsibilities

```
uber/
├── server.js                      # Entry point, start server & DB
├── src/
│   ├── app.js                    # Express app setup & middleware
│   ├── controllers/
│   │   └── user.controller.js    # HTTP request handlers
│   ├── models/
│   │   ├── user.model.js         # User schema & methods
│   │   └── blacklistToke.model.js # Token blacklist schema
│   ├── services/
│   │   └── user.service.js       # Business logic (CRUD)
│   ├── routes/
│   │   └── user.routes.js        # Route definitions & validation
│   ├── middlewares/
│   │   └── auth.middleware.js    # JWT verification middleware
│   └── db/
│       └── connectDB.js          # MongoDB connection logic
└── docs/
    ├── API_DOCUMENTATION.md      # API endpoint reference
    ├── ARCHITECTURE.md           # System design (this file)
    ├── DATABASE.md               # Database schema details
    └── INSTALLATION.md           # Setup instructions
```

---

## Design Patterns Used

### 1. **Service Layer Pattern**

Encapsulates business logic away from HTTP concerns, making code reusable and testable.

### 2. **Middleware Pattern**

CORS, body parsing, authentication applied as middleware for clean separation.

### 3. **Model-View-Controller (MVC)**

Controllers handle requests, models define data, services contain logic.

### 4. **Token Blacklisting Pattern**

Maintains list of invalidated tokens to enable secure logout.

### 5. **Factory/Singleton Pattern**

Mongoose models use singleton pattern to prevent duplicate model compilation.

---

## Data Flow Examples

### Registration Flow

```
POST /api/auth/register
     ↓
[CORS, BodyParser Middleware]
     ↓
[Validation Middleware - express-validator]
     ↓
userController.register()
     ↓
UserModel.hashPassword(password)
     ↓
userService.createUser()
     ↓
UserModel.create() [Database Insert]
     ↓
user.generateAuthToken()
     ↓
Response: { token, user }
```

### Login Flow

```
POST /api/auth/login
     ↓
[Validation]
     ↓
userController.login()
     ↓
UserModel.findOne({ email })
     ↓
user.comparePassword(password)
     ↓
user.generateAuthToken()
     ↓
Set-Cookie: token=...
Response: { token, user }
```

### Protected Route Flow

```
GET /api/auth/getProfile
(with Authorization header)
     ↓
[checkAuth Middleware]
     ↓
Extract token from header/cookie
     ↓
Check blacklistToken collection
     ↓
JWT.verify(token)
     ↓
Extract _id from payload
     ↓
UserModel.findById(_id)
     ↓
Attach user to req.user
     ↓
userController.getProfile()
     ↓
Response: { user: req.user }
```

---

## Scalability Considerations

### Current Limitations

- No horizontal scaling (stateless, but needs shared JWT_SECRET)
- Blacklist stored in database (OK for now, could use Redis)
- No caching layer implemented

### Recommendations for Scaling

1. **Horizontal Scaling**: Use consistent JWT_SECRET across all instances
2. **Caching**: Implement Redis for:
   - Token blacklist (faster lookups)
   - User session data
   - Frequently accessed user profiles
3. **Message Queue**: RabbitMQ/Kafka for async operations
4. **Load Balancing**: Nginx/HAProxy in front
5. **Database Optimization**: Indexing, sharding, replication

---

## Error Handling Architecture

```
Error Occurs
     ↓
Caught in try-catch block
     ↓
Formatted into standard response
     ↓
HTTP Status Code Set
     ↓
Error details returned to client
```

### Error Types

1. **Validation Errors** (400) - Input validation fails
2. **Authentication Errors** (401) - Invalid/missing token
3. **Not Found Errors** (404) - Resource doesn't exist
4. **Server Errors** (500) - Unexpected exceptions

---

## Future Architecture Enhancements

- [ ] Implement rate limiting middleware
- [ ] Add request logging/tracing system
- [ ] Separate config from code (config service)
- [ ] Implement dependency injection
- [ ] Add Redis caching layer
- [ ] Implement API versioning
- [ ] Add comprehensive error tracking (Sentry)
- [ ] GraphQL API alongside REST
- [ ] API documentation (Swagger/OpenAPI)
