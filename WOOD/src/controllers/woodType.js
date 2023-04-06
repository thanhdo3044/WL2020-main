const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES} = require('../config/database')
const woodType = express.Router()

woodType.get('/',(req,res,next) =>{
    let query = `
    SELECT * FROM ${TABLE.WOOD_TYPE}
    `
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

module.exports = woodType