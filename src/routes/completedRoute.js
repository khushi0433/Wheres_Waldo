const Router = require("express").Router();
const completedController = require("../controllers/completedController");

Router.post('/completed', completedController.completedGame);

module.exports = Router;