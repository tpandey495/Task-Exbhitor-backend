const routers = require('express').Router();
const {verifyToken } = require('../middleware');
const taskController = require('../controller/task.contoller');

routers.post('/', verifyToken, taskController.addTask);
routers.get('/', verifyToken, taskController.getTask); 
routers.get("/daily", verifyToken, taskController.getDailyTask);

module.exports = routers;