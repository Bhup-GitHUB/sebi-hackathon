# 🧪 SEBI Hackathon Trading Platform - API Test Cases

> **Live API Base URL:** `https://sebi-hackathon.bkumar-be23.workers.dev/`

A comprehensive testing guide for the SEBI Hackathon Trading Platform API. This document provides detailed test cases, request/response examples, and testing instructions for all available endpoints.

## 📋 Table of Contents

- [🔐 Authentication Endpoints](#-authentication-endpoints)
- [📊 Database Testing](#-database-testing)
- [🌐 Health Check](#-health-check)
- [🛠️ Testing Tools](#️-testing-tools)
- [📝 Test Scenarios](#-test-scenarios)

---

## 🔐 Authentication Endpoints

### 1. User Registration (Signup)

**Endpoint:** `POST /auth/signup`

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "phone": "+919876543210",
    "password": "securepass123",
    "name": "Test User"
  }'
```

**Expected Response (Success - 200):**
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": 1
}
```

**Expected Response (Error - 400):**
```json
{
  "success": false,
  "error": "All fields are required"
}
```

**Test Cases:**
- ✅ Valid registration with all fields
- ❌ Missing required fields
- ❌ Duplicate username/email
- ❌ Invalid email format
- ❌ Invalid phone format

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Request:**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "securepass123"
  }'
```

**Expected Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser123",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**Expected Response (Error - 401):**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

**Test Cases:**
- ✅ Valid credentials
- ❌ Invalid username
- ❌ Invalid password
- ❌ Missing credentials
- ❌ Non-existent user

---

## 📊 Database Testing

### 3. Database Connection Test

**Endpoint:** `GET /test-db`

**Request:**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/test-db
```

**Expected Response (Success - 200):**
```json
{
  "success": true,
  "message": "Database connected successfully!",
  "totalUsers": 1,
  "users": [
    {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "phone": "+919876543210",
      "name": "Test User",
      "created_at": "2024-08-30T19:38:45.726Z"
    }
  ]
}
```

**Expected Response (Error - 500):**
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

**Test Cases:**
- ✅ Database connection working
- ✅ User data retrieval
- ❌ Database connection failure

---

### 4. Debug Information

**Endpoint:** `GET /debug`

**Request:**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/debug
```

**Expected Response (Success - 200):**
```json
{
  "hasDB": true,
  "dbType": "object",
  "envKeys": ["sebi_trading_db"],
  "bindingWorking": "Yes"
}
```

**Test Cases:**
- ✅ Environment variables loaded
- ✅ Database binding working
- ❌ Missing environment variables

---

## 🌐 Health Check

### 5. API Health Status

**Endpoint:** `GET /`

**Request:**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/
```

**Expected Response (Success - 200):**
```json
{
  "message": "SEBI Hackathon Trading Platform API",
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-08-30T19:38:45.726Z",
  "endpoints": {
    "auth": {
      "signup": "POST /auth/signup",
      "login": "POST /auth/login"
    },
    "database": "GET /test-db"
  }
}
```

**Test Cases:**
- ✅ API is running
- ✅ Version information
- ✅ Available endpoints listed
- ✅ Timestamp accuracy

---

## 🛠️ Testing Tools

### Using Postman

1. **Import Collection:**
   ```json
   {
     "info": {
       "name": "SEBI Hackathon API",
       "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
     },
     "item": [
       {
         "name": "Health Check",
         "request": {
           "method": "GET",
           "url": "https://sebi-hackathon.bkumar-be23.workers.dev/"
         }
       },
       {
         "name": "User Signup",
         "request": {
           "method": "POST",
           "url": "https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup",
           "header": [
             {
               "key": "Content-Type",
               "value": "application/json"
             }
           ],
           "body": {
             "mode": "raw",
             "raw": "{\n  \"username\": \"testuser123\",\n  \"email\": \"test@example.com\",\n  \"phone\": \"+919876543210\",\n  \"password\": \"securepass123\",\n  \"name\": \"Test User\"\n}"
           }
         }
       },
       {
         "name": "User Login",
         "request": {
           "method": "POST",
           "url": "https://sebi-hackathon.bkumar-be23.workers.dev/auth/login",
           "header": [
             {
               "key": "Content-Type",
               "value": "application/json"
             }
           ],
           "body": {
             "mode": "raw",
             "raw": "{\n  \"username\": \"testuser123\",\n  \"password\": \"securepass123\"\n}"
           }
         }
       },
       {
         "name": "Test Database",
         "request": {
           "method": "GET",
           "url": "https://sebi-hackathon.bkumar-be23.workers.dev/test-db"
         }
       }
     ]
   }
   ```

### Using cURL Scripts

Create a test script `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="https://sebi-hackathon.bkumar-be23.workers.dev"

echo "🧪 Testing SEBI Hackathon API"
echo "================================"

# Health Check
echo "1. Testing Health Check..."
curl -s -X GET "$BASE_URL/" | jq '.'

# Database Test
echo -e "\n2. Testing Database Connection..."
curl -s -X GET "$BASE_URL/test-db" | jq '.'

# User Signup
echo -e "\n3. Testing User Signup..."
curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "phone": "+919876543210",
    "password": "securepass123",
    "name": "Test User"
  }' | jq '.'

# User Login
echo -e "\n4. Testing User Login..."
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "securepass123"
  }' | jq '.'

echo -e "\n✅ API Testing Complete!"
```

---

## 📝 Test Scenarios

### Scenario 1: Complete User Journey

1. **Health Check** → Verify API is running
2. **Database Test** → Verify database connectivity
3. **User Signup** → Create new user account
4. **User Login** → Authenticate user and get JWT token
5. **Token Validation** → Use token for protected endpoints (future)

### Scenario 2: Error Handling

1. **Invalid Signup** → Test missing fields
2. **Duplicate User** → Test existing username/email
3. **Invalid Login** → Test wrong credentials
4. **Database Error** → Test connection issues

### Scenario 3: Security Testing

1. **Password Hashing** → Verify passwords are hashed
2. **JWT Token** → Verify token structure and expiration
3. **Input Validation** → Test SQL injection prevention
4. **Rate Limiting** → Test API abuse prevention (future)

---

## 🔍 Response Status Codes

| Status Code | Description | Usage |
|-------------|-------------|-------|
| `200` | Success | Successful operations |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Authentication required |
| `404` | Not Found | Endpoint not found |
| `500` | Internal Server Error | Server/database errors |

---

## 📊 Performance Testing

### Load Testing with Apache Bench

```bash
# Test health endpoint
ab -n 100 -c 10 https://sebi-hackathon.bkumar-be23.workers.dev/

# Test database endpoint
ab -n 50 -c 5 https://sebi-hackathon.bkumar-be23.workers.dev/test-db
```

### Expected Performance Metrics

- **Response Time:** < 200ms
- **Throughput:** > 1000 requests/second
- **Error Rate:** < 1%
- **Availability:** 99.9%

---

## 🚀 Quick Start Testing

### 1. Test API Health
```bash
curl https://sebi-hackathon.bkumar-be23.workers.dev/
```

### 2. Test Database
```bash
curl https://sebi-hackathon.bkumar-be23.workers.dev/test-db
```

### 3. Create Test User
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo_user",
    "email": "demo@example.com",
    "phone": "+919876543210",
    "password": "demo123",
    "name": "Demo User"
  }'
```

### 4. Login with Test User
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo_user",
    "password": "demo123"
  }'
```

---

## 📞 Support & Contact

- **API Documentation:** [GitHub Repository](https://github.com/Bhup-GitHUB/sebi-hackathon)
- **Live API:** https://sebi-hackathon.bkumar-be23.workers.dev/
- **Team:** Yajat, Naman, Bhupesh, Simran, Akshat

---

## 🔄 Future Endpoints (Coming Soon)

- `POST /kyc/register` - KYC registration
- `GET /kyc/validate/:userId` - KYC validation
- `GET /dashboard/:userId` - User dashboard
- `POST /order/:userId` - Trading orders
- `GET /report/:userId` - Trading reports
- `GET /balance/:userId` - Balance management

---

*Last Updated: August 30, 2024*
*API Version: 1.0.0*
