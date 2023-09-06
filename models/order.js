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
  referralVerified: {
    type: Boolean,
    default: false,
  },
  orderVerified: {
    type: Boolean,
    default: false,
  },
  orderEvents: [
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
      type: {
        type: String,
      },
      price: {
        type: Number,
      },
      ticketCount: {
        type: Number,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
  },
  totalAmount: {
    type: Number,
    required: [true, "please provide the total amount"],
  },
  // paymentProof: {
  //   id: {
  //     type: String,
  //     required: [true, "please provide the payment proof"],
  //   },
  //   secure_url: {
  //     type: String,
  //     required: [true, "please provide the payment proof"],
  //   },
  // },
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

module.exports = mongoose.model("Order", orderSchema)
