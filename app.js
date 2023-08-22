const express = require("express")
require("dotenv").config()
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const cloudinary = require("cloudinary").v2
const multer = require("multer")

const app = express()

app.use(helmet())
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(morgan("tiny"))

//cors
app.use(
  cors({
    origin:
      process.env.ENV === "development"
        ? "*"
        : ["https://invento23.com", "https://invento-23.vercel.app/"],
  })
)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// )

const upload = multer({ dest: "tmp/" })

module.exports = { upload }

app.set("view engine", "ejs")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
})

app.use("/api", limiter)

app.get("/api/v1/newevent", (req, res) => {
  res.render("eventcreate")
})

app.get("/api/v1/updateevent", (req, res) => {
  res.render("updateEvent")
})

app.get("/api/v1/updatephoto", (req, res) => {
  res.render("updateEventPhoto")
})

app.post("/rzp-test", async (req, res, next) => {
  const amountDue = req.body.amount * 100

  try {
    const response = await rzp.orders.create({
      amount: amountDue,
      currency: "INR",
      receipt: Date.now().toString(),
      payment_capture: true,
    })

    const order = await createdOrder.create({
      amount: req.body.amount,
      attemptId: uuidv4(),
      order_id: response.id,
      attemptedBy: req.body.attemptedBy,
      attemptedAt: req.body.attemptedAt,
      attemptedEmail: req.body.attemptedEmail,
    })

    order.save()

    // console.log(response.id, order)

    res.json({
      id: response.id,
      currency: response.currency,
      amt: response.amount,
      createdAt: response.created_at,
      attemptId: order.attemptId,
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      code: error.code,
      error: error,
    })
  }
})

app.post("/rzp-test", async (req, res, next) => {
  const amountDue = req.body.amount * 100

  try {
    const response = await rzp.orders.create({
      // amount: amountDue,
      amount: amountDue,
      currency: "INR",
      receipt: Date.now().toString(),
      payment_capture: true,
    })

    const order = await createdOrder.create({
      amount: req.body.amount,
      attemptId: uuidv4(),
      order_id: response.id,
      attemptedBy: req.body.attemptedBy,
      attemptedAt: req.body.attemptedAt,
      attemptedEmail: req.body.attemptedEmail,
    })

    order.save()

    console.log(response.id, order)

    res.json({
      id: response.id,
      currency: response.currency,
      amt: response.amount,
      createdAt: response.created_at,
      attemptId: order.attemptId,
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      code: error.code,
      error: error,
    })
  }
})

//routes
const campusAmbassador = require("./routes/campusAmbassador")
const event = require("./routes/event")
const payment = require("./routes/payment")
const order = require("./routes/order")

//router middleware
app.use("/api/v1", campusAmbassador)
app.use("/api/v1", event)
app.use("/api/v1", payment)
app.use("/api/v1", order)

module.exports = app
