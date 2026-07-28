
function generatePayload(eventId, type, merchantId, data) {
    return {
        id: eventId,
        type: type,
        createdAt: new Date().toISOString(),
        merchantId: merchantId,
        data: data || {}
    };
}

module.exports = { generatePayload };
