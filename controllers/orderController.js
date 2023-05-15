const Order = require("../models/order");
const Events = require("../models/event");
const campusAmbassadors = require("../models/campusAmbassador");
const Users = require("../models/user");
const { createUser } = require("../controllers/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../errors/customError");
const mailHelper = require("../utils/emailHelper")

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
  const email = order.email;

  if (!order) {
    return new CustomError("Please check order id", 401);
  }

  const user = await Users.findOne({ email });

  if (!user) {
    await createUser(order);
  }
  else{
    for (const event of order.orderEvents) {
      const id = event.event
      const singleEvent = await Events.findById(id)
      await updateUser(order.email, singleEvent.name, order.referalCode);
    }
}

for (const event of order.orderEvents) {
  const id = event.event;
  const singleEvent = await Events.findById(id);
  await updateEventTicket(id);
  await mailHelper(order,singleEvent);
}

if (order.referalCode) {
  await updateCampusAmbassador(order.referalCode);
}

await order.save();

}

async function updateEventTicket(eventId) {
  try {
    const event = await Events.findById(eventId);
    event.ticketsBooked = event.ticketsBooked + 1;
    await event.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(error);
  }
}

async function updateCampusAmbassador(referalCode) {
  try {
    const ambassador = await campusAmbassadors.findOne({ referalCode });
    if (!ambassador) {
      throw new CustomError("no ambassador found", 401);
    }
    ambassador.score = ambassador.score + 10;
    await ambassador.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(error);
  }
}

async function updateUser(email, eventName, referalCode) {
  const user = await Users.findOne({ email });
  if (user) {
    user.events.push(eventName);
    if (referalCode && !user.referalCodes.includes(referalCode)) {
      user.referalCodes.push(referalCode);
    }
    await user.save({ validateBeforeSave: false });
  }
}
