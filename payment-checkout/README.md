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

### Deliveries

| Field         | Type      | Description                 |
| ------------- | --------- | --------------------------- |
| id            | UUID      | Primary key                 |
| address       | VARCHAR   | Delivery address            |
| city          | VARCHAR   | City                        |
| status        | ENUM      | PENDING, SHIPPED, DELIVERED |
| transactionId | UUID      | FK → Transactions           |
| customerId    | UUID      | FK → Customers              |
| createdAt     | TIMESTAMP | Creation date               |

### Tests

```bash
cd payment-checkout
npm run test
npm run test:coverage


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
