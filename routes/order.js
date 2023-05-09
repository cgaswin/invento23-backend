const express = require("express")
const router = express.Router()

const {createOrder} = require("../controllers/orderController")

router.route("/order/create").post(createOrder)
router.route("/order/:id").put(updateOrder)



module.exports = router