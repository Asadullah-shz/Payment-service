# Sandbox & Testing

The Sandbox environment provides a safe place to test your integration without moving real money. 

## 1. Sandbox API Keys
When initializing your SDK, use a test key (usually starting with `test_`) and set the environment to `sandbox`:

```javascript
const sdk = new PaymentSDK({
    apiKey: 'test_12345abcdef',
    environment: 'sandbox'
});
```

## 2. Mock Gateways
In sandbox mode, our platform routes your payments to mock gateways instead of live providers (like Stripe or PayPal).

- Any payment processed will immediately transition to `succeeded` or `failed` depending on the test card used.
- Webhooks will be dispatched instantly for local testing.

## 3. Test Cards
Use the following test card tokens/amounts to trigger specific responses:

| Scenario | Amount (Cents) | Expected Result | Error Code |
|----------|----------------|-----------------|------------|
| Successful Payment | 5000 | `succeeded` | None |
| Insufficient Funds | 5051 | `failed` | `insufficient_funds` |
| Card Declined | 5052 | `failed` | `card_declined` |
| Gateway Timeout | 5054 | `failed` (504 status) | `gateway_timeout` |

## 4. Local Webhook Testing
To test webhooks locally:
1. Use a tool like [ngrok](https://ngrok.com/) to expose your local Express server.
2. Run `ngrok http 3000`
3. Copy the forwarding URL (e.g., `https://abcdef123.ngrok.io`).
4. Register the webhook URL in your Sandbox dashboard or via the API:

```javascript
await sdk.webhook.register('https://abcdef123.ngrok.io/api/webhooks', ['payment.succeeded']);
```
