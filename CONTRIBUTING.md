# Contributing Guidelines

Thank you for contributing to the Uber Backend API project! This document provides guidelines for contributing code and documentation.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Report issues professionally
- Help others learn and grow

---

## Getting Started

### 1. Fork the Repository

Click "Fork" on GitHub to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/yourusername/uber-backend.git
cd uber
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/original/uber-backend.git
```

### 4. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation
```

### 5. Set Up Development Environment

```bash
npm install
npm run dev
```

---

## Development Workflow

### 1. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Make Your Changes

Write clean, maintainable code. See Code Standards section.

### 3. Test Your Changes

```bash
# Manual testing
npm run dev

# Run test suite (when available)
npm test
```

### 4. Commit Your Changes

See Commit Messages section for guidelines.

```bash
git add .
git commit -m "feat: add new authentication feature"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Go to GitHub and create a PR with a descriptive title and description.

---

## Code Standards

### JavaScript Style Guide

#### Naming Conventions

```javascript
// Functions: camelCase
function registerUser() {}
const loginUser = () => {};

// Classes/Constructors: PascalCase
class UserModel {}
const UserController = {};

// Constants: UPPER_SNAKE_CASE
const MAX_PASSWORD_LENGTH = 128;
const JWT_EXPIRATION = "24h";

// Private variables: _leadingUnderscore
const _internalHelper = () => {};
```

#### Code Organization

```javascript
// 1. Imports at the top
import express from "express";
import UserModel from "../models/user.model.js";

// 2. Constants
const DEFAULT_PORT = 5001;

// 3. Variable declarations
let counter = 0;

// 4. Function declarations
function registerUser(req, res) {
  // Implementation
}

// 5. Exports at the bottom
export default registerUser;
```

#### Error Handling

```javascript
// Use try-catch for async operations
async function login(req, res) {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Success case
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
```

#### Comments

```javascript
// Use comments for "why", not "what"

// Good: Explains the reason
// We hash the password immediately to prevent storing plain text
const hashedPassword = await bcrypt.hash(password, 10);

// Avoid: Explains what is obvious
// Set hashedPassword variable
const hashedPassword = await bcrypt.hash(password, 10);

// Use JSDoc for functions
/**
 * Authenticates a user with email and password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
async function login(req, res) {
  // Implementation
}
```

#### File Structure

```javascript
// Maximum line length: 100 characters
// Indentation: 2 spaces
// No trailing whitespace

// Each file should have a single responsibility
// Keep functions small (< 30 lines ideally)
// Avoid deeply nested code (max 3 levels)
```

---

## Commit Messages

### Format

```
<type>: <subject>

<body>

<footer>
```

### Type

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting (no logic change)
- `refactor:` Code restructuring (no behavior change)
- `perf:` Performance improvement
- `test:` Test additions/changes
- `chore:` Build, dependencies, tools

### Subject

- Max 50 characters
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at end

### Body

- Wrap at 72 characters
- Explain what and why, not how
- Separate from subject with blank line

### Examples

```
feat: implement password reset functionality

Add ability for users to reset forgotten passwords via email.
Includes token generation, expiration, and validation.

Closes #123

---

fix: correct JWT token extraction from headers

The Authorization header parsing was incorrect when using
Bearer token format. Fixed by using split(" ")[1].

---

docs: update installation instructions for MongoDB Atlas

Added clear instructions for MongoDB Atlas cloud setup
with example connection strings.
```

---

## Pull Requests

### PR Title Format

```
[TYPE] Brief description

Examples:
[FEATURE] Add email verification
[FIX] Correct password hashing bug
[DOCS] Improve API documentation
```

### PR Description Template

```markdown
## Description

Brief explanation of changes

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring

## Related Issues

Closes #123

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing

How to test these changes:

1. Step 1
2. Step 2

## Screenshots (if applicable)

Add images showing UI changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass (if applicable)
- [ ] No breaking changes
```

### PR Review Process

1. Request review from maintainers
2. Address feedback promptly
3. Update PR description if scope changes
4. Ensure CI/CD passes
5. Squash commits if requested

---

## Testing

### Manual Testing

Test all endpoints affected by your changes:

```bash
# Start server
npm run dev

# Test registration
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Test","lastname":"User"},"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected route
curl -X GET http://localhost:5001/api/auth/getProfile \
  -H "Authorization: Bearer <token>"
```

### Automated Testing (Future)

When test suite is implemented:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Documentation

### Code Documentation

- Add JSDoc comments to all public functions
- Update README if adding features
- Document environment variables
- Add examples for complex logic

### External Documentation

Update relevant documentation files:

- `README.md` - For major features
- `docs/API_DOCUMENTATION.md` - For API changes
- `docs/ARCHITECTURE.md` - For architectural changes
- `docs/DATABASE.md` - For database changes
- `docs/INSTALLATION.md` - For setup changes

### Documentation Standards

- Use clear, concise English
- Include code examples
- Provide context and rationale
- Keep examples up-to-date
- Add troubleshooting if relevant

---

## Common Mistakes to Avoid

❌ **Committing secrets**

- Never commit .env files
- Never commit API keys or passwords
- Use environment variables

❌ **Large commits**

- Keep commits focused on single feature
- Easier to review and revert if needed

❌ **Unclear commit messages**

- Future developers need context
- Explain the "why" not just the "what"

❌ **Incomplete testing**

- Test edge cases
- Test error scenarios
- Manual test in development

❌ **Outdated documentation**

- Update docs with code changes
- Examples should work

---

## Getting Help

- **Questions?** Open a discussion
- **Found a bug?** Open an issue with details
- **Need clarification?** Ask in PR comments
- **Stuck?** Reach out to maintainers

---

## Recognition

Contributors will be recognized in:

- Project README
- Release notes
- Contributors page

Thank you for contributing! 🙏
