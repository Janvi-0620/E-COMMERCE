# Two-Factor Authentication (2FA) Implementation Guide

## Overview

A production-grade, **email-based Two-Factor Authentication (2FA)** system has been implemented. This provides an extra layer of security for user accounts.

---

## 🏗️ Architecture

### 2FA Flow

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: User Credentials                                │
├─────────────────────────────────────────────────────────┤
│ User enters email & password                             │
│ Server verifies credentials                              │
│ If valid, generates 6-digit OTP                          │
│ Sends OTP to user's email                                │
│ Returns tempToken (valid for OTP verification only)      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 2: OTP Verification                                │
├─────────────────────────────────────────────────────────┤
│ User receives OTP email                                  │
│ User enters OTP on login page                            │
│ Server verifies OTP (must match & not expired)           │
│ If valid, clears OTP and marks email as verified        │
│ Returns JWT token for API access                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Access Protected Resources                       │
├─────────────────────────────────────────────────────────┤
│ Client stores JWT in localStorage                        │
│ Client sends JWT in Authorization header                 │
│ Server verifies JWT and grants access                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 API Endpoints

### 1. Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "emailVerified": false,
    "isTwoFactorEnabled": true,
    "createdAt": "2024-01-15T10:30:45.123Z"
  },
  "message": "Registration successful. Please check your email."
}
```

---

### 2. Login (Step 1) - Send OTP
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200) - 2FA Enabled:**
```json
{
  "success": true,
  "data": {
    "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "requiresTwoFactor": true,
    "maskedEmail": "us***@example.com"
  },
  "message": "OTP sent to user@example.com"
}
```

**Response (200) - 2FA Disabled:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "role": "user"
    },
    "requiresTwoFactor": false
  },
  "message": "Login successful"
}
```

---

### 3. Verify OTP (Step 2) - Complete Login
```http
POST /api/v1/auth/verify-otp
Authorization: Bearer <tempToken>
Content-Type: application/json

{
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "role": "user",
      "emailVerified": true
    }
  },
  "message": "Login successful"
}
```

**Error (401) - Invalid OTP:**
```json
{
  "success": false,
  "message": "Invalid OTP. 4 attempts remaining"
}
```

**Error (401) - OTP Expired:**
```json
{
  "success": false,
  "message": "OTP has expired"
}
```

---

### 4. Resend OTP
```http
POST /api/v1/auth/resend-otp
Authorization: Bearer <tempToken>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "maskedEmail": "us***@example.com"
  },
  "message": "OTP resent to user@example.com"
}
```

**Error (400) - Rate Limited:**
```json
{
  "success": false,
  "message": "Please wait 45 seconds before requesting a new OTP"
}
```

---

### 5. Get Current User (Protected)
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "role": "user",
    "emailVerified": true,
    "isTwoFactorEnabled": true,
    "createdAt": "2024-01-15T10:30:45.123Z"
  },
  "message": "User fetched successfully"
}
```

---

### 6. Toggle 2FA (Protected)
```http
PUT /api/v1/auth/2fa/toggle
Authorization: Bearer <token>
Content-Type: application/json

{
  "enable": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "isTwoFactorEnabled": false
  },
  "message": "2FA has been disabled"
}
```

---

### 7. Logout (Protected)
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 8. Refresh Token
```http
POST /api/v1/refresh
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

---

## 🔐 Security Features

### 1. **Password Security**
- ✅ Minimum 8 characters
- ✅ Must contain uppercase letter (A-Z)
- ✅ Must contain lowercase letter (a-z)
- ✅ Must contain number (0-9)
- ✅ Must contain special character (@$!%*?&)
- ✅ Hashed with bcrypt (10 rounds by default)

### 2. **OTP Security**
- ✅ 6-digit OTP (000000-999999)
- ✅ Expires in 10 minutes (configurable)
- ✅ One-time use (cleared after verification)
- ✅ Rate limiting: 1 resend per 60 seconds
- ✅ Brute force protection: Locked after 5 failed attempts

### 3. **Account Protection**
- ✅ Login attempt rate limiting (5 attempts per 15 minutes)
- ✅ Temporary account lock on failed OTP attempts
- ✅ Temporary account lock on failed login attempts
- ✅ Email masking in responses (us***@example.com)
- ✅ Token expiration (7 days)

### 4. **Token Security**
- ✅ JWT with HS256 algorithm
- ✅ TempToken: Valid only for OTP verification (short-lived)
- ✅ JWT: Valid for API access (7 days by default)
- ✅ No sensitive fields in token payload
- ✅ Token signature verification on every request

### 5. **Email Security**
- ✅ OTP sent via SMTP (Gmail or custom SMTP)
- ✅ HTML email templates with proper styling
- ✅ Branding and security warnings included
- ✅ OTP display as large font for easy reading

---

## 📧 Email Configuration

### Gmail Setup (Recommended for Testing)

1. **Enable 2-Step Verification in Gmail**
   - Go to Google Account settings
   - Click "Security"
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to "App passwords" (https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Google generates a 16-character password
   - Use this as `SMTP_PASS` in `.env`

3. **Update .env**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password (16 characters)
SENDER_EMAIL=your-email@gmail.com
```

### Custom SMTP Server

```
SMTP_HOST=smtp.yourserver.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password
SENDER_EMAIL=noreply@yourdomain.com
```

---

## 💾 Database Schema

### User Model - 2FA Fields

```javascript
{
  // Basic Info
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (user/admin),

  // 2FA Fields
  isTwoFactorEnabled: Boolean (default: true),
  twoFactorSecret: String (optional, for TOTP),
  
  // OTP Fields
  otpCode: String (current 6-digit OTP),
  otpExpiresAt: Date (when OTP expires),
  otpAttempts: Number (failed verification attempts),
  otpAttemptsLockedUntil: Date (temporary lock),
  lastOtpSentAt: Date (prevent spam),
  
  // Email Verification
  emailVerified: Boolean (true after OTP verification),
  
  // Account Security
  isActive: Boolean,
  isLocked: Boolean,
  
  // Login History
  lastLogin: Date,
  lastLoginAttempt: Date,
  loginAttempts: Number,
  loginAttemptsLockedUntil: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing 2FA

### Using cURL

**1. Register**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**2. Login (Get OTP)**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Response includes tempToken
```

**3. Verify OTP**
```bash
curl -X POST http://localhost:5000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tempToken>" \
  -d '{
    "otp": "123456"
  }'

# Response includes JWT token
```

**4. Access Protected Route**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Create collection: "E-Commerce API"
2. Add requests:
   - POST /auth/register
   - POST /auth/login
   - POST /auth/verify-otp
   - GET /auth/me
   - POST /auth/logout

3. Set up environment variables:
   - base_url: http://localhost:5000/api/v1
   - tempToken: (from login response)
   - token: (from verify-otp response)

---

## 🚨 Error Handling

### Common Errors & Solutions

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| Invalid email or password | 401 | Wrong credentials | Verify email/password |
| OTP has expired | 401 | OTP older than 10 min | Use resend-otp endpoint |
| Invalid OTP | 401 | Wrong 6-digit code | Enter correct OTP |
| Account locked | 401 | Too many failed attempts | Wait 15 minutes |
| Too many requests | 400 | Rate limit exceeded | Wait before retrying |
| Email already registered | 409 | Email exists | Use different email |
| Missing required fields | 400 | Invalid request body | Check request format |

---

## 🔧 Configuration

### OTP Settings
```javascript
// In auth.service.js
const otpExpiration = 10; // minutes
const maxOTPAttempts = 5;
const otpLockDurationMinutes = 15;
```

### Login Rate Limiting
```javascript
// In config/constants.js
LOGIN_ATTEMPTS: {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts'
}
```

### Password Requirements
```javascript
// In auth.validation.js
const PASSWORD_PATTERN = 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

---

## 📊 Monitoring & Logging

All auth events are logged to `logs/YYYY-MM-DD.log`:

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "User registered: user@example.com"
}
```

Tracked events:
- ✅ User registration
- ✅ Login attempts (success/failure)
- ✅ OTP sent
- ✅ OTP verification (success/failure)
- ✅ 2FA toggle
- ✅ Token refresh
- ✅ Logout
- ❌ Failed OTP attempts
- ❌ Account lockouts
- ❌ Invalid tokens

---

## 🚀 Frontend Integration

### React Implementation Example

```javascript
// 1. Login
const login = async (email, password) => {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await res.json();
  
  if (data.data.requiresTwoFactor) {
    // Show OTP input
    localStorage.setItem('tempToken', data.data.tempToken);
  } else {
    // Save JWT and redirect
    localStorage.setItem('token', data.data.token);
  }
};

// 2. Verify OTP
const verifyOTP = async (otp) => {
  const tempToken = localStorage.getItem('tempToken');
  
  const res = await fetch('/api/v1/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tempToken}`
    },
    body: JSON.stringify({ otp })
  });
  
  const data = await res.json();
  localStorage.setItem('token', data.data.token);
};

// 3. Protected Request
const getUser = async () => {
  const token = localStorage.getItem('token');
  
  const res = await fetch('/api/v1/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await res.json();
};
```

---

## 📋 Checklist

### Implementation Complete ✅
- [x] User registration with 2FA enabled by default
- [x] Email-based OTP generation (6 digits)
- [x] OTP expiration (10 minutes)
- [x] OTP email sending via SMTP
- [x] OTP verification with rate limiting
- [x] Account lockout after failed attempts
- [x] Password hashing with bcrypt
- [x] JWT token generation
- [x] Protected routes with JWT verification
- [x] 2FA toggle functionality
- [x] Comprehensive error handling
- [x] Security logging
- [x] Email templates
- [x] Rate limiting
- [x] Input validation

### Next: Frontend Implementation 🔄
- [ ] Login page with email/password form
- [ ] OTP verification page
- [ ] Resend OTP button
- [ ] 2FA settings page
- [ ] Protected route component
- [ ] Redux integration for auth state
- [ ] Token storage (localStorage)
- [ ] Auto-logout on token expiration

---

## 🎓 Security Best Practices Applied

1. **Defense in Depth** - Multiple layers (password + OTP)
2. **Rate Limiting** - Prevent brute force attacks
3. **Account Lockout** - Temporary lock after failures
4. **Secure Hashing** - bcrypt for passwords
5. **Token Expiration** - JWT valid for 7 days
6. **Email Masking** - Hide full email in responses
7. **Structured Logging** - Track all auth events
8. **Input Validation** - Joi schemas for all inputs
9. **Error Messages** - Generic messages to prevent enumeration
10. **HTTPS Ready** - All security measures for HTTPS

---

## 📚 Files Created/Modified

### New Files
- ✅ `server/src/services/email.service.js` - Email sending
- ✅ `docs/2FA_GUIDE.md` - This document

### Modified Files
- ✅ `server/src/modules/auth/auth.model.js` - User schema with 2FA
- ✅ `server/src/modules/auth/auth.service.js` - 2FA business logic
- ✅ `server/src/modules/auth/auth.controller.js` - 2FA endpoints
- ✅ `server/src/modules/auth/auth.routes.js` - 2FA routes
- ✅ `server/src/modules/auth/auth.validation.js` - 2FA validation
- ✅ `server/src/middleware/auth.middleware.js` - JWT verification
- ✅ `server/src/app.js` - Integrated auth routes
- ✅ `server/package.json` - Added nodemailer

---

## 🔗 Related Files

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [docs/API.md](./docs/API.md) - API specification
- [docs/SETUP.md](./docs/SETUP.md) - Setup guide
- [README.md](./README.md) - Project overview

---

**Two-Factor Authentication System: Production-Ready ✅**
