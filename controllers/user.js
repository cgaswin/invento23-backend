const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const Users = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");

exports.createUser = BigPromise(async (req, res, next) => {
  const { name, email, refferalCodes, paymentInfo } = req.body;

  const user = await Users.create({
    name,
    email,
    refferalCodes,
    paymentInfo,
  });

  var transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_HOST_PORT,
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  transport.sendMail({
    from: "Invento23 inventogec@gmail.com",
    to: req.body.email,
    subject: "Welcome to Invento23",
    html: `<p>Registration to Invento 23 was successful.</p>
    `,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.getUsers = BigPromise(async (req, res, next) => {
  const users = await Users.find({});
  console.log(users);
  res.status(200).json({
    success: true,
    users,
  });
});