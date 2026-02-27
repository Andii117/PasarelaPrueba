# Payment Checkout App

Full-stack e-commerce checkout application built with React + Redux (Frontend) and NestJS (Backend), integrated with a payment gateway for credit card processing.

---

## 🚀 Tech Stack

### Frontend

- React 18 + TypeScript
- Vite
- Redux Toolkit + React Redux
- React Router DOM
- Axios

### Backend

- NestJS + TypeScript
- PostgreSQL
- TypeORM
- Jest

---

## 📋 Prerequisites

- Node.js v18+
- npm v9+
- PostgreSQL 14+

---

## 🛠️ Installation & Setup

### Frontend

```bash
cd payment-checkout
npm install
cp .env.example .env
npm run dev


### Backend
cd payment-api
npm install
cp .env.example .env
npm run start:dev

### Environment Variables
### .env
VITE_API_URL=http://localhost:3001
VITE_GATEWAY_URL=https://api-sandbox.co.uat.wompi.dev/v1
VITE_PUB_KEY=pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7

### Backend .env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=payment_checkout
GATEWAY_PRIVATE_KEY=prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg
GATEWAY_PUBLIC_KEY=pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7
GATEWAY_INTEGRITY_KEY=stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp
GATEWAY_URL=https://api-sandbox.co.uat.wompi.dev/v1

### APP Flow
1. Product Page (/)
      ↓
2. Checkout Page (/checkout) — Credit card + Delivery info
      ↓
3. Summary Page (/summary) — Payment breakdown + Confirm
      ↓
4. Payment Status (/status) — Result (approved/declined)
      ↓
5. Product Page (/) — Updated stock

## Data Model

##Product
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

### API Endpoints
### Products

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | /products/featured  | Get featured product with stock |
| GET    | /products/:id       | Get product by ID               |
| PATCH  | /products/:id/stock | Update product stock            |

### Customers
| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| POST   | /customers     | Create customer    |
| GET    | /customers/:id | Get customer by ID |


### Transactions
| Method | Endpoint          | Description                  |
| ------ | ----------------- | ---------------------------- |
| POST   | /transactions     | Create transaction (PENDING) |
| GET    | /transactions/:id | Get transaction by ID        |
| PATCH  | /transactions/:id | Update transaction status    |

### Deliveries
| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| POST   | /deliveries     | Create delivery        |
| GET    | /deliveries/:id | Get delivery by ID     |
| PATCH  | /deliveries/:id | Update delivery status |


### Unit Tests

# Frontend
cd payment-checkout
npm run test
npm run test:coverage

# Backend
cd payment-api
npm run test
npm run test:cov

### Project Structure
payment-checkout/
├── src/
│   ├── pages/
│   │   ├── ProductPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── SummaryPage.tsx
│   │   └── PaymentStatusPage.tsx
│   ├── store/
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── productSlice.ts
│   │       ├── checkoutSlice.ts
│   │       └── transactionSlice.ts
│   ├── services/
│   │   ├── apiService.ts
│   │   └── gatewayService.ts
│   └── types/
│       └── index.ts


### Backend
payment-api/
├── src/
│   ├── products/
│   ├── customers/
│   ├── transactions/
│   ├── deliveries/
│   └── gateway/

### Postman Endpoints
- Encontrara un archivo en la carpeta docs/ para copiar

## 🔒 Security

- Sensitive data handled via environment variables
- Card data tokenized before processing, never stored raw
- HTTPS enforced in production
- Security headers configured (OWASP alignment)

---

## 📌 Considerations

- Payment gateway runs in Sandbox mode — no real money transactions
- Database seeded with dummy products on startup
- App state persisted in localStorage for session recovery on refresh
- Branches and PRs created per feature following Git Flow

---


### Author Harold Andres Jara Granados
```
