const mssql = require('mssql')

const express = require('express')
const router = express.Router()
const {
    getErrorMessage
} = require('./../../core/config')
const  {getBaoCaoPhoiTheoMeSay} = require('./../../core/query/index')

router.get('/', (req,res,next)=>{
    new mssql.Request()
    .input('FROM', req.query.from || '2019-01-01')
    .input('TO',req.query.to || require('./../../core/config').date.now())
    .input('FACTORY_ID', req.query.factoryId)
    .query(getBaoCaoPhoiTheoMeSay, (err,record)=>{
        if(err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})

module.exports = router