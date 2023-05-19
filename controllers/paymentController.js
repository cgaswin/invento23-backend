const Razorpay = require("razorpay");
const { v4: uuidv4 } = require('uuid');
const BigPromise = require("../middlewares/bigPromise");

exports.captureRazorPayment = BigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const myOrder = await instance.orders.create({
    amount: req.body.amount*100,//converting rupees to paisa
    currency: "INR",
    receipt: uuidv4()
  });

  res.status(200).json({
    success:true,
    amount:req.body.amount,
    order:myOrder
  })

});
