const express = require('express')
const routes = express.Router()

routes.use('/po', require('./po'))
routes.use('/customer',require('../core/verify'), require('./customer'))


module.exports = routes