const users = require("../models/user")
const BigPromise = require("../middlewares/bigPromise");

exports.createUser = BigPromise(async (req,res,next) => {
    const {name,email,refferalCodes,paymentInfo} = req.body

    const user = await users.create({
        name,
        email,
        refferalCodes,
        paymentInfo,
    })

    res.status(200).json({
        success:true,
        user
    })
})

exports.getUsers = BigPromise(async (req,res,next) => {
    const users = await users.find({})
    console.log(users)
    res.status(200).json({
        success:true,
        users
    })
})