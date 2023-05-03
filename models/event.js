const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide event name"]
    },
    date:{
        type:Date,
        required:[true,"Please enter event date"]
    },
    regFee:{
        type:Number,
        required:[true,"Please enter event registration fees"]
    },
    eventType:{
        type:String,
        required:[true,"please enter event type eg:Saptha,Proshow,Tech"]
    },
    category:{
        type:String,
        required:[true,"please enter event category eg:workshop"]
    },
    isPreEvent:{
        type:Boolean,
        required:[true,"Please enter if the event is a pre event"]
    },
    description:{
        type:String,
        required:[true,"Please enter event description"]
    },
    image:{
        type:String
    },
    prize:{
        type:String,
        default:"0",
    },
    rules:{
        type:[String],
        required:[true,"please give event rules"]
    }



})

module.exports = mongoose.model("events",eventSchema)