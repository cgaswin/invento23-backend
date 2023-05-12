const Order = require("../models/order");
const Events = require("../models/event");
const campusAmbassador = require("../models/campusAmbassador");
const Users = require("../models/user");
const { createUser } = require("../controllers/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../errors/customError");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    refferalCode,
    college,
    year,
    orderEvents,
    paymentInfo,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    name,
    email,
    phone,
    refferalCode,
    college,
    year,
    orderEvents,
    paymentInfo,
    totalAmount,
  });

  const id = order._id;
  console.log(id)
  if (id) {
    console.log("got the id")
    updateOrder(id);
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getAllOrders = BigPromise(async (req, res, next) => {
  let orders = await Order.find();
  console.log(orders);
  res.status(200).json({
    success: true,
    orders,
  });
});

async function updateOrder(id) {
  const order = await Order.findById(id);
  console.log(order)
  if (!order) {
    return next(new CustomError("Please check order id", 401));
  }

  const email = order.email;
  const user = await Users.findOne({ email });

  if (!user) {
    await createUser(order.name, order.email,order.phone,order.referralCode,order.college,order.year,order.orderEvents,);
  }

  for (const event of order.orderEvents) {
    await updateEventTicket(event.id);
    await updateUser(order.email, event.name, order.refferalCode);
  }

  if (order.refferalCode) {
    await updateCampusAmbassador(order.refferalCode);
  }

  await order.save();
}

async function updateEventTicket(eventId) {
  const event = await Events.findById(eventId);
  event.ticketsBooked = event.ticketsBooked + 1;

  await event.save({ validateBeforeSave: false });
}

async function updateCampusAmbassador(refferalCode) {
  const ambassador = await campusAmbassador.findById(refferalCode);
  ambassador.score = ambassador.score + 10;

  await ambassador.save({ validateBeforeSave: false });
}

async function updateUser(email, eventName, refferalCode) {
   const user = await Users.findOne({ email });
   if (user) {
     user.events.push(eventName);
     if (refferalCode && !user.referralCodes.includes(refferalCode)) {
       user.referralCodes.push(refferalCode);
     }
     await user.save({ validateBeforeSave: false });
   }
}
