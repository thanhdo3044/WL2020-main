const express = require('express')
const mssql = require('mssql')
const reqCost = express.Router()
const model = require('../../data/model')


reqCost.get('/', (req, res) => {
    new mssql.Request()
        .query(`SELECT 
            A.REQNO no, B.UPDATE_DATE createAt, A.REASON reason,
            A.CREATE_BY createBy, A.APPROVAL approval,
            B.MASP masp

            FROM nlg.REQ_COST A JOIN nlg.BANGGIANVL B on B.REQNO = A.REQNO
            ORDER BY B.UPDATE_DATE DESC,A.APPROVAL
            `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
reqCost.get('/duyet', (req, res) => {
    new mssql.Request()
        .query(`SELECT 
            A.REQNO no, A.CREATED_AT createAt, A.REASON reason,
            A.CREATE_BY createBy, A.APPROVAL approval,
            B.MASP masp

            FROM nlg.REQ_COST A JOIN nlg.BANGGIANVL B on B.REQNO = A.REQNO
            where A.REQNO = '${req.query.no}'`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
reqCost.post('/', model.reqCost.insert)

reqCost.put('/:id', model.reqCost.updateById)

reqCost.delete('/:id', model.reqCost.deleteById)



module.exports = reqCost