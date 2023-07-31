const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const createdOrderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  attemptId: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  order_id: {
    type: String,
    required: true,
  },
  attemptedBy: {
    type: String,
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now(),
  },
  attemptedEmail: {
    type: String,
  },
})

module.exports = mongoose.model("createdOrder", createdOrderSchema)
