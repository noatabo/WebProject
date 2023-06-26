const mongoose = require('mongoose')
const { Users } = require("../models/userModel")

const register = (req, res) => {
    res.render('../views/register.ejs', {
        User: {},
        Email: res.locals.Email
    });
}

function validateEmail(email) {
    // Regular expression to match email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const user_creation_handler = async (req, res) => {
    console.log(req.body)
    console.log(Users)
    const { username, email, password_hash, location } = req.body;

    // Basic validation to ensure all required fields are present and non-empty
    if (!username || !email || !password_hash || !location) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Email format is incorrect" });
    }

    // Check if username or email already exists in the database
    const existingUser = await Users.findOne({ $or: [{ userName: username }, { email: email }] });
    if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" });
    }
    // fetch map of picked location

    // Create a new user object
    const newUser = new Users({
        userName: username,
        email: email,
        Location: location,
        passwordHash: password_hash,
        isAdmin: false
    });

    // Save the user object to the database
    await newUser.save();

    // Return a success message to the client

    res.status(201).json({ message: "User created successfully" });
};

module.exports = {
    register, user_creation_handler,
}
