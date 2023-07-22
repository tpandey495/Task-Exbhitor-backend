const TaskSchema = require('../models/task.model'); 
const Utils = require('../utils');
const db = require('../db').connection;

exports.addTask = async (req, res) => {
    try {
        if (!req.body.task_name || !req.body.plan_id || !req.body.date)
            throw { message: 'please send required data' };
        req.body.task_name = req.body.task_name.toLowerCase();
        const date = {day : parseInt(req.body.date.split("-")[2]), month : parseInt(req.body.date.split("-")[1]), year : parseInt(req.body.date.split("-")[0]),}
        req.body.date = date;
        let isTask = await TaskSchema.findOne({ plan_id: req.body.plan_id, task_name: req.body.task_name });
        if (isTask)
            throw { message: 'this task already present' };
        let newTask = new TaskSchema(req.body);
        console.log(newTask);
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
        let query = plan_id ? { plan_id , deleted_flag : false, is_completed : false} : {deleted_flag : false, is_completed : false};
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
            pipeline: [
                {
                    $match: {
                        $expr:
                        {
                            $and:
                                [
                                    { $eq: ['$plan_id', '$$plan_id'] },
                                    { $eq: ['$is_daily_task', true] },
                                    { $eq: ["$deleted_flag", false] },
                                    { $eq : ['$is_completed', false] }
                                ]
                        }
                    }
                }],
            as : 'tasks'
        }
        const projection = { task_name: '$tasks.task_name', timinng: '$tasks.timing', date: '$tasks.date' };
        db.collection('plans').aggregate(
            [
                { $match: { user_id: user_id, deleted_flag : false } },
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

exports.getTodayTask = async (req, res) => {
    try {
        let user_id = req.user._id;
        const date = { day: new Date().getDate(), month: new Date().getMonth()+1, year: new Date().getFullYear() };
       
        let task_join = {
            from: 'tasks',
            let: { plan_id: '$_id' },
            pipeline: [
                {
                    $match:
                    {
                        $expr: {
                            $and:
                                [
                                    { $eq: ['$plan_id', '$$plan_id'] },
                                    { $eq: ['$date', date] },
                                    { $eq: ["$deleted_flag", false] },
                                    { $eq : ['$is_completed', false] }
                                ]
                        }
                    }
                }],
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

exports.getUpComingTask = async (req, res) => {
    try {
        let user_id = req.user._id;
        const currentDate = new Date();
        const query = {
            'tasks.date': {
                $gt: {
                    day: currentDate.getDate(),
                    month: currentDate.getMonth() + 1, // Months are zero-indexed, so add 1 to get the correct month.
                    year: currentDate.getFullYear()
                }
            }
        };
        let task_join = {
            from: 'tasks',
            let: { plan_id: '$_id' },
            pipeline: [
                {
                    $match:
                    {
                        $expr: {
                            $and:
                                [
                                    { $eq: ['$plan_id', '$$plan_id'] },
                                    { $eq: ["$deleted_flag", false] },
                                    { $eq: ['$is_completed', false] },
                                ]
                        }
                    }
                }],
            as: 'tasks'
        }
        const projection = { task_name: '$tasks.task_name', timinng: '$tasks.timing', date: '$tasks.date' };
        db.collection('plans').aggregate(
            [
                { $match: { user_id: user_id } },
                { $lookup: task_join },
                { $unwind: { path: '$tasks' } },
                { $match: query },
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
/** update task  */
exports.updateTask = async (req, res) => {
    try {
        if (!req.body.task_id)
            throw { message: 'please send required data' };
        if (req.body.task_name)
            req.body.task_name = req.body.task_name.toLowerCase();
        if (req.body.date)
            req.body.date = {day : parseInt(req.body.date.split("-")[2]), month : parseInt(req.body.date.split("-")[1]), year : parseInt(req.body.date.split("-")[0]),}
        if (req.body.is_completed)
            req.body.complated_date = new Date();
        let isTask = await TaskSchema.findOne({ _id: req.body.task_id });
        if (!isTask)
            throw { message: 'this task_id is not present' };
        const isUpdated = await TaskSchema.updateOne({ _id: req.body.task_id }, {$set : req.body});
        // await newTask.save();
        return Utils.sendSuccessResponse(req, res, 200, { message: "successfully created", success: true, data: isUpdated });

    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, { message: e.message, success: false });
    }
 }

/** get data for heat map */
exports.getHeatMapData = async (req, res) => { 
    try {
        //print user id
        console.log(req.user._id);
        const taskPipeline = [
            { $match: { $expr: { $and: [{ $eq: ['$plan_id', '$$plan_id'] }, { $eq : ['$is_completed', false] }] } } },
            {
                $project: {
                    date: { $dateFromString: { dateString: { $concat: [{ $toString: "$date.year" }, "-", { $toString: "$date.month" }, "-", { $toString: "$date.day" }] } } },
                },
            },
            
        ]
        
        db.collection("plans").aggregate(
            [
                // { $match: { user_id: req.user._id } },
                {
                    $lookup: {
                        from: 'tasks',
                        let: { plan_id: '$_id' },
                        pipeline: taskPipeline,
                        as: 'tasks'
                    }
                },
                { $unwind: "$tasks" },
                { $group: { _id: "$tasks.date", cnt: { $sum: 1 } } },
                { $sort: { _id: 1 } },
                { $project: { _id :  0,date : "$_id", cnt : 1} }
            ]
        ).toArray((err, data) => {
            if (err) return Utils.sendErrorResponse(req, res, 400, { message: err.message, success: false });
            const result = [];
            const date = new Date();
            let idx = 0;
            function isValid(idx, date, month, year){
                if (idx >= data.length) return false;
                const cur = data[idx];
                const curDate = new Date(cur.date);
                if (curDate.getDate() === date && curDate.getMonth() === month && curDate.getFullYear() === year) return true;
                return false;
            }
            for (let i = 0; i <= date.getMonth(); i++){
                let currentdate = new Date(2023, i, 1);
                let currentMonth = currentdate.getMonth();
                const currentYear = currentdate.getFullYear();
                const nextMonth = new Date(currentYear, currentMonth + 1, 1);
                nextMonth.setDate(nextMonth.getDate() - 1);
                const numberOfDays = nextMonth.getDate();
                console.log(numberOfDays)
                const dateData = [];
                for (let date = 1; date <= numberOfDays; date++){
                    let cur = { date: `${date}/${i + 1}/${currentYear}`, cnt: 0 }
                    if (isValid(idx, date, i, currentYear))
                        cur.cnt =  data[idx++].cnt;
                    dateData.push(cur);
                }
                result.push({data : dateData, month: i + 1, year: currentYear });
            }

            Utils.sendSuccessResponse(req, res, 200, { data: result, success: true });
         });
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, { message: e.message, success: false });
    }
}