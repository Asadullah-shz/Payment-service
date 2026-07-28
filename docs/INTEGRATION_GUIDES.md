# Integration Guides

Whether you're building a backend in Node.js or a mobile app in React Native, our SDK and APIs are built for seamless integration.

## 1. Node.js & Express

```javascript
const express = require('express');
const { PaymentSDK } = require('payment-sdk');

const app = express();
const sdk = new PaymentSDK({ apiKey: 'YOUR_API_KEY' });

app.use(express.json());


app.post('/api/checkout', async (req, res) => {
    try {
        const payment = await sdk.payment.create({
            amount: req.body.amount,
            currency: 'usd',
            paymentMethod: req.body.paymentMethod
        });
        res.json({ success: true, payment });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});


app.post('/api/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
    const signature = req.headers['x-webhook-signature'];
    try {
        const event = sdk.webhook.constructEvent(req.body, signature, 'YOUR_WEBHOOK_SECRET');
        
        if (event.type === 'payment.succeeded') {
            console.log("Payment successful for ID:", event.data.paymentId);
            // Update your database here
        }

        res.status(200).send();
    } catch (error) {
        res.status(400).send(`Webhook error: ${error.message}`);
    }
});
```

## 2. React / Next.js (Client-Side)

> [!WARNING]
> **Never** expose your secret API key on the frontend! You must call your own backend (like the Express route above) from your React application.

```jsx
import { useState } from 'react';

export default function Checkout() {
    const [status, setStatus] = useState('idle');

    const handlePayment = async () => {
        setStatus('processing');
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 5000, paymentMethod: 'card' })
        });
        
        const data = await res.json();
        if (data.success) {
            setStatus('success');
        } else {
            setStatus('error');
            console.error(data.error);
        }
    }

    return (
        <div>
            <button onClick={handlePayment} disabled={status === 'processing'}>
                {status === 'processing' ? 'Processing...' : 'Pay $50.00'}
            </button>
        </div>
    );
}
```

## 3. Python (Django / Flask)

*(Python SDK coming soon! For now, use direct API requests).*

```python
import requests
import uuid

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.paymentplatform.com/v1"

def create_payment():
    headers = {
        "x-api-key": API_KEY,
        "Idempotency-Key": str(uuid.uuid4())
    }
    payload = {
        "amount": 5000,
        "currency": "usd",
        "paymentMethod": "card"
    }
    
    response = requests.post(f"{BASE_URL}/payments", json=payload, headers=headers)
    return response.json()
```
