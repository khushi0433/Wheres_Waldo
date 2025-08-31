const Router = require("express").Router();
const completedController = require("../controllers/completedController");

Router.post('/v1/completed', completedController.completedGame);

module.exports = Router;