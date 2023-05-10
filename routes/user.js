const express = require("express")
const router = express.Router()

const {getUsers} = require("../controllers/user")

router.route("/users").get(getUsers)


module.exports = router