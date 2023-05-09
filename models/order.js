const mongoose = require("mongoose")
const validator = require("validator");


const orderSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"please provide email in correct format"],
    },
    phone:{
        type:Number,
        required:true
    },
    refferalCode:{
        type:String
    },
    college:{
        type:String
    },
    year:{
        type:Number
    },
    orderEvents:[
        {
            event:{
                type:mongoose.Schema.objectId,
                ref:"product",
                required:true
            }
        }
    ],
    paymentInfo:{
        id:{
            type:String
        }
    },
    totalAmount:{
        type:Number
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("Order",orderSchema)