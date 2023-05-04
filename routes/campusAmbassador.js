const express = require("express")
const router = express.Router()

const {getCampusAmbassadors} = require("../controllers/campusAmbassador")

router.route("/ambassadors").get(getCampusAmbassadors)




module.exports = router