const express = require("express")
const router = express.Router()
const { upload } = require("../app")


const {getEvents,addEvent,getOneEvent,updateEventPrize,updateEventPhoto} = require("../controllers/event")

router.route("/events/create").post(upload.any(),addEvent)
router.route("/events/update").post(upload.any(),updateEventPrize)
router.route("/events/updatephoto").post(upload.any(),updateEventPhoto)
router.route("/events/:id").get(getOneEvent)
router.route("/events/:category?").get(getEvents)



module.exports = router
