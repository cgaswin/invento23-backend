const mongoose = require("mongoose");
const validator = require("validator");

const ambassadorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide your name"],
  },
  collegeName: {
    type: String,
    required: [true, "please provide college Name"],
  },
  state: {
    type: String,
    required: [true, "please provide state"],
  },
  district: {
    type: String,
    required: [true, "please provide district"],
  },
  collegeType: {
    type: String,
    required: [true, "please provide college Type"],
  },
  yearOfStudy: {
    type: String,
    required: [true, "please provide year of study"],
  },
  contact: {
    type: Number,
    required: [true, "please provide contact number"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    validate: [validator.isEmail, "please provide email in correct format"],
    unique: true,
  },
  previousExperience: {
    type: String,
    required: [true, "please provide previous experience"],
  },
  referalCode: {
    type: String,
    required: [true, "please provide referral code"],
  },
  score: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("campusAmbassadors", ambassadorSchema);
