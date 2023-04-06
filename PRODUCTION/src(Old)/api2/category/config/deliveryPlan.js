const express = require('express')
const deliveryPlan = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')
const m2 = require('./../../../core/m2')




deliveryPlan.get('/', (req, res, next) => {
    m2.deliveryPlan.findAll()
        .then(data => {
            res.api.sendData(data)
        })
})


deliveryPlan.post('/', (req, res, next) => {
    m2.deliveryPlan.create(req.body)
        .then(data => {
            res.api.sendData([])
        })
})


deliveryPlan.put('/:id', (req, res, next) => {

})



deliveryPlan.delete('/:id', (req, res, next) => {

})
module.exports = deliveryPlan