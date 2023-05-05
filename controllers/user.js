const Users = require("../models/user")
const BigPromise = require("../middlewares/bigPromise");

exports.createUser = BigPromise(async (req,res,next) => {
    const {name,email,refferalCodes,paymentInfo} = req.body

    const user = await Users.create({
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
    const users = await Users.find({})
    console.log(users)
    res.status(200).json({
        success:true,
        users
    })
})