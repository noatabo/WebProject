const express = require("express")
const { profile } = require("../controllers/profileController");
const profileRouter = express.Router()

profileRouter.get("/", profile)
module.exports = {
    profileRouter
}
