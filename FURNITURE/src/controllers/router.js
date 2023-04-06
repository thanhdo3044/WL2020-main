const express= require('express')
const router = express.Router()

const api = require('../api/index')
const verify = require('../core/verify')

router.use('/api/v2',verify,api)


module.exports = router