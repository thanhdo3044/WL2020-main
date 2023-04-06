const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const Listen = new mongoose.Schema({
    node: ObjectId,
    listen: ObjectId,
    active: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = Listen