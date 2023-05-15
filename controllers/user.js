const Users = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const Events = require("../models/event");

exports.createUser = BigPromise(
  async (order) => {
    const {name,email,phone,referalCode,college,year,orderEvents} = order
    let events = []
    const userObj = {
      name,
      email,
      phone,
    };

    for(const event of orderEvents){
      const id = event.event
      const singleEvent = await Events.findById(id)
        events.push(singleEvent.name);
    }


    userObj.events = events

    if (referalCode) {
      userObj.referalCodes = [referalCode];
    }

    if (college) {
      userObj.college = college;
    }

    if (year) {
      userObj.year = year;
    }

    const user = await Users.create(userObj);

   
    return user;
  }
);

exports.getUsers = BigPromise(async (req, res, next) => {
  const users = await Users.find();
  console.log(users);
  res.status(200).json({
    success: true,
    users,
  });
});
