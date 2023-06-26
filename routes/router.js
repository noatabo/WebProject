const express = require("express")
const { index } = require("../controllers/homepageController")
const { profileRouter } = require("./profileRouter")
const { signinRouter } = require("./signinRouter")
const { registerRouter } = require("./registerRouter")
const { listingsRouter } = require("./listingsRouter");
const { usersRouter } = require("./usersRouter")
const { adminRouter } = require("./adminRouter")
const { servicesRouter } = require("../routes/servicesRouter");
require("dotenv").config()
const jwt = require('jsonwebtoken')
const { renderForUser } = require("../controllers/servicesController")
const router = express.Router()

router.get("/", renderForUser, index)
router.use("/users", renderForUser, usersRouter)
router.use("/admin", renderForUser, adminRouter)
router.use("/login", renderForUser, signinRouter)
router.use("/register", renderForUser, registerRouter)
router.use("/listings", renderForUser, listingsRouter)
router.use("/utils", renderForUser, servicesRouter)
//router.get("/search", search)


module.exports = router
