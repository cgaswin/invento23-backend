const mailHelper = require("../utils/emailHelper");
const CustomError = require("../errors/customError");
const Users = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");

exports.createUser = BigPromise(
  async (name, email, phone, refferalCode, college, year, orderEvents) => {


    console.log(name, email, phone, refferalCode, college, year, orderEvents)
    const refferalCodes = []
    const userObj = {
      name,
      email,
      phone,
      orderEvents,
    };

    if (refferalCode) {
      refferalCodes.push(refferalCode)
      userObj.refferalCodes = refferalCodes
    }

    if (college) {
      userObj.college = college;
    }

    if (year) {
      userObj.year = year;
    }

    console.log(userObj)

    const user = await Users.create(userObj);

    // try {
    //   await mailHelper({
    //     email:user.email,
    //     subject: "Welcome to Invento23",
    //   });
    // } catch (error) {
    //   console.log(error);
    //   throw new CustomError(error.message, 500);
    // }

    return user;
  }
);

exports.getUsers = BigPromise(async (req, res, next) => {
  const users = await Users.find({});
  console.log(users);
  res.status(200).json({
    success: true,
    users,
  });
});
