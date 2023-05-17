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

  const {
    name,
    date,
    time,
    isOnline,
    contactNameFirst,
    contactNumberFirst,
    contactNameSecond,
    contactNumberSecond,
    regFee,
    regFeeTeam,
    eventType,
    category,
    isPreEvent,
    description,
    firstPrize,
    secondPrize,
    thirdPrize,
    department,
    rules,
  } = req.body;


  let file = req.files.photo;

  

  // Split time string into its components
  const [timeString, period] = time.split(" ");

  // Split hours and minutes from timeString
  const [hours, minutes] = timeString.split(":");

  // Convert hours to 24-hour format if necessary
  const eventHours =
    period === "PM" && hours !== "12"
      ? parseInt(hours) + 12
      : period === "AM" && hours === "12"
      ? parseInt(hours) - 12
      : parseInt(hours);



  // Concatenate components back together into a single string
   const eventTime = `${eventHours}:${minutes}`;
   

  let rulesArray = rules.split("$").filter(Boolean);

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "invento23",
  });

  let prizeMoney = {}
  prizeMoney.first=firstPrize
  prizeMoney.second=secondPrize
  prizeMoney.third=thirdPrize

  const event = await Events.create({
    name,
    date,
    time: new Date(`${date}T${eventTime}:00.000Z`), 
    isOnline,
    contactNameFirst,
    contactNumberFirst,
    contactNameSecond,
    contactNumberSecond,
    regFee,
    regFeeTeam,
    eventType,
    category,
    isPreEvent,
    description,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
    prizeMoney,
    department,
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
