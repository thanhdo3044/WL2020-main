const express = require('express')
const router = express.Router()

router.use('/',
    require('./../middleware/logging'),
    require('./../core/verify'),
    require('./../api2/api'))

module.exports = router