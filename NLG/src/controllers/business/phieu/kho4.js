const express = require('express')
const mssql = require('mssql')
const { mssqlExcutedQuery, PROCEDUCES, VIEWS } = require('../../../config/database')
const kho = express.Router()
const model = require('../../../data/model')
const uuidv4 = require('uuid/v4');
const NLGO = require('../../../model/NLGO');

kho.get('/', (req, res) => {
    console.log(req.query.kho)
    new mssql.Request()
        .query(`SELECT 
            A.ID id,
            A.SOPHIEU sophieu,
           A.MAKHO makho ,
           A.ALLOWMODIFY ALLOWMODIFY,
           A.ALLOWTINHTIEN tinhtien
           
           
           


            FROM nlg.PHIEUNHAPKHO A  where A.MAKHO = '${req.query.kho}' and YEAR(A.CREATED_AT) = DATEPART(year, GETDATE()) and MONTH(A.CREATED_AT) = DATEPART(MONTH, GETDATE())
            
            ORDER BY A.CREATED_AT DESC`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


kho.post('/', (req, res, next) => {
    req.body.createBy = req.headers['x-gateway-account-account']
    next()
}, model.kho.insert)
kho.put('/:id', (req, res) => {
    const id = req.params.id
        //const hacap = req.body.hacap ?  req.body.hacap : 'N'
        // const tinhtien = req.body.tinhtien
        // const delFlag = req.body.delFlag ? req.body.delFlag : 'N' 
    const query = `UPDATE nlg.PHIEUNHAPKHO_DT SET SOBO = '${req.body.sobo}'
    WHERE ID = ${id}`
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})

module.exports = kho