const Utils = require('../utils/index');
const PlanSchema = require("../models/plan.model");

exports.createPlan = async (req, res) => {
    try {
        let { plan_name, desc } = req.body;
        if (!plan_name)
            throw { message: "Please send plan name" };
        req.body.plan_name = plan_name.toLowerCase();
        if (desc)
            req.body.desc = desc.toLowerCase();
        let user_id = req.user._id;
        req.body.user_id = user_id;
        let isPlan = await PlanSchema.findOne({ plan_name });
        if (isPlan)
            throw { message: "this plan is already exists" };
        let newPlan = new PlanSchema(req.body);
        await newPlan.save();
        return Utils.sendSuccessResponse(req, res, 200, { message: "sucessfully! Plan has created", data: newPlan });
    
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, e.message);
    }
}
exports.getPlans = async (req, res) => {
    try {
        let user_id = req.user._id;
        const plans = await PlanSchema.find({ user_id, deleted_flag : false }, { plan_name: 1, desc: 1 });
        return Utils.sendSuccessResponse(req, res, 200, plans);
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, e.message);
    }
}

/** edit plan schema */
exports.editPlan = async (req, res) => { 
    try {
        const { plan_id } = req.body;
        if (!plan_id)
            throw { message: "Please send plan id" };
        const isUpdated = await PlanSchema.updateOne({ _id: plan_id }, {$set : req.body});
        return Utils.sendSuccessResponse(req, res, 200, { message: "sucessfully! Plan has updated", data: isUpdated });
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, e.message);
    }
}
