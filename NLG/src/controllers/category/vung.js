const express = require('express')
const vung = express.Router()
const model = require('../../data/model')


vung.get('/', model.vung.select)

vung.post('/', model.vung.insert)

vung.put('/:id', model.vung.updateById)

vung.delete('/:id', model.vung.deleteById)



module.exports = vung