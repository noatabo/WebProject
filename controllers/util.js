const mongoose = require('mongoose')
const { Users, userModel } = require("../models/userModel")
function extractUserInfo(token) {
    let userJson = JSON.parse(Buffer.from(token.split('.')[1], "base64"))
    return userJson
}
function getToken() {
    let token = req.header('Cookie');
    token = token.replace('authToken=', '')
}
function verifyUser(token) {
    var verify = jwt.verify(token, process.env.JWT_SECRET_KEY)
    return verify;
}
async function getUserInfo(email) {
    let user = await Users.findOne({ email: email });
    return user
}
module.exports = {
    extractUserInfo, getUserInfo, verifyUser, getToken
}