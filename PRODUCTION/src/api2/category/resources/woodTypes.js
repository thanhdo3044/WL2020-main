const express = require('express')
const woodType = express.Router()
const model = require('./../../../core/model')
const mssql = require('mssql')

woodType.get('/', (req, res) => {
    let result = model.woodTypes.findAll()
    if (req.query.type)
        result = result.filter(i => i.type == req.query.type)
    res.api.sendData(result)
})

woodType.post('/', (req, res) => {
    model.woodTypes.create(req.body, data => {
        res.api.sendData(data)
    })
})

module.exports = woodType