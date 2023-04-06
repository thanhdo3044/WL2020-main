const express = require('express')
const bb = express.Router()


const model = require('./../../core/model')


bb.get('/:type', (req, res, next) => {
    model.bienban.getByType(req.params.type, (err, data) => {
        if (err)
            return res.api.sendFaile({
                number: 4907,
                message: err
            })
        res.api.sendData(data)
    })
})

bb.get('/', (req, res, next) => {
    model.bienban.get((err, data) => {
        if (err)
            return res.api.sendFaile({
                number: 4907,
                message: err
            })
        res.api.sendData(data)
    })
})

bb.post('/', (req, res, next) => {
    req.body.createBy = req.token.accountId
    model.bienban.create(req.body, err => {
        if (err)
            return res.api.sendFaile({
                number: 4907,
                message: err
            })
        res.api.sendData([])
    })
})

bb.put('/:id', (req, res, next) => {
    model.bienban.updateById(req.params.id, req.body, (err) => {
        if (err)
            return res.api.sendFaile({
                number: 4907,
                message: err
            })
        res.api.sendData([])
    })
})

bb.delete('/:id', (req, res, next) => {
    model.bienban.deleteById(req.params.id, (err) => {
        if (err)
            return res.api.sendFaile({
                number: 4907,
                message: err
            })
        res.api.sendData([])
    })
})


module.exports = bb