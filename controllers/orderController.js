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


exports.checkInOrder = BigPromise(async (req, res, next) => {
  const { orderId, day } = req.body; // Assuming you send orderId and day in the request body

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({
        status: "failed",
        message: "No order with this id",
      });
    }

    // Assuming day is either "day2" or "day3"
    if (day === "day2" || day === "day3") {
      // Update the day2 or day3 array based on the day provided
      order.orderEvents.forEach((event) => {
        if (event.type === "proshow") {
          const index = event.day2.findIndex((value) => value === false);
          if (index !== -1) {
            event[day][index] = true;
          }
        }
      });

      // Save the updated order
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
        message: `Check-in for ${day} updated successfully for order ID ${orderId}`,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Invalid day provided. Please provide 'day2' or 'day3'",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});




async function updateEventTicket(eventId) {
  try {
    const event = await Events.findById(eventId)
    event.ticketsBooked = event.ticketsBooked + 1
    await event.save({ validateBeforeSave: false })
  } catch (error) {
    console.log(error)
  }
}
