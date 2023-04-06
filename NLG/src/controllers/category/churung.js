const express = require('express')
const churung = express.Router()
const model = require('../../data/model')


churung.get('/', model.churung.select)

churung.post('/', model.churung.insert)

churung.put('/:id', model.churung.updateById)

churung.delete('/:id', model.churung.deleteById)

module.exports = churung