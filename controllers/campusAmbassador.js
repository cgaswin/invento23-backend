const campusAmbassadors = require("../models/campusAmbassador");
const BigPromise = require("../middlewares/bigPromise");


exports.createCampusAmbassador = BigPromise(async (req,res,next)=>{
  const {
    name,
    collegeName,
    state,
    district,
    collegeType,
    yearOfStudy,
    contact,
    email,
    previousExperience,
    referralCode,
  } = req.body

  const ambassador = await campusAmbassadors.create({
    name,
    collegeName,
    state,
    district,
    collegeType,
    yearOfStudy,
    contact,
    email,
    previousExperience,
    referralCode,
  })

  res.status(200).json({
    success:true,
    ambassador
  })
})

exports.getCampusAmbassadors = BigPromise(async (req, res, next) => {
  const ambassadors = await campusAmbassadors.find();
  console.log(ambassadors)
    res.status(200).json({
      success: true,
      ambassadors,
    });
});

