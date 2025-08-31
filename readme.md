# 🚀 SEBI Hackathon - Smart Trading Platform

A modern, secure trading platform built with **Hono.js** and deployed on **Cloudflare Workers** for lightning-fast serverless performance. This platform provides comprehensive broker management, fraud detection, and real-time trading capabilities with full KYC compliance.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [📡 API Documentation](#-api-documentation)
- [🧪 Test Cases](#-test-cases)
- [🔒 Security Features](#-security-features)
- [📊 Database Schema](#-database-schema)
- [🚀 Deployment](#-deployment)
- [👥 Team](#-team)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login/signup with password hashing
- 📋 **KYC Management** - Complete Know Your Customer verification system
- 💰 **Balance Management** - Real-time balance tracking with minimum balance alerts
- 📊 **Trading Operations** - Buy/sell stocks with real-time portfolio management
- 🚨 **Smart Alerts** - Low balance notifications and trading alerts
- 📈 **Transaction History** - Complete audit trail of all financial transactions
- 🔍 **Portfolio Tracking** - Real-time stock holdings and performance metrics
- 🛡️ **Fraud Prevention** - Built-in security measures and validation

## 🛠️ Tech Stack

### Backend
- **[Hono.js](https://hono.dev/)** - Ultra-fast web framework for edge computing
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Serverless deployment platform
- **TypeScript** - Type-safe development with full IntelliSense support
- **JWT** - Secure token-based authentication

### Database & Storage
- **Cloudflare D1** - Serverless SQL database with automatic scaling
- **SQLite** - Lightweight, reliable database engine

### Development Tools
- **Wrangler CLI** - Cloudflare Workers development and deployment tool
- **ESBuild** - Fast JavaScript bundler for production builds

## 📁 Project Structure

```
sebi-hackathon/
├── src/
│   ├── routes/
│   │   ├── auth.ts          # Authentication endpoints
│   │   ├── kyc.ts           # KYC management
│   │   ├── balance.ts       # Balance and transaction management
│   │   └── trading.ts       # Trading operations
│   └── index.ts             # Main application entry point
├── schema.sql               # Database schema and initial data
├── testcase.md              # Comprehensive API test cases
├── wrangler.toml            # Cloudflare Workers configuration
├── package.json             # Project dependencies and scripts
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cloudflare account with Workers enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bhup-GitHUB/sebi-hackathon
   cd sebi-hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Cloudflare D1 Database**
   ```bash
   # Create D1 database
   npx wrangler d1 create sebi-trading-db
   
   # Apply schema
   npx wrangler d1 execute sebi-trading-db --file=schema.sql
   ```

4. **Configure environment**
   ```bash
   # Update wrangler.toml with your database ID
   # Add your JWT secret and other environment variables
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Deploy to production**
   ```bash
   npm run deploy
   ```

## 📡 API Documentation

### Base URL
```
https://sebi-hackathon.bkumar-be23.workers.dev/
```

### Authentication Endpoints

#### User Registration
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "phone": "9876543210",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "SecurePass123!"
}
```

### KYC Management

#### Register KYC
```http
POST /kyc/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "pan": "ABCDE1234F"
}
```

#### Validate KYC
```http
POST /kyc/validate
Authorization: Bearer <token>
Content-Type: application/json

{
  "kycId": 1
}
```

#### Check KYC Status
```http
GET /kyc/status
Authorization: Bearer <token>
```

### Balance Management

#### Add Balance
```http
POST /balance/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "addBalance": 1000
}
```

#### Check Balance
```http
GET /balance/check
Authorization: Bearer <token>
```

#### Check Low Balance Alert
```http
GET /balance/check-low-balance
Authorization: Bearer <token>
```

#### Get Transaction History
```http
GET /balance/transactions?limit=50&offset=0
Authorization: Bearer <token>
```

### Trading Operations

#### Buy Stock
```http
POST /trading/buy
Authorization: Bearer <token>
Content-Type: application/json

{
  "stockName": "RELIANCE",
  "price": 2450.50,
  "quantity": 10
}
```

#### Sell Stock
```http
POST /trading/sell
Authorization: Bearer <token>
Content-Type: application/json

{
  "stockName": "RELIANCE",
  "price": 2500.00,
  "quantity": 5
}
```

#### Get Portfolio
```http
GET /trading/portfolio
Authorization: Bearer <token>
```

## 🧪 Test Cases

### Quick Test Flow

1. **Health Check**
   ```bash
   curl -X GET https://sebi-hackathon.bkumar-be23.workers.dev/
   ```

2. **Register User**
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

3. **Login and Get Token**
   ```bash
   curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser1",
       "password": "TestPassword123!"
     }'
   ```

4. **Register KYC**
   ```bash
   curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/kyc/register \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
     -d '{
       "pan": "ABCDE1234F"
     }'
   ```

5. **Add Balance**
   ```bash
   curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/balance/add \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
     -d '{
       "addBalance": 1000
     }'
   ```

6. **Buy Stock**
   ```bash
   curl -X POST https://sebi-hackathon.bkumar-be23.workers.dev/trading/buy \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{
       "stockName": "RELIANCE",
       "price": 2450.50,
       "quantity": 10
     }'
   ```

### Expected Responses

#### Successful Registration
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": 1
}
```

#### Successful Login
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

#### Successful Stock Purchase
```json
{
  "success": true,
  "message": "Stock purchase successful",
  "order": {
    "orderId": 1,
    "stockName": "RELIANCE",
    "orderType": "buy",
    "quantity": 10,
    "price": 2450.50,
    "totalAmount": 24505.00,
    "status": "executed",
    "executedAt": "2025-08-30T20:30:15.456Z"
  },
  "balance": {
    "previousBalance": 50000,
    "amountSpent": 24505.00,
    "newBalance": 25495.00,
    "currency": "INR"
  },
  "portfolio": {
    "stockName": "RELIANCE",
    "quantity": 10,
    "averagePrice": 2450.50,
    "totalInvestment": 24505.00
  }
}
```

### Error Handling

The API provides comprehensive error handling with detailed error messages:

#### Authentication Errors
```json
{
  "success": false,
  "error": "Authorization header required"
}
```

#### Validation Errors
```json
{
  "success": false,
  "error": "Valid balance amount is required (must be a positive number)"
}
```

#### Business Logic Errors
```json
{
  "success": false,
  "error": "Insufficient balance for this purchase",
  "details": {
    "requiredAmount": 24505.00,
    "currentBalance": 1000,
    "shortfall": 23505.00
  }
}
```

For complete test cases, see [testcase.md](./testcase.md)

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication with expiration
- **Password Hashing** - Secure password storage using cryptographic hashing
- **Input Validation** - Comprehensive validation for all API inputs
- **Rate Limiting** - Built-in protection against API abuse
- **CORS Protection** - Cross-origin request security
- **SQL Injection Prevention** - Parameterized queries for database operations

## 📊 Database Schema

The platform uses a well-structured SQLite database with the following tables:

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    kyc_status TEXT DEFAULT 'not_registered',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### KYC Table
```sql
CREATE TABLE kyc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    pan TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    validated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Balance Table
```sql
CREATE TABLE balance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0.00,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Balance Transactions Table
```sql
CREATE TABLE balance_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'credit' or 'debit'
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🚀 Deployment

### Using Wrangler CLI

```bash
# Login to Cloudflare
npx wrangler login

# Deploy to production
npm run deploy

# Deploy to staging
npm run deploy:staging
```

### Environment Configuration

Update your `wrangler.toml` with the following:

```toml
name = "sebi-hackathon"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "sebi_trading_db"
database_name = "sebi-trading-db"
database_id = "your-database-id"

[vars]
JWT_SECRET = "your-jwt-secret-key"
MINIMUM_BALANCE = "1000"
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server

# Deployment
npm run deploy           # Deploy to production
npm run cf-typegen       # Generate TypeScript types
```

## 🧪 Testing

The platform includes comprehensive test cases covering:

- ✅ User registration and authentication
- ✅ KYC registration and validation
- ✅ Balance management and transactions
- ✅ Stock trading operations
- ✅ Portfolio management
- ✅ Error handling and edge cases

Run the test cases using the provided curl commands in the [Test Cases](#-test-cases) section.

## 📈 Performance

- **Ultra-fast Response Times** - Cloudflare Workers edge computing
- **Global CDN** - Worldwide content delivery
- **Auto-scaling** - Handles traffic spikes automatically
- **99.9% Uptime** - Cloudflare's reliable infrastructure

## 🔮 Future Enhancements

- [ ] Real-time stock price feeds
- [ ] Advanced charting and technical analysis
- [ ] Mobile app development
- [ ] AI-powered trading recommendations
- [ ] Multi-currency support
- [ ] Advanced fraud detection algorithms

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Contact the development team
- Check the [testcase.md](./testcase.md) for detailed API documentation

---

## 👥 Team -> Yajat , Naman , Bhupesh , Simran , Akshat
https://github.com/YajatPahuja



