const Router = require('express').Router();
const guessesController = require('../controllers/guessesController');
const ratelimiter = require('../middleware/rateLimiter');

console.log('ratelimiter:', ratelimiter);
console.log('guessesController:', guessesController);

Router.post('/', ratelimiter, guessesController.createGuess);

module.exports = Router;