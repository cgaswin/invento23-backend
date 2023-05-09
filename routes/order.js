const express = require("express")
const router = express.Router()

const {createOrder,updateOrder} = require("../controllers/orderController")

router.route("/order/create").post(createOrder)



module.exports = router