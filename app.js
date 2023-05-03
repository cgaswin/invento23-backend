const express = require("express")
require('dotenv').config()
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("tiny"))




module.exports = app