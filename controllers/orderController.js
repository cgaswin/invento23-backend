const Order = require("../models/order")
const Events = require("../models/event")
const campusAmbassadors = require("../models/campusAmbassador")
const Users = require("../models/user")
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require("../errors/customError")
const mailHelper = require("../utils/emailHelper")
const cloudinary = require("cloudinary")
const order = require("../models/order")

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
    console.log(file)

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
    await mailHelper(order, singleEvent,"unverified")
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

exports.getUnverifiedOrders = BigPromise(async (req, res, next) => {
  
  let orders = await Order.find({ orderVerified: false }).populate("orderEvents.event")

  res.status(200).json({
    success: true,
    orders,
    
  })
})

exports.verifyOrder = BigPromise(async (req, res, next) => {
  const {id} = req.body
  console.log(id)
  const order = await Order.findById(id).populate("referalCode")
  console.log(order)
  if(order){
    order.orderVerified = true
    await order.save({ validateBeforeSave: false })
    if (order.referalCode && order.referralVerified === true) {
      const ambassador = await campusAmbassadors.findOne({ referalCode })
  
      if (ambassador) {
        ambassador.score = ambassador.score + 10
        await ambassador.save({ validateBeforeSave: false })
      }
    }


    for await (const event of order.orderEvents) {
      const id = event.event
      await updateEventTicket(id)
      const singleEvent = await Events.findById(id)
      await mailHelper(order, singleEvent,"verified")
    }
   res.status(200).json({
    message:"Order verified successfully"
   })

  }else{
    return next(new CustomError("No order found with this id", 401));
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

// async function updateCampusAmbassador(referalCode) {
//   try {
//     const ambassador = await campusAmbassadors.findOne({ referalCode });
//     if (!ambassador) {
//       throw new CustomError("no ambassador found", 401);
//     }
//     ambassador.score = ambassador.score + 10;
//     await ambassador.save({ validateBeforeSave: false });
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function updateUser(email, eventName,participants, referalCode) {
//   const user = await Users.findOne({ email });
//   if (user) {
//     user.events.push({ eventName, participants });
//     if (referalCode && !user.referalCodes.includes(referalCode)) {
//       user.referalCodes.push(referalCode);
//     }
//     await user.save({ validateBeforeSave: false });
//   }
// }
