class PaymentPlatformError extends Error {
    constructor(message, status, code, details) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

class AuthenticationError extends PaymentPlatformError {
    constructor(message = "Authentication failed", details) {
        super(message, 401, 'authentication_error', details);
    }
}

class ValidationError extends PaymentPlatformError {
    constructor(message = "Validation failed", details) {
        super(message, 400, 'validation_error', details);
    }
}

class GatewayError extends PaymentPlatformError {
    constructor(message = "Gateway processing failed", details) {
        super(message, 502, 'gateway_error', details);
    }
}

class RateLimitError extends PaymentPlatformError {
    constructor(message = "Too many requests", details) {
        super(message, 429, 'rate_limit_error', details);
    }
}

class NetworkError extends PaymentPlatformError {
    constructor(message = "Network request failed", details) {
        super(message, 0, 'network_error', details);
    }
}

class APIError extends PaymentPlatformError {
    constructor(message, status = 500, details) {
        super(message, status, 'api_error', details);
    }
}

module.exports = {
    PaymentPlatformError,
    AuthenticationError,
    ValidationError,
    GatewayError,
    RateLimitError,
    NetworkError,
    APIError
};
