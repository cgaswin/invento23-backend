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
    referalCode,
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
    referalCode,
    college,
    year,
    orderEvents,
    paymentInfo,
    totalAmount,
  });

  const id = order._id;

  if (id) {
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
  const email = order.email

  if (!order) {
    return next(new CustomError("Please check order id", 401));
  }

  const user = await Users.findOne({ email });

  if (!user) {
    await createUser(
      order.name,
      order.email,
      order.phone,
      order.referalCode,
      order.college,
      order.year,
      order.orderEvents
    );
  }

  for (const event of order.orderEvents) {
    await updateEventTicket(event.id);
    await updateUser(order.email, event.name, order.referalCode);
  }

  if (order.referalCode) {
    await updateCampusAmbassador(order.referalCode);
  }

  await order.save();
}

async function updateEventTicket(eventId) {
  console.log("inside event function")
  const event = await Events.findById(eventId);
  if(!event){
    return next(new CustomError("No event with this id exists",401))
  }
  event.ticketsBooked = event.ticketsBooked + 1;

  await event.save({ validateBeforeSave: false });
}

async function updateCampusAmbassador(referalCode) {
  console.log("inside campus function")
  const ambassador = await campusAmbassador.findById(referalCode);
  ambassador.score = ambassador.score + 10;

  await ambassador.save({ validateBeforeSave: false });
}

async function updateUser(email, eventName, referalCode) {
  console.log("inside user section")
  const user = await Users.findOne({ email });
  if (user) {
    user.events.push(eventName);
    if (referalCode && !user.referalCodes.includes(referalCode)) {
      user.referalCodes.push(referalCode);
    }
    await user.save({ validateBeforeSave: false });
  }
}
