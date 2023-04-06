const express = require('express')
const nguyenLieuGo = express.Router()
const model = require('../../data/model')


nguyenLieuGo.get('/', model.nguyenLieuGo.select)

nguyenLieuGo.post('/', model.nguyenLieuGo.insert)

nguyenLieuGo.put('/:id', model.nguyenLieuGo.updateById)

nguyenLieuGo.delete('/:id', model.nguyenLieuGo.deleteById)

module.exports = nguyenLieuGo