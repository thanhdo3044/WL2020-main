const express = require('express')
const gquicach = express.Router()
const model = require('../../data/model')


gquicach.get('/', model.groupQuiCach.select)



gquicach.post('/', (req, res, next) => {
    req.body.createBy = req.headers['x-gateway-account-id']
    next()
}, model.groupQuiCach.insert)

gquicach.put('/:id', model.groupQuiCach.updateById)

gquicach.delete('/:id', model.groupQuiCach.deleteById)

module.exports = gquicach