const mongoose = require("mongoose")
const validator = require("validator")
const { nanoid } = require("nanoid")

const orderedEventsSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.ObjectId,
      ref: "Events",
      required: true,
    },
    participants: [
      {
        type: String,
      },
    ],
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  { discriminatorKey: "type" }
)

const orderedProshowSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
    default: () => nanoid(6),
    index: { unique: true },
  },
  ticketCount: {
    type: Number,
  },
  dayTwo:[{
    type:Boolean,
    default:false
  }],
  dayThree:[{
    type:Boolean,
    default:false
  }]
})

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
  referralVerified: {
    type: Boolean,
    default: false,
  },
  orderVerified: {
    type: Boolean,
    default: false,
  },
  orderEvents: [orderedEventsSchema],
  paymentInfo: {
    id: {
      type: String,
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

  paymentProof: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
})

orderSchema.path("orderEvents").discriminator("proshow", orderedProshowSchema)

const Order = mongoose.model("Order", orderSchema)
module.exports = { Order }
// module.exports = orderedProshow
// module.exports = orderedEvents
