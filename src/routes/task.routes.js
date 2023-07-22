const routers = require('express').Router();
const {verifyToken } = require('../middleware');
const taskController = require('../controller/task.contoller');

routers.post('/', verifyToken, taskController.addTask);
routers.get('/', verifyToken, taskController.getTask); 
routers.put('/', verifyToken, taskController.updateTask);
routers.get("/daily", verifyToken, taskController.getDailyTask);
routers.get('/today', verifyToken, taskController.getTodayTask);
routers.get('/upcoming', verifyToken, taskController.getUpComingTask);
routers.get('/heatmap', verifyToken, taskController.getHeatMapData);
module.exports = routers;
