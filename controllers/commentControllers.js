////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////

const express = require("express")
const Game = require("../models/game")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////

const router = express.Router()

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

// POST
// only loggedIn users can post comments
router.post("/:gameId", (req, res) => {
    const gameId = req.params.gameId
    if (req.session.loggedIn) {
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }
    req.body.author = req.session.userId
    Game.findById(fruitId)
        .then(game => {
            game.comments.push(req.body)
            return game.save()
        })
        .then(game => {
            res.status(200).json({game: game})
        })
        .catch(err => console.error(err))
})
// DELETE
// only the author of the comment can delete it

/////////////////////////////////////////
// Export the Router
/////////////////////////////////////////

module.exports = router