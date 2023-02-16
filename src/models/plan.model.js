const mongoose = require("../db");

const PlanSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Types.ObjectId, required: true , ref : 'User'},
        plan_name: { type: String, required: true, trim: true },
        desc: {type : String}
    },
    {
        timestamps : true
    }
)

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan