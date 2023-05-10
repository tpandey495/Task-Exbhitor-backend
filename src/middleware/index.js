
var jwt = require('jsonwebtoken')
const User = require('../models/user.models')

exports.verifyToken = async(req,res,next)=>{
    try{
        const token = req.headers['x-access-token']
        if (!token)
         return res.status(403).send({auth: false, message:'No token provided'})
    
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findOne({_id:decoded._id})
        if(!user){
            throw ({status:400, message:'User not found'})
        }

        req.token = token
        req.user = user
        next()
    } catch(e){
        res.status(401).send(e)
    }
}