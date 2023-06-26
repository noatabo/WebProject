const { Users } = require("../models/userModel")
const socketIo = require('socket.io');
const { login } = require("./loginController")
const express = require("express")
const jwt = require('jsonwebtoken')
const { extractUserInfo } = require('./util')
let io
//let mapEmailSeq =new Map();


async function setupSocketListeners(_io) {
    io = _io
    // set up Socket.io event listeners for notifications
    io.on('connection', (socket) => {
        socket.on('subscribe', (authToken) => {
            console.log("(setupSocketListeners)userInfo " + extractUserInfo(authToken)['email'])
            let email = extractUserInfo(authToken)['email']
            //mapEmailSeq.set(email,authToken)
            // subscribe the socket to notifications for the specified user
            socket.join(`notifications-${email}`);
        });

        // ... other event listeners for notifications
        socket.on('joinListing', () => {
            console.log("someone joined")
            socket.join('listings')
        })

    });

}
function newListingNotify() {

    console.log('newListingNotify activated ')
    io.to('listings').emit('newListing')
}
async function notifyUser(notification, targetEmail) {
    console.log("--------" + notification + targetEmail)
    io.to(`notifications-${targetEmail}`).emit(`notifications`, JSON.stringify(notification))
}
module.exports = {
    setupSocketListeners, newListingNotify, notifyUser,
};