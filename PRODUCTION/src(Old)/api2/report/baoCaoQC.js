const mssql = require('mssql')

const express = require('express')
const router = express.Router()
const {
    getErrorMessage
} = require('./../../core/config')

router.get('/qc-xu-ly', (req, res, next) => {

    new mssql.Request()

    .input('FROM', req.query.from || '2019-01-01')
        .input('TO', `${req.query.to} 23:59:59` || require('./../../core/config').date.now())
        .input('FACTORY_ID', req.query.factoryId)
        .query(require('./../../core/query').getBaoCaoQCXuLyHang, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.get('/hang-den-kho-qc', (req, res, next) => {
    new mssql.Request()
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', `${req.query.to} 23:59:59` || require('./../../core/config').date.now())
        .input('FACTORY_ID', req.query.factoryId)
        .query(require('./../../core/query').getBaoCaoHangDayDenKhoQC, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


module.exports = router