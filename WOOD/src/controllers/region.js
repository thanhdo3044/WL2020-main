const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES,asyncExcuted} = require('../config/database')
const region = express.Router()

region.get('/',(req,res)=>{
    let moduleCode = req.query.module
    let query =`SELECT * FROM ${TABLE.REGION} WHERE MODULE='${moduleCode}'`    
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

region.post('/',(req,res)=>{
    const code = req.body.code,
            name= req.body.name,
            moduleId  = req.body.moduleId
    let query=`INSERT INTO ${TABLE.REGION}([CODE],[NAME],[MODULE_ID]) 
    VALUES('${code}',N'${name}',${moduleId})`
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
module.exports  = region