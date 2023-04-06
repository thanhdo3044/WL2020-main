const express = require('express')
const routes = express.Router()
const customer = require('../controller/customer')
routes.get('/',customer.getCustomer)

module.exports = routes