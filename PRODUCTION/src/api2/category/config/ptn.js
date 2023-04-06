const express = require('express')
const ptn = express.Router()
const mssql = require('mssql')
const model = require('./../../../core/m2')
const {
    getErrorMessage
} = require('./../../../core/config')


ptn.get('/', (req, res, next) => {
    model.ptn.findAll({
            where: req.query
        }).then(data => {
            let buf = []

            data.forEach(e => {
                buf.push(e.dataValues)
            })
            console.log(buf)

            buf.forEach((e, i) => {
                buf[i].item = e.itemId
                buf[i].department = e.departmentId
                delete buf[i].itemId
                delete buf[i].departmentId
            })
            res.setHeader('x-response-description', JSON.stringify({
                field: {
                    item: 'itemId',
                    department: 'departmentId'
                }
            }))
            res.api.sendData(buf)
        })
        .catch(err => res.api.sendFail(getErrorMessage(4907)))
})

ptn.post('/', model.ptn.insert)

ptn.put('/:id', model.ptn.updateById)

ptn.delete('/:id', model.ptn.deleteById)


module.exports = ptn