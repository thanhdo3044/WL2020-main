const express = require('express')
const parcels = express.Router()
const model = require('./../../../core/model')


parcels.get('/', (req, res) => {
    res.api.sendData(model.parcels.findAll())
})
parcels.get('/:id/hoang/:id2', (req, res) => {
    res.api.sendData(model.parcels.findAll())
})

parcels.post('/', (req, res) => {
    req.body.createBy = req.token.accountId
    model.parcels.create(req.body, item => {
        res.api.sendData(item)
    })
})


parcels.put('/:id', (req, res) => {
    model.parcels.updateById(req.params.id, req.body, item => {
        res.api.sendData(item)
    })
})


parcels.delete('/:id', (req, res) => {
    model.parcels.deleteById(req.params.id, (status) => {
        res.api.sendData({
            status
        })
    })
})

module.exports = parcels