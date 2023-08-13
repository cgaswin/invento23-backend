const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide event name"],
  },
  date: {
    type: Date,
    required: [true, "Please provide event date"],
  },
  time:{
    type:String,
  },
  isOnline:{
    type:Boolean,
  },
  contactNameFirst:{
    type:String,
  },
  contactNumberFirst:{
    type:String,
  },
  contactNameSecond:{
    type:String,
  },
  contactNumberSecond:{
    type:String,
  },
  regFee: {
    type: Number
  },
  regFeeTeam: {
    type: Number
  },
  eventType: {
    type: String,
    required: [true, "please provide event type eg:Saptha,Proshow,Tech"],
  },
  category: {
    type: String,
    required: [true, "please provide event category eg:workshop"],
  },
  isPreEvent: {
    type: String,
    required: [true, "Please provide if the event is a pre event"],
  },
  description: {
    type: String,
    required: [true, "Please provide event description"],
  },
  photo: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  prize:{
    type:Number,
    default:0
  },
  department:{
    type:String,
    default:""
  },
  rules: {
    type: [String],
  },
  ticketsBooked:{
    type:Number,
    default:0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Events", eventSchema);
