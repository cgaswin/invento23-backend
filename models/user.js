const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide your name"]
    },
    email:{
        type:String,
        required:[true,"please provide your email"],
        validate:[validator.isEmail,"please provide email in correct format"],
        unique:true
    },
    referralCodes:{
        type:[String],
    },
    isPaymentSuccessful:{
        type:Boolean,
        required:[true,"Please provide if the payment was successful"]
    },
    events:{
        type:[String],
        required:[true,"please provide the event list"]
    }
})


module.exports = mongoose.model("users",userSchema)