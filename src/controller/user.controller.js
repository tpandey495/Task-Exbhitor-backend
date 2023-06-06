const UserSchema = require('../models/user.models');
const Utils = require('../utils/index');
const sharp = require('sharp')
const services = require('../services/index');

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();
        let isUser = await UserSchema.findByCredentials(email, password);
        if (!isUser)
            return sendErrorResponse(req, res, 400, 'user is not exists');
        let token = await isUser.generateAuthToken();
        console.log(token)
        return Utils.sendSuccessResponse(req, res, 200, {user : isUser, authToken : token});
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, e.message);   
    }
}
exports.signUp = async (req, res) => {
    try {
        let { email, fName, lName, password,type } = req.body;
        if (!email) return Utils.sendErrorResponse(req, res, 400, 'send emailId');
        req.body.email = email.toLowerCase();
        req.body.fName = fName.toLowerCase();
        req.body.lName = lName.toLowerCase();
        if (type)
            req.body.type = type.toLowerCase();
        let isUser = await UserSchema.findOne({ email : req.body.email });
        if (isUser)
            return Utils.sendErrorResponse(req, res, 400, 'user has already account with this email');
        let newUser = new UserSchema(req.body);
        await newUser.save();
        return Utils.sendSuccessResponse(req, res, 200, {message : 'successfully user has created his account'});
    }

    catch (e) {
        return Utils.sendErrorResponse(req, res, 500, e.message);
    }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadProfile = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
    
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
        const user = await UserSchema.findOneAndUpdate(
            { email: req.user.email },
            { profilePicture: buffer },
            { new: true }
        );
    
        if (!user) {
            throw { message: "user does not exist" };
        }
        res.contentType("image/png");
        res.send(buffer);
    } catch (e) {
      //console.log(e)
        return Utils.sendErrorResponse(req, res, 400, e.message);
    }
  };
  
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getProfilePic = async (req, res) => {
    try {
       
        if (!req.user.profilePicture) return Utils.sendErrorResponse(req, res, 200, 'No profile');
        res.contentType("image/png");
        res.send(req.user.profilePicture);
    }   
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, e.message);
    }
}
exports.updateUserInfo = async (req, res) => {
    try {
        const user = await UserSchema.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { ...req.body } },
            {new : true},
        );
        return Utils.sendSuccessResponse(req, res, 201, { message: "successfully updated", data : user});
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, e.message);
    }
}

exports.getUsersInfo = async (req, res) => {
    try {
        
        return Utils.sendSuccessResponse(req, res, 200, req.user);
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, e.message)
    }
}

/** testing mail functionality */
exports.sendMail = async (req, res) => { 
    try {
        let { email, subject, content } = req.body;
        let info = await services.sendMail(email, subject, content);
        return Utils.sendSuccessResponse(req, res, 200, { message: "successfully sent mail", data : info });
    }
    catch (e) {
        return Utils.sendErrorResponse(req, res, 400, e.message);
    }
};