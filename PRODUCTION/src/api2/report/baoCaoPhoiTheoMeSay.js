const mssql = require('mssql')

const express = require('express')
const router = express.Router()
const {
    getErrorMessage
} = require('./../../core/config')
const { getBaoCaoPhoiTheoMeSay, getBaoCaoPhoiTheoMeSay2, getBaoCaoPhoiTheoMeSay3,getBaoCaoPhoiTheoMeSay3kho } = require('./../../core/query/index')

router.get('/', (req, res, next) => {
    new mssql.Request()
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .input('FACTORY_ID', req.query.factoryId)
        .query(getBaoCaoPhoiTheoMeSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
router.get('/export', (req, res, next) => {
    let from = `${req.query.from} 00:00:00`
    let to = `${req.query.to} 23:59:59`
    new mssql.Request()
        .input('FROM', from)
        .input('TO', to || require('./../../core/config').date.now())
        .input('FACTORY_ID', req.query.factoryId)
        .query(getBaoCaoPhoiTheoMeSay2, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
router.get('/exportpallet', (req, res, next) => {
    let from = `${req.query.from} 00:00:00`
    let to = `${req.query.to} 23:59:59`
    new mssql.Request()
        .input('FROM', from)
        .input('TO', to || require('./../../core/config').date.now())
        .input('FACTORY_ID', req.query.factoryId)
        .query(getBaoCaoPhoiTheoMeSay3, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
router.get('/exportpallet-kho', (req, res, next) => {
    let from = `${req.query.from} 00:00:00`
    let to = `${req.query.to} 23:59:59`
    new mssql.Request()
        .input('FROM', from)
        .input('TO', to || require('./../../core/config').date.now())
        .input('FACTORY_ID', req.query.factoryId)
        .query(getBaoCaoPhoiTheoMeSay3kho, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
module.exports = router