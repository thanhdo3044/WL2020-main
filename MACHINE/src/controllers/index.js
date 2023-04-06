const express = require('express')
const api = express.Router()

api.use('/machine', require('./machine'))


module.exports = api