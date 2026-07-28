class Payout {
    constructor(client) {
        this.client = client;
    }

    async create(params, options = {}) {
        const headers = {};
        if (options.idempotencyKey) {
            headers['Idempotency-Key'] = options.idempotencyKey;
        }
        return this.client.request('POST', '/payouts', params, headers);
    }

    async list() {
        return this.client.request('GET', '/payouts');
    }

    async retrieve(id) {
        return this.client.request('GET', `/payouts/${id}`);
    }

    async cancel(id) {
        return this.client.request('POST', `/payouts/${id}/cancel`);
    }
}

module.exports = Payout;
