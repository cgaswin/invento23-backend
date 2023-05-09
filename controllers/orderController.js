const Order = require("../models/order")
const Events = require("../models/event")
const campusAmbassador = require("../models/campusAmbassador")
const BigPromise = require("../middlewares/bigPromise")

exports.createOrder = BigPromise(async (req,res,next)=>{
    const {
        name,
        email,
        phone,
        refferalCode,
        college,
        year,
        orderEvents,
        paymentInfo,
        totalAmount
    } = req.body

    const order = await Order.create({
        name,
        email,
        phone,
        refferalCode,
        college,
        year,
        orderEvents,
        paymentInfo,
        totalAmount
    })

    res.status(200).json({
        success:true,
        order
    })

})

exports.updateOrder = BigPromise(async (req,res,next)=>{
    const order = await Order.findById(req.params.id)
    
    order.orderEvents.forEach(async(event)=>{
        await updateEventTicket(event.id)
    })

    if(order.refferalCode){
       await updateCampusAmbassador(order.refferalCode)
    }
    
    await order.save()

    res.status(200).json({
        success:true,
        order
    })

})

async function updateEventTicket(eventId){
    const event = await Events.findById(eventId)
    event.ticketsBooked = event.ticketsBooked+1

    await event.save({validateBeforeSave:false})
}

async function updateCampusAmbassador(refferalCode){
    const ambassador = await campusAmbassador.findById(refferalCode)
    ambassador.score = ambassador.score + 10

    await ambassador.save({validateBeforeSave:false})
}