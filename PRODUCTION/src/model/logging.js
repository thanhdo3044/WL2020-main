const mongoose = require('mongoose')

const loggingSchema = new mongoose.Schema({
    accountId: String,
    account : String,
    baseUrl: String,
    path: String,
    method: String,
    originalUrl: String,
    headers: String,
    data : String,
    error: String,
    reqTime: String,
    resTime: String
})


const Logging = mongoose.model('logging', loggingSchema)

module.exports = Logging