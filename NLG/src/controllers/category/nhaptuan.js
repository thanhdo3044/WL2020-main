const express = require('express')
const nhaptuan = express.Router()
const mssql = require('mssql')
const model = require('../../data/model')




nhaptuan.post('/', model.nhaptuan.insert)

nhaptuan.put('/:id', model.nhaptuan.updateById)

nhaptuan.delete('/:id', model.nhaptuan.deleteById)



module.exports = nhaptuan