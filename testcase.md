# 🧪 SEBI Hackathon Trading Platform - Postman Test Collection

> **Live API Base URL:** `https://sebi-hackathon.bkumar-be23.workers.dev/`

A comprehensive Postman testing guide for the SEBI Hackathon Trading Platform API. This document provides Postman collection imports, environment setup, and detailed testing workflows.

## 📋 Table of Contents

- [🚀 Quick Start (Postman)](#-quick-start-postman)
- [📦 Postman Collection Import](#-postman-collection-import)
- [⚙️ Environment Setup](#️-environment-setup)
- [🔐 Authentication Endpoints](#-authentication-endpoints)
- [📊 Database Testing](#-database-testing)
- [🌐 Health Check](#-health-check)
- [🔄 Test Automation](#-test-automation)
- [📝 Test Scenarios](#-test-scenarios)

---

## 🚀 Quick Start (Postman)

### Step 1: Import Collection
1. Open **Postman**
2. Click **Import** button
3. Copy the JSON collection below and paste it
4. Click **Import**

### Step 2: Set Up Environment
1. Create new environment: **SEBI Hackathon**
2. Add variables:
   - `base_url`: `https://sebi-hackathon.bkumar-be23.workers.dev`
   - `auth_token`: (leave empty, will be auto-filled)
   - `user_id`: (leave empty, will be auto-filled)

### Step 3: Run Tests
1. Select the **SEBI Hackathon** environment
2. Open the collection
3. Click **Run Collection** to execute all tests

---

## 📦 Postman Collection Import

Copy and paste this JSON into Postman's import section:

```json
{
  "info": {
    "name": "SEBI Hackathon Trading Platform API",
    "description": "Complete API testing collection for SEBI Hackathon Trading Platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "version": "1.0.0"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://sebi-hackathon.bkumar-be23.workers.dev",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "🌐 Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/",
          "host": ["{{base_url}}"],
          "path": [""]
        },
        "description": "Check if the API is running and healthy"
      },
      "response": [],
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test(\"API is healthy\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.status).to.eql(\"healthy\");",
              "});",
              "",
              "pm.test(\"Version is present\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.version).to.be.a('string');",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "📊 Database Test",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/test-db",
          "host": ["{{base_url}}"],
          "path": ["test-db"]
        },
        "description": "Test database connectivity and retrieve user data"
      },
      "response": [],
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test(\"Database connection successful\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.success).to.be.true;",
              "    pm.expect(response.message).to.include(\"connected successfully\");",
              "});",
              "",
              "pm.test(\"Users array exists\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.users).to.be.an('array');",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "🔍 Debug Information",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/debug",
          "host": ["{{base_url}}"],
          "path": ["debug"]
        },
        "description": "Get debug information about environment and database binding"
      },
      "response": [],
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test(\"Database binding working\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.hasDB).to.be.true;",
              "    pm.expect(response.bindingWorking).to.eql(\"Yes\");",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "🔐 User Registration",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"{{$randomUserName}}\",\n  \"email\": \"{{$randomEmail}}\",\n  \"phone\": \"+919876543210\",\n  \"password\": \"securepass123\",\n  \"name\": \"Test User\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/auth/signup",
          "host": ["{{base_url}}"],
          "path": ["auth", "signup"]
        },
        "description": "Register a new user account"
      },
      "response": [],
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test(\"User created successfully\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.success).to.be.true;",
              "    pm.expect(response.message).to.include(\"created successfully\");",
              "});",
              "",
              "pm.test(\"User ID is returned\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.userId).to.be.a('number');",
              "    pm.environment.set(\"user_id\", response.userId);",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "🔐 User Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"{{username}}\",\n  \"password\": \"{{password}}\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/auth/login",
          "host": ["{{base_url}}"],
          "path": ["auth", "login"]
        },
        "description": "Login with user credentials and get JWT token"
      },
      "response": [],
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test(\"Login successful\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.success).to.be.true;",
              "    pm.expect(response.message).to.include(\"Login successful\");",
              "});",
              "",
              "pm.test(\"JWT token is returned\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.token).to.be.a('string');",
              "    pm.expect(response.token).to.have.length.greaterThan(50);",
              "    pm.environment.set(\"auth_token\", response.token);",
              "});",
              "",
              "pm.test(\"User data is returned\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.user).to.be.an('object');",
              "    pm.expect(response.user.id).to.be.a('number');",
              "    pm.expect(response.user.username).to.be.a('string');",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "❌ Error - Invalid Signup (Missing Fields)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/auth/signup",
          "host": ["{{base_url}}"],
          "path": ["auth", "signup"]
        },
        "description": "Test signup with missing required fields"
      },
      "response": [],
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 400\", function () {",
              "    pm.response.to.have.status(400);",
              "});",
              "",
              "pm.test(\"Error message for missing fields\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.success).to.be.false;",
              "    pm.expect(response.error).to.include(\"required\");",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "❌ Error - Invalid Login (Wrong Password)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser123\",\n  \"password\": \"wrongpassword\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/auth/login",
          "host": ["{{base_url}}"],
          "path": ["auth", "login"]
        },
        "description": "Test login with incorrect password"
      },
      "response": [],
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 401\", function () {",
              "    pm.response.to.have.status(401);",
              "});",
              "",
              "pm.test(\"Invalid credentials error\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.success).to.be.false;",
              "    pm.expect(response.error).to.include(\"Invalid username or password\");",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "❌ Error - Non-existent Endpoint",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/non-existent",
          "host": ["{{base_url}}"],
          "path": ["non-existent"]
        },
        "description": "Test 404 error for non-existent endpoint"
      },
      "response": [],
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 404\", function () {",
              "    pm.response.to.have.status(404);",
              "});",
              "",
              "pm.test(\"Not found error message\", function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.success).to.be.false;",
              "    pm.expect(response.error).to.include(\"not found\");",
              "});"
            ]
          }
        }
      ]
    }
  ]
}
```

---

## ⚙️ Environment Setup

### Create Environment Variables

1. **Click** the gear icon (⚙️) in the top right
2. **Click** "Add" to create new environment
3. **Name it**: `SEBI Hackathon`
4. **Add these variables**:

| Variable | Initial Value | Current Value | Description |
|----------|---------------|---------------|-------------|
| `base_url` | `https://sebi-hackathon.bkumar-be23.workers.dev` | | API base URL |
| `auth_token` | | | JWT token (auto-filled) |
| `user_id` | | | User ID (auto-filled) |
| `username` | `testuser123` | | Test username |
| `password` | `securepass123` | | Test password |

### Environment JSON Import

```json
{
  "name": "SEBI Hackathon",
  "values": [
    {
      "key": "base_url",
      "value": "https://sebi-hackathon.bkumar-be23.workers.dev",
      "type": "default",
      "enabled": true
    },
    {
      "key": "auth_token",
      "value": "",
      "type": "secret",
      "enabled": true
    },
    {
      "key": "user_id",
      "value": "",
      "type": "default",
      "enabled": true
    },
    {
      "key": "username",
      "value": "testuser123",
      "type": "default",
      "enabled": true
    },
    {
      "key": "password",
      "value": "securepass123",
      "type": "secret",
      "enabled": true
    }
  ]
}
```

---

## 🔐 Authentication Endpoints

### 1. User Registration (Signup)

**Request Details:**
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/signup`
- **Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "username": "{{$randomUserName}}",
  "email": "{{$randomEmail}}",
  "phone": "+919876543210",
  "password": "securepass123",
  "name": "Test User"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("User created successfully", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.message).to.include("created successfully");
});

pm.test("User ID is returned", function () {
    const response = pm.response.json();
    pm.expect(response.userId).to.be.a('number');
    pm.environment.set("user_id", response.userId);
});
```

---

### 2. User Login

**Request Details:**
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/login`
- **Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "username": "{{username}}",
  "password": "{{password}}"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Login successful", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.message).to.include("Login successful");
});

pm.test("JWT token is returned", function () {
    const response = pm.response.json();
    pm.expect(response.token).to.be.a('string');
    pm.expect(response.token).to.have.length.greaterThan(50);
    pm.environment.set("auth_token", response.token);
});
```

---

## 📊 Database Testing

### 3. Database Connection Test

**Request Details:**
- **Method:** `GET`
- **URL:** `{{base_url}}/test-db`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Database connection successful", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.message).to.include("connected successfully");
});

pm.test("Users array exists", function () {
    const response = pm.response.json();
    pm.expect(response.users).to.be.an('array');
});
```

---

## 🌐 Health Check

### 4. API Health Status

**Request Details:**
- **Method:** `GET`
- **URL:** `{{base_url}}/`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("API is healthy", function () {
    const response = pm.response.json();
    pm.expect(response.status).to.eql("healthy");
});

pm.test("Version is present", function () {
    const response = pm.response.json();
    pm.expect(response.version).to.be.a('string');
});
```

---

## 🔄 Test Automation

### Running Collection Tests

1. **Open Collection** → Click on collection name
2. **Click "Run Collection"** → Blue button in top right
3. **Select Environment** → Choose "SEBI Hackathon"
4. **Configure Run Settings:**
   - **Iterations:** 1
   - **Delay:** 1000ms (1 second between requests)
   - **Log responses:** ✅ Checked
   - **Save responses:** ✅ Checked

### Newman CLI (Command Line)

Install Newman:
```bash
npm install -g newman
```

Run collection:
```bash
newman run "SEBI Hackathon Trading Platform API" \
  --environment "SEBI Hackathon" \
  --reporters cli,json \
  --reporter-json-export results.json
```

### GitHub Actions Integration

Create `.github/workflows/api-tests.yml`:

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Newman
        run: npm install -g newman
      - name: Run API Tests
        run: |
          newman run "SEBI Hackathon Trading Platform API" \
            --environment "SEBI Hackathon" \
            --reporters cli,junit \
            --reporter-junit-export results.xml
      - name: Upload Test Results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: results.xml
```

---

## 📝 Test Scenarios

### Scenario 1: Happy Path Testing

1. **Health Check** → Verify API is running
2. **Database Test** → Verify database connectivity
3. **User Signup** → Create new user account
4. **User Login** → Authenticate and get JWT token

### Scenario 2: Error Handling

1. **Invalid Signup** → Test missing required fields
2. **Invalid Login** → Test wrong credentials
3. **Non-existent Endpoint** → Test 404 errors

### Scenario 3: Data Validation

1. **Email Format** → Test invalid email addresses
2. **Phone Format** → Test invalid phone numbers
3. **Password Strength** → Test weak passwords

---

## 🔍 Response Status Codes

| Status Code | Description | Postman Test |
|-------------|-------------|--------------|
| `200` | Success | `pm.response.to.have.status(200)` |
| `400` | Bad Request | `pm.response.to.have.status(400)` |
| `401` | Unauthorized | `pm.response.to.have.status(401)` |
| `404` | Not Found | `pm.response.to.have.status(404)` |
| `500` | Internal Server Error | `pm.response.to.have.status(500)` |

---

## 📊 Performance Testing

### Postman Monitor

1. **Set up Monitor:**
   - Collection → Three dots → "Monitor collection"
   - **Name:** SEBI Hackathon API Monitor
   - **Environment:** SEBI Hackathon
   - **Frequency:** Every 5 minutes
   - **Region:** Multiple regions

2. **Monitor Alerts:**
   - Response time > 200ms
   - Error rate > 1%
   - Failed tests

### Load Testing with Postman

```javascript
// Pre-request Script for load testing
pm.globals.set("iteration", pm.info.iteration);

// Test Script for performance
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});
```

---

## 🚀 Quick Start Testing

### 1. Import Collection
Copy the JSON collection above and import into Postman

### 2. Set Up Environment
Create environment with variables listed above

### 3. Run Health Check
```bash
GET {{base_url}}/
```

### 4. Test Database
```bash
GET {{base_url}}/test-db
```

### 5. Create Test User
```bash
POST {{base_url}}/auth/signup
Content-Type: application/json

{
  "username": "demo_user",
  "email": "demo@example.com",
  "phone": "+919876543210",
  "password": "demo123",
  "name": "Demo User"
}
```

### 6. Login with Test User
```bash
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "username": "demo_user",
  "password": "demo123"
}
```

---

## 📞 Support & Contact

- **API Documentation:** [GitHub Repository](https://github.com/Bhup-GitHUB/sebi-hackathon)
- **Live API:** https://sebi-hackathon.bkumar-be23.workers.dev/
- **Postman Collection:** Import the JSON above
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

## 🎯 Postman Pro Tips

### 1. Pre-request Scripts
```javascript
// Generate random data
pm.environment.set("random_username", "user_" + Math.random().toString(36).substr(2, 9));
pm.environment.set("random_email", "test_" + Math.random().toString(36).substr(2, 9) + "@example.com");
```

### 2. Dynamic Variables
- `{{$randomUserName}}` - Random username
- `{{$randomEmail}}` - Random email
- `{{$timestamp}}` - Current timestamp
- `{{$guid}}` - Random GUID

### 3. Test Chaining
```javascript
// Set token for next request
if (pm.response.json().token) {
    pm.environment.set("auth_token", pm.response.json().token);
}
```

### 4. Data-Driven Testing
Create a CSV file with test data and use Postman's data import feature for multiple test scenarios.

---

*Last Updated: August 30, 2024*
*API Version: 1.0.0*
*Postman Collection Version: 1.0.0*
