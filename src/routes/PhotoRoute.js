const Router = require("express").Router();
const photoController = require('../controllers/photoController');

Router.get('/leaderboard', photoController.leaderboard);
Router.post('/admin/photos', photoController.createPhoto);

module.exports = Router;