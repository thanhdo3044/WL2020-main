const express = require('express')
const bm = express.Router()

const mssql = require('mssql')
const {
    createBieuMauKiemTraDoAm,
    getBieuMauKiemTraDoAm
} = require('./../../core/query/index')

bm.get('/', (req, res, next) => {
    new mssql.Request()
        .query(getBieuMauKiemTraDoAm, (err, record) => {
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

bm.post('/', (req, res, next) => {
    new mssql.Request()
        .input('KILN_BATCH_ID', req.body.kilnBatchId)
        .input('DATA', JSON.stringify(req.body))
        .input('CREATE_BY', req.token.accountId)
        .query(createBieuMauKiemTraDoAm, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            res.api.sendData([])
        })
})

module.exports = bm