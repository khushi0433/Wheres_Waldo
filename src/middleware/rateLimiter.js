const rateLimit = require('express-rate-limit');

const guessesLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Too many guesses from this IP, please try again after 60 seconds' },
    strandardHeaders: true,
    legacyHeaders: false
});