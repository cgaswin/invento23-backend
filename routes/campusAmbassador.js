const express = require("express")
const router = express.Router()

const {getCampusAmbassadors,createCampusAmbassador} = require("../controllers/campusAmbassador")

router.route("/ambassadors").get(getCampusAmbassadors)
router.route("/ambassadors/create").post(createCampusAmbassador)





module.exports = router