const express = require("express")
const { Album_search, newBid, renderForUser, ProfilePic } = require("../controllers/servicesController");
const bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: true })
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const servicesRouter = express.Router()
servicesRouter.get("/album_search/:q", Album_search)
servicesRouter.post("/newBid", urlencodedParser, newBid)
servicesRouter.post("/ProfilePic", upload.single('photo'), urlencodedParser, ProfilePic)
module.exports = {
    servicesRouter
}
