const express = require('express')
const khodt = express.Router()
const model = require('../../data/model')


khodt.get('/', model.khodt.select)

khodt.post('/', model.khodt.insert)

khodt.put('/:id', model.khodt.updateById)

khodt.delete('/:id', model.khodt.deleteById)

module.exports = makho