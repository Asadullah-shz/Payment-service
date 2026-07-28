declare module 'payment-sdk' {
    export class PaymentSDK {
        constructor(config: { apiKey: string, environment?: 'sandbox' | 'production', baseUrl?: string });
        payment: Payment;
        refund: Refund;
        subscription: Subscription;
        payout: Payout;
        merchant: Merchant;
        webhook: Webhook;
    }

    class Payment {
        create(params: { amount: number, currency: string, paymentMethod: string }, options?: { idempotencyKey?: string }): Promise<any>;
        cancel(id: string): Promise<any>;
    }

    class Refund {
        create(params: { paymentId: string, amount: number, reason?: string }, options?: { idempotencyKey?: string }): Promise<any>;
    }

    class Subscription {
        create(params: { planName: string, amount: number, interval: 'monthly'|'yearly', trialPeriodDays?: number }): Promise<any>;
        list(): Promise<any>;
        retrieve(id: string): Promise<any>;
        pause(id: string): Promise<any>;
        resume(id: string): Promise<any>;
        cancel(id: string): Promise<any>;
    }

    class Payout {
        create(params: { amount: number, currency: string, destination: string }): Promise<any>;
        list(): Promise<any>;
        retrieve(id: string): Promise<any>;
        cancel(id: string): Promise<any>;
    }

    class Merchant {
        getProfile(): Promise<any>;
    }

    class Webhook {
        register(url: string, events: string[]): Promise<any>;
        verifySignature(payload: string, signatureHeader: string, secret: string): boolean;
        constructEvent(payload: string, signatureHeader: string, secret: string): any;
    }

    export class PaymentPlatformError extends Error {
        status: number;
        code: string;
        details: any;
    }
    export class AuthenticationError extends PaymentPlatformError {}
    export class ValidationError extends PaymentPlatformError {}
    export class GatewayError extends PaymentPlatformError {}
    export class RateLimitError extends PaymentPlatformError {}
    export class NetworkError extends PaymentPlatformError {}
    export class APIError extends PaymentPlatformError {}
}
