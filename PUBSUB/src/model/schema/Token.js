const mongoose = require('mongoose')

const Token = new mongoose.Schema({
    code : String,
    state : Number,
    created : Date,
    exp : Date
})

module.exports = Token