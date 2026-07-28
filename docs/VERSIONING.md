# API Versioning Strategy

This Payment Infrastructure Platform uses a simple and predictable versioning strategy designed to keep your integrations stable while allowing us to continuously ship improvements.

## 1. Core Principles

- All API endpoints are prefixed with a major version number, e.g., `/v1/payments`. *(Note: For the current local development setup, the gateway handles routing without explicit versioning, but production URLs will use `/v1/`)*
- Backwards-incompatible changes will **always** result in a new major version (e.g., `v2`).
- We will never silently break your integration.

## 2. What is considered a non-breaking (backward-compatible) change?
We may introduce the following changes without creating a new API version:
- Adding new API endpoints.
- Adding new optional properties to existing API requests.
- Adding new properties to existing API responses.
- Changing the order of properties within a response.
- Changing the length or format of opaque strings, such as object IDs, error messages, and other human-readable text.
- Adding new event types for webhooks.

## 3. What is considered a breaking change?
A new API version will be released if we make any of the following changes:
- Removing or renaming an endpoint.
- Removing or renaming a property in an API response.
- Changing a property's data type (e.g., changing an integer to a string).
- Adding a new required parameter to an existing request.
- Removing a webhook event type that you rely on.

## 4. Deprecation Strategy
When a new version (e.g., `v2`) is released:
1. `v1` will continue to be fully supported for a minimum of **24 months**.
2. We will provide a comprehensive Migration Guide detailing exactly what changed.
3. You will receive email notifications and dashboard alerts warning you of the upcoming deprecation 6 months, 3 months, and 1 month before `v1` is disabled.

## 5. SDK Versioning
The Node.js SDK (`payment-sdk`) follows [Semantic Versioning (SemVer)](https://semver.org/):
- `MAJOR` version when making incompatible API changes.
- `MINOR` version when adding functionality in a backward-compatible manner.
- `PATCH` version when making backward-compatible bug fixes.
