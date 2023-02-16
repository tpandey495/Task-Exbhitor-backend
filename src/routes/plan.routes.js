const routers = new require('express').Router();
const { verifyToken } = require("../middleware");
const planController = require("../controller/plan.controller");

routers.post('/', verifyToken, planController.createPlan);
routers.get('/', verifyToken, planController.getPlans);
module.exports = routers;