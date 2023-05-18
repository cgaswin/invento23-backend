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
    type:Date,
    required:[true,"please provide time for the event"]
  },
  isOnline:{
    type:Boolean,
  },
  contactNameFirst:{
    type:String,
  },
  contactNumberFirst:{
    type:Number,
  },
  contactNameSecond:{
    type:String,
  },
  contactNumberSecond:{
    type:Number,
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
      required:true,
    },
    secure_url: {
      type: String,
      required:true,
    },
  },
  prizeMoney:{
    first:{
      type:String,
      default:""
    },
    second:{
      type:String,
      default:""
    },
    third:{
      type:String,
      default:""
    },
  },
  department:{
    type:String,
    default:""
  },
  rules: {
    type: [String],
  },
  prize:{
    first:{
      type:String,
      default:""
    },
    second:{
      type:String,
      default:""
    },
    third:{
      type:String,
      default:""
    },
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
