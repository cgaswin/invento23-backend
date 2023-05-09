const mailHelper = require("../utils/emailHelper");
const CustomError = require("../errors/customError");
const Users = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");

exports.createUser = BigPromise(async (name, email, paymentInfo) => {
  const user = await Users.create({
    name,
    email,
    paymentInfo
  });

  try {
    await mailHelper({
      email,
      subject: "Welcome to Invento23",
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError(error.message, 500));
  }

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
