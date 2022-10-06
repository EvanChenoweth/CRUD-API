////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////
// Routes
/////////////////////////////////////////
router.get('/signup', (req, res) => {
    res.render('users/signup')
})
// route for sign up
router.post('/signup', async (req, res) => {
    // this route will receive a req.body
    console.log('this is our initial req.body', req.body)
    // first step, is to encrypt our password
    req.body.password = await bcrypt.hash(
        req.body.password,
        await bcrypt.genSalt(10)
    )
    console.log('req.body after hash', req.body)

    // create a new user
    User.create(req.body)
        // if successful, console log the user(for now)
        .then(user => {
            console.log(user)
            res.status(201).json({ username: user.username})
        })
        // if an error occurs, log the error
        .catch(err => {
            console.log(err)
            res.json(err)
        })
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

// a route for log in
router.post('/login', async (req, res) => {
    //get out data from the req body, saved as separate variables
    const { username, password } = req.body

    User.findOne({ username })
        .then(async (user) => {
            if(user) {
                //compare the password
                //bcrypt.compare() -> eval to bool
                const result = await bcrypt.compare(password, user.password)

                if(result) {
                    //this is where we use the session object
                    // session object lives in our request
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                    console.log('this is req.session', req.session)

                    res.status(201).json({ user: user.toObject() })
                } else {
                    res.json({ error: 'username or password incorrect' })
                }
            } else {
                res.json({ error: 'user does not exist.'})
            }
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
})
// a route for log out 
router.delete('/logout', (req, res) => {
    // destroy the session(eventually we'll redirect)
    req.session.destroy(err => {
        console.log('err on Log Out', req.session)

        res.sendStatus(204)
    })
})
/////////////////////////////////////////
// Export Router
/////////////////////////////////////////
module.exports = router