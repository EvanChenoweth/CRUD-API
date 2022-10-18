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
// POST
// only loggedIn users can post comments
router.post("/:gameId", (req, res) => {
    const gameId = req.params.gameId

    if (req.session.loggedIn) {
        // we want to adjust req.body so that the author is automatically assigned
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }
    // find a specific fruit
    Game.findById(gameId)
        // do something if it works
        //  --> send a success response status and maybe the comment? maybe the fruit?
        .then(game => {
            // push the comment into the fruit.comments array
            game.comments.push(req.body)
            // we need to save the fruit
            return game.save()
        })
        .then(game => {
            // res.status(200).json({ fruit: fruit })
            res.redirect(`/games/${game.id}`)
        })
        // do something else if it doesn't work
        //  --> send some kind of error depending on what went wrong
        .catch(err => res.redirect(`/error?error=${err}`))
})

// DELETE
// only the author of the comment can delete it
router.delete('/delete/:gameId/:commId', (req, res) => {
    // isolate the ids and save to vars for easy ref
    const gameId = req.params.gameId 
    const commId = req.params.commId
    // get the fruit
    Game.findById(gameId)
        .then(game => {
            // get the comment
            // subdocs have a built in method that you can use to access specific subdocuments when you need to.
            // this built in method is called .id()
            const theComment = game.comments.id(commId)
            console.log('this is the comment that was found', theComment)
            // make sure the user is logged in
            if (req.session.loggedIn) {
                // only let the author of the comment delete it
                if (theComment.author == req.session.userId) {
                    // find some way to remove the comment
                    // here's another built in method
                    theComment.remove()
                    game.save()
                    res.redirect(`/games/${game.id}`)
                } else {
                    const err = 'you%20are%20not%20authorized%20for%20this%20action'
                    res.redirect(`/error?error=${err}`)
                }
            } else {
                const err = 'you%20are%20not%20authorized%20for%20this%20action'
                res.redirect(`/error?error=${err}`)
            }
        })
        // send an error if error
        .catch(err => res.redirect(`/error?error=${err}`))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router