const express = require('express')
const productionOrdersStatus = express.Router()
const model = require('./../../../core/model')

productionOrdersStatus.get('/', (req, res) => {
    res.api.sendData(model.productionOrdersStatus.findAll())
})

productionOrdersStatus.post('/', (req, res) => {
    model.productionOrdersStatus.create(req.body, data => {
        res.api.sendData(data)
    })

})

module.exports = productionOrdersStatus