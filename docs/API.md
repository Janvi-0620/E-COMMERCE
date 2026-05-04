# API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

### Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or malformed request |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - User authenticated but lacks permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists (duplicate) |
| 500 | Internal Server Error - Server error |

---

## Authentication Endpoints

### Register New User
```
POST /auth/register
```

**Request Body:**
```json
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
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "message": "Registration successful"
}
```

**Error (409):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### Login User
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "role": "user"
    }
  },
  "message": "Login successful"
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "role": "user",
    "createdAt": "2024-01-15T10:30:45.123Z"
  },
  "message": "User fetched successfully"
}
```

---

### Logout User
```
POST /auth/logout
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

### Refresh Token
```
POST /auth/refresh
```

**Request Body:**
```json
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

## Product Endpoints

### List Products
```
GET /products?page=1&limit=20&category=electronics&sort=-price
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |
| category | string | Filter by category |
| search | string | Search in name/description |
| minPrice | number | Filter by minimum price |
| maxPrice | number | Filter by maximum price |
| sort | string | Sort field (prefix with - for descending) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Laptop",
        "price": 999.99,
        "category": "electronics",
        "image": "https://cdn.example.com/laptop.jpg",
        "stock": 10,
        "rating": 4.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  },
  "message": "Products fetched successfully"
}
```

---

### Get Product Details
```
GET /products/:productId
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "discountPrice": 799.99,
    "category": "electronics",
    "image": "https://cdn.example.com/laptop.jpg",
    "images": ["url1", "url2"],
    "stock": 10,
    "rating": 4.5,
    "reviews": [
      {
        "userId": "...",
        "rating": 5,
        "comment": "Great product!",
        "createdAt": "2024-01-15T10:30:45.123Z"
      }
    ]
  },
  "message": "Product fetched successfully"
}
```

---

### Create Product (Admin Only)
```
POST /products
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Request Body:**
```
name: "Laptop"
description: "High-performance laptop"
price: 999.99
discountPrice: 799.99
category: "electronics"
stock: 10
image: <file>
images: [<file>, <file>]
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "price": 999.99,
    "message": "Product created successfully"
  }
}
```

---

### Update Product (Admin Only)
```
PUT /products/:productId
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Laptop Pro",
  "price": 1099.99,
  "stock": 15
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Laptop Pro",
    "price": 1099.99
  },
  "message": "Product updated successfully"
}
```

---

### Delete Product (Admin Only)
```
DELETE /products/:productId
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Order Endpoints

### Create Order
```
POST /orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "razorpay"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "quantity": 2,
        "price": 999.99
      }
    ],
    "totalAmount": 1999.98,
    "status": "pending",
    "paymentStatus": "pending"
  },
  "message": "Order created successfully"
}
```

---

### Get User Orders
```
GET /orders
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "totalAmount": 1999.98,
      "status": "processing",
      "paymentStatus": "completed",
      "createdAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "message": "Orders fetched successfully"
}
```

---

### Get Order Details
```
GET /orders/:orderId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "name": "Laptop",
        "quantity": 2,
        "price": 999.99
      }
    ],
    "totalAmount": 1999.98,
    "status": "processing",
    "paymentStatus": "completed",
    "shippingAddress": "123 Main St",
    "createdAt": "2024-01-15T10:30:45.123Z"
  },
  "message": "Order fetched successfully"
}
```

---

## Admin Endpoints

### Get All Orders (Admin Only)
```
GET /admin/orders?page=1&limit=20&status=processing
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "507f1f77bcf86cd799439012",
        "userId": "507f1f77bcf86cd799439011",
        "totalAmount": 1999.98,
        "status": "processing",
        "createdAt": "2024-01-15T10:30:45.123Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  },
  "message": "Orders fetched successfully"
}
```

---

### Update Order Status (Admin Only)
```
PUT /admin/orders/:orderId/status
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "status": "shipped",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  },
  "message": "Order status updated successfully"
}
```

---

## Payment Endpoints

### Create Razorpay Order
```
POST /payments/razorpay/order
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439012",
  "amount": 1999.98
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_9A33XWu170gUtm",
    "amount": 199998,
    "currency": "INR"
  },
  "message": "Razorpay order created"
}
```

---

### Verify Razorpay Payment
```
POST /payments/razorpay/verify
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "razorpayPaymentId": "pay_9A33XWu170gUtm",
  "razorpayOrderId": "order_9A33XWu170gUtm",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "507f1f77bcf86cd799439012",
    "paymentStatus": "completed"
  },
  "message": "Payment verified successfully"
}
```

---

## Error Handling

### Common Error Responses

**Invalid Input (400):**
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Conflict (409):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Structure
JWT tokens are valid for **7 days** by default.

Example token payload:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "iat": 1705315845,
  "exp": 1705920645
}
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 requests | 15 minutes |
| General API | 100 requests | 15 minutes |
| Product Upload | 20 uploads | 1 hour |

**Rate Limit Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1705315845
```

---

## Examples using cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

### List Products
```bash
curl "http://localhost:5000/api/v1/products?page=1&limit=20&category=electronics"
```

---

**API documentation will be updated as features are implemented.**
