const Router = require("express").Router();
const photoController = require('../controllers/photoController');

Router.get('/v1/leaderboard', photoController.leaderboard);
Router.post('/v1/admin/photos', photoController.createPhoto);

module.exports = Router;