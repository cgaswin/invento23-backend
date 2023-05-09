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