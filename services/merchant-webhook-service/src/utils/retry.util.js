
function getExponentialBackoffDelay(attempt, baseDelayMs = 2000) {
  
    return Math.pow(2, attempt) * baseDelayMs;
}


function getNextRetryDate(attempt) {
    const delay = getExponentialBackoffDelay(attempt);
    return new Date(Date.now() + delay);
}


function isRetryableError(statusCode) {
    if (!statusCode) return true; 
    
    const retryableCodes = [408, 429, 500, 502, 503, 504];
    return retryableCodes.includes(statusCode);
}

module.exports = { getExponentialBackoffDelay, getNextRetryDate, isRetryableError };
