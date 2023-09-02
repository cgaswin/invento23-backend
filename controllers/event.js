const Events = require("../models/event")
const BigPromise = require("../middlewares/bigPromise")
const cloudinary = require("cloudinary").v2
const CustomError = require("../errors/customError")
const { isValidObjectId } = require("mongoose")

exports.getEvents = BigPromise(async (req, res, next) => {
  const category = req.query.category

  let queryObject = { eventType: category }
  if (category == undefined) {
    queryObject = {}
  }

  console.log(queryObject)
  let events = await Events.find(queryObject)
  console.log(events.length)
  return res.status(200).json({
    success: true,
    events,
  })
})

exports.getOneEvent = BigPromise(async (req, res, next) => {
  const id = req.params.id
  console.log(id)
  console.log(isValidObjectId(id))

  if (!isValidObjectId(id)) {
    const err = new CustomError("Invalid id", 400)

    CustomError.respond(err, res)

    next(err)
  }

  let event = await Events.findById(id)

  if (!event) {
    const err = new CustomError("No event found with this id", 404)

    CustomError.respond(err, res)

    next(err)
  }

  res.status(200).json({
    success: true,
    event,
  })
})

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
    maxParticipants,
    isPreEvent,
    description,
    prize,
    department,
    rules,
  } = req.body

  let file = null
  let mobileFile = null
  let result = null
  let mobileResult = null
  let eventTime = null

  const isPreEventBoolean = isPreEvent === "true"

  if (req.files && req.files[0]) {
    file = req.files[0]
    result = await cloudinary.uploader.upload(file.path, {
      folder: "invento23",
    })
  }

  if (req.files && req.files[1]) {
    mobileFile = req.files[1]
    mobileResult = await cloudinary.uploader.upload(mobileFile.path, {
      folder: "invento23",
    })
  }

  if (time) {
    // Split time string into its components
    const [timeString, period] = time.split(" ")

    // Split hours and minutes from timeString
    const [hours, minutes] = timeString.split(":")

    // Convert hours to 24-hour format if necessary
    const eventHours =
      period === "PM" && hours !== "12"
        ? parseInt(hours) + 12
        : period === "AM" && hours === "12"
        ? parseInt(hours) - 12
        : parseInt(hours)

    // Concatenate components back together into a single string
    eventTime = `${eventHours}:${minutes}`
  }

  console.log(rules)
  let rulesArray = rules.split("$").filter(Boolean)

  const event = await Events.create({
    name,
    date,
    time: eventTime ? new Date(`${date} ${eventTime}:00+5:30`) : null,
    isOnline,
    contactNameFirst,
    contactNumberFirst,
    contactNameSecond,
    contactNumberSecond,
    regFee,
    regFeeTeam,
    eventType,
    category,
    maxParticipants,
    isPreEvent: isPreEventBoolean,
    description,
    photo: result
      ? {
          id: result.public_id,
          secure_url: result.secure_url,
        }
      : null,
    photoMobile: mobileResult
      ? {
          id: mobileResult.public_id,
          secure_url: mobileResult.secure_url,
        }
      : null,
    prize,
    department,
    rules: rulesArray,
  })

  res.status(200).json({
    success: true,
    event,
  })
})

exports.updateEventPrize = BigPromise(async (req, res, next) => {
  const { id, prize } = req.body
  let event = await Events.findById(id)

  if (!event) {
    return next(new CustomError("No event found with this id", 401))
  }

  event.prize = prize

  await event.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    message: "Event prize updated successfully",
    event,
  })
})

exports.updateEventPhoto = BigPromise(async (req, res, next) => {
  const { id } = req.body
  let file = null
  let picture = null
  let mobileFile = null
  let mobilePicture = null

  let event = await Events.findById(id)

  if (!event) {
    return next(new CustomError("No event found with this id", 401))
  }

  if (req.files && req.files[0]) {
    file = req.files[0]
    picture = await cloudinary.uploader.upload(file.path, {
      folder: "invento23",
    })

    event.photo.id = picture.public_id
    event.photo.secure_url = picture.secure_url
  }

  if (req.files && req.files[1]) {
    mobileFile = req.files[1]
    mobilePicture = await cloudinary.uploader.upload(mobileFile.path, {
      folder: "invento23",
    })

    event.photoMobile.id = mobilePicture.public_id
    event.photoMobile.secure_url = mobilePicture.secure_url
  }

  await event.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    message: "Photo update successfully",
  })
})
