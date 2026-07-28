const crypto = require('crypto');

class SignatureService {

    static generateSignature(secret, payload, timestamp) {
       
        const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
        
        return crypto
            .createHmac('sha256', secret)
            .update(signedPayload)
            .digest('hex');
    }

   
    static getWebhookHeaders(secret, payload, webhookId) {
        const timestamp = Date.now().toString();
        const signature = this.generateSignature(secret, payload, timestamp);

        return {
            'Content-Type': 'application/json',
            'User-Agent': 'PaymentService-Webhook/1.0',
            'X-Webhook-Id': webhookId,
            'X-Webhook-Timestamp': timestamp,
            'X-Webhook-Signature': `t=${timestamp},v1=${signature}`
        };
    }
}

module.exports = SignatureService;
