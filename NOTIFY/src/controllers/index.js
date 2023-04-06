const express = require('express')
const api = express.Router()

api.use('/notify', require('./notify'))


module.exports = api