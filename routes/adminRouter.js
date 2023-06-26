const express = require("express")
const { admin, activeListings, archivedListings, statistics, promote, demote, ban, unban } = require("../controllers/adminController");
const bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: true })
const adminRouter = express.Router()

adminRouter.get("/", admin)
adminRouter.get("/activeListings", activeListings)
adminRouter.get("/archivedListings", archivedListings)
adminRouter.get("/statistics", statistics)
adminRouter.post("/promote", urlencodedParser, promote)
adminRouter.post("/demote", urlencodedParser, demote)
adminRouter.post("/ban", urlencodedParser, ban)
adminRouter.post("/unban", urlencodedParser, unban)
module.exports = {
    adminRouter
}
