const multer = require('multer');

const multerImageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb("File should be png,jpeg or jpg");
    }
    return cb(undefined, true);
  };
const filename = (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
};
  

exports.upload = multer({filename,fileFilter: multerImageFilter,});