////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const mongoose = require('./connection')
const Game = require('./game')

////////////////////////////////////////
// Origin Route / Recreate Route
////////////////////////////////////////

db.on('open', () => {
    const startGames = [
        { name: "Super Mario Bros.", genre: "Adventure", freeToPlay: false },
        { name: "The Legend of Zelda", genre: "Adventure", freeToPlay: false },
        { name: "Mario Kart", genre: "Racing", freeToPlay: false },
        { name: "Pokemon", genre: "Adventure & Strategy RPG", freeToPlay: false },
        { name: "League of Legends", genre: "MOBA", freeToPlay: false },
    ]

    Game.remove({})
        .then(deletedGames => {
            console.log('this is what .remove returns', deletedGames)

            Game.create(startGames)
                .then(data => {
                    console.log('here are the newly created fruits', data)
                    db.close()
                })
                .catch(error => {console.log(error)})
                db.close()
        })
        .catch(error => {
            console.log(error)
            db.close()
        })
})