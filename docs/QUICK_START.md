# Quick Start Guide

Welcome to the Payment Infrastructure Platform! This guide will help you integrate our platform into your application in minutes.

## 1. Installation

Install our official Node.js SDK via npm:

```bash
npm install payment-sdk
```

## 2. Authentication

Before making requests, you need an API Key.
1. Sign up for a Merchant account.
2. Navigate to your Dashboard > Developers > API Keys.
3. Generate a Sandbox API Key.

Initialize the SDK with your API Key:

```javascript
const { PaymentSDK } = require('payment-sdk');

const sdk = new PaymentSDK({
    apiKey: 'YOUR_API_KEY',
    environment: 'sandbox' // or 'production'
});
```

## 3. Make Your First Payment

Creating a payment is as simple as:

```javascript
try {
    const payment = await sdk.payment.create({
        amount: 5000, // Amount in cents ($50.00)
        currency: 'usd',
        paymentMethod: 'card' // or specific tokens
    });
    console.log("Payment created:", payment);
} catch (error) {
    console.error("Payment failed:", error.message);
}
```

### 3.1 Idempotency
To prevent duplicate charges on network retries, use an idempotency key:

```javascript
const { PaymentSDK } = require('payment-sdk');

const idempotencyKey = PaymentSDK.utils.generateIdempotencyKey();
const payment = await sdk.payment.create(
    { amount: 5000, currency: 'usd', paymentMethod: 'card' },
    { idempotencyKey }
);
```

## 4. Subscriptions & Payouts

**Create a Subscription:**
```javascript
const subscription = await sdk.subscription.create({
    planName: "Pro Tier",
    amount: 1500, // $15.00
    interval: "monthly",
    trialPeriodDays: 14
});
```

**Issue a Payout:**
```javascript
const payout = await sdk.payout.create({
    amount: 10000, // $100.00
    currency: "usd",
    destination: "bank_acct_123"
});
```

## 5. Receiving Webhooks

Register an endpoint to listen for events:

```javascript
await sdk.webhook.register('https://your-domain.com/webhooks', [
    'payment.succeeded',
    'refund.created'
]);
```

Verify webhook signatures in your Express route:

```javascript
app.post('/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
    const signature = req.headers['x-webhook-signature'];
    
    try {
        const event = sdk.webhook.constructEvent(
            req.body, // Raw body
            signature,
            process.env.WEBHOOK_SECRET
        );
        
        console.log("Verified event:", event.type);
        res.status(200).send();
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
```

---

*Ready for production? Simply change the `environment` to `production` and swap out your Sandbox API Key for a Live API Key!*
