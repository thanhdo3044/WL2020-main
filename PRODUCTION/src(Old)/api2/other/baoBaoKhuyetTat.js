const express = require('express')
const bc = express.Router()


const mssql = require('mssql')
const {
    createBaoCaoKhuyetTat,
    getBaoCaoKhuyetTat
} = require('./../../core/query/index')
bc.get('/', (req, res, next) => {
    new mssql.Request()
        .query(getBaoCaoKhuyetTat, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            let result = []
            record.recordset.forEach(e => {
                result.push({
                    id : e.ID,
                    kilnBatchId: e.KILN_BATCH_ID,
                    data: JSON.parse(e.DATA),
                    createBy: e.CREATE_BY,
                    createDate: e.CREATE_DATE
                })
            })
            res.api.sendData(result)
        })
})


bc.post('/', (req, res, next) => {
    new mssql.Request()
        .input('KILN_BATCH_ID', req.body.kilnBatchId)
        .input('DATA', JSON.stringify(req.body))
        .input('CREATE_BY', req.token.accountId)
        .query(createBaoCaoKhuyetTat, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            res.api.sendData([])
        })
})

module.exports = bc