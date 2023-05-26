const express = require("express");
const router = express.Router();
const validation = require("../middlewares/validation");
const orderSchema = require("../validations/orderSchema");

const { createOrder, getAllOrders } = require("../controllers/orderController");

router.route("/orders").get(getAllOrders);
router.route("/order/create").post(validation(orderSchema), createOrder);

module.exports = router;
