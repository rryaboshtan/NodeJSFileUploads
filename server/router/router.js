const route = require('express').Router();
const controller = require('../controller/controller');

route.get('/', controller.home);

module.exports = route;
