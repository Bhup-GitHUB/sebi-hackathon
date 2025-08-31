# 🚀 SEBI Hackathon - Smart Trading Platform

A modern, secure trading platform built with **Hono.js** and deployed on **Cloudflare Workers** for lightning-fast serverless performance. This platform provides comprehensive broker management, fraud detection, and real-time trading capabilities.

## ✨ Features

- 🔐 **User Authentication** - Secure login/signup with KYC verification
- 📊 **Real-time Trading Dashboard** - Live stock prices, margins, and portfolio management  
- 🚨 **Fraud Detection** - ML-powered suspicious activity alerts
- 📈 **Advanced Reporting** - Historical data analysis and performance metrics
- 💰 **Wallet Management** - Secure balance and credit management
- 🔍 **Order Management** - Buy/sell orders with real-time execution

## 🛠️ Tech Stack

### Backend
- **[Hono.js](https://hono.dev/)** - Ultra-fast web framework
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Serverless deployment
- **TypeScript** - Type-safe development
- **JWT** - Secure authentication

### Database
- **Cloudflare D1** - Serverless SQL database
- **Cloudflare KV** - Key-value storage for caching

## 📁 Project Structure

```
sebi-hackathon/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── kyc.ts
│   │   ├── balance.ts
│   │   ├── user.ts
│   │   ├── trading.ts
│   │   └── reports.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── validation.ts
│   └── index.ts
├── wrangler.toml
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cloudflare account

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

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your Cloudflare credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Deploy to Cloudflare Workers**
   ```bash
   npm run deploy
   ```

## 📡 API Endpoints

### Authentication
```http
POST /auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "securepass"
}
```

```http
POST /auth/signup  
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "password": "securepass"
}
```

### KYC Management
```http
POST /kyc/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "pan": "ABCDE1234F",
  "aadhar": "1234-5678-9012"
}
```

```http
GET /kyc/validate/:userId
Authorization: Bearer <token>

Response: {
  "status": "verified|pending|rejected",
  "verifiedUser": true,
  "message": "KYC verification complete"
}
```

### User Dashboard
```http
GET /dashboard/:userId
Authorization: Bearer <token>

Response: {
  "user": { "id": 123, "name": "John Doe" },
  "portfolio": {
    "totalValue": 150000,
    "stocks": [...],
    "margin": 15000,
    "fees": 250
  }
}
```

### Trading Operations
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

```http
GET /trading/portfolio
Authorization: Bearer <token>
```

Response Examples:

**Buy Success:**
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

**Sell Success:**
```json
{
  "success": true,
  "message": "Stock sale successful",
  "order": {
    "orderId": 2,
    "stockName": "RELIANCE",
    "orderType": "sell",
    "quantity": 5,
    "price": 2500.00,
    "totalAmount": 12500.00,
    "status": "executed",
    "executedAt": "2025-08-30T23:30:15.456Z"
  },
  "balance": {
    "previousBalance": 25495.00,
    "amountReceived": 12500.00,
    "newBalance": 37995.00,
    "currency": "INR"
  },
  "profitLoss": {
    "amount": 247.50,
    "percentage": 2.02,
    "type": "profit"
  },
  "portfolio": {
    "stockName": "RELIANCE",
    "remainingQuantity": 5,
    "averagePrice": 2450.50
  }
}
```

**Portfolio:**
```json
{
  "success": true,
  "message": "Portfolio retrieved successfully",
  "portfolio": {
    "totalStocks": 25,
    "totalInvestment": 50000.00,
    "numberOfHoldings": 3,
    "stocks": [
      {
        "stockName": "RELIANCE",
        "quantity": 10,
        "averagePrice": 2450.50,
        "totalInvestment": 24505.00,
        "currentValue": 24505.00,
        "createdAt": "2025-08-30T20:30:15.456Z",
        "updatedAt": "2025-08-30T20:30:15.456Z"
      }
    ]
  }
}
```

### Reports & Analytics
```http
GET /report/:userId?period=1M
Authorization: Bearer <token>

Response: {
  "margin": 15000,
  "fees": 1200,
  "orders": [...],
  "performance": {
    "profit": 5000,
    "loss": 1200
  },
  "timeRange": "2024-01-01 to 2024-02-01"
}
```

### Balance Management
```http
POST /balance/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "addBalance": 1000
}
```

```http
GET /balance/check
Authorization: Bearer <token>

Response: {
  "success": true,
  "message": "Balance retrieved successfully",
  "balance": {
    "currentBalance": 1000,
    "minimumRequired": 1000,
    "currency": "INR",
    "lastUpdated": "2025-08-30T20:20:15.456Z"
  },
  "alert": {
    "isLowBalance": false,
    "shortfall": 0,
    "message": "Your balance is sufficient for trading."
  },
  "recentTransactions": [...]
}
```

```http
GET /balance/check-low-balance
Authorization: Bearer <token>

Response: {
  "success": true,
  "message": "Balance is low. Please recharge.",
  "balance": {
    "currentBalance": 500,
    "minimumRequired": 1000,
    "currency": "INR",
    "lastUpdated": "2025-08-30T20:20:15.456Z"
  },
  "alert": {
    "isLowBalance": true,
    "shortfall": 500,
    "message": "Your balance is ₹500. Minimum required is ₹1000. Please recharge ₹500 to meet the minimum requirement."
  }
}
```

```http
GET /balance/alert
Authorization: Bearer <token>

Response: {
  "success": true,
  "hasAlert": true,
  "alertType": "LOW_BALANCE",
  "alert": {
    "type": "LOW_BALANCE",
    "severity": "WARNING",
    "title": "Low Balance Alert",
    "message": "Your balance is ₹500. Minimum required is ₹1000.",
    "action": "Please recharge your account",
    "shortfall": 500,
    "requiredAmount": 1000,
    "currentAmount": 500,
    "actionButton": {
      "text": "Recharge Now",
      "amount": 500,
      "url": "/recharge"
    }
  },
  "balance": {
    "currentBalance": 500,
    "minimumRequired": 1000,
    "currency": "INR",
    "lastUpdated": "2025-08-30T20:20:15.456Z"
  }
}
```

```http
GET /balance/transactions
Authorization: Bearer <token>

Response: {
  "success": true,
  "message": "Transaction history retrieved successfully",
  "transactions": [...],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1,
    "hasMore": false
  }
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevent API abuse  
- **Input Validation** - Sanitize all inputs
- **Fraud Detection** - ML-powered anomaly detection

## 📊 Fraud Detection System

The platform includes advanced fraud detection capabilities:

- **Suspicious Activity Monitoring** - Real-time transaction analysis
- **Pattern Recognition** - Identify unusual trading patterns  
- **Risk Scoring** - Automated risk assessment
- **Alert System** - Instant notifications for high-risk activities

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

### Environment Variables

```env
JWT_SECRET=your-jwt-secret
DB_URL=your-d1-database-url
KV_NAMESPACE=your-kv-namespace
FRAUD_DETECTION_API=your-ml-api-endpoint
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests  
npm run test:integration

# Generate coverage report
npm run test:coverage
```




## 👥 Team -> Yajat , Naman , Bhupesh , Simran , Akshat
https://github.com/YajatPahuja


