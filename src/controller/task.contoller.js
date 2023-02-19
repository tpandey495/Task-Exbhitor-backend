const TaskSchema = require('../models/task.model'); 
const Utils = require('../utils');
const db = require('../db').connection;

exports.addTask = async (req, res) => {
    try {
        if (!req.body.task_name || !req.body.plan_id || !req.body.date)
            throw { message: 'please send required data' };
        req.body.task_name = req.body.task_name.toLowerCase();
        req.body.date = new Date(req.body.date);
        let isTask = await TaskSchema.findOne({ plan_id: req.body.plan_id, task_name: req.body.task_name });
        if (isTask)
            throw { message: 'this task already present' };
        let newTask = new TaskSchema(req.body);
        await newTask.save();
        return Utils.sendSuccessResponse(req, res, 200, { message: "successfully created", success: true, data: newTask });
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, {message : e.message, success : false});
    }
}

exports.getTask = async (req, res) => {
    try {
        let { plan_id } = req.query;
        let query = plan_id ? { plan_id } : {};
        const tasks = await TaskSchema.find(query);
        return Utils.sendSuccessResponse(req, res, 200, { data: tasks, success: true });

    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, { message : e.message , success : false})
    }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns return daily task for a user 
 */
exports.getDailyTask = async (req, res) => {
    try {
        let user_id = req.user._id;
        console.log(user_id);
        let task_join = {
            from: 'tasks',
            let: { plan_id: '$_id' },
            pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$plan_id', '$$plan_id'] }, {$eq : ['$is_daily_task', true]}]} } }],
            as : 'tasks'
        }
        const projection = { task_name: '$tasks.task_name', timinng: '$tasks.timing', date: '$tasks.date' };
        db.collection('plans').aggregate(
            [
                { $match: { user_id: user_id } },
                { $lookup: task_join },
                { $unwind: {path : '$tasks'} },
                { $project: projection}
            ]
        ).toArray((err, results) => {
            
            if (err) return Utils.sendErrorResponse(req, res, 400, { message: err.message, success: false });
            Utils.sendSuccessResponse(req, res, 200, {data : results, success : true});
        })
    
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, { message: e.message, success: false });
    }
}