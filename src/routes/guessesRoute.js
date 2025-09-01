const Router = require('express').Router();
const guessesController = require('../controllers/guessesController');
const ratelimiter = require('../middleware/rateLimiter');

Router.post('/v1/guesses', guessesController.createGuess);

module.exports = Router;