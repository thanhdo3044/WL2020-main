const express= require('express')
const router = express.Router()

const controller = require('../controllers')

router.use('/api/v2',controller)


module.exports = router