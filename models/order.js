const mongoose = require("mongoose")
const validator = require("validator")

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "please provide email in correct format"],
  },
  phone: {
    type: Number,
    required: true,
  },
  referalCode: {
    type: String,
  },
  college: {
    type: String,
  },
  year: {
    type: Number,
  },
  orderEvents: [
    {
      event: {
        type: mongoose.Schema.ObjectId,
        ref: "Events",
        required: true,
      },
      
    },
  ],
  paymentInfo: {
    id: {
      type: String,
      required: [true, "please provide payment id"],
    },
  },
  totalAmount: {
    type: Number,
    required: [true, "please provide the total amount"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model("Order", orderSchema)
