const express = require("express")
const router = express.Router()
const validation = require("../middlewares/validation")
const orderSchema = require("../validations/orderSchema")

const { upload } = require("../app")

const { createOrder, getAllOrders } = require("../controllers/orderController")

router.route("/orders").get(getAllOrders)
router.route("/order/create").post(
  //   upload.single("paymentProof"),
  upload.any(),
  (req, res, next) => {
    req.body.orderEvents = JSON.parse(req.body.orderEvents)
    console.log(req.body.orderEvents)
    next()
  },
  // JSON.parse(req.body.orderEvents),
  validation(orderSchema),
  createOrder
)

module.exports = router
