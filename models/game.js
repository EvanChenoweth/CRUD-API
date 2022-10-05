///////////////////////////////////////////////////////////
// Our schema and model for the fruit resource
///////////////////////////////////////////////////////////
const mongoose = require("mongoose") // import mongoose
const commentSchema = require("./comment")

// we're going to pull the Schema and model from mongoose
// we'll use a syntax called "destructuring"
const { Schema, model } = mongoose

// fruits schema
const gameSchema = new Schema({
    name: String,
    genre: String,
    freeToPlay: Boolean,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true })

// make the fruit model
// the model method takes two args
// the first is what we will call our model
// the second is what we will use to build the model
const Game = model("Game", gameSchema)

//////////////////////////////////////////////////
// Export our model
//////////////////////////////////////////////////
module.exports = Game