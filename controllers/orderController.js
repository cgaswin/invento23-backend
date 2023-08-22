const Order = require("../models/order")
const Events = require("../models/event")
const campusAmbassadors = require("../models/campusAmbassador")
const Users = require("../models/user")
const { createUser } = require("../controllers/user")
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require("../errors/customError")
const mailHelper = require("../utils/emailHelper")
const cloudinary = require("cloudinary")

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    referalCode,
    college,
    year,
    orderEvents,
    paymentInfo,
    totalAmount,
  } = req.body

  const orderEventsWithParticipants = orderEvents.map((event) => {
    return {
      event: event.event,
      participants: event.participants, // Add participants array here
    }
  })

  let file = null
  let result
  if (req.files && req.files[0]) {
    file = req.files[0]

    result = await cloudinary.v2.uploader.upload(file.path, {
      // folder: "inventoPayment",
      folder: "InventoVerifyPayment",
    })
  }

  const order = await Order.create({
    name,
    email,
    phone,
    referalCode,
    college,
    year,
    orderEvents: orderEventsWithParticipants,
    paymentInfo,
    totalAmount,
    paymentProof: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  })

  if (referalCode) {
    const ambassador = await campusAmbassadors.findOne({ referalCode })

    if (ambassador) {
      order.referralVerified = true
      await order.save({ validateBeforeSave: false })
    }
  }
  for await (const event of order.orderEvents) {
    const id = event.event
    const singleEvent = await Events.findById(id)
    await updateEventTicket(id)
    await mailHelper(order, singleEvent)
  }

  res.status(200).json({
    success: true,
    order,
  })
})

exports.getAllOrders = BigPromise(async (req, res, next) => {
  let orders = await Order.find()

  res.status(200).json({
    success: true,
    orders,
  })
})
