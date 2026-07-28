const axios = require('axios');
const { DEFAULT_API_GATEWAY_URL, MAX_RETRIES, TIMEOUT_MS } = require('./config');
const {
    AuthenticationError,
    ValidationError,
    GatewayError,
    RateLimitError,
    NetworkError,
    APIError
} = require('./errors');

class HTTPClient {
    constructor({ apiKey, environment = 'sandbox', baseUrl = DEFAULT_API_GATEWAY_URL, timeout = TIMEOUT_MS, maxRetries = MAX_RETRIES }) {
        if (!apiKey) {
            throw new Error("API Key is required to initialize the Payment SDK.");
        }
        
        this.apiKey = apiKey;
        this.environment = environment;
        this.maxRetries = maxRetries;
        
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: timeout,
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json'
            }
        });

      
        this.client.interceptors.response.use(
            (response) => response.data,
            (error) => this._handleError(error)
        );
    }

    async request(method, url, data = null, headers = {}) {
        let attempt = 0;
        
        while (attempt <= this.maxRetries) {
            try {
                return await this.client.request({
                    method,
                    url,
                    data,
                    headers
                });
            } catch (error) {
               
                if (error instanceof NetworkError || (error.status && error.status >= 500 && error.status < 600)) {
                    attempt++;
                    if (attempt > this.maxRetries) {
                        throw error;
                    }
                    
                    await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 100));
                } else {
                    throw error; 
                }
            }
        }
    }

    _handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            const message = data.message || data.error || 'An error occurred';

            switch (status) {
                case 400:
                    throw new ValidationError(message, data);
                case 401:
                case 403:
                    throw new AuthenticationError(message, data);
                case 429:
                    throw new RateLimitError(message, data);
                case 502:
                case 504:
                    throw new GatewayError(message, data);
                default:
                    throw new APIError(message, status, data);
            }
        } else if (error.request) {
            throw new NetworkError("No response received from the server", error.request);
        } else {
            throw new APIError(error.message, 500, error);
        }
    }
}

module.exports = HTTPClient;
