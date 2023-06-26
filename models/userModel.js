const mongoose = require('mongoose');
const { Schema } = mongoose;

const userModel = new Schema({
    userName: String, // String is shorthand for {type: String}
    email: String,
    userId: String,
    userPhoto: { type: String, default: "/assets/profile stock 1.png" },
    Sells: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listings" }],
    Orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listings" }],
    Notifications: Array,
    Location: String,
    passwordHash: String,
    isAdmin: Boolean,
    Banned: { type: Boolean, default: false }
});

const Users = mongoose.model('User', userModel)
module.exports = { Users, userModel };
