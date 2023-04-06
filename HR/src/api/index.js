const express = require('express')
const api = express.Router()


api.use('/work-time', require('./bussiness/workTime'))

module.exports = api