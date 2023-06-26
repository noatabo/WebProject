const mongoose = require('mongoose')
const { Users, userModel } = require("../models/userModel")
const socketIo = require('socket.io');
const { notifyUser, newListingNotify } = require('./socketModule')
const { getUserInfo, extractUserInfo, verifyUser } = require('./util')

const { login } = require("./loginController")
const express = require("express")
const jwt = require('jsonwebtoken')
const util = require('util')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var jsonParser = bodyParser.json();
const Album_search = async (req, res) => {
    let name = req.params.q.replace(/ /g, "%20")
    let resp = await fetch("https://api.deezer.com/search/album/?q=" + name)
    resp = await resp.json()
    res.send(resp.data)
}


var count = 0;
// Middleware to validate user's session
const renderForUser = async (req, res, next) => {

    count++
    req.locals = { 'Email': 'tal' }
    res.locals = { 'Email': '' }
    try {
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let cookie = req.cookies['authToken'];
        let token = req.header('Cookie');
        token = token.replace('authToken=', '')
        //console.log("token (inside renderForUser) "+ token)
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            let userJson = extractUserInfo(token)
            let email = userJson['email']
            let userInfo = await getUserInfo(email)

            //console.log(userInfo)
            // console.log("email is: "+email)
            res.locals = userInfo
            next()
        } else {
            // Access Denied
            req.locals.Email = ''
            next();
        }
    }
    catch (err) {
        console.log("Error: " + err);
        req.locals.Email = ''
        next()

    }
};
const { Bids } = require("../models/bidModel")
const { Listings } = require("../models/listingModel")
const fs = require("fs");

const newBid = async (req, res) => {
    let amount = parseInt(req.body.bid)
    console.log(req.body.bidBy)
    let l = await Listings.findById(req.body.listing)
    let bb = await Users.findById(req.body.bidBy)
    const listing = await Listings.findById(req.body.listing).populate('listedBy')
    if (amount > l.lastBid) {
        let NewBid = new Bids({
            bidBy: bb,
            date: req.body.date,
            amount: amount,
            listing: l
        })
        await NewBid.save()
        console.log(NewBid.bidBy)
        l.Bids.push(NewBid._id)
        l.lastBid = amount
        l.save()
        let txt = " bidded " + amount + "$" + " on your track: ";
        let notification = {
            'txt': txt,
            'bidder': bb._id,
            'bidderName': bb.userName,
            'listing': l._id,
            'listingName': l.name
        }
        notifyUser(notification, listing.listedBy.email)
        newListingNotify()
        await res.send({ lastBid: NewBid.amount })
    } else {
        console.log("lower bid")
        return res.status(400).json({ msg: "Bid need to be bigger than last bid" })
    }
}
const ProfilePic = async (req, res) => {
    if (!(res.locals.Email === "")) {

        fs.appendFile("./public/uploads/" + res.locals._id + "." + req.file.mimetype.split("/")[1], req.file.buffer, (err) => {
            if (err) {
                console.error(err);
            } else {
                // res.send('File saved!');
            }

        });
        let u = await Users.findById(res.locals._id)
        u.userPhoto = "/uploads/" + u._id + "." + req.file.mimetype.split("/")[1];
        await u.save()
        res.json({ image: "/uploads/" + u._id + "." + req.file.mimetype.split("/")[1] });
    }
}


module.exports = {
    Album_search, renderForUser, verifyUser, extractUserInfo, newBid, ProfilePic
}
