jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { Users } = require("../models/userModel")
const login = (req, res) => {
    res.render('../views/login.ejs', {
        User: {},
        Email: res.locals.Email
    });
}
function generate_jwt(data) {
    let jwtSecret = process.env.JWT_SECRET_KEY
    token = jwt.sign(data, jwtSecret)
    console.log(token)
    return token
}
function validateEmail(email) {
    // Regular expression to match email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const user_login_handler = async (req, res) => {
    console.log(req.body)
    console.log(Users)
    const { email, password_hash } = req.body;

    // Basic validation to ensure all required fields are present and non-empty
    if (!email || !password_hash) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Email format is incorrect" });
    }

    // Check if creds are correct
    const existingUser = await Users.findOne({ email: email, passwordHash: password_hash });
    console.log(existingUser)
    if (!existingUser) {
        console.log("incorrect")
        return res.status(409).json({ message: "Username or password incorrect" });
    }
    try {
        res.cookie('authToken', generate_jwt(JSON.stringify({ email: email, passwordHash: password_hash })))
        //req.session.cookie.maxAge = 14 * 24 * hour; //2 weeks
        return res.status(200).json({ message: "Logged succesfuly" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error setting cookie" });
    }

};
module.exports = {
    login, user_login_handler,
}
