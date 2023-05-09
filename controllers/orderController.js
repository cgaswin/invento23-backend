const Order = require("../models/order")
const Events = require("../models/event")
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
    

})

async function updateEventTicket(eventId){
    const event = await Events.findById(eventId)

    event.ticketsBooked = event.ticketsBooked+1

    await event.save({validateBeforeSave:false})
}