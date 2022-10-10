////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Game = require("../models/game")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Game.find({})
        .populate("comments.author", "username")
        .then(games => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            res.render('games/index', { games, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET for new fruit
// renders the form to create a fruit
router.get('/new', (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    res.render('games/new', { username, loggedIn, userId })
})

// POST request
// create route -> gives the ability to create new fruits
router.post("/", (req, res) => {
    // bc our checkboxes dont send true or false(which they totally should but whatev)
    // we need to do some js magic to change the value
    // first side of the equals sign says "set this key to be the value"
    // the value comes from the ternary operator, checking the req.body field
    req.body.freeToPlay = req.body.freeToPlay === 'on' ? true : false
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our fruits
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    console.log('the game from the form', req.body)
    // we'll use the mongoose model method `create` to make a new fruit
    Game.create(req.body)
        .then(game => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // send the user a '201 created' response, along with the new fruit
            // res.status(201).json({ fruit: fruit.toObject() })
            res.redirect('/games')
            // res.render('fruits/show', { fruit, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET request
// only fruits owned by logged in user
// we're going to build another route, that is owner specific, to list all the fruits owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the fruits, by ownership
    Game.find({ owner: req.session.userId })
    // then display the fruits
        .then(games => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId

            // res.status(200).json({ fruits: fruits })
            res.render('games/index', { games, username, loggedIn, userId })
        })
    // or throw an error if there is one
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    const gameId = req.params.id

    Game.findById(gameId)
        // render the edit form if there is a fruit
        .then(game => {
            res.render('games/edit', { game, username, loggedIn, userId })
        })
        // redirect if there isn't
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
    // res.send('edit page')
})

// PUT request
// update route -> updates a specific fruit
router.put("/:id", (req, res) => {
    console.log("req.body initially", req.body)
    const id = req.params.id

    req.body.freeToPlay = req.body.freeToPlay === 'on' ? true : false
    console.log('req.body after changing checkbox value', req.body)
    Game.findById(id)
        .then(game => {
            if (game.owner == req.session.userId) {
                // must return the results of this query
                return game.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            // console.log('returned from update promise', data)
            res.redirect(`/games/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

router.delete('/:id', (req, res) => {
    // get the fruit id
    const gameId = req.params.id

    // delete and REDIRECT
    Game.findByIdAndRemove(gameId)
        .then(game => {
            // if the delete is successful, send the user back to the index page
            res.redirect('/games')
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
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
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // res.json({ fruit: fruit })
            res.render('games/show', { game, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router