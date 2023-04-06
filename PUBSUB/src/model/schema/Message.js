const mongoose = require('mongoose')

const Message = new mongoose.Schema({
    from : mongoose.Types.ObjectId,
    to : mongoose.Types.ObjectId,
    body : String,
    createDate : Date,
})

module.exports = Message