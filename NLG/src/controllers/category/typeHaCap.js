const express = require('express')
const typeHaCap = express.Router()
const model = require('../../data/model')


typeHaCap.get('/', model.typeHaCap.select)

typeHaCap.post('/', model.typeHaCap.insert)

typeHaCap.put('/:id', model.typeHaCap.updateById)

typeHaCap.delete('/:id', model.typeHaCap.deleteById)



module.exports = typeHaCap