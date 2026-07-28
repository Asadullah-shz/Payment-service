const IdempotencyKeyModel = require('../models/idempotency.model');

class IdempotencyService {
    
    static async findKey(merchantId, key) {
        return await IdempotencyKeyModel.findOne({ merchantId, key });
    }

    
    static validateHash(existingRecord, requestHash) {
        return existingRecord.requestHash === requestHash;
    }

   
    static async initializeKey({ merchantId, apiKeyId, key, requestHash, method, endpoint, ttlHours = 24 }) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + ttlHours);

        try {
            const record = await IdempotencyKeyModel.create({
                merchantId,
                apiKeyId,
                key,
                requestHash,
                method,
                endpoint,
                status: 'PROCESSING',
                expiresAt
            });
            return { record, created: true };
        } catch (error) {
           
            if (error.code === 11000) {
                return { record: null, created: false };
            }
            throw error;
        }
    }

   
    static async saveResponse(merchantId, key, statusCode, responseHeaders, responseBody, executionTimeMs) {
        const status = (statusCode >= 200 && statusCode < 400) ? 'COMPLETED' : 'FAILED';
        
        await IdempotencyKeyModel.updateOne(
            { merchantId, key },
            { 
                $set: { 
                    status,
                    statusCode,
                    responseHeaders,
                    responseBody,
                    executionTimeMs,
                    completedAt: new Date()
                } 
            }
        );
    }
}

module.exports = IdempotencyService;
