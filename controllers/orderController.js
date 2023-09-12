const { Order } = require("../models/order")
const Events = require("../models/event")
const campusAmbassadors = require("../models/campusAmbassador")
const Users = require("../models/user")
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require("../errors/customError")
const {
  mailHelper,
  sendMailForVerifiedProshow,
} = require("../utils/emailHelper")
const cloudinary = require("cloudinary")
const order = require("../models/order")
const mongoose = require("mongoose")

exports.createOrder = BigPromise(async (req, res, next) => {
  req.body.createdAt=new Date.now()
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
    ticketsBooked,
    createdAt
  } = req.body

  console.log(orderEvents)

  const orderEventsWithParticipants = orderEvents.map((event) => {
    const e = {
      event: event.event,
      participants: event.participants, // Add participants array here
      name: event.name,
      type: event.type,
      price: event.price,
    }

    if (event.type === "proshow") {
      e.ticketCount = event.ticketCount
      return e
    }

    return e
  })

  const parsedAmount = parseInt(totalAmount)

  // console.log("Total Amount", parsedAmount, typeof totalAmount)

  // console.log(orderEventsWithParticipants)

  if (parsedAmount === 0) {
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
    })

    if (referalCode) {
      const ambassador = await campusAmbassadors.findOne({ referalCode })

      if (ambassador) {
        order.referralVerified = true
        await order.save({ validateBeforeSave: false })
      }
    }
    if (process.env.NODE_ENV === "production") {
      for await (const event of order.orderEvents) {
        const id = event.event
        const singleEvent = await Events.findById(id)
        await mailHelper(order, singleEvent, "unverified")
      }
    }

    res.status(200).json({
      success: true,
      order,
    })
    return
  }

  let file = null
  let result
  if (req.files && req.files[0]) {
    file = req.files[0]

    try {
      result = await cloudinary.v2.uploader.upload(file.path, {
        // folder: "inventoPayment",
        folder:
          process.env.NODE_ENV === "production"
            ? "InventoVerifyPayment"
            : "InventoVerifyPaymentDev",
      })
    } catch (error) {
      console.log(error)
      return next(new CustomError("Error uploading payment proof", 500))
    }
  }

  if (!result) {
    return next(new CustomError("Error uploading payment proof", 500))
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
    createdAt
  })

  console.log("Order", order)

  if (referalCode) {
    const ambassador = await campusAmbassadors.findOne({ referalCode })

    if (ambassador) {
      order.referralVerified = true
      await order.save({ validateBeforeSave: false })
    }
  }

  if (process.env.NODE_ENV === "production") {
    for await (const event of order.orderEvents) {
      const id = event.event
      const singleEvent = await Events.findById(id)
      //await mailHelper(order, singleEvent, "unverified")
    }
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

exports.getOrdersForEvent = BigPromise(async (req, res, next) => {
  const { id } = req.params
  if (mongoose.isValidObjectId(id)) {
    let event = await Events.findById(id)
    if (event) {
      let orders = await Order.find({ "orderEvents.event": id })
      res.status(200).json({
        count: orders.length,
        data: orders,
      })
    }
  } else {
    res.status(404).json({
      message: "Event not found",
    })
  }
})

exports.getUnverifiedOrders = BigPromise(async (req, res, next) => {
  let orders = await Order.find({ orderVerified: false }).populate(
    "orderEvents.event"
  )

  res.status(200).json({
    success: true,
    orders,
  })
})

exports.getVerifiedOrders = BigPromise(async (req, res, next) => {
  let orders = await Order.find({ orderVerified: true }).populate(
    "orderEvents.event"
  )

  res.status(200).json({
    success: true,
    orders,
  })
})

exports.verifyOrder = BigPromise(async (req, res, next) => {
  const { id } = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // The provided id is not a valid ObjectId
    res
      .status(400)
      .json({ message: "No order found with this id", status: false })
    return next(new CustomError("No order found with this id", 401))
  }
  const order = await Order.findById(id)

  if (order) {
    console.log("Order to verify", order)

    // return
    order.orderVerified = true
    await order.save({ validateBeforeSave: false })

    if (order.referalCode && order.referralVerified === true) {
      const ambassador = await campusAmbassadors.findOne({
        referalCode: order.referalCode,
      })

      if (ambassador) {
        ambassador.score = ambassador.score + 10
        await ambassador.save({ validateBeforeSave: false })
      }
    }

    for (const event of order.orderEvents) {
      const id = event.event
      await updateEventTicket(id)
      const singleEvent = await Events.findById(id)
      if (singleEvent.eventType === "proshow") {
        await sendMailForVerifiedProshow({
          email: order.email,
          eventName: singleEvent.name,
          uniqueId: event.uniqueId,
          eventDate: singleEvent.date,
        })
      } else {
        await mailHelper(order, singleEvent, "verified")
      }
    }

    res.status(200).json({
      message: "Order verified successfully",
      status: true,
    })
  } else {
    res.status(401).json({
      message: "No order found with this id",
      status: false,
    })
    return next(new CustomError("No order found with this id", 401))
  }
})

async function updateEventTicket(eventId) {
  try {
    const event = await Events.findById(eventId)
    event.ticketsBooked = event.ticketsBooked + 1
    await event.save({ validateBeforeSave: false })
  } catch (error) {
    console.log(error)
  }
}
