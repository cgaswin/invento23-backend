const mongoose = require("mongoose")

const ambassadorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide your name"]
    },
    collegeName:{
        type:String,
        required:[true,"please provide college Name"]
    },
    state:{
        type:String,
        required:[true,"please provide state"]
    },
    district:{
        type:String,
        required:[true,"please provide district"]
    },
    collegeType:{
        type:String,
        required:[true,"please provide college Type"]
    },
    yearOfStudy:{
        type:Number,
        required:[true,"please provide year of study"]
    },
    contact:{
        type:Number,
        required:[true,"please provide contact number"]
    },
    email:{
        type:String,
        required:[true,"please provide your email"],
        validate:[validator.isEmail,"please provide email in correct format"],
        unique:true
    },
    previousExperience:{
        type:Boolean,
        required:[true,"please provide previous experience"]
    },
    referralCode:{
        type:String,
        required:[true,"please provide referral code"]
    },
    score:{
        type:Number,
        default:0
    }

})

module.export = mongoose.model("campusAmbassadors",ambassadorSchema)
