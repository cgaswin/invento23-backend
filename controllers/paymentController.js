const Razorpay = require("razorpay")
const { v4: uuidv4 } = require("uuid")
const BigPromise = require("../middlewares/bigPromise")
const createdOrder = require("../models/createdOrder")
const crypto = require("crypto")

const {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils")

exports.captureRazorPayment = BigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  })

  const myOrder = await instance.orders.create({
    amount: req.body.amount*100,//converting rupees to paisa
    currency: "INR",
    receipt: uuidv4(),
    payment_capture: 1,
  })

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrder,
  })
})

async function verifyPayment(req, res, next) {
  const { razorpay_payment_id, razorpay_signature, attemptId } = req.body

  const order = await createdOrder.findOne({ attemptId })
  const order_id = order.order_id

  const isValid = validatePaymentVerification(
    {
      order_id: order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    process.env.RAZORPAY_API_SECRET
  )

  res.status(200).json({
    success: isValid,
    msg: isValid ? "Payment verified" : "Payment not verified",
  })
}

exports.verifyPayment = verifyPayment
