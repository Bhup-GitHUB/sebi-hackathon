# 🧪 SEBI Hackathon API – Test Cases

## 🌐 Health Check

* **Route:** `/`
* **Method:** `GET`
* **Request Body:** None
* **Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0"
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
  "message": "Database connected successfully",
  "users": [
    { "id": 1, "username": "demo_user", "email": "demo@example.com" }
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
  "username": "testuser",
  "email": "test@example.com",
  "phone": "+919876543210",
  "password": "securepass123",
  "name": "Test User"
}
```

* **Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "userId": 2
}
```

---

## 🔐 User Login

* **Route:** `/auth/login`
* **Method:** `POST`
* **Request Body:**

```json
{
  "username": "testuser",
  "password": "securepass123"
}
```

* **Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": 2,
    "username": "testuser"
  }
}
```

---

## ❌ Invalid Signup (Missing Fields)

* **Route:** `/auth/signup`
* **Method:** `POST`
* **Request Body:**

```json
{
  "username": "testuser"
}
```

* **Response:**

```json
{
  "success": false,
  "error": "Some required fields are missing"
}
```

---

## ❌ Invalid Login (Wrong Password)

* **Route:** `/auth/login`
* **Method:** `POST`
* **Request Body:**

```json
{
  "username": "testuser",
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

## ❌ Non-existent Endpoint

* **Route:** `/non-existent`
* **Method:** `GET`
* **Response:**

```json
{
  "success": false,
  "error": "Endpoint not found"
}
```
