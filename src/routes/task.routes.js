const routers = require('express').Router();
const {verifyToken } = require('../middleware');
const taskController = require('../controller/task.contoller');

routers.post('/', verifyToken, taskController.addTask);

module.exports = routers;