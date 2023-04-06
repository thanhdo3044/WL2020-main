const express = require('express')
const packageType = express.Router()
const model = require('./../../../core/model')

packageType.get('/', (req, res) => {
    res.api.sendData(model.packageTypes.filter(i => i.active == 1))
})

module.exports = packageType