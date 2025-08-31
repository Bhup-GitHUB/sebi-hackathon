# SEBI Hackathon Trading Platform API - Test Cases

**Base URL:** https://sebi-hackathon.bkumar-be23.workers.dev/

---

## 1. Health Check

**GET /** 
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/
```

**Expected:**
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
    "kyc": {
      "register": "POST /kyc/register",
      "validate": "POST /kyc/validate",
      "status": "GET /kyc/status"
    },
    "balance": {
      "add": "POST /balance/add",
      "check": "GET /balance/check",
      "transactions": "GET /balance/transactions"
    },
    "database": "GET /test-db"
  }
}
```

---

## 2. User Registration

**POST /auth/signup**
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

**Expected Success:**
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": 1
}
```

**Expected Error (Missing Fields):**
```json
{
  "success": false,
  "error": "All fields are required"
}
```

---

## 3. User Login

**POST /auth/login**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1",
    "password": "TestPassword123!"
  }'
```

**Expected Success:**
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

**Expected Error (Invalid Credentials):**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

## 4. KYC Registration

**POST /kyc/register**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/kyc/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "pan": "ABCDE1234F"
  }'
```

**Expected Success:**
```json
{
  "success": true,
  "message": "KYC registration successful",
  "kycId": 1,
  "pan": "ABCDE1234F",
  "status": "pending",
  "kycExists": false
}
```

**Expected Error (Invalid PAN):**
```json
{
  "success": false,
  "error": "Invalid PAN format. PAN should be 10 characters (5 letters + 4 digits + 1 letter)"
}
```

**Expected Error (Duplicate KYC):**
```json
{
  "success": false,
  "error": "KYC already registered for this user",
  "existingKyc": {
    "id": 1,
    "pan": "ABCDE1234F",
    "status": "pending",
    "createdAt": "2025-08-30T20:10:18.304Z",
    "validatedAt": null
  },
  "kycExists": true
}
```

---

## 5. KYC Validation

**POST /kyc/validate**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/kyc/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "kycId": 1
  }'
```

**Expected Success:**
```json
{
  "success": true,
  "message": "KYC validation successful",
  "kycId": 1,
  "status": "validated",
  "validatedAt": "2025-08-30T20:15:30.123Z"
}
```

**Expected Error (Already Validated):**
```json
{
  "success": false,
  "error": "KYC is already validated"
}
```

---

## 6. KYC Status

**GET /kyc/status**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/kyc/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected (KYC Exists):**
```json
{
  "success": true,
  "message": "KYC status retrieved successfully",
  "kyc": {
    "id": 1,
    "pan": "ABCDE1234F",
    "status": "validated",
    "createdAt": "2025-08-30T20:10:18.304Z",
    "validatedAt": "2025-08-30T20:15:30.123Z"
  },
  "kycExists": true
}
```

**Expected (No KYC):**
```json
{
  "success": true,
  "message": "No KYC record found",
  "kycStatus": "not_registered",
  "kycExists": false
}
```

---

## 7. Add Balance

**POST /balance/add**
```bash
curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/balance/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "addBalance": 1000
  }'
```

**Expected Success:**
```json
{
  "success": true,
  "message": "Balance added successfully",
  "previousBalance": 0,
  "addedAmount": 1000,
  "newBalance": 1000,
  "transactionId": 1
}
```

**Expected Error (Invalid Amount):**
```json
{
  "success": false,
  "error": "Valid balance amount is required (must be a positive number)"
}
```

---

## 8. Check Balance

**GET /balance/check**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/balance/check \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Success:**
```json
{
  "success": true,
  "message": "Balance retrieved successfully",
  "balance": {
    "currentBalance": 1000,
    "currency": "INR",
    "lastUpdated": "2025-08-30T20:20:15.456Z"
  },
  "recentTransactions": [
    {
      "id": 1,
      "type": "credit",
      "amount": 1000,
      "description": "Balance added",
      "created_at": "2025-08-30T20:20:15.456Z"
    }
  ]
}
```

---

## 9. Transaction History

**GET /balance/transactions**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/balance/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Success:**
```json
{
  "success": true,
  "message": "Transaction history retrieved successfully",
  "transactions": [
    {
      "id": 1,
      "type": "credit",
      "amount": 1000,
      "description": "Balance added",
      "created_at": "2025-08-30T20:20:15.456Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1,
    "hasMore": false
  }
}
```

**With Pagination:**
```bash
curl -X GET "https://sebi-hackathon.bkumar-be23.workers.dev/balance/transactions?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 10. Database Test

**GET /test-db**
```bash
curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/test-db
```

**Expected:**
```json
{
  "success": true,
  "message": "Database connected successfully!",
  "totalUsers": 1,
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

---

## Quick Test Flow

1. **Register User:** `POST /auth/signup`
2. **Login:** `POST /auth/login` (save the token)
3. **Register KYC:** `POST /kyc/register` (use token)
4. **Validate KYC:** `POST /kyc/validate` (use token)
5. **Check Status:** `GET /kyc/status` (use token)
6. **Add Balance:** `POST /balance/add` (use token)
7. **Check Balance:** `GET /balance/check` (use token)
8. **View Transactions:** `GET /balance/transactions` (use token)

---

## Common Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authorization header required"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Valid balance amount is required (must be a positive number)"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Endpoint not found"
}
```

---

**Last Updated:** August 30, 2025  
**API Version:** 1.0.0
