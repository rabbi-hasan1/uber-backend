# Security Policy

## Overview

This document outlines security practices, vulnerability reporting procedures, and recommendations for securing the Uber Backend API.

---

## Table of Contents

- [Security Best Practices](#security-best-practices)
- [Vulnerability Reporting](#vulnerability-reporting)
- [Security Features](#security-features)
- [Common Vulnerabilities](#common-vulnerabilities)
- [Production Checklist](#production-checklist)
- [Dependencies](#dependencies)
- [Security Maintenance](#security-maintenance)

---

## Security Best Practices

### 1. Environment Variables

✅ **DO:**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uber
JWT_SECRET=very_long_random_string_minimum_32_characters
NODE_ENV=production
PORT=5000
```

❌ **DON'T:**

- Commit `.env` files to version control
- Use simple/predictable secrets
- Share secrets in chat or email
- Use same secret for multiple environments
- Log sensitive data

### 2. Password Security

**Current Implementation:**

- Bcrypt with 10 salt rounds
- Passwords hashed before storage
- Passwords excluded from queries

**Recommendations:**

- Enforce minimum 8-character passwords
- Require mixed case, numbers, and symbols
- Implement password history
- Add password strength meter
- Implement account lockout after failed attempts

```javascript
// Recommended password validation
const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};
```

### 3. JWT Token Security

**Current Implementation:**

- HS256 algorithm
- 24-hour expiration
- Token blacklisting on logout

**Recommendations:**

- Use RS256 (asymmetric) in production
- Implement refresh token rotation
- Store tokens in HttpOnly cookies
- Add token fingerprinting
- Monitor unusual token usage patterns

```javascript
// Current
const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
  expiresIn: "24h",
});

// Recommended for production
const token = jwt.sign(
  { _id: this._id, fingerprint: generateFingerprint() },
  process.env.JWT_PRIVATE_KEY,
  {
    expiresIn: "15m",
    algorithm: "RS256",
  },
);
```

### 4. Database Security

```env
# MongoDB Security
MONGO_URI=mongodb+srv://limited_user:strong_password@cluster.mongodb.net/uber?authSource=admin&retryWrites=true

# Connection Options
# - Use authentication
# - Enable encryption (TLS/SSL)
# - Use IP whitelisting
# - Enable database logging
# - Regular backups to secure location
```

**Backup Strategy:**

```bash
# Daily backups
mongodump --uri "mongodb+srv://..." --out ./backups/$(date +%Y%m%d)

# Store backups securely (encrypted, separate location)
```

### 5. CORS Configuration

**Current Implementation:**

```javascript
app.use(cors()); // ⚠️ Allows all origins
```

**Recommended for Production:**

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || "https://yourdomain.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

### 6. Rate Limiting

**Recommended Implementation:**

```javascript
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
});

app.post("/api/auth/login", loginLimiter, userController.login);
app.use("/api/", apiLimiter);
```

### 7. Input Validation

**Current Implementation:**

```javascript
[body("email").isEmail(), body("password").isLength({ min: 6 })];
```

**Enhanced Validation:**

```javascript
[
  body("email")
    .isEmail()
    .normalizeEmail()
    .custom((value) => {
      // Check for disposable emails
      if (isDisposableEmail(value)) {
        throw new Error("Disposable email not allowed");
      }
    }),

  body("password")
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .trim(),

  body("fullname.firstname").trim().escape().isLength({ min: 3, max: 50 }),
];
```

### 8. SQL/NoSQL Injection Prevention

✅ **Current Implementation:**

- Mongoose prevents injection automatically
- No raw queries

✅ **Maintain:**

- Always use Mongoose queries
- Never use string interpolation in queries
- Sanitize user input

❌ **Avoid:**

```javascript
// DANGEROUS - Don't do this!
const user = db
  .collection("users")
  .findOne({ $where: `this.email == "${userInput}"` });
```

### 9. Cross-Site Request Forgery (CSRF)

**Current Implementation:**

- Stateless JWT authentication
- Token sent in header/cookie

**Enhancement:**

```javascript
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(csrf({ cookie: true }));
```

### 10. Logging and Monitoring

**What to Log:**

- Failed login attempts
- Token validation failures
- Database errors
- Rate limit violations

**What NOT to Log:**

- Passwords
- API keys/secrets
- Tokens
- Sensitive user data

```javascript
// Good logging
console.log(`User ${userId} failed login: invalid password`);

// Bad logging
console.log(`User login failed with password: ${password}`);
```

---

## Vulnerability Reporting

### Reporting a Security Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue.

Instead, email: **security@example.com**

**Include in your report:**

- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)
- Your contact information

### Response Timeline

- **Initial Response**: Within 24 hours
- **Assessment**: Within 72 hours
- **Fix Target**: Within 7-14 days
- **Disclosure**: After fix is released

### Responsible Disclosure

We follow responsible disclosure practices:

1. Receive vulnerability report
2. Confirm and assess
3. Develop fix
4. Test thoroughly
5. Release fix
6. Publish disclosure with credit

---

## Security Features

### Currently Implemented ✅

| Feature                | Status         | Details                          |
| ---------------------- | -------------- | -------------------------------- |
| HTTPS Support          | ⚠️ Recommended | Use reverse proxy (Nginx/Apache) |
| Password Hashing       | ✅             | Bcrypt with 10 salt rounds       |
| JWT Authentication     | ✅             | 24-hour token expiration         |
| Token Blacklisting     | ✅             | Logout invalidates tokens        |
| Input Validation       | ✅             | Express-validator                |
| CORS                   | ⚠️             | Currently allows all origins     |
| HTTP-only Cookies      | ✅             | Token storage support            |
| Password Field Privacy | ✅             | Excluded from queries            |

### Recommended Additions

| Feature            | Priority | Implementation       |
| ------------------ | -------- | -------------------- |
| Rate Limiting      | High     | Express-rate-limit   |
| HTTPS Enforcement  | High     | Reverse proxy        |
| Request Logging    | High     | Morgan or Winston    |
| Helmet Middleware  | High     | Helmet.js            |
| Two-Factor Auth    | Medium   | TOTP/SMS             |
| Email Verification | Medium   | Nodemailer           |
| Request Signing    | Medium   | HMAC signatures      |
| API Keys           | Low      | Separate auth system |

---

## Common Vulnerabilities

### 1. Brute Force Attacks

**Risk:** Attacker guesses password through repeated login attempts

**Mitigation:**

```javascript
// Implement rate limiting (see section above)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});
```

### 2. Token Hijacking

**Risk:** Attacker obtains and uses valid token

**Mitigation:**

- Use HTTPS only
- Store in HttpOnly cookies
- Short expiration times
- Token rotation on refresh

### 3. Weak Password

**Risk:** User accounts compromised by simple passwords

**Mitigation:**

- Enforce password strength requirements
- Password history
- Periodic password changes
- Breach database checks

### 4. Unauthorized Access

**Risk:** Access to protected resources without valid token

**Mitigation:**

- Proper token verification (already implemented)
- RBAC (Role-Based Access Control)
- Field-level permissions

### 5. Data Exposure

**Risk:** Sensitive data leaked through logs or errors

**Mitigation:**

- Don't log passwords, tokens, API keys
- Mask sensitive data in error messages
- Encrypt sensitive fields in database
- Use secure data transmission

### 6. Dependency Vulnerabilities

**Risk:** Known vulnerabilities in third-party packages

**Mitigation:**

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update packages regularly
npm update

# Monitor dependencies
npm outdated
```

---

## Production Checklist

Before deploying to production, verify:

### Security

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] NODE_ENV=production
- [ ] HTTPS enabled (reverse proxy)
- [ ] CORS restricted to allowed origins
- [ ] Rate limiting implemented
- [ ] Request logging configured
- [ ] Error messages don't expose internals
- [ ] .env file is NOT in version control

### Database

- [ ] MongoDB authentication enabled
- [ ] Database user has limited privileges
- [ ] Database backups configured
- [ ] Encryption at rest enabled
- [ ] Connection uses TLS/SSL
- [ ] IP whitelisting enabled

### Performance & Monitoring

- [ ] Response time tracking
- [ ] Error rate monitoring
- [ ] Security event logging
- [ ] Performance metrics
- [ ] Uptime monitoring
- [ ] Alert system configured

### Infrastructure

- [ ] Load balancing configured
- [ ] Auto-scaling policies set
- [ ] Firewall rules configured
- [ ] WAF (Web Application Firewall) enabled
- [ ] DDoS protection active
- [ ] CDN configured (if applicable)

### Compliance

- [ ] Privacy policy published
- [ ] Terms of service agreed
- [ ] Data retention policy defined
- [ ] GDPR/Privacy laws compliant
- [ ] Audit logging enabled

---

## Dependencies

### Current Dependencies

```json
{
  "bcrypt": "^6.0.0", // ✅ Secure password hashing
  "cookie-parser": "^1.4.7", // ✅ Cookie handling
  "cors": "^2.8.6", // ⚠️ No origin restriction
  "dotenv": "^17.4.2", // ✅ Environment variables
  "express": "^5.2.1", // ✅ Latest version
  "express-validator": "^7.3.2", // ✅ Input validation
  "jsonwebtoken": "^9.0.3", // ✅ JWT creation/verification
  "mongoose": "^9.7.0" // ✅ MongoDB ODM
}
```

### Recommended Additional Dependencies

```json
{
  "helmet": "^7.0.0", // HTTP security headers
  "express-rate-limit": "^7.0.0", // Rate limiting
  "morgan": "^1.10.0", // Request logging
  "dotenv": "^17.0.0", // Already installed
  "joi": "^17.0.0", // Schema validation
  "bcryptjs": "^2.4.3" // Alternative to bcrypt
}
```

### Security Audits

```bash
# Check for vulnerabilities
npm audit

# Output example:
# 0 vulnerabilities found

# Update packages with security patches
npm update
npm audit fix

# Check outdated packages
npm outdated
```

---

## Security Maintenance

### Regular Tasks

**Weekly:**

- Review error logs for suspicious activity
- Check failed login attempts
- Monitor rate limit violations

**Monthly:**

- Run `npm audit`
- Update dependencies
- Review access logs
- Test backup restoration

**Quarterly:**

- Security assessment
- Penetration testing (external)
- Dependency audit
- Access control review

**Annually:**

- Full security audit
- Compliance review
- Architecture security review
- Team security training

### Updates and Patches

```bash
# Check for updates
npm outdated

# Update patches only (safe)
npm update

# Update minor version (test first)
npm install package@^x.y.z

# Major version update (review breaking changes first)
npm install package@x.y.z
```

### Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Mongoose Security](https://mongoosejs.com/docs/api.html)

---

## Contact

For security concerns:

📧 **Email:** security@example.com

**Please do not:**

- Open public GitHub issues for security vulnerabilities
- Post on social media
- Share vulnerability details publicly

---

**Last Updated:** June 16, 2026  
**Version:** 1.0.0
