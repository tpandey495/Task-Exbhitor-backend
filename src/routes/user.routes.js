const routers = new require('express').Router();
const passport = require('passport');
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

/**login with google passport js**/
routers.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
routers.get('/google/callback',passport.authenticate('google', { failureRedirect: '/' }),
    async(req, res) => {
      try{
      const token=await userController.signupOrLoginWithGoogle(req.user);
      res.redirect(`https://taskexhibitor.netlify.app?token=${token}`); 
      }catch(err){
        res.redirect('/');
      }
    }
  );

module.exports = routers;