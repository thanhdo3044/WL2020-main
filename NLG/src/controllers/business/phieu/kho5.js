const express = require('express')
const mssql = require('mssql')
const { mssqlExcutedQuery, PROCEDUCES, VIEWS } = require('../../../config/database')
const kho = express.Router()
const uuidv4 = require('uuid/v4');
const NLGO = require('../../../model/NLGO');

kho.get('/', (req, res) => {

    new mssql.Request()
        .query(`SELECT 
            
            SUM((CAST(B.DAY as FLOAT)*CAST(B.RONG as float)*CAST(B.CAO as FLOAT)*B.SOBO*B.SOTHANH_BO)/1000000000) AS KLT


            FROM nlg.PHIEUNHAPKHO A JOIN nlg.PHIEUNHAPKHO_DT B ON B.SOPHIEUNHAP = A.SOPHIEU 
             where B.DEL_FLAG = 'N' and B.DELAI = 'N' and A.MANCC = '${req.query.guid}' and B.CODENHOM = '${req.query.nhom}'  and YEAR(A.CREATED_AT) = '${req.query.nam}' and MONTH(A.CREATED_AT) = '${req.query.thang}'`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

kho.get('/klvuot', (req, res) => {

    new mssql.Request()
        .query(`SELECT 
        A.PLANQTY PLANQTY,
        A.MANCC MANCC, A.KHO KHO,A.VUOTNCC
           FROM nlg.PLAN_NLG A 
             where  A.MANCC = '${req.query.guid}' and A.GROUP_CODE = '${req.query.nhom}'  and YEAR(A.CREATED_AT) = '${req.query.nam}' 
             and MONTH(A.CREATED_AT) = '${req.query.thang}' and A.VUOTNCC = 1`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
kho.get('/khokl', (req, res) => {

    new mssql.Request()
        .query(`SELECT 
                    
                    SUM((CAST(B.DAY as FLOAT)*CAST(B.RONG as float)*CAST(B.CAO as FLOAT)*B.SOBO*B.SOTHANH_BO)/1000000000) AS KLT
        
        
                    FROM nlg.PHIEUNHAPKHO A JOIN nlg.PHIEUNHAPKHO_DT B ON B.SOPHIEUNHAP = A.SOPHIEU 
                     where B.DEL_FLAG = 'N' and B.DELAI = 'N' and A.MAKHO = '${req.query.makho}' and B.CODENHOM = '${req.query.nhom}'  and YEAR(A.CREATED_AT) = '${req.query.nam}' and MONTH(A.CREATED_AT) = '${req.query.thang}'`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

    // new mssql.Request()
    //     .input('ID', req.headers['x-gateway-account-id'])
    //     .query(getAccount, (err, record) => {
    //         if (err)
    //             return res.api.sendFail(getErrorMessage(4907))
    //         res.api.sendData(record.recordset)
    //     })

})



module.exports = kho