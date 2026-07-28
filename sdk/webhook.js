const crypto = require('crypto');

class Webhook {
    constructor(client) {
        this.client = client;
    }

    async register(url, events) {
        return this.client.request('POST', '/webhook-endpoints', { url, events });
    }

   
    verifySignature(payload, signatureHeader, secret) {
        try {
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(payload)
                .digest('hex');

            if (expectedSignature !== signatureHeader) {
                throw new Error('Invalid signature');
            }
            return true;
        } catch (error) {
            return false;
        }
    }

   
    constructEvent(payload, signatureHeader, secret) {
        if (!this.verifySignature(payload, signatureHeader, secret)) {
            throw new Error('Webhook signature verification failed.');
        }
        return JSON.parse(payload);
    }
}

module.exports = Webhook;
