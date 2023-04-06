const express = require('express')
const vungVanChuyen = express.Router()
const model = require('../../data/model')


vungVanChuyen.get('/', model.vungVanChuyen.select)

vungVanChuyen.post('/', model.vungVanChuyen.insert)

vungVanChuyen.put('/:id', model.vungVanChuyen.updateById)

vungVanChuyen.delete('/:id', model.vungVanChuyen.deleteById)



module.exports = vungVanChuyen