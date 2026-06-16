# Database Documentation

Complete reference for MongoDB schemas, data models, and database operations.

## Database Overview

**Database Type:** MongoDB (NoSQL Document Database)  
**ORM/ODM:** Mongoose 9.7+  
**Connection:** Configured via `MONGO_URI` environment variable

---

## Collections

### 1. Users Collection

Store user account information with secure password hashing.

#### Schema Definition

```javascript
{
  _id: ObjectId,
  fullname: {
    firstname: String,      // Required, Min: 3 characters
    lastname: String        // Optional, Min: 3 characters
  },
  email: String,           // Required, Unique
  password: String,        // Required, Hashed with bcrypt
  socketId: String,        // Optional, for WebSocket connections
  createdAt: Date,         // Auto-generated timestamp
  updatedAt: Date,         // Auto-generated on changes
  __v: Number              // Mongoose version key
}
```

#### Field Details

| Field                | Type     | Required | Unique | Constraints    | Notes                       |
| -------------------- | -------- | -------- | ------ | -------------- | --------------------------- |
| `_id`                | ObjectId | ✅       | ✅     | Auto-generated | MongoDB default primary key |
| `fullname.firstname` | String   | ✅       | ❌     | Min 3 chars    | User's first name           |
| `fullname.lastname`  | String   | ❌       | ❌     | Min 3 chars    | User's last name            |
| `email`              | String   | ✅       | ✅     | Valid email    | Used for login              |
| `password`           | String   | ✅       | ❌     | Hashed only    | Never selected by default   |
| `socketId`           | String   | ❌       | ❌     | -              | For real-time features      |
| `createdAt`          | Date     | ✅       | ❌     | Auto           | Registration timestamp      |
| `updatedAt`          | Date     | ✅       | ❌     | Auto           | Last modified timestamp     |

#### Example Document

```json
{
  "_id": {
    "$oid": "507f1f77bcf86cd799439011"
  },
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "$2b$10$kI1S1qM8L0xN2pQ3rL5sT6uV7wX8yZ9a0bC1dE2fG3hI4jK5lM6nO",
  "socketId": null,
  "createdAt": {
    "$date": "2026-06-16T10:30:00.000Z"
  },
  "updatedAt": {
    "$date": "2026-06-16T10:30:00.000Z"
  },
  "__v": 0
}
```

#### Indexes

**Unique Index on Email:**

```javascript
{
  email: 1;
} // Unique
```

**Default Index on Timestamps:**

```javascript
{
  createdAt: 1;
}
{
  updatedAt: 1;
}
```

#### Mongoose Methods

**Instance Methods:**

```javascript
// Generate JWT token for authentication
user.generateAuthToken();
// Returns: JWT token string
// Usage: Called after login/registration

// Compare plain password with hashed password
await user.comparePassword(plainPassword);
// Parameters: plainPassword (string)
// Returns: boolean
// Usage: Called during login
```

**Static Methods:**

```javascript
// Hash password using bcrypt
await UserModel.hashPassword(plainPassword);
// Parameters: plainPassword (string)
// Returns: Hashed password string
// Usage: Called before storing password
```

**Query Examples:**

```javascript
// Find user by email (excludes password by default)
const user = await UserModel.findOne({ email: "john@example.com" });

// Find user by email and include password
const user = await UserModel.findOne({ email: "john@example.com" }).select(
  "+password",
);

// Find user by ID
const user = await UserModel.findById("507f1f77bcf86cd799439011");

// Find all users created after a date
const users = await UserModel.find({
  createdAt: { $gt: new Date("2026-01-01") },
});

// Find and update
const user = await UserModel.findByIdAndUpdate(
  userId,
  { $set: { socketId: "socket123" } },
  { new: true },
);
```

---

### 2. Blacklisttokes Collection

Maintain a list of invalidated JWT tokens to prevent their reuse.

#### Schema Definition

```javascript
{
  _id: ObjectId,
  token: String,        // Required, JWT token string
  createdAt: Date       // Auto-generated, expires after 86400 seconds
}
```

#### Field Details

| Field       | Type     | Required | TTL          | Notes                 |
| ----------- | -------- | -------- | ------------ | --------------------- |
| `_id`       | ObjectId | ✅       | -            | Auto-generated        |
| `token`     | String   | ✅       | -            | Full JWT token string |
| `createdAt` | Date     | ✅       | 86400s (24h) | Auto-expires document |

#### Indexes

**TTL Index (Time To Live):**

```javascript
{
  createdAt: 1;
} // TTL: 86400 seconds
```

This index automatically removes documents 24 hours after creation, matching JWT expiration.

#### Example Document

```json
{
  "_id": {
    "$oid": "507f1f77bcf86cd799439012"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE2ODY5MDg0MDAsImV4cCI6MTY4Njk5NDgwMH0.xk7...",
  "createdAt": {
    "$date": "2026-06-16T11:00:00.000Z"
  }
}
```

#### Query Examples

```javascript
// Add token to blacklist
await blacklistToken.create({ token: tokenString });

// Check if token is blacklisted
const blacklistedToken = await blacklistToken.findOne({ token: tokenString });

// Find all blacklisted tokens (shouldn't be needed, TTL handles cleanup)
const allBlacklisted = await blacklistToken.find({});

// Manually delete old blacklisted tokens (optional, TTL index handles this)
await blacklistToken.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 86400000) },
});
```

---

## Database Operations

### Connection Flow

```javascript
// File: src/db/connectDB.js
import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database is connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1); // Exit if connection fails
  }
}
```

### Connection String Examples

**Local MongoDB:**

```
mongodb://localhost:27017/uber
```

**MongoDB Atlas (Cloud):**

```
mongodb+srv://username:password@cluster.mongodb.net/uber?retryWrites=true&w=majority
```

**Docker Container:**

```
mongodb://mongodb:27017/uber
```

---

## CRUD Operations

### Create (Registration)

```javascript
// In userService.createUser()
const user = await UserModel.create({
  fullname: {
    firstname: "John",
    lastname: "Doe",
  },
  email: "john@example.com",
  password: hashedPassword, // Pre-hashed with bcrypt
});
```

### Read (Login)

```javascript
// Fetch user with password for verification
const user = await UserModel.findOne({ email }).select("+password");
```

### Read (Profile)

```javascript
// Fetch user without password
const user = await UserModel.findById(userId);
// Password not included due to .select(false) in schema
```

### Update (Future Implementation)

```javascript
// Update user profile
const user = await UserModel.findByIdAndUpdate(
  userId,
  { $set: { "fullname.lastname": "Smith" } },
  { new: true }, // Return updated document
);
```

### Delete (Future Implementation)

```javascript
// Delete user account
await UserModel.findByIdAndDelete(userId);
```

---

## Data Validation

### Mongoose Schema Validation

```javascript
// User Schema Validation
fullname: {
  firstname: {
    type: String,
    required: true,
    minlength: [3, "first name must be at least 3 characters"]
  },
  lastname: {
    type: String,
    minlength: [3, "last name must be at least 3 characters"]
  }
}

email: {
  type: String,
  required: true,
  unique: true  // MongoDB enforces uniqueness
}

password: {
  type: String,
  required: true,
  select: false  // Exclude from queries by default
}
```

### Express-Validator Validation

```javascript
// In routes
[
  body("email").isEmail().withMessage("Invalid Email"),
  body("fullname.firstname")
    .isLength({ min: 3 })
    .withMessage("first name must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
];
```

---

## Indexes and Performance

### Current Indexes

```javascript
// users collection
{
  _id: 1; // Default primary key index
}

// Unique index on email (created by mongoose)
{
  email: 1; // Unique
}

// blacklisttokes collection
{
  createdAt: 1; // TTL index
}
```

### Recommended Additional Indexes

```javascript
// For faster timestamp-based queries
db.users.createIndex({ createdAt: 1 });
db.users.createIndex({ updatedAt: 1 });

// For token lookup in blacklist
db.blacklisttokes.createIndex({ token: 1 });
```

### Query Performance Tips

1. **Use `.select()` to limit fields:**

   ```javascript
   // Good - fetches only needed fields
   const user = await UserModel.findById(id).select("fullname email");

   // Avoid - fetches all fields including large data
   const user = await UserModel.findById(id);
   ```

2. **Use `.lean()` for read-only queries:**

   ```javascript
   // Returns plain JavaScript objects (faster)
   const user = await UserModel.findById(id).lean();
   ```

3. **Use proper query operators:**
   ```javascript
   // Find users created in last 7 days
   const users = await UserModel.find({
     createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
   });
   ```

---

## Backup and Recovery

### MongoDB Backup (mongodump)

```bash
# Backup entire database
mongodump --uri "mongodb://localhost:27017/uber" --out ./backup

# Backup specific collection
mongodump --uri "mongodb://localhost:27017/uber" --collection users --out ./backup
```

### MongoDB Restore (mongorestore)

```bash
# Restore entire backup
mongorestore --uri "mongodb://localhost:27017/uber" ./backup

# Restore specific collection
mongorestore --uri "mongodb://localhost:27017/uber" --collection users ./backup/uber/users.bson
```

### Atlas (Cloud) Backup

1. Use MongoDB Atlas built-in backup features
2. Configure backup frequency in Atlas dashboard
3. Automatic backups retained for 7-35 days depending on plan

---

## Data Migration Examples

### Add new field to existing users

```javascript
// Migration script
db.users.updateMany({}, { $set: { preferences: {} } });
```

### Change email of specific user

```javascript
const userId = ObjectId("507f1f77bcf86cd799439011");
await UserModel.findByIdAndUpdate(
  userId,
  { $set: { email: "newemail@example.com" } },
  { new: true },
);
```

### Rename field

```javascript
db.users.updateMany({}, { $rename: { oldField: "newField" } });
```

---

## Monitoring and Maintenance

### Check Database Size

```javascript
// In MongoDB shell
db.stats();

// Check collection size
db.users.stats();
```

### Monitor Indexes

```javascript
// In MongoDB shell
db.users.getIndexes();
db.blacklisttokes.getIndexes();
```

### Find Slow Queries

```javascript
// Enable profiling
db.setProfilingLevel(1); // Log slow queries

// View slow queries
db.system.profile.find({ millis: { $gt: 100 } }).pretty();
```

---

## Security Best Practices

### 1. Connection Security

- Use encrypted connections: `mongodb+srv://` for Atlas
- Enable IP whitelist in MongoDB Atlas
- Use strong database passwords

### 2. Data Protection

- Enable database-level encryption (Atlas)
- Use MongoDB field-level encryption for sensitive data
- Regular backups to secure locations

### 3. Access Control

- Use database users with limited privileges
- Don't use admin credentials in application
- Rotate database passwords regularly

### 4. Query Security

- Use parameterized queries (Mongoose prevents injection)
- Validate all input before database queries
- Use `.select()` to limit data exposure

---

## Troubleshooting

### Common Issues

**Duplicate Key Error**

```json
{
  "code": 11000,
  "errmsg": "E11000 duplicate key error"
}
```

**Solution**: Ensure unique fields (email) are not duplicated. Drop and recreate index if needed.

**Connection Timeout**

```
MongoNetworkError: connection timeout
```

**Solution**:

- Check MONGO_URI is correct
- Verify MongoDB service is running
- Check network connectivity
- For Atlas, verify IP whitelist

**No TTL Index on Blacklist**

```javascript
// Verify TTL index exists
db.blacklisttokes.getIndexes();

// Recreate if missing
db.blacklisttokes.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });
```

---

## Database Diagram

```
┌─────────────────────────────┐
│    MongoDB Database (uber)   │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │    users collection   │  │
│  ├───────────────────────┤  │
│  │ _id (ObjectId) [PK]   │  │
│  │ fullname              │  │
│  │  ├─ firstname         │  │
│  │  └─ lastname          │  │
│  │ email (unique)        │  │
│  │ password (hashed)     │  │
│  │ socketId              │  │
│  │ createdAt             │  │
│  │ updatedAt             │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ blacklisttokes        │  │
│  │ collection            │  │
│  ├───────────────────────┤  │
│  │ _id (ObjectId)        │  │
│  │ token (JWT string)    │  │
│  │ createdAt (TTL Index) │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

---

## Environment Configuration

Required environment variable in `.env`:

```env
MONGO_URI=mongodb://localhost:27017/uber
```

Connection is established in `src/db/connectDB.js` on server startup.
