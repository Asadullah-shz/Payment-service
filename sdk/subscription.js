class Subscription {
    constructor(client) {
        this.client = client;
    }

    async create(params, options = {}) {
        const headers = {};
        if (options.idempotencyKey) {
            headers['Idempotency-Key'] = options.idempotencyKey;
        }
        return this.client.request('POST', '/subscriptions', params, headers);
    }

    async list() {
        return this.client.request('GET', '/subscriptions');
    }

    async retrieve(id) {
        return this.client.request('GET', `/subscriptions/${id}`);
    }

    async pause(id) {
        return this.client.request('POST', `/subscriptions/${id}/pause`);
    }

    async resume(id) {
        return this.client.request('POST', `/subscriptions/${id}/resume`);
    }

    async cancel(id) {
        return this.client.request('POST', `/subscriptions/${id}/cancel`);
    }
}

module.exports = Subscription;
