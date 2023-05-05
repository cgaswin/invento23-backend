const Events = require("../models/event")
const BigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary").v2;
const CustomError = require("../errors/customError");

exports.getEvents = BigPromise(async (req,res,next) => {
    const {category} = req.query
    const queryObject = {}
    if(category){
        queryObject.category = category
    }

    let events = await Events.find(queryObject)
    return res.status(200).json({
        success:true,
        events
    })
})

exports.addEvent = BigPromise(async(req,res,next) => {

    if(!req.files){
        return next(new CustomError("image is required",400))
    }

    const {name,date,regFee,eventType,category,isPreEvent,description,prize,rules} = req.body


    if(!name|| !date || !regFee || !eventType || !category || !isPreEvent || !description || !prize || !rules){
        return next(new CustomError("all fields are mandatory",400))
    }  

    let file = req.files.photo

    const result = await cloudinary.uploader.upload(file.tempFilePath,{
        folder:"invento23"
    })

    const event = await Events.create({
        name,
        date,
        regFee,
        eventType,
        category,
        isPreEvent,
        description,
        prize,
        rules,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url,
          },
    })
})


