const mongoose = require('mongoose');
const { Schema } = mongoose;
const { userModel, Users } = require("./userModel")

const adminsModel = new Schema({
    admins: Array
});

const Admins = mongoose.model("Admins", admins)
module.exports = {
    Admins, adminsModel
}
