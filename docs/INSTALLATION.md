# Installation & Setup Guide

Step-by-step instructions for setting up the Uber Backend API project.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Development Setup](#development-setup)

---

## System Requirements

### Minimum Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (or yarn)
- **RAM**: 512 MB minimum
- **Disk Space**: 500 MB minimum

### Recommended Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **RAM**: 2 GB or higher
- **Disk Space**: 1 GB or higher

### Supported Operating Systems

- ✅ Windows (10, 11)
- ✅ macOS (10.15+)
- ✅ Linux (Ubuntu 18.04+, Debian 10+)

---

## Prerequisites

Before installation, ensure you have:

### 1. Node.js & npm

**Check if installed:**

```bash
node --version
npm --version
```

**Install Node.js:**

**Windows:**

- Download from [nodejs.org](https://nodejs.org/)
- Run installer and follow prompts
- Restart terminal/command prompt

**macOS:**

```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install nodejs npm
```

### 2. MongoDB

**Option A: Local MongoDB Installation**

**Windows:**

1. Download installer from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run installer and follow setup wizard
3. MongoDB will run as a service automatically

**macOS:**

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux (Ubuntu):**

```bash
# Add MongoDB repository
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on boot
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create a free cluster
3. Get connection string (will be used in .env)

**Option C: Docker**

```bash
# Install Docker (if not already installed)
# Then run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify MongoDB is running
docker ps | grep mongodb
```

### 3. Git (Optional)

For cloning the repository:

**Windows/macOS:**
Download from [git-scm.com](https://git-scm.com/)

**Linux:**

```bash
sudo apt-get install git
```

### 4. Code Editor

- [Visual Studio Code](https://code.visualstudio.com/) (Recommended)
- WebStorm
- Sublime Text
- Any text editor of choice

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/yourusername/uber-backend.git

# Navigate to project directory
cd uber
```

**Alternative: Manual Download**

If not using Git, download the ZIP file and extract it.

### Step 2: Verify Project Structure

Ensure the project structure looks correct:

```
uber/
├── server.js
├── package.json
├── README.md
├── src/
│   ├── app.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   └── db/
└── docs/
```

### Step 3: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn (if installed)
yarn install
```

This will:

- Download all dependencies listed in package.json
- Create `node_modules/` folder
- Generate `package-lock.json` (npm) or `yarn.lock` (yarn)

**Expected output:**

```
added 156 packages in 45s
```

### Step 4: Verify Installation

```bash
# Check Node.js and npm versions
node --version
npm --version

# Check installed packages
npm list

# Check MongoDB connection
# (Will verify in next steps)
```

---

## Configuration

### Step 1: Create Environment File

**Windows (Command Prompt):**

```bash
copy .env.example .env
# If .env.example doesn't exist, create manually
```

**Windows (PowerShell):**

```bash
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

**If no .env.example exists, create .env manually:**

```bash
# Create empty .env file
touch .env  # macOS/Linux
# or
echo. > .env  # Windows
```

### Step 2: Configure Environment Variables

**Edit .env file with your text editor:**

```env
# Server Configuration
PORT=5001

# Database Configuration
MONGO_URI=mongodb://localhost:27017/uber

# JWT Configuration
JWT_SECRET=your_secure_random_string_here_minimum_32_chars_recommended

# Environment
NODE_ENV=development
```

#### Configuration Details

**PORT**

- Default: `5001`
- Change if port is already in use
- Must be a number between 1024-65535

**MONGO_URI**

**For Local MongoDB:**

```
mongodb://localhost:27017/uber
```

**For MongoDB Atlas (Cloud):**

```
mongodb+srv://username:password@cluster.mongodb.net/uber?retryWrites=true&w=majority
```

**For Docker MongoDB:**

```
mongodb://mongodb:27017/uber
```

**JWT_SECRET**

Generate a strong random string:

**Online generator:**
Use [random.org](https://www.random.org/strings/)

**Command line:**

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}) -as [byte[]])
```

**Example JWT_SECRET:**

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t
```

⚠️ **IMPORTANT**: Never use the same JWT_SECRET in production as development!

**NODE_ENV**

- `development` - For local development
- `production` - For live server

### Step 3: Verify Configuration

```bash
# Test MongoDB connection manually
mongosh mongodb://localhost:27017/uber

# If connected, you'll see:
# uber>

# Exit MongoDB shell
exit
```

---

## Database Setup

### Step 1: Create Database

MongoDB automatically creates the database when first document is inserted. Skip manual creation.

### Step 2: Create Collections

Collections are created automatically by Mongoose when the application starts.

### Step 3: Verify Database Setup

After starting the server (see next section), verify collections were created:

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/uber

# Show collections
show collections

# Expected output:
# users
# blacklisttokes

# Check users collection
db.users.find()

# Exit
exit
```

### Step 4: Database Backups (Optional)

```bash
# Create backup directory
mkdir backups

# Backup database
mongodump --uri "mongodb://localhost:27017/uber" --out ./backups/$(date +%Y%m%d)
```

---

## Running the Application

### Step 1: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
node server.js
```

**Expected output:**

```
App is running on port 5001
database is connected
```

### Step 2: Verify Server is Running

**Test in new terminal:**

```bash
# macOS/Linux
curl http://localhost:5001/

# Windows PowerShell
curl http://localhost:5001/

# Expected response:
# hellow world
```

### Step 3: Test API Endpoint

**Register a new user:**

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected response:**

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
    ...
  }
}
```

---

## Verification

### Checklist

- [ ] Node.js v14+ installed
- [ ] npm/yarn installed
- [ ] MongoDB running and accessible
- [ ] Project dependencies installed (npm install completed)
- [ ] .env file created with correct values
- [ ] Server starts without errors (npm run dev)
- [ ] Base endpoint responds (curl http://localhost:5001/)
- [ ] API endpoint works (POST /api/auth/register successful)
- [ ] MongoDB collections created (show collections in mongosh)

### Common Verification Commands

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"

# Test API
curl http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Test","lastname":"User"},"email":"test@example.com","password":"password123"}'
```

---

## Troubleshooting

### Issue: "Port already in use"

**Error:**

```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solution 1: Change port**

```bash
PORT=5002 npm run dev
```

**Solution 2: Kill process using port**

**Windows:**

```bash
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

**macOS/Linux:**

```bash
lsof -i :5001
kill -9 <PID>
```

### Issue: "Cannot find module"

**Error:**

```
Error: Cannot find module 'express'
```

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "MongoDB connection failed"

**Error:**

```
MongoNetworkError: connect ECONNREFUSED
```

**Solutions:**

1. **Check MongoDB is running:**

   ```bash
   # macOS
   brew services list | grep mongodb

   # Linux
   sudo systemctl status mongod

   # Windows
   # Check Services app or Task Manager
   ```

2. **Verify MONGO_URI in .env:**

   ```
   MONGO_URI=mongodb://localhost:27017/uber
   ```

3. **Test connection manually:**

   ```bash
   mongosh mongodb://localhost:27017/uber
   ```

4. **Check MongoDB logs:**

   ```bash
   # macOS
   cat /usr/local/var/log/mongodb/mongo.log

   # Linux
   sudo journalctl -u mongod -n 20
   ```

### Issue: "JWT_SECRET not defined"

**Error:**

```
TypeError: Cannot read property 'JWT_SECRET' of undefined
```

**Solution:**

1. Verify .env file exists in root directory
2. Check .env contains: `JWT_SECRET=your_secret_here`
3. Restart server: `npm run dev`

### Issue: "Validation errors on registration"

**Error:**

```json
{
  "errors": [
    {
      "msg": "first name must be at least 3 characters long"
    }
  ]
}
```

**Solution:**

Ensure all fields meet requirements:

- firstname: minimum 3 characters
- email: valid email format
- password: minimum 6 characters

---

## Development Setup

### Step 1: Install Development Dependencies

```bash
# Install nodemon globally (optional)
npm install -g nodemon

# Or use via npx
npx nodemon server.js
```

### Step 2: Configure VS Code (Optional)

**Create .vscode/settings.json:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**Install Extensions:**

- ES7+ React/Redux/React-Native snippets
- Mongoose Snippets
- REST Client (for API testing)
- Thunder Client (for API testing)

### Step 3: Configure Postman (Optional)

1. Create collection "Uber API"
2. Add environment variable:
   ```json
   {
     "base_url": "http://localhost:5001/api/auth",
     "token": ""
   }
   ```
3. Create requests:
   - POST /register
   - POST /login
   - GET /getProfile
   - GET /logout

### Step 4: Git Setup (Optional)

```bash
# Initialize git
git init

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
.env.*.local
/dist/
/build/
.DS_Store
*.log
EOF

# Initial commit
git add .
git commit -m "Initial commit"
```

### Step 5: NPM Scripts Enhancement (Optional)

**Add to package.json:**

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/"
  }
}
```

---

## Docker Setup (Optional)

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "run", "dev"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "5001:5001"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/uber
      - JWT_SECRET=your_secret_here
      - NODE_ENV=development
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

**Run with Docker Compose:**

```bash
# Start services
docker-compose up

# Stop services
docker-compose down
```

---

## Deployment Preparation

### Pre-deployment Checklist

- [ ] Test all endpoints locally
- [ ] Create strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB URI
- [ ] Set secure CORS origins
- [ ] Enable HTTPS (use reverse proxy)
- [ ] Implement rate limiting
- [ ] Set up error logging
- [ ] Configure backups
- [ ] Document deployment steps

### Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/uber
JWT_SECRET=very_long_and_complex_secret_string
CORS_ORIGIN=https://yourdomain.com
```

---

## Next Steps

1. **Read API Documentation**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. **Understand Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Database Details**: See [DATABASE.md](DATABASE.md)
4. **Start Development**: Begin implementing features

---

## Support

For installation issues:

1. Check error messages carefully
2. Review troubleshooting section above
3. Check MongoDB logs
4. Verify all prerequisites are installed
5. Try reinstalling dependencies

**Still need help?**

- Check project README.md
- Review MongoDB documentation
- Check Express documentation
- Open an issue in the repository
