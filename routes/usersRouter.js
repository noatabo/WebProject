const express = require("express")
const { profile, profileOrders, profileSells, profileListings } = require("../controllers/profileController");
const usersRouter = express.Router()

usersRouter.get("/:userid", profile)
usersRouter.get("/:userid/sells", profileSells)
usersRouter.get("/:userid/orders", profileOrders)
usersRouter.get("/:userid/listings", profileListings)

module.exports = {
    usersRouter
}
