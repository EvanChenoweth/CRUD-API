////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Game = require("../models/game")

/////////////////////////////////////////
// Create Routes
/////////////////////////////////////////

const router = express.Router()

router.get("/game/list", (req, res) => {
    // array of starter fruits
    const startGames = [
        { name: "Super Mario Bros.", genre: "Adventure", freeToPlay: false },
        { name: "The Legend of Zelda", genre: "Adventure", freeToPlay: false },
        { name: "Mario Kart", genre: "Racing", freeToPlay: false },
        { name: "Pokemon", genre: "Adventure & Strategy RPG", freeToPlay: false },
        { name: "League of Legends", genre: "MOBA", freeToPlay: false },
    ]

    // Delete every fruit in the db
    Game.deleteMany({})
        .then(() => {
            // seed with the starter fruits array
            Game.create(startGames)
                .then(data => {
                    res.json(data)
                })
        })
})

// GET request
// index route -> shows all instances of a document in the db
router.get("/games", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Game.find({})
        .then(games => {
            // this is fine for initial testing
            // res.send(fruits)
            // this the preferred method for APIs
            res.json({ games: games })
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new fruits
router.post("/games", (req, res) => {
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    req.body.owner = req.session.userId
    // we'll use the mongoose model method `create` to make a new fruit
    Game.create(req.body)
        .then(game => {
            // send the user a '201 created' response, along with the new fruit
            res.status(201).json({ game : game.toObject() })
        })
        .catch(error => console.log(error))
})

// PUT request
// update route -> updates a specific fruit
router.put("/games/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    
    // for now, we'll use a simple mongoose model method, eventually we'll update this(and all) routes and we'll use a different method
    // we're using findByIdAndUpdate, which needs three arguments
    // it needs an id, it needs the req.body, and whether the info is new
    Game.findByIdAndUpdate(id, req.body, { new: true })
        .then(game => {
            console.log('the game from update', game)
            // update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// DELETE request
// destroy route -> finds and deletes a single resource(fruit)
router.delete("/games/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the fruit
    Game.findByIdAndRemove(id)
        // send a 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        // send the error if not
        .catch(err => res.json(err))
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    Game.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populate
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate("comments.author", "username")
        .then(game => {
            res.json({ game: game })
        })
        .catch(err => console.log(err))
})
//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////

module.exports = router