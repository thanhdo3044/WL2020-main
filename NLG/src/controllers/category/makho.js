const express = require('express')
const makho = express.Router()
const model = require('../../data/model')


makho.get('/', model.makho.select)

makho.post('/', model.makho.insert)

makho.put('/:id', model.makho.updateById)

makho.delete('/:id', model.makho.deleteById)

module.exports = makho