const express = require("express");
const router = express.Router();
const { captureRazorPayment } = require("../controllers/paymentController");

router.route("/capturerazorpay").post(captureRazorPayment);

module.exports = router;
