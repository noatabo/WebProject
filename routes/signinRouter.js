const express = require("express")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true })
const { login, user_login_handler } = require("../controllers/loginController");
const signinRouter = express.Router()

signinRouter.get("/", login)
signinRouter.post("/log", urlencodedParser, user_login_handler)
module.exports = {
    signinRouter
}
