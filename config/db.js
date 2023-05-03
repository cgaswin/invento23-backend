const mongoose = require("mongoose")

const connectWithDb = () => {
    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(console.log("Connection to DB Successful"))
    .catch((error)=>{
        console.log("DB connection issues")
        console.log(error)
        process.exit(1)
    })
}

module.exports = connectWithDb