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
  referalCodes: {
    type: [String],
  },
  college:{
    type:String,
    default:""
  },
  year:{
    type:Number,
    default:0
  },
  events: {
    type: [String],
    required: [true, "please provide the event list"],
  },
});

module.exports = mongoose.model("Users", userSchema);
