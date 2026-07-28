const rateLimit = require("express-rate-limit");

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        message: "Too many login attempts, please try again after 15 minutes"
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: {
        message: "Too many requests, please try again later"
    }
});

module.exports = {
    loginRateLimiter,
    generalRateLimiter
};
