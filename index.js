const app = require("./app")
require('dotenv').config()
const connectWithDb = require("./config/db")
const cloudinary = require("cloudinary")

//connect with database
connectWithDb()

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

app.listen(process.env.PORT,()=>{
    console.log(`server is running at PORT ${process.env.PORT}`)
})