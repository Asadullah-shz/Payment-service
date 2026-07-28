const IdempotencyService = require('../service/idempotency.service');
const { generateRequestHash } = require('../utils/hash.util');
const Metrics = require('../utils/metrics.util');

const idempotencyMiddleware = async (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
        return next();
    }

   
    const merchantId = req.user?.id;
    if (!merchantId) {
        return res.status(401).json({ message: "Unauthorized. Idempotency requires an authenticated merchant." });
    }

    if (idempotencyKey.length > 255 || !/^[a-zA-Z0-9_-]+$/.test(idempotencyKey)) {
        return res.status(400).json({ message: "Invalid idempotency key format." });
    }

    const requestHash = generateRequestHash(req.method, req.originalUrl, req.body);
    const startTime = Date.now();

    try {
        
        const { record: newRecord, created } = await IdempotencyService.initializeKey({
            merchantId,
            apiKeyId: req.user?.apiKeyId || null,
            key: idempotencyKey,
            requestHash,
            method: req.method,
            endpoint: req.originalUrl,
            ttlHours: 24
        });

        
        if (!created) {
            const existingRecord = await IdempotencyService.findKey(merchantId, idempotencyKey);
            if (!existingRecord) {
                
                return res.status(500).json({ message: "Internal server error during idempotency processing." });
            }

            Metrics.inc('idempotency_hits');
            console.log(`[Idempotency] Hit for key: ${idempotencyKey} (Merchant: ${merchantId})`);

            if (!IdempotencyService.validateHash(existingRecord, requestHash)) {
                Metrics.inc('processing_conflicts');
                console.warn(`[Idempotency] Hash Conflict for key: ${idempotencyKey}`);
                return res.status(409).json({
                    message: "Conflict: The idempotency key is already in use with a different request payload."
                });
            }

            if (existingRecord.status === 'PROCESSING') {
                Metrics.inc('processing_conflicts');
                console.log(`[Idempotency] Concurrent Request blocked for key: ${idempotencyKey}`);
                return res.status(409).json({
                    message: "Conflict: A request with this idempotency key is currently being processed. Please back off and retry."
                });
            }

           
            if (existingRecord.statusCode && existingRecord.responseBody) {
                Metrics.inc('cached_responses');
                console.log(`[Idempotency] Cached Response Returned for key: ${idempotencyKey}`);
              
                if (existingRecord.responseHeaders) {
                    for (const [key, value] of Object.entries(existingRecord.responseHeaders)) {
                        res.setHeader(key, value);
                    }
                }
                return res.status(existingRecord.statusCode).json(existingRecord.responseBody);
            }
            
           
            return res.status(500).json({ message: "Previous request failed catastrophically. Please retry with a new idempotency key." });
        }

        Metrics.inc('idempotency_misses');
        console.log(`[Idempotency] Miss (New Lock Acquired) for key: ${idempotencyKey}`);
        req.idempotencyKey = idempotencyKey;

        
        const originalJson = res.json;
        res.json = function (body) {
            const executionTimeMs = Date.now() - startTime;
            
           
            if (res.statusCode < 500) {
                const headers = res.getHeaders ? res.getHeaders() : {};
                IdempotencyService.saveResponse(merchantId, idempotencyKey, res.statusCode, headers, body, executionTimeMs)
                    .catch(err => console.error(`[Idempotency] Error saving response for key ${idempotencyKey}:`, err));
            } else {
               
                IdempotencyService.saveResponse(merchantId, idempotencyKey, res.statusCode, {}, { error: "Internal Server Error" }, executionTimeMs)
                    .catch(err => console.error(`[Idempotency] Error marking failure for key ${idempotencyKey}:`, err));
            }
            
            return originalJson.call(this, body);
        };

       
        const originalSend = res.send;
        res.send = function (body) {
          
            return originalSend.call(this, body);
        };

        next();
    } catch (error) {
        console.error(`[Idempotency Middleware] Unexpected error:`, error.message);
        return res.status(500).json({ message: "Internal server error during idempotency processing." });
    }
};

module.exports = idempotencyMiddleware;
