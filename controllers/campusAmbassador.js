const campusAmbassadors = require("../models/campusAmbassador");
const BigPromise = require("../middlewares/bigPromise");

exports.getCampusAmbassadors = BigPromise(async (req, res, next) => {
  const ambassadors = await campusAmbassadors.find({});
  console.log(campusAmbassadors);
    res.status(200).json({
      success: true,
      ambassadors,
    });
});

