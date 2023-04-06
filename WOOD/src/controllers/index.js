const express = require('express')
const api = express.Router()

api.use('/wood-warehouse', require('./warehouse'))
api.use('/wood-input-type',require('./inputType'))
api.use('/wood-inspection',require('./inspection'))
api.use('/wood-input',require('./inputWH'))
api.use('/wood-type',require('./woodType'))
api.use('/wood-payment',require('./payment'))
api.use('/wood-price',require('./price'))
api.use('/wood-dtype',require('./dType'))
api.use('/wood-req-price',require('./reqPrice'))
api.use('/wood-region',require('./region'))
api.use('/wood-report',require('./report'))

module.exports = api