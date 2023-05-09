const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide your name"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    validate: [validator.isEmail, "please provide email in correct format"],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "please provide contact number"],
  },
  referralCodes: {
    type: [String],
  },
  college:{
    type:String
  },
  year:{
    type:Number
  },
  events: {
    type: [String],
    required: [true, "please provide the event list"],
  },
});

module.exports = mongoose.model("Users", userSchema);
