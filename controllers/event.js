const Events = require("../models/event");
const BigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary").v2;
const CustomError = require("../errors/customError");

exports.getEvents = BigPromise(async (req, res, next) => {
  const { type, category } = req.query;
  let queryObject = {};
  if (type) {
    queryObject.eventType = type;
  }
  if (category) {
    queryObject.category = category;
  }

  let events = await Events.find(queryObject);
  console.log(events);
  return res.status(200).json({
    success: true,
    events,
  });
});

exports.getOneEvent = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  let event = await Events.findById(id);
  res.status(200).json({
    success: true,
    event,
  });
});

exports.addEvent = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("image is required", 400));
  }

  const {
    name,
    date,
    regFee,
    eventType,
    category,
    isPreEvent,
    description,
    prize,
    rules,
  } = req.body;

  let file = req.files.photo;

  if (
    !name ||
    !date ||
    !regFee ||
    !eventType ||
    !category ||
    !isPreEvent ||
    !description ||
    !prize ||
    !rules
  ) {
    return next(new CustomError("all fields are mandatory", 400));
  }

  let rulesArray = rules.split(",");

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "invento23",
  });

  const event = await Events.create({
    name,
    date,
    regFee,
    eventType,
    category,
    isPreEvent,
    description,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
    prize,
    rules: rulesArray,
  });

  res.status(200).json({
    success:true,
    event
  })
});

exports.updateEventPrize = BigPromise(async (req, res, next) => {
  const { id, first, second, third } = req.body;
  let event = await Events.findById(id);

  if (!event) {
    return next(new CustomError("No event found with this id", 401));
  }

  event.prize.first = first;
  event.prize.second = second;
  event.prize.third = third;

  await event.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Event prizes updated successfully",
    event,
  });
});
