const routers = require('express').Router();
const userRoutes = require('./user.routes');
const planRoutes = require('./plan.routes');
const taskRoutes = require('./task.routes');

routers.use("/users", userRoutes);
routers.use("/plan", planRoutes);
routers.use('/task', taskRoutes);

module.exports = routers;