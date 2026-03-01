# Payment Checkout App

A full-stack e-commerce checkout application that allows customers to browse products, enter payment and delivery information, and process credit card transactions through the Wompi payment gateway.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Installation](#installation)
- [Requirements](#requirements)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Tests](#tests)
- [Security](#security)
- [Contact](#contact)

---

## 📌 About the Project

This application implements a 5-step payment onboarding flow:

Product Page (/) → Browse products with stock
↓

Checkout Page (/checkout) → Credit card + Delivery info
↓

Summary Page (/summary) → Payment breakdown + Confirm
↓

Payment Status (/status) → Result (approved/declined)
↓

Product Page (/) → Updated stock

**Tech Stack**

| Layer    | Technologies                                           |
| -------- | ------------------------------------------------------ |
| Frontend | React 18, TypeScript, Vite, Redux Toolkit, CSS Modules |
| Backend  | NestJS, TypeScript, PostgreSQL, TypeORM                |
| Testing  | Jest                                                   |
| Gateway  | Wompi (Sandbox)                                        |

---

## ⚙️ Installation

### Requirements

Node.js v18+

npm v9+

PostgreSQL 14+

### Frontend

```bash
cd payment-checkout
npm install
cp .env.example .env
npm run dev

 Usage
Once both services are running:

Frontend: http://localhost:5173


The app runs entirely in Sandbox mode — no real money transactions are processed.

Import docs/postman_collection.json into Postman to test all API endpoints.

### Project Structure

payment-checkout/
├── src/
│   ├── pages/
│   │   ├── ProductPage/
│   │   │   ├── index.tsx
│   │   │   └── ProductPage.module.css
│   │   ├── CheckoutPage/
│   │   │   ├── index.tsx
│   │   │   └── CheckoutPage.module.css
│   │   ├── SummaryPage/
│   │   │   ├── index.tsx
│   │   │   └── SummaryPage.module.css
│   │   └── PaymentStatusPage/
│   │       ├── index.tsx
│   │       └── PaymentStatusPage.module.css
│   ├── store/
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── productSlice.ts
│   │       ├── checkoutSlice.ts
│   │       └── transactionSlice.ts
│   └── types/
│       └── index.ts


```

### Data Model

### Products

| Field       | Type      | Description         |
| ----------- | --------- | ------------------- |
| id          | UUID      | Primary key         |
| name        | VARCHAR   | Product name        |
| description | TEXT      | Product description |
| price       | INTEGER   | Price in COP        |
| imageUrl    | VARCHAR   | Product image URL   |
| stock       | INTEGER   | Available units     |
| createdAt   | TIMESTAMP | Creation date       |

### Customers

| Field     | Type      | Description      |
| --------- | --------- | ---------------- |
| id        | UUID      | Primary key      |
| name      | VARCHAR   | Full name        |
| phone     | VARCHAR   | Phone number     |
| address   | VARCHAR   | Delivery address |
| city      | VARCHAR   | City             |
| createdAt | TIMESTAMP | Creation date    |

### Transactions

| Field                | Type      | Description               |
| -------------------- | --------- | ------------------------- |
| id                   | UUID      | Primary key               |
| reference            | VARCHAR   | Unique payment reference  |
| amount               | INTEGER   | Total amount in COP       |
| status               | ENUM      | PENDING, APPROVED, FAILED |
| gatewayTransactionId | VARCHAR   | Gateway transaction ID    |
| productId            | UUID      | FK → Products             |
| customerId           | UUID      | FK → Customers            |
| createdAt            | TIMESTAMP | Creation date             |
| updatedAt            | TIMESTAMP | Last update               |

### Tests

```bash
cd payment-checkout
npm run test
npm run test:coverage

### información del % de coverage
-------------------------------|---------|----------|---------|---------|-------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------|---------|----------|---------|---------|-------------------
All files                      |      96 |    81.96 |   87.87 |   96.63 |
 pages/PaymentStatusPage       |   96.96 |    89.74 |    87.5 |   96.66 |
  PaymentStatusPage.module.css |       0 |        0 |       0 |       0 |
  PaymentStatusPage.tsx        |   96.96 |    89.74 |    87.5 |   96.66 | 147
 pages/SummaryPage             |   96.15 |    83.33 |      75 |      96 |
  SummaryPage.module.css       |       0 |        0 |       0 |       0 |
  SummaryPage.tsx              |   96.15 |    83.33 |      75 |      96 | 111
 services                      |     100 |     62.5 |     100 |     100 |
  apiService.ts                |     100 |       50 |     100 |     100 | 4
  gatewayService.ts            |     100 |       50 |     100 |     100 | 4-5
  ipServices.ts                |     100 |      100 |     100 |     100 |
  transactionService.ts        |     100 |      100 |     100 |     100 |
 store                         |     100 |      100 |     100 |     100 |
  store.ts                     |     100 |      100 |     100 |     100 |
 store/slices                  |    92.3 |     62.5 |   85.71 |   94.59 |
  checkoutSlice.ts             |     100 |       50 |     100 |     100 | 6-36
  productSlice.ts              |   83.33 |       75 |      75 |    87.5 | 19-22
  transactionSlice.ts          |     100 |      100 |     100 |     100 |
-------------------------------|---------|----------|---------|---------|-------------------


Coverage results are available in /coverage after running the commands above. Target: 80%+ coverage.

###  Contact & Support
Harold Andres Jara Granados
For questions or support regarding this project, please open an issue in the repository.

### 📎 Additional Information
| Item        | Detail                         |
| ----------- | ------------------------------ |
| Version     | 1.0.0                          |
| Created     | February 2026                  |
| License     | MIT                            |
| Environment | Sandbox — no real transactions |
```

### POSTMAN COLLECTION

```bash
{
  "info": {
    "name": "Payment Checkout API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001"
    }
  ],
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "Get Featured Product",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/products/featured",
            "description": "Returns the featured product with its current stock"
          },
          "response": [
            {
              "name": "Success",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"product\": {\n    \"id\": \"uuid-prod-001\",\n    \"name\": \"Producto de prueba\",\n    \"description\": \"Descripción del producto\",\n    \"price\": 50000,\n    \"imageUrl\": \"https://example.com/image.jpg\"\n  },\n  \"stock\": 5\n}"
            }
          ]
        },
        {
          "name": "Get Product By ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/products/:id",
            "description": "Returns a specific product by ID"
          },
          "response": [
            {
              "name": "Success",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"id\": \"uuid-prod-001\",\n  \"name\": \"Producto de prueba\",\n  \"description\": \"Descripción del producto\",\n  \"price\": 50000,\n  \"imageUrl\": \"https://example.com/image.jpg\",\n  \"stock\": 5\n}"
            },
            {
              "name": "Not Found",
              "status": "Not Found",
              "code": 404,
              "body": "{\n  \"statusCode\": 404,\n  \"message\": \"Product not found\"\n}"
            }
          ]
        },
        {
          "name": "Update Product Stock",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/products/:id/stock",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"stock\": 4\n}"
            },
            "description": "Updates the stock of a product after a successful transaction"
          },
          "response": [
            {
              "name": "Success",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"id\": \"uuid-prod-001\",\n  \"stock\": 4\n}"
            }
          ]
        }
      ]
    },
    {
      "name": "Customers",
      "item": [
        {
          "name": "Create Customer",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/customers",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Juan Perez\",\n  \"phone\": \"3001234567\",\n  \"address\": \"Calle 10 # 43-25\",\n  \"city\": \"Medellín\"\n}"
            },
            "description": "Creates a new customer with delivery information"
          },
          "response": [
            {
              "name": "Created",
              "status": "Created",
              "code": 201,
              "body": "{\n  \"id\": \"uuid-cust-001\",\n  \"name\": \"Juan Perez\",\n  \"phone\": \"3001234567\",\n  \"address\": \"Calle 10 # 43-25\",\n  \"city\": \"Medellín\",\n  \"createdAt\": \"2026-02-26T00:00:00.000Z\"\n}"
            },
            {
              "name": "Bad Request",
              "status": "Bad Request",
              "code": 400,
              "body": "{\n  \"statusCode\": 400,\n  \"message\": [\"name should not be empty\", \"phone must be a valid phone number\"]\n}"
            }
          ]
        },
        {
          "name": "Get Customer By ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/customers/:id",
            "description": "Returns a specific customer by ID"
          },
          "response": [
            {
              "name": "Success",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"id\": \"uuid-cust-001\",\n  \"name\": \"Juan Perez\",\n  \"phone\": \"3001234567\",\n  \"address\": \"Calle 10 # 43-25\",\n  \"city\": \"Medellín\",\n  \"createdAt\": \"2026-02-26T00:00:00.000Z\"\n}"
            },
            {
              "name": "Not Found",
              "status": "Not Found",
              "code": 404,
              "body": "{\n  \"statusCode\": 404,\n  \"message\": \"Customer not found\"\n}"
            }
          ]
        }
      ]
    },
    {
      "name": "Transactions",
      "item": [
        {
          "name": "Create Transaction",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/transactions",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productId\": \"uuid-prod-001\",\n  \"amount\": 61000,\n  \"customerData\": {\n    \"name\": \"Juan Perez\",\n    \"phone\": \"3001234567\",\n    \"address\": \"Calle 10 # 43-25\",\n    \"city\": \"Medellín\"\n  }\n}"
            },
            "description": "Creates a new transaction in PENDING status and returns a transaction ID"
          },
          "response": [
            {
              "name": "Created",
              "status": "Created",
              "code": 201,
              "body": "{\n  \"transactionId\": \"uuid-txn-001\",\n  \"reference\": \"REF-1234567890\",\n  \"status\": \"PENDING\",\n  \"amount\": 61000,\n  \"createdAt\": \"2026-02-26T00:00:00.000Z\"\n}"
            },
            {
              "name": "Bad Request",
              "status": "Bad Request",
              "code": 400,
              "body": "{\n  \"statusCode\": 400,\n  \"message\": [\"productId must be a UUID\", \"amount must be a positive number\"]\n}"
            },
            {
              "name": "Product Not Found",
              "status": "Not Found",
              "code": 404,
              "body": "{\n  \"statusCode\": 404,\n  \"message\": \"Product not found\"\n}"
            },
            {
              "name": "Out of Stock",
              "status": "Conflict",
              "code": 409,
              "body": "{\n  \"statusCode\": 409,\n  \"message\": \"Product out of stock\"\n}"
            }
          ]
        },
        {
          "name": "Get Transaction By ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/transactions/:id",
            "description": "Returns a specific transaction by ID"
          },
          "response": [
            {
              "name": "Success",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"id\": \"uuid-txn-001\",\n  \"reference\": \"REF-1234567890\",\n  \"status\": \"APPROVED\",\n  \"amount\": 61000,\n  \"gatewayTransactionId\": \"gateway-txn-id\",\n  \"product\": {\n    \"id\": \"uuid-prod-001\",\n    \"name\": \"Producto de prueba\"\n  },\n  \"customer\": {\n    \"id\": \"uuid-cust-001\",\n    \"name\": \"Juan Perez\"\n  },\n  \"createdAt\": \"2026-02-26T00:00:00.000Z\",\n  \"updatedAt\": \"2026-02-26T00:01:00.000Z\"\n}"
            },
            {
              "name": "Not Found",
              "status": "Not Found",
              "code": 404,
              "body": "{\n  \"statusCode\": 404,\n  \"message\": \"Transaction not found\"\n}"
            }
          ]
        },
        {
          "name": "Update Transaction Status",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/transactions/:id",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"APPROVED\",\n  \"gatewayTransactionId\": \"gateway-txn-id-001\"\n}"
            },
            "description": "Updates the transaction status after gateway processing. Valid statuses: APPROVED, FAILED"
          },
          "response": [
            {
              "name": "Success APPROVED",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"id\": \"uuid-txn-001\",\n  \"status\": \"APPROVED\",\n  \"gatewayTransactionId\": \"gateway-txn-id-001\",\n  \"updatedAt\": \"2026-02-26T00:01:00.000Z\"\n}"
            },
            {
              "name": "Success FAILED",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"id\": \"uuid-txn-001\",\n  \"status\": \"FAILED\",\n  \"gatewayTransactionId\": \"gateway-txn-id-001\",\n  \"updatedAt\": \"2026-02-26T00:01:00.000Z\"\n}"
            },
            {
              "name": "Invalid Status",
              "status": "Bad Request",
              "code": 400,
              "body": "{\n  \"statusCode\": 400,\n  \"message\": \"Invalid status value\"\n}"
            }
          ]
        }
      ]
    },
    {
      "name": "Deliveries",
      "item": [
        {
          "name": "Create Delivery",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/deliveries",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"transactionId\": \"uuid-txn-001\",\n  \"customerId\": \"uuid-cust-001\",\n  \"address\": \"Calle 10 # 43-25\",\n  \"city\": \"Medellín\"\n}"
            },
            "description": "Creates a delivery record after a successful transaction"
          },
          "response": [
            {
              "name": "Created",
              "status": "Created",
              "code": 201,
              "body": "{\n  \"id\": \"uuid-del-001\",\n  \"address\": \"Calle 10 # 43-25\",\n  \"city\": \"Medellín\",\n  \"status\": \"PENDING\",\n  \"transactionId\": \"uuid-txn-001\",\n  \"customerId\": \"uuid-cust-001\",\n  \"createdAt\": \"2026-02-26T00:01:00.000Z\"\n}"
            },
            {
              "name": "Bad Request",
              "status": "Bad Request",
              "code": 400,
              "body": "{\n  \"statusCode\": 400,\n  \"message\": [\"transactionId must be a UUID\", \"address should not be empty\"]\n}"
            }
          ]
        },
        {
          "name": "Get Delivery By ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/deliveries/:id",
            "description": "Returns a specific delivery by ID"
          },
          "response": [
            {
              "name": "Success",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"id\": \"uuid-del-001\",\n  \"address\": \"Calle 10 # 43-25\",\n  \"city\": \"Medellín\",\n  \"status\": \"PENDING\",\n  \"transactionId\": \"uuid-txn-001\",\n  \"customerId\": \"uuid-cust-001\",\n  \"createdAt\": \"2026-02-26T00:01:00.000Z\"\n}"
            },
            {
              "name": "Not Found",
              "status": "Not Found",
              "code": 404,
              "body": "{\n  \"statusCode\": 404,\n  \"message\": \"Delivery not found\"\n}"
            }
          ]
        },
        {
          "name": "Update Delivery Status",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/deliveries/:id",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"SHIPPED\"\n}"
            },
            "description": "Updates delivery status. Valid statuses: PENDING, SHIPPED, DELIVERED"
          },
          "response": [
            {
              "name": "Success",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"id\": \"uuid-del-001\",\n  \"status\": \"SHIPPED\",\n  \"updatedAt\": \"2026-02-26T00:02:00.000Z\"\n}"
            }
          ]
        }
      ]
    }
  ]
}
```
