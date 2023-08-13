const Events = require("../models/event");
const BigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary").v2;
const CustomError = require("../errors/customError");
const { isValidObjectId } = require("mongoose");

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
  return res.status(200).json({
    success: true,
    events,
  });
});

exports.getOneEvent = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  console.log(isValidObjectId(id))
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
    prize,
    department,
    rules,
  } = req.body;


  let file = null;
  let result = null;
  let eventTime = null;
  

  if (req.files && req.files.photo) {
    file = req.files.photo;
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "invento23",
    });
  }

  
  if(time){
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
    eventTime = `${eventHours}:${minutes}`;
  }

   

  let rulesArray = rules.split("$").filter(Boolean);
  



  const event = await Events.create({
    name,
    date,
    time: eventTime?new Date(`${date}T${eventTime}:00.000Z`):null, 
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
    photo: result ? {
      id: result.public_id,
      secure_url: result.secure_url,
    } : null, 
    prize,
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


exports.updateEventPhoto = BigPromise(async (req,res,next)=>{

  const{id} = req.body;
  let file = null;

  let event = await Events.findById(id);
  
  if (!event) {
    return next(new CustomError("No event found with this id", 401));
  }
 
  if (req.files && req.files.photo) {
    file = req.files.photo;
    picture = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "invento23",
    });


  event.photo.id = picture.public_id;
  event.photo.secure_url = picture.secure_url;

  }else{
    return next(new CustomError("No photo added", 401));
  }


await event.save({ validateBeforeSave: false });
  
res.status(200).json({
  success:true,
  message:"Photo update successfully"
})
  
  
})