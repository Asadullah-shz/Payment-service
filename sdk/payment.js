class Payment {
    constructor(client) {
        this.client = client;
    }

    async create(params, options = {}) {
        const headers = {};
        if (options.idempotencyKey) {
            headers['Idempotency-Key'] = options.idempotencyKey;
        }
        return this.client.request('POST', '/payments', params, headers);
    }

    async cancel(id) {
        return this.client.request('POST', `/payments/${id}/cancel`);
    }
}

module.exports = Payment;
