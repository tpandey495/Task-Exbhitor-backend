const routers = require('express').Router();
const {verifyToken } = require('../middleware');
const taskController = require('../controller/task.contoller');

routers.post('/', verifyToken, taskController.addTask);
routers.get('/:plan_id', verifyToken , taskController.getTask);
module.exports = routers;