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
  isOnline:{
    type:Boolean,
  },
  contactName:{
    type:String,
  },
  contactNumber:{
    type:Number,
  },
  regFee: {
    type: Number,
    required: [true, "Please provide event registration fees"],
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
    type: Boolean,
    required: [true, "Please provide if the event is a pre event"],
  },
  description: {
    type: String,
    required: [true, "Please provide event description"],
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  prize: {
    type: String,
    default: "0",
  },
  rules: {
    type: [String],
    required: [true, "please provide event rules"],
  },
  ticketsBooked:{
    type:Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Events", eventSchema);
