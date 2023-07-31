const express = require("express")
const router = express.Router()
const { captureRazorPayment } = require("../controllers/paymentController")
const { verifyPayment } = require("../controllers/paymentController")

router.route("/capturerazorpay").post(captureRazorPayment)
router.route("/verify").post(verifyPayment)

module.exports = router
