const express = require('express')
const parcelWoods = express.Router()
const mssql = require('mssql')
const {getParcelWoods} = require('./../../../core/query/index')

parcelWoods.get('/', (req,res,next)=>{
    new mssql.Request()
    .query(getParcelWoods, (err,record)=>{
        if(err)
            return res.api.sendFail({
                number : 4907,
                message : err
            })
        req.result = []
        record.recordset.forEach(e=>{
            req.result.push({
                code : e.PARCEL
            })
        })
        res.api.sendData(req.result)
    })
})


module.exports = parcelWoods