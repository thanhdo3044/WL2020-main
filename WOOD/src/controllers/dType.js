const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES} = require('../config/database')
const dType = express.Router()

dType.get('/',(req,res)=>{
    const moduleCode = req.query.moduleCode
    let query = `SELECT * FROM wood.PRICE_TYPE WHERE [MODULE]='${moduleCode}'`
    mssqlExcutedQuery(query,(data,err)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })   
        }
        return res.api.sendData(data.recordset)
    })
})

module.exports = dType