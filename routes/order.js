const express = require("express");
const router = express.Router();

const { createOrder, getAllOrders } = require("../controllers/orderController");

router.route("/orders").get(getAllOrders);
router.route("/order/create").post(createOrder);

module.exports = router;
