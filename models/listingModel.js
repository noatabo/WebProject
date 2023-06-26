const mongoose = require('mongoose');
const { Schema } = mongoose;
const { userModel } = require("./userModel")

const listingModel = new Schema({
    listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // String is shorthand for {type: String}
    photo: String,
    albumId: String,
    name: String,
    closed: { type: Boolean, Default: false },
    lastBid: Number, //change to bid scheme
    acceptedBidDate: Date,
    acceptedBid: Number,
    acceptedBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    artist: String,
    release: String,
    Bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bids" }]
});

const Listings = mongoose.model("Listings", listingModel)
module.exports = {
    Listings, listingModel
}
