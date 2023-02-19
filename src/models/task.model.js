const mongoose = require('../db');

const TaskSchema = new mongoose.Schema(
    {
        plan_id:{ type: mongoose.Types.ObjectId, required: true , ref : 'Plan'},
        task_name: { type: String, required: true, trim: true },
        date: { 
            day : Number, month : Number, year : Number
        },
        is_daily_task: { type: Boolean, default: false },
        timing: { type: String },
        is_completed : { type : Boolean, default : false}
    },
    {
        timestamps: true,
        timeseries : true
    }
)

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;