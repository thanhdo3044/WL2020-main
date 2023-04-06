const express = require('express')
const dinhMucTon = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')
const m2 = require('./../../../core/m2')

dinhMucTon.get('/', (req, res, next) => {
    m2.dinhMucTon.findAll({
        where: req.query
    }).then(data => {
        let buf = []
        data.forEach(e => {
            buf.push(e.dataValues)
        })
        buf.forEach(e => {
            e.item = e.itemId
            e.department = e.departmentId
            delete e.itemId
            delete e.departmentId
        })
        res.setHeader('x-response-description', JSON.stringify({
            field: {
                item: 'itemId',
                department: 'departmentId'
            }
        }))
        res.api.sendData(buf)
    }).catch(err => {
        console.log(err)
        return res.api.sendFail(getErrorMessage(4907))
    })
})


dinhMucTon.post('/', m2.dinhMucTon.insert)


dinhMucTon.put('/:id', m2.dinhMucTon.updateById)



dinhMucTon.delete('/:id', m2.dinhMucTon.deleteById)


const getdinhMucTon = `
                        select 
                        M.ID id,
                        M.CODE code,
                        M.NAME name,
                        M.QUANTITY quantity,
                        D.NAME departmentId,
                        M.WORKERS workers
                        from prod.dinhMucTon M
                        left join base.DEPARTMENT D ON D.ID = M.DEPARTMENT_ID
                        `
module.exports = dinhMucTon