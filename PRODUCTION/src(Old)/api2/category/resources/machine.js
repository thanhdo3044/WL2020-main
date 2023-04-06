const express = require('express')
const machine = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')
const m2 = require('./../../../core/m2')




machine.get('/', (req, res, next) => {
    new mssql.Request()
        .query(getMachine, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


machine.post('/', (req, res, next) => {
    m2.machine.create(req.body)
        .then(data => {
            res.api.sendData([])
        })
})


machine.put('/:id', (req, res, next) => {

})



machine.delete('/:id', (req, res, next) => {

})


const getMachine = `select 
M.ID id,
M.CODE code,
M.NAME name,
M.QUANTITY quantity,
D.NAME departmentId,
M.WORKERS workers
from prod.MACHINE M
left join base.DEPARTMENT D ON D.ID = M.DEPARTMENT_ID`
module.exports = machine