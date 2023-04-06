const express = require('express')
const mssql = require('mssql')
const { mssqlExcutedQuery, PROCEDUCES, VIEWS } = require('../../../config/database')
const kho = express.Router()
const model = require('../../../data/model')
const uuidv4 = require('uuid/v4');
const NLGO = require('../../../model/NLGO');

kho.get('/', (req, res) => {
    let condition = ` where A.MAKHO='${req.query.kho}'`
    if (req.query.kho == 'Phòng NLG' || req.query.kho == 'Ban chứng chỉ') {
        condition = `where YEAR(A.CREATED_AT) = DATEPART(year, GETDATE())`
    } else if(req.query.kho  == 'TB') {
        condition = ` where A.MAKHO in ('${req.query.kho}','YS4')`
    }
    else  condition = ` where A.MAKHO ='${req.query.kho}' `
    // if (req.headers['x-gateway-account-id'] == 100400) {
    new mssql.Request()
        .query(`SELECT 
            A.ID id,
            A.SOPHIEU sophieu,
           A.MAKHO makho ,
           A.ALLOWMODIFY ALLOWMODIFY,
           A.ALLOWTINHTIEN tinhtien,
           A.MANCC 'MANCC',
           B.NAME name,
           A.XUONGXENANG xuongxenang,
           A.CREATED_AT createDate,
           A.ACTUALDATE ngaynhaptt,
           C.TENKHO tenkho,
           A.BIENSOXE BIENSOXE,
           A.MALOGONHAP,
           B.ADDRESS NCC_ADDRESS
          
           
            FROM nlg.PHIEUNHAPKHO A JOIN nlg.PROVIDERS B ON B.CODE = A.MANCC 
            JOIN nlg.MAKHO C on A.MAKHO = C.MAKHO 
            ${condition} 
              ORDER BY A.CREATED_AT DESC,A.SOPHIEU DESC `, (err, record) => {
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
    const tinhtien = req.body.tinhtien
        // const delFlag = req.body.delFlag ? req.body.delFlag : 'N' 
    const query = `UPDATE nlg.PHIEUNHAPKHO SET ALLOWTINHTIEN='${tinhtien}'
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