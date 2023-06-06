const routers = new require('express').Router();
const userController = require('../controller/user.controller');
const { verifyToken } = require('../middleware/index');
const { upload } = require('../services/index')


/** Sign Up & Login  */
routers.post('/login', userController.login)
routers.post('/signup', userController.signUp)

/** user info  */
routers.put('/user', verifyToken, userController.updateUserInfo);
routers.get('/user', verifyToken, userController.getUsersInfo)

/** user profile */
routers.post("/profile", verifyToken, upload.single("profilePicture"), userController.uploadProfile)
routers.get("/profile", verifyToken , userController.getProfilePic)

/** sending mail */
routers.post('/sendmail', userController.sendMail);
module.exports = routers;