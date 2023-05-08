const express = require("express");
const router = express.Router();
const { captureRazorpayPayment } = require("../controllers/paymentController");

router.route("/capturerazorpay").post(captureRazorpayPayment);

module.exports = router;
