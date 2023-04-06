const express = require('express')
const remedies = express.Router()
const model = require('../../../core/model')

remedies.get('/', (req, res) => {
    res.api.sendData(model.remedies.findAll())
})

remedies.post('/', (req, res) => {
    model.remedies.create(req.body, item => {
        res.api.sendData(item)
    })
})


remedies.put('/:id', (req, res) => {
    model.remedies.updateById(req.params.id, req.body, item => {
        res.api.sendData(item)
    })
})


remedies.delete('/:id', (req, res) => {
    model.remedies.deleteById(req.params.id, (status) => {
        res.api.sendData({
            status
        })
    })
})

module.exports = remedies