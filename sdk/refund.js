class Refund {
    constructor(client) {
        this.client = client;
    }

    async create(params, options = {}) {
        const headers = {};
        if (options.idempotencyKey) {
            headers['Idempotency-Key'] = options.idempotencyKey;
        }
        return this.client.request('POST', '/refund/create', params, headers);
    }
}

module.exports = Refund;
