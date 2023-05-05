const express = require("express")
const router = express.Router()

const {getEvents,addEvent} = require("../controllers/event")

router.route("/events").get(getEvents)
router.route("/events/create").post(addEvent)


module.exports = router
