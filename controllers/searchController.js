const { Listings } = require("../models/listingModel")
const mongoose = require('mongoose')
const fs = require('fs');
const { notifyUser, newListingNotify } = require('./socketModule')
const { Bids } = require("../models/bidModel");
const { Users } = require("../models/userModel")
const { tweet } = require("./twitterController")

const postNewListing = async (req, res) => {
    ////console.log(req.locals)
    if (req.locals.email === "") {
        return res.status(409).json({ message: "not logged in" });
    }
    if (!req.file || !req.body.bid || !req.body.picked) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    let album = await fetch("https://api.deezer.com/album/" + req.body.picked.id)

    await album.json()
    if (album.error) {
        return res.status(409).json({ message: "wrong album id" });
    }
    console.log("new listing notify")
    let picked = req.body.picked
    ///console.log("id after send", picked)
    res.send({ message: "success" })
    let title = req.body.title
    let a = await fetch("https://api.deezer.com/album/" + picked)
    a = await a.json()
    let release = a.release_date
    let artist = req.body.artist
    //console.log("relese: " + release)
    let newlisting = new Listings({
        listedBy: res.locals,
        photo: "",
        albumId: picked,
        artist: artist,
        lastBid: parseInt(req.body.bid),
        name: title,
        release: release,
        closed: false
    })
    await newlisting.save()
    fs.appendFile("./public/uploads/" + newlisting._id + "." + req.file.mimetype.split("/")[1], req.file.buffer, (err) => {
        if (err) {
            console.error(err);
        } else {
            // res.send('File saved!');
        }
    });
    newlisting.photo = "/uploads/" + newlisting._id + "." + req.file.mimetype.split("/")[1]
    await newlisting.save()
    newListingNotify()
    await tweet(`${newlisting.listedBy.userName} has listed a vinyl of ${a.title} for a starting bid of ${newlisting.lastBid}$ view here : https://localhost:8080/listings/${newlisting._id}`)
}
const search = async (req, res) => {
    const listings = await Listings.find({ closed: false })
    let listingsUsers = new Map()
    let populatedListing = []
    for (let i = 0; i < listings.length; i++) {
        listingsUsers.set(listings[i]._id.toString(), await Users.findById(listings[i].listedBy))
        populatedListing.push(listings[i].populate("listedBy"))
        for (let j = 0; j < listings[i].Bids.length; j++) {

        }
    }
    if (res.locals.Email !== "") {
        res.render('../views/listings.ejs', {
            Items: { listings },
            Admin: res.locals.isAdmin,
            usersMap: listingsUsers
        })
    } else {
        res.render('../views/listings.ejs', {
            Items: { listings },
            Admin: false,
            usersMap: listingsUsers
        })
    }
}
const listing = async (req, res) => {
    let er = false;
    const listingId = req.params.id
    const l = await Listings.findOne({ _id: listingId }).catch(() => {
        er = true;
        return res.status(404).send("Resource not found. Invalid ID")
    })
    console.log(l != null)
    if (l != null) {
        let map = new Map()
        let userBidMap = new Map()
        let seller = await Users.findById(l.listedBy.toString())
        let arr = []
        for (const b of l.Bids) {

            let bid = await Bids.findById(b)
            console.log("bid: " + bid)
            arr.push(bid)
            userBidMap.set(bid._id, await Users.findById(bid.bidBy))
        }

        console.log("arr " + arr.length)
        const name = l.albumId
        //console.log(name)
        let Album = await fetch("https://api.deezer.com/album/" + name)
        Album = await Album.json()
        //console.log(Album)
        let Songs = await fetch(Album.tracklist)
        Songs = await Songs.json()
        let Genre = await fetch("https://api.deezer.com/genre/" + Album.genre_id)
        Genre = await Genre.json()

        res.render('../views/listing.ejs', {
            Item: l,
            Album: Album,
            Songs: Songs.data,
            Genre: Genre,
            Email: res.locals.email,
            Bids: arr,
            userBidMap: userBidMap,
            seller: seller
        });
    }
}

const newListing = (req, res) => {
    if (res.locals.Email !== "") {
        res.render("../views/newListing.ejs", {
            Email: res.locals.email
        });
    } else {
        res.redirect("/login")
    }
}
const deleteListing = async (req, res) => {
    console.log(res.locals._id)
    let l = await Listings.findById(req.body.listing)
    if (res.locals._id.equals(l.listedBy._id) || res.locals.isAdmin) {
        console.log("deleting")
        let bidsQuery = l.Bids
        Listings.deleteOne({ _id: l._id }).then(() => { console.log("deleted") })
        bidsQuery.forEach(b => {
            Bids.deleteOne({ _id: b._id }).then(() => { console.log("deleted") })
        })
        res.json({ message: "success" })
    } else {
        res.status(400).json({ message: "not an admin or listing owner" })
    }
}
const parametersSearch = async (req, res) => {
    const listings = await Listings.find({ closed: false })
    let listingsUsers = new Map()
    for (let i = 0; i < listings.length; i++) {
        listingsUsers.set(listings[i]._id.toString(), await Users.findById(listings[i].listedBy))
    }
    if (req.params) {
        const data = (req.query)
        let query = {}
        if (data.name !== "all") {
            query.name = {}
            query.name.$regex = new RegExp(data.name)
            query.name.$options = "i"
        }
        if (data.artist !== "all") {
            query.artist = {}
            query.artist.$regex = new RegExp(data.artist)
            query.artist.$options = "i"

        }
        if (data.minimum !== "all") {
            query.lastBid = {}
            query.lastBid.$gt = data.minimum
        }
        if (data.maximum !== "all") {
            if (data.minimum === "all") {
                query.lastBid = {}
            }
            query.lastBid.$lt = data.maximum
        }
        if (data.release !== "all") {
            query.release = data.release
        }
        query.closed = false
        console.log(query)
        let listings = await Listings.find(query).catch(e => {
            res.status(404)
        })
        if (res.locals.Email !== "") {
            console.log("rendering")
            res.render('../views/listings.ejs', {
                Items: { listings },
                Admin: res.locals.isAdmin,
                usersMap: listingsUsers


            })
        } else {
            console.log("rendering")
            res.render('../views/listings.ejs', {
                Items: { listings },
                Admin: false,
                usersMap: listingsUsers

            })
        }


    }
}
const closeListing = async (req, res) => {
    let l = await Listings.findById(req.body.listing).populate('listedBy')
    let b = await Bids.findById(req.body.bid)
    if (l && res.locals._id.equals(l.listedBy._id)) {
        l.closed = true
        l.acceptedBid = b.amount
        l.acceptedBidDate = b.date
        l.acceptedBidder = b.bidBy
        l.save()
        let seller = await Users.findById(l.listedBy)
        let bidder = await Users.findById(b.bidBy)
        seller.Sells.push(l)
        seller.save()
        bidder.Orders.push(l)
        bidder.save()
        res.send({ message: "sell completed" })
        let txt = " accepted your " + b.amount + "$" + " bid on: ";
        let notification = {
            'txt': txt,
            'bidder': l.listedBy._id,
            'bidderName': l.listedBy.userName,
            'listing': l._id,
            'listingName': l.name
        }
        console.log(notification)
        notifyUser(notification, bidder.email)
        newListingNotify()
    }
}
module.exports = {
    search, listing, newListing, postNewListing, deleteListing, closeListing, parametersSearch
}
