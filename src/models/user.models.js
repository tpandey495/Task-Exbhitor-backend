const mongoose = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 8;
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, unique: true},
    password: {  type: String,trim: true, },
    fName: { type: String, trim: true, minlength: 1 },
    lName: { type: String, trim: true, minlength: 1 },
    type: { type: String, trim: true },
    phoneNumber: { type: Number,  minlength: 10, maxlength: 10},
    profilePicture: {  type: Buffer },
    isVerified: { type: Boolean, required: true,default: false},
    // normal login=0,login_with_google=1
    loginwith:{type:Number,required:true,default:0,enum:[0,1]}
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  return token;
};

//comparing the hash passwords
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) 
    throw { message: "User not found" };
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { message: "Incorrect Password" };
  }
  // if (!user.isVerified) {
  //   throw { message: "Email is not verified" };
  // }
  return user;
};

//hashing the password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) 
    this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;