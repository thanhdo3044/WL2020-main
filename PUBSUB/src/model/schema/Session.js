const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Session = new mongoose.Schema({
    code: String,
    node : ObjectId,
    created: {
        type: Date,
        default: Date.now
    },
    lastUse: Date // Mỗi lần session sử dụng thì update lại lastUse này
})

module.exports = Session