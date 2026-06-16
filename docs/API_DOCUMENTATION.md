# API Documentation

Complete reference for all endpoints, request/response formats, and error handling.

## Base URL

```
http://localhost:5001/api/auth
```

## Authentication

Protected endpoints require a JWT token passed in one of these ways:

1. **Cookie**: `token=<jwt_token>`
2. **Authorization Header**: `Authorization: Bearer <jwt_token>`

## Endpoints

---

### 1. Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
| Field | Rule | Example |
|-------|------|---------|
| `fullname.firstname` | Min 3 characters | "John" |
| `fullname.lastname` | Min 3 characters | "Doe" |
| `email` | Valid email format | "john@example.com" |
| `password` | Min 6 characters | "securePassword123" |

**Success Response (201 Created):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null,
    "createdAt": "2026-06-16T10:30:00.000Z",
    "updatedAt": "2026-06-16T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invaild Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "ab",
      "msg": "first name must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

**Error Response (500 Server Error):**

```json
{
  "message": "Duplicate key error: email already exists"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**JavaScript (Fetch) Example:**

```javascript
const response = await fetch("http://localhost:5001/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fullname: {
      firstname: "John",
      lastname: "Doe",
    },
    email: "john@example.com",
    password: "securePassword123",
  }),
});

const data = await response.json();
console.log(data);
```

---

### 2. Login User

Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
| Field | Rule | Example |
|-------|------|---------|
| `email` | Valid email format | "john@example.com" |
| `password` | Min 6 characters | "securePassword123" |

**Success Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null,
    "createdAt": "2026-06-16T10:30:00.000Z",
    "updatedAt": "2026-06-16T10:30:00.000Z",
    "__v": 0
  }
}
```

**Note:** Token is also set as an HTTP-only cookie for convenience.

**Error Response (401 Unauthorized):**

```json
{
  "message": "Invalid email or password"
}
```

**Error Response (400 Bad Request):**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**JavaScript (Fetch) Example:**

```javascript
const response = await fetch("http://localhost:5001/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Include cookies
  body: JSON.stringify({
    email: "john@example.com",
    password: "securePassword123",
  }),
});

const data = await response.json();
console.log("Token:", data.token);
```

---

### 3. Get User Profile

Retrieve the authenticated user's profile information.

**Endpoint:** `GET /api/auth/getProfile`

**Authentication:** Required ✅

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

Or include cookie:

```
Cookie: token=<jwt_token>
```

**Success Response (200 OK):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null,
    "createdAt": "2026-06-16T10:30:00.000Z",
    "updatedAt": "2026-06-16T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "message": "Unauthorized"
}
```

**Error Response (401 User Not Found):**

```json
{
  "message": "User not found"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/auth/getProfile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch) Example:**

```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const response = await fetch("http://localhost:5001/api/auth/getProfile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
console.log("User Profile:", data.user);
```

---

### 4. Logout User

Invalidate the current JWT token and clear session.

**Endpoint:** `GET /api/auth/logout`

**Authentication:** Required ✅

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Logged out"
}
```

**Error Response (401 Unauthorized):**

```json
{
  "message": "Unauthorized"
}
```

**Error Response (500 Server Error):**

```json
{
  "message": "Error message describing the issue"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch) Example:**

```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const response = await fetch("http://localhost:5001/api/auth/logout", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
console.log(data.message); // "Logged out"
```

---

## Status Codes

| Code | Status       | Meaning                                 |
| ---- | ------------ | --------------------------------------- |
| 200  | OK           | Request successful                      |
| 201  | Created      | Resource created successfully           |
| 400  | Bad Request  | Invalid input or validation error       |
| 401  | Unauthorized | Missing or invalid authentication token |
| 500  | Server Error | Internal server error                   |

---

## Error Handling

### Validation Errors

When request validation fails, the API returns a 400 status with an array of errors:

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid",
      "msg": "Error message",
      "path": "fieldName",
      "location": "body"
    }
  ]
}
```

### Authentication Errors

When token is missing, invalid, or blacklisted:

```json
{
  "message": "Unauthorized"
}
```

### Server Errors

When an unexpected error occurs:

```json
{
  "message": "Error description"
}
```

---

## Response Headers

All responses include standard headers:

```
Content-Type: application/json
X-Powered-By: Express
```

Successful login also sets:

```
Set-Cookie: token=<jwt_token>; Path=/; HttpOnly; Max-Age=86400
```

---

## Rate Limiting

Currently not implemented. Recommended for production.

---

## Token Details

### Token Format

JWT tokens consist of three parts separated by dots: `header.payload.signature`

**Header:**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "iat": 1686908400,
  "exp": 1686994800
}
```

### Token Lifetime

- **Expiration**: 24 hours
- **Issued At**: When token is generated
- **Secret**: From `JWT_SECRET` environment variable

---

## Testing the API

### Using Postman

1. Create a new collection
2. Add requests for each endpoint
3. In Login request, extract token from response
4. Use token in Authorization tab for protected endpoints

### Using cURL

See individual endpoint examples above.

### Using Thunder Client (VS Code)

Similar to Postman with built-in VS Code integration.

---

## Security Notes

- **Never expose tokens** in logs or version control
- **Use HTTPS** in production
- **Store tokens securely** on the client (HttpOnly cookies recommended)
- **Rotate JWT_SECRET** periodically
- **Never send passwords** in unencrypted requests
- **Implement rate limiting** to prevent brute force attacks

---

## Changelog

| Version | Date      | Changes         |
| ------- | --------- | --------------- |
| 1.0.0   | June 2026 | Initial release |
