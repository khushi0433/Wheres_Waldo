const rateLimit = require('express-rate-limit');

const guessesLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many guesses from this IP, please try again after 60 seconds' },
    standardHeaders: true, // Correct spelling
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = guessesLimiter;