# 💳 Payment Platform – Microservices Monorepo

**A scalable, multi-tenant payment platform built with an event-driven microservices architecture.**  
Built with **Node.js**, **Express**, **MongoDB**, and **RabbitMQ** — this monorepo is designed to handle decentralized payments, merchant management, subscriptions, payouts, and webhook processing securely and reliably.

---

## 🚀 What Does This Platform Do?

This system serves as a complete multi-tenant payment infrastructure offering:

- ✅ **Merchant & Tenant Management**
- 🛒 **Payments & Subscriptions** (via internal processing and external gateways like Stripe)
- 💸 **Payouts & Refunds** lifecycle management
- 📤 **Incoming & Outgoing Webhook processing** with secure signature validation
- 📦 **Event-Driven Architecture** utilizing RabbitMQ for decentralized service communication
- 🔒 **Authentication & Idempotency** controls to guarantee safe and secure transactions

---

## 💡 Use Cases

- 🧾 Merchants onboard and manage their tenants/users.
- 🛍️ Customers perform checkouts, one-time payments, and recurring subscriptions.
- 🔄 System handles complex distributed transactions (like processing a refund that communicates with Stripe, updates internal ledgers, and fires a webhook to the merchant).
- 🛡️ Idempotent payment processing ensures no double-charges even on network failures.

---

## 🔧 How it Works (Architecture)

1. The platform is structured as a **Monorepo** containing multiple independent microservices in the `/services` directory.
2. Services communicate synchronously via **RPC** (Remote Procedure Calls) and asynchronously via **Event Bus** (Pub/Sub) using **RabbitMQ**.
3. Shared logic (EventBus, Gateway implementations, Idempotency middleware) is abstracted into the `/packages` directory.
4. Each microservice has its own isolated **MongoDB** database, enforcing strict data boundaries.
5. Clients interact with the services via decoupled REST APIs, while internal state changes propagate through RabbitMQ events.

---

## 🔐 Core Microservices

The platform consists of the following key services:

| Service | Description |
|---------|-------------|
| **`auth-service`** | JWT-based authentication and user session management |
| **`payment-service`** | Core engine for processing transactions and initiating payments |
| **`merchant-service`** | Manages merchant profiles, tenants, and API keys |
| **`stripe-service`** | Gateway implementation specifically handling Stripe interactions |
| **`subscription-service`** | Manages recurring billing cycles and subscription plans |
| **`refund-service`** | Handles full and partial refunds with gateway synchronization |
| **`payout-service`** | Manages payouts to merchants or connected accounts |
| **`transaction-service`** | Global ledger tracking all financial movements and states |
| **`incoming-webhook-service`** | Validates and ingests webhooks from external providers (e.g. Stripe) |
| **`merchant-webhook-service`** | Dispatches HTTP webhook events back to the merchant's system |
| **`gateway-router-service`** | Dynamically routes payment intent to the correct external gateway |

*(Detailed API endpoints and RPC events for each service can be found in their respective `README.md` files inside the `services/` directory.)*

---

## 🔂 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Isolated per service)
- **Message Broker:** RabbitMQ (EventPub/Sub & RPC)
- **Security:** JWT Authentication, HMAC Webhook Signatures, Idempotency Keys

---

## 🛠️ Quick Start

To run the entire platform locally for development:

1. Ensure **MongoDB** and **RabbitMQ** are running locally or update the `.env` files with your connection strings.
2. Install dependencies for all services.
3. Run the orchestration script from the root directory:
   ```bash
   node run_services.js
   ```
4. Each service will bind to its designated port (e.g., Auth on 3000, Payment on 6000, etc.) and connect to the message broker.
