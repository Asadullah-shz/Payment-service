const crypto = require('crypto');


function canonicalize(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(canonicalize);
    }

    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    for (const key of sortedKeys) {
        result[key] = canonicalize(obj[key]);
    }
    return result;
}


function generateRequestHash(method, url, body) {
    const canonicalBody = canonicalize(body || {});
    const data = JSON.stringify({
        method: method.toUpperCase(),
        url,
        body: canonicalBody
    });
    return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = { generateRequestHash, canonicalize };
