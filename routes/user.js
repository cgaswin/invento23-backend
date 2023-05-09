const express = require("express")
const router = express.Router()

const {createUser,getUsers} = require("../controllers/user")

router.route("/users").get(getUsers)


module.exports = router