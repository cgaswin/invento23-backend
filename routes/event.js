const express = require("express")
const router = express.Router()

const {getEvents,addEvent,getOneEvent,updateEventPrize,updateEventPhoto} = require("../controllers/event")

router.route("/events/create").post(addEvent)
router.route("/events/update").post(updateEventPrize)
router.route("/events/updatephoto").post(updateEventPhoto)
router.route("/events/:id").get(getOneEvent)
router.route("/events").get(getEvents)



module.exports = router
