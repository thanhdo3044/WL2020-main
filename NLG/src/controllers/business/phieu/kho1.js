const express = require('express')
const mssql = require('mssql')
const { mssqlExcutedQuery, PROCEDUCES, VIEWS } = require('../../../config/database')
const kho = express.Router()
const model = require('../../../data/model')
const uuidv4 = require('uuid/v4');
const NLGO = require('../../../model/NLGO');

kho.get('/', (req, res) => {

    new mssql.Request()
        .query(`SELECT 
            A.ID id,
            A.SOPHIEU sophieu,
           A.MAKHO makho ,
           A.ALLOWTINHTIEN tinhtien,
           A.MANCC 'mancc',
           B.NAME name,
           A.XUONGXENANG xuongxenang,
           A.CREATED_AT ngaynhapht,
           A.ACTUALDATE ngaynhaptt,
           C.TENKHO tenkho,
           BA.LAST_NAME NGUOI_TAO,
           BB.LAST_NAME QC_NAME,
           B.ADDRESS NCC_ADDRESS,
           B.VUNG,
           A.BIENSOXE BIENSOXE,
           A.MALOGONHAP,
           B.COHD COHD,
           B.COC COC
         
            FROM nlg.PHIEUNHAPKHO A JOIN nlg.PROVIDERS B ON B.CODE = A.MANCC JOIN nlg.MAKHO C on A.MAKHO = C.MAKHO 
            JOIN base.ACCOUNT BA ON BA.ACCOUNT = A.CREATED_BY 
            JOIN base.ACCOUNT BB ON BB.ACCOUNT = A.QC_STAFF 
             where A.SOPHIEU = '${req.query.guid}'
             ORDER BY A.CREATED_AT DESC`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})
kho.get('/nhap-lai', (req, res) => {

    new mssql.Request()
        .query(`SELECT 
            A.ID id,
            A.SOPHIEUTRAVE sophieu,
           A.FROMSL makho ,
           A.ALLOWTINHTIEN tinhtien,
           A.MANCC 'mancc',
           B.NAME name,
           AC.LAST_NAME NGUOI_TAO,
           A.CREATED_AT ngaynhapht,
          
           C.TENKHO tenkho,
         
        
           B.ADDRESS NCC_ADDRESS,
        
           B.COHD COHD,
           B.COC COC
         
            FROM nlg.PHIEUTRAVE A JOIN nlg.PROVIDERS B ON B.CODE = A.MANCC JOIN nlg.MAKHO C on A.FROMSL = C.MAKHO 
             left join base.ACCOUNT AC on AC.ACCOUNT = A.CREATE_BY
            
             where A.SOPHIEUTRAVE = '${req.query.guid}'
             ORDER BY A.CREATED_AT DESC`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})
kho.get('/NL', (req, res) => {

    new mssql.Request()
        .query(`
        DELETE FROM nlg.TINHTIEN WHERE SOPHIEU ='${req.query.sophieu}'

    UPDATE nlg.PHIEUTRAVE SET 
    ALLOWTINHTIEN = 'Y'
    WHERE ID = ${req.query.id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})
kho.post('/', (req, res, next) => {


        next()
    }, model.kho.insert)
    // kho.post('/', (req, res) => {
    //         req.body.createBy = req.headers['x-gateway-account-id']

//     }, model.kho.insert)
// kho.post('/', (req, res) => {
//     const uid = req.headers['x-gateway-account-id']
//     const newId = uuidv4()
//     const bsx = req.body.bsx
//     const xenang = req.body.xenang
//     const ngaynhapkho = req.body.ngaynhapkho
//     const makho = req.body.makho
//     const mancc = req.body.mancc

//     new mssql.Request()
//         .input('BSX', mssql.NVarChar(30), bsx)
//         .input('XENANG', mssql.VARCHAR(10), xenang)
//         .input('RECEIPT_DATE', mssql.VarChar(300), ngaynhapkho)
//         .input('MANCC', mssql.Int, mancc)
//         .input('MAKHO', mssql.Int, makho)
//         .input('UID', mssql.Int, uid)
//         .input('GUID', mssql.NVarChar(300), newId)
//         .execute(PROCEDUCES.TAO_PHIEU_NHAP_KHO, (err, data) => {
//             if (err) {
//                 return res.api.sendFail({
//                     number: 4907,
//                     message: err
//                 })
//             }
//             return res.api.sendData(data.recordset)
//         })
// })
kho.put('/:id', (req, res) => {
    const id = req.params.id
    const hacap = req.body.hacap ? req.body.hacap : 'N'
    const tinhtien = req.body.tinhtien ? req.body.tinhtien : 'N'
    const delFlag = req.body.delFlag ? req.body.delFlag : 'N'
    const query = `UPDATE NLG.PHIEUNHAPKHO SET HACAP='${hacap}',DEL_FLAG='${delFlag}',TINHTIEN='${tinhtien}'
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