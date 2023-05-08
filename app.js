const express = require("express")
require('dotenv').config()
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload");
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("tiny"))

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

  app.set("view engine", "ejs");

  app.get("/api/v1/newevent", (req, res) => {
    res.render("eventcreate");
  });
  

//routes
const campusAmbassador = require("./routes/campusAmbassador")
const event = require("./routes/event")
const payment = require("./routes/payment");


//router middleware
app.use("/api/v1",campusAmbassador)
app.use("/api/v1",event)
app.use("/api/v1", payment);

module.exports = app