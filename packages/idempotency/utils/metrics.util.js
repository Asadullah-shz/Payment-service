class IdempotencyMetrics {
    constructor() {
        this.counters = {
            idempotency_hits: 0,
            idempotency_misses: 0,
            duplicate_requests: 0,
            processing_conflicts: 0,
            cached_responses: 0
        };
    }

    inc(metricName) {
        if (this.counters[metricName] !== undefined) {
            this.counters[metricName]++;
        }
    }

    getMetrics() {
        return { ...this.counters };
    }
}


module.exports = new IdempotencyMetrics();
