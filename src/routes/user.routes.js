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

/** user forgot password */
routers.post("/reset-link", userController.generateResetPasswordLink);
routers.post("/reset-password",verifyToken, userController.resetPassword);
module.exports = routers;