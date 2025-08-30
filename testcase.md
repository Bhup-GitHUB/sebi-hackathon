# SEBI Hackathon Trading Platform API - Test Cases

**Base URL:** https://sebi-hackathon.bkumar-be23.workers.dev/

## Table of Contents
1. [Health Check Endpoints](#health-check-endpoints)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Database Test Endpoints](#database-test-endpoints)
4. [Error Handling Tests](#error-handling-tests)
5. [Security Tests](#security-tests)

---

## Health Check Endpoints

### Test Case 1: Root Endpoint (GET /)
**Objective:** Verify API health and get available endpoints

**Request:**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/
```

**Expected Response:**
```json
{
  "message": "SEBI Hackathon Trading Platform API",
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-08-30T20:10:18.304Z",
  "endpoints": {
    "auth": {
      "signup": "POST /auth/signup",
      "login": "POST /auth/login"
    },
    "database": "GET /test-db"
  }
}
```

**Test Criteria:**
- ✅ Status code: 200
- ✅ Response contains all required fields
- ✅ Timestamp is valid ISO format
- ✅ Endpoints object contains auth routes

---

## Authentication Endpoints

### Test Case 2: User Signup - Valid Data (POST /auth/signup)
**Objective:** Test successful user registration

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1",
    "email": "test1@example.com",
    "phone": "9876543210",
    "password": "TestPassword123!",
    "name": "Test User One"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": 1
}
```

**Test Criteria:**
- ✅ Status code: 200
- ✅ Success flag is true
- ✅ User ID is returned
- ✅ Password is hashed (not returned in response)

### Test Case 3: User Signup - Missing Required Fields
**Objective:** Test validation for missing fields

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "email": "test2@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "All fields are required"
}
```

**Test Criteria:**
- ✅ Status code: 400
- ✅ Success flag is false
- ✅ Error message indicates missing fields

### Test Case 4: User Signup - Duplicate Username
**Objective:** Test handling of duplicate username registration

**Request:**
```bash
# First registration
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "duplicateuser",
    "email": "duplicate1@example.com",
    "phone": "9876543211",
    "password": "TestPassword123!",
    "name": "Duplicate User One"
  }'

# Second registration with same username
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "duplicateuser",
    "email": "duplicate2@example.com",
    "phone": "9876543212",
    "password": "TestPassword123!",
    "name": "Duplicate User Two"
  }'
```

**Expected Response (Second Request):**
```json
{
  "success": false,
  "error": "UNIQUE constraint failed: users.username"
}
```

**Test Criteria:**
- ✅ Status code: 400
- ✅ Success flag is false
- ✅ Error message indicates constraint violation

### Test Case 5: User Login - Valid Credentials (POST /auth/login)
**Objective:** Test successful user login

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser1",
    "email": "test1@example.com",
    "name": "Test User One"
  }
}
```

**Test Criteria:**
- ✅ Status code: 200
- ✅ Success flag is true
- ✅ JWT token is returned
- ✅ User object contains correct data
- ✅ Password is not returned in response

### Test Case 6: User Login - Invalid Username
**Objective:** Test login with non-existent username

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nonexistentuser",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

**Test Criteria:**
- ✅ Status code: 401
- ✅ Success flag is false
- ✅ Generic error message (security best practice)

### Test Case 7: User Login - Invalid Password
**Objective:** Test login with wrong password

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1",
    "password": "WrongPassword123!"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

**Test Criteria:**
- ✅ Status code: 401
- ✅ Success flag is false
- ✅ Generic error message (security best practice)

### Test Case 8: User Login - Missing Credentials
**Objective:** Test login with missing fields

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Username and password are required"
}
```

**Test Criteria:**
- ✅ Status code: 400
- ✅ Success flag is false
- ✅ Error message indicates missing fields

---

## Database Test Endpoints

### Test Case 9: Database Connection Test (GET /test-db)
**Objective:** Verify database connectivity and retrieve users

**Request:**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/test-db
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Database connected successfully!",
  "totalUsers": 2,
  "users": [
    {
      "id": 1,
      "username": "testuser1",
      "email": "test1@example.com",
      "phone": "9876543210",
      "password_hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
      "name": "Test User One",
      "created_at": "2025-08-30T20:10:18.304Z"
    }
  ]
}
```

**Test Criteria:**
- ✅ Status code: 200
- ✅ Success flag is true
- ✅ Database connection message
- ✅ Users array contains user data
- ✅ Password hashes are present (not plain text)

### Test Case 10: Debug Endpoint (GET /debug)
**Objective:** Check environment and binding configuration

**Request:**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/debug
```

**Expected Response:**
```json
{
  "hasDB": true,
  "dbType": "object",
  "envKeys": ["sebi_trading_db"],
  "bindingWorking": "Yes"
}
```

**Test Criteria:**
- ✅ Status code: 200
- ✅ Database binding is available
- ✅ Environment keys are present

---

## Error Handling Tests

### Test Case 11: Invalid Endpoint (404 Test)
**Objective:** Test handling of non-existent endpoints

**Request:**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/invalid-endpoint
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Endpoint not found",
  "availableEndpoints": [
    "GET /",
    "GET /test-db",
    "POST /auth/signup",
    "POST /auth/login"
  ]
}
```

**Test Criteria:**
- ✅ Status code: 404
- ✅ Success flag is false
- ✅ Available endpoints are listed

### Test Case 12: Invalid JSON in Request Body
**Objective:** Test handling of malformed JSON

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser3",
    "email": "test3@example.com",
    "phone": "9876543213",
    "password": "TestPassword123!",
    "name": "Test User Three"
    "invalid": "missing comma"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Unexpected token in JSON at position 123"
}
```

**Test Criteria:**
- ✅ Status code: 400
- ✅ Success flag is false
- ✅ JSON parsing error is handled

---

## Security Tests

### Test Case 13: Password Hashing Verification
**Objective:** Verify that passwords are properly hashed

**Steps:**
1. Create a user with known password
2. Check database response to ensure password_hash is not plain text
3. Verify hash length and format

**Test Criteria:**
- ✅ Password hash is 64 characters (SHA-256)
- ✅ Hash contains only hexadecimal characters
- ✅ Plain text password is never returned

### Test Case 14: JWT Token Validation
**Objective:** Verify JWT token structure and expiration

**Steps:**
1. Login to get a token
2. Decode JWT token (header.payload.signature)
3. Verify payload contains required claims

**Test Criteria:**
- ✅ Token has three parts separated by dots
- ✅ Payload contains: sub, username, exp, iat
- ✅ Expiration time is 24 hours from creation
- ✅ Subject (sub) matches user ID

### Test Case 15: SQL Injection Prevention
**Objective:** Test protection against SQL injection attacks

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1\"; DROP TABLE users; --",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

**Test Criteria:**
- ✅ Status code: 401
- ✅ No SQL errors in response
- ✅ Database remains intact

---

## Performance Tests

### Test Case 16: Concurrent User Registration
**Objective:** Test system performance under load

**Script:**
```bash
# Run multiple signup requests simultaneously
for i in {1..10}; do
  curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"loadtestuser$i\",
      \"email\": \"loadtest$i@example.com\",
      \"phone\": \"98765432$i\",
      \"password\": \"TestPassword123!\",
      \"name\": \"Load Test User $i\"
    }" &
done
wait
```

**Test Criteria:**
- ✅ All requests complete successfully
- ✅ Response times are reasonable (< 2 seconds)
- ✅ No duplicate user IDs generated

---

## Data Validation Tests

### Test Case 17: Email Format Validation
**Objective:** Test email format handling

**Requests:**
```bash
# Valid email
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "emailtest1",
    "email": "valid.email@domain.com",
    "phone": "9876543214",
    "password": "TestPassword123!",
    "name": "Email Test User"
  }'

# Invalid email
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "emailtest2",
    "email": "invalid-email-format",
    "phone": "9876543215",
    "password": "TestPassword123!",
    "name": "Invalid Email User"
  }'
```

**Test Criteria:**
- ✅ Valid email is accepted
- ✅ Invalid email format is handled appropriately

### Test Case 18: Phone Number Validation
**Objective:** Test phone number format handling

**Test Criteria:**
- ✅ 10-digit phone numbers are accepted
- ✅ Non-numeric characters are handled appropriately

---

## Test Execution Summary

### Manual Testing Checklist
- [ ] Health check endpoint responds correctly
- [ ] User registration works with valid data
- [ ] User registration fails with missing data
- [ ] User login works with valid credentials
- [ ] User login fails with invalid credentials
- [ ] Database connection test works
- [ ] Error handling for invalid endpoints
- [ ] JWT token generation and structure
- [ ] Password hashing verification
- [ ] SQL injection prevention

### Automated Testing Recommendations
1. **Unit Tests:** Test individual functions (hashPassword, JWT generation)
2. **Integration Tests:** Test complete API endpoints
3. **Load Tests:** Test concurrent user registration/login
4. **Security Tests:** Automated SQL injection and XSS tests
5. **API Contract Tests:** Verify response schemas

### Test Environment Setup
```bash
# Test data cleanup
# Note: Implement cleanup scripts to reset test data between test runs

# Environment variables for testing
BASE_URL=https://sebi-hackathon.bkumar-be23.workers.dev
TEST_USERNAME=testuser
TEST_EMAIL=test@example.com
TEST_PASSWORD=TestPassword123!
```

---

## Bug Reports and Issues

### Known Issues
1. **No email validation:** Current implementation doesn't validate email format
2. **No password strength requirements:** No minimum length or complexity checks
3. **No rate limiting:** No protection against brute force attacks
4. **No input sanitization:** Limited protection against malicious input

### Recommendations for Improvement
1. Add email format validation
2. Implement password strength requirements
3. Add rate limiting for auth endpoints
4. Implement input sanitization
5. Add logging for security events
6. Implement refresh token mechanism
7. Add user profile update endpoints
8. Implement password reset functionality

---

**Last Updated:** August 30, 2025  
**Test Environment:** Production (https://sebi-hackathon.bkumar-be23.workers.dev/)  
**API Version:** 1.0.0
