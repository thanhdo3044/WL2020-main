const mongoose = require('mongoose')
const {
    access
} = require('../../core/config')



const Node = new mongoose.Schema({
    code: String,
    name: String,
    password: String,
    firtName: String,
    lastName: String,
    email: String,
    phone: String,
    type: Number,
    state: Number,
    status: String,
    active: {
        type: Boolean,
        default: true
    },
    access: {
        type: Boolean,
        default: access.private
    }, // private public
    created: {
        type: Date,
        default: Date.now
    }


})

module.exports = Node