# Changelog

All notable changes to the Payment Infrastructure Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-29

### Added
- **Developer SDK**: Initial release of the `payment-sdk` for Node.js, providing wrappers for Payments, Subscriptions, Refunds, Payouts, Merchants, and Webhooks.
- **OpenAPI 3.1 Specification**: Comprehensive interactive documentation added via Swagger UI at the Developer Portal.
- **Webhook Verification Utilities**: Shipped `sdk.webhook.constructEvent()` and `sdk.webhook.verifySignature()` for one-line webhook signature verification.
- **Error Handling**: Standardized custom errors (`AuthenticationError`, `ValidationError`, `GatewayError`, etc.) included in the SDK.
- **Subscriptions Service**: New microservice for managing recurring payments (`monthly` and `yearly` with trial support).
- **Payouts Service**: New microservice for routing payouts to destination accounts.
- **Multi-Gateway Routing Engine**: Added `GatewayRouter` service to dynamically route payments to `stripe`, `paypal`, `jazzcash`, or `easypaisa`.
- **Mock Gateways**: Added mocked gateway responses for local and sandbox development.
- **EventBus Upgrade**: Added RabbitMQ RPC support for robust synchronous inter-service communication.
- **Comprehensive Documentation**: Quick Start, Integration Guides, Sandbox documentation, and Versioning guidelines.
- **Postman Collection**: Released a pre-configured `postman_collection.json` to accelerate API exploration.

### Changed
- Refactored all internal microservice HTTP communication to use RabbitMQ RPC for tighter security and reduced latency.
- Consolidated `MONGO_URI` and `PORT` configurations into strictly `.env` driven variables.

### Removed
- Removed tightly coupled internal Axios calls in the Payment and Refund services.
