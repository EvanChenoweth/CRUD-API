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
router.delete('/delete/:fruitId/:commId', (req, res) => {
    const gameId = req.params.gameId
    const commId = req.params.commId
    Game.findById(gameId)
        .then(game => {
            const theComment = fruit.comments.id(commId)
            if (req.session.loggedIn) {
                if(theComment.author == req.session.userId) {
                    theComment.remove()
                    return game.save()
                } else {
                    res.sendStatus(401)
                }
            } else {
                res.sendStatus(401)
            }
        })
        .catch(error => console.log(error))
})
/////////////////////////////////////////
// Export the Router
/////////////////////////////////////////

module.exports = router