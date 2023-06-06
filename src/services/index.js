const multer = require('multer');
const nodemailer = require('nodemailer');

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
 

/** configure the nodemailer app */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  }
});

/** sending the a mail  */
exports.sendMail = async (email, subject, content) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject : "Testing ",
      html: "<h1>hello</h1>"
    };
    console.log("sending mail");
    let info = await transporter.sendMail(mailOptions);
   
    console.log("Message sent: %s", info.messageId);
    return info;
    
  }
  catch (e) {
    console.log(e);
    console.log(e.message);
    return null;
  }
}

exports.upload = multer({filename,fileFilter: multerImageFilter,});