import { nanoid } from "nanoid";
const BigPromise = require("../middlewares/bigPromise");

exports.captureRazorPayment = BigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  console.log(req.body.amount);

  const myOrder = await instance.orders.create({
    amount: req.body.amount,
    currency: "INR",
    receipt: nanoid(),
  });

  res.status(200).json({
    success:true,
    amount:req.body.amount,
    order:myOrder
  })

});
