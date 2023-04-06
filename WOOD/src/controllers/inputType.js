const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES} = require('../config/database')
const inputTypeRouter = express.Router()
let inputTypes = []

inputTypeRouter.get('/',(req,res)=>{
    let itype = req.query.type
    const moduleCode = req.query.moduleCode
    let query=''
    if (itype&&itype!=='undefined') {
        query = `SELECT * FROM ${TABLE.WOOD_INPUT_TYPE} WHERE  ITYPE='${itype}' AND MODULE='${moduleCode}'`
    }else {
        query=`SELECT * FROM ${TABLE.WOOD_INPUT_TYPE} WHERE MODULE='${moduleCode}'`
    }
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
module.exports = inputTypeRouter