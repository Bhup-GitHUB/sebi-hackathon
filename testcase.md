# 🧪 SEBI Hackathon API – Test Cases

> **Live API Base URL:** `https://sebi-hackathon.bkumar-be23.workers.dev/`

## 🌐 Health Check

* **Route:** `/`
* **Method:** `GET`
* **Request Body:** None
* **Response:**

```json
{
  "message": "SEBI Hackathon Trading Platform API",
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-08-30T20:03:54.152Z",
  "endpoints": {
    "auth": {
      "signup": "POST /auth/signup",
      "login": "POST /auth/login"
    },
    "database": "GET /test-db"
  }
}
```

---

## 📊 Database Test

* **Route:** `/test-db`
* **Method:** `GET`
* **Request Body:** None
* **Response:**

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

---

## 🔍 Debug Info

* **Route:** `/debug`
* **Method:** `GET`
* **Request Body:** None
* **Response:**

```json
{
  "hasDB": true,
  "dbType": "object",
  "envKeys": ["sebi_trading_db"],
  "bindingWorking": "Yes"
}
```

---

## 🔐 User Signup

* **Route:** `/auth/signup`
* **Method:** `POST`
* **Request Body:**

```json
{
  "username": "testuser123",
  "email": "test@example.com",
  "phone": "+919876543210",
  "password": "securepass123",
  "name": "Test User"
}
```

* **Response (Success):**

```json
{
  "success": true,
  "message": "User created successfully",
  "userId": 2
}
```

* **Response (Error - Missing Fields):**

```json
{
  "success": false,
  "error": "All fields are required"
}
```

---

## 🔐 User Login

* **Route:** `/auth/login`
* **Method:** `POST`
* **Request Body:**

```json
{
  "username": "testuser123",
  "password": "securepass123"
}
```

* **Response (Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "testuser123",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

* **Response (Error - Invalid Credentials):**

```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

## ❌ Invalid Signup (Missing Fields)

* **Route:** `/auth/signup`
* **Method:** `POST`
* **Request Body:**

```json
{
  "username": "testuser",
  "email": "test@example.com"
}
```

* **Response:**

```json
{
  "success": false,
  "error": "All fields are required"
}
```

---

## ❌ Invalid Login (Wrong Password)

* **Route:** `/auth/login`
* **Method:** `POST`
* **Request Body:**

```json
{
  "username": "testuser123",
  "password": "wrongpassword"
}
```

* **Response:**

```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

## ❌ Invalid Login (Non-existent User)

* **Route:** `/auth/login`
* **Method:** `POST`
* **Request Body:**

```json
{
  "username": "nonexistentuser",
  "password": "anypassword"
}
```

* **Response:**

```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

## ❌ Non-existent Endpoint

* **Route:** `/non-existent`
* **Method:** `GET`
* **Response:**

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

---

## 🧪 Test Scenarios

### Scenario 1: Complete User Journey

1. **Health Check** → Verify API is running
2. **Database Test** → Verify database connectivity
3. **User Signup** → Create new user account
4. **User Login** → Authenticate and get JWT token

### Scenario 2: Error Handling

1. **Invalid Signup** → Test missing required fields
2. **Invalid Login** → Test wrong credentials
3. **Non-existent User** → Test login with non-existent user
4. **Non-existent Endpoint** → Test 404 errors

### Scenario 3: Data Validation

1. **Email Format** → Test invalid email addresses
2. **Phone Format** → Test invalid phone numbers
3. **Password Strength** → Test weak passwords
4. **Username Uniqueness** → Test duplicate usernames

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

## 🔒 Security Features

- **Password Hashing** → SHA-256 hashing for passwords
- **JWT Authentication** → Secure token-based authentication
- **Input Validation** → Required field validation
- **Error Handling** → Proper error responses without sensitive data

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
