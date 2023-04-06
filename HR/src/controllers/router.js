const express = require('express')
const router = express.Router()
const api = require('./../api/index')
const verify = require('./../core/verify')

router.use(require('./../middleware/logging'))
router.use('/', verify, api)

module.exports = router