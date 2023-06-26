const mongoose = require('mongoose')
const { Users } = require("../models/userModel")
const { listingModel, Listings } = require("../models/listingModel")
const admin = async (req, res) => {
    let users = await Users.find({})
    const listings = await Listings.find({ closed: false })
    const closedlistings = await Listings.find({ closed: true })
    res.render("../views/adminPanel.ejs", { User: res.locals, Users: users, ActiveListingsAmount: listings.length, closedListingsAmount: closedlistings.length })
}
const activeListings = async (req, res) => {
    let users = await Users.find({})
    const listings = await Listings.find({ closed: false })
    let listingsUsers = new Map()
    for (let i = 0; i < listings.length; i++) {
        listingsUsers.set(listings[i]._id.toString(), await Users.findById(listings[i].listedBy))
    }

    const closedlistings = await Listings.find({ closed: true })
    res.render("activeListings.ejs", { User: res.locals, Items: { listings }, Admin: true, usersAmount: users.length, closedListingsAmount: closedlistings.length, listingsUsers: listingsUsers })
}
const archivedListings = async (req, res) => {
    let users = await Users.find({})
    const listings = await Listings.find({ closed: true })
    let listingsUsers = new Map()
    for (let i = 0; i < listings.length; i++) {
        listingsUsers.set(listings[i]._id.toString(), await Users.findById(listings[i].listedBy))
    }
    let idToUserMap = new Map()
    let u = await Users.find({})
    for (let i = 0; i < u.length; i++) {
        idToUserMap.set(u[i]._id.toString(), u[i])
        console.log(u[i]._id + "->" + u[i])
    }
    const Activelistings = await Listings.find({ closed: false })
    res.render("ArchivedListings.ejs", {
        User: res.locals,
        Items: { listings },
        Admin: true,
        usersAmount: users.length,
        activeListingsAmount: Activelistings.length,
        listingsUsers: listingsUsers,
        idToUserMap: idToUserMap
    })
}
const statistics = async (req, res) => {
    let users = await Users.find({})
    const listings = await Listings.find({ closed: false })
    const closedlistings = await Listings.find({ closed: true })
    res.render("adminStatistics.ejs", {
        User: res.locals,
        Users: users,
        ActiveListingsAmount: listings.length,
        closedListingsAmount: closedlistings.length,
        ActiveListings: listings,
        ClosedListings: closedlistings,
    })
}
const promote = async (req, res) => {
    if (res.locals.Email !== "") {
        if (res.locals.isAdmin) {
            const user = await Users.findById(req.body._id)
            user.isAdmin = true;
            user.save()
            res.sendStatus(200)
        }
    }
}
const demote = async (req, res) => {
    if (res.locals.Email !== "") {
        if (res.locals.isAdmin) {
            console.log("demote")
            const user = await Users.findById(req.body._id)
            user.isAdmin = false;
            user.save()
            res.sendStatus(200)
        }
    }
}
const ban = async (req, res) => {
    if (res.locals.Email !== "") {
        if (res.locals.isAdmin) {
            const user = await Users.findById(req.body._id)
            user.banned = true;
            user.save()
            res.sendStatus(200)
        }
    }
}
const unban = async (req, res) => {
    if (res.locals.Email !== "") {
        if (res.locals.isAdmin) {
            const user = await Users.findById(req.body._id)
            user.banned = false;
            user.save()
            res.sendStatus(200)
        }
    }
}


module.exports = { admin, activeListings, archivedListings, statistics, promote, demote, ban, unban }
