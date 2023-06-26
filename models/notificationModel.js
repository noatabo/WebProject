const mongoose = require('mongoose');
const { Schema } = mongoose;
const { userModel } = require("./userModel")
const { listingModel } = require("./listingModel")

const notificationModel = new Schema({
    type: String, // bid or sell  {notifier} placed a bid / accepted your bid {listing} 
    notifier: userModel,
    notified: userModel,
    listing: listingModel,
});

const Notifications = mongoose.model("Notifications", notificationModel)
module.exports = {
    Notifications, notificationModel
}
