const express = require('express');
const Router = express.Router();
const sessionController = require('../controllers/sessionController');

Router.get('/v1/healthz', sessionController.getHealth);
Router.post('/', sessionController.createSession);

module.exports = Router;