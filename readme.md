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
POST /order/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "buy|sell",
  "symbol": "RELIANCE",
  "quantity": 10,
  "price": 2450.50,
  "orderType": "market|limit"
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
GET /balance/:userId
Authorization: Bearer <token>

Response: {
  "availableBalance": 50000,
  "margin": 15000,
  "credit": 35000
}
```

```http
POST /balance/:userId/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 10000,
  "method": "upi|bank_transfer"
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

