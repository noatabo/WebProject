const express = require("express")

const { register, user_creation_handler } = require("../controllers/registerController");
const { userModel } = require("../models/userModel");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true })
const registerRouter = express.Router()

registerRouter.get("/", register)
registerRouter.post("/createUser", urlencodedParser, user_creation_handler)
module.exports = {
    registerRouter
}