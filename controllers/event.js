const events = require("../models/event")
const BigPromise = require("../middlewares/bigPromise");

exports.getEvents = BigPromise(async (req,res,next) => {
    const {category} = req.query
    const queryObject = {}
    if(category){
        queryObject.category = category
    }

    let events = await events.find(queryObject)
    return res.status(200).json({
        success:true,
        events
    })
})



