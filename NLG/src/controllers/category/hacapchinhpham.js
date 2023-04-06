const express = require('express')
const bbtinhtien = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../core/config')

bbtinhtien.get('/', (req, res) => {
    new mssql.Request()
        .query(` SELECT PT.ID id, PT.SOPHIEUNHAP sophieunhap,
    PT.DAY DAY, PT.RONG RONG, PT.CAO CAO,PT.CODENHOM CODENHOM,
     PT.SOBO SOBO, PT.SOTHANH_BO SOTHANH_BO,PT.QTY,
    PT.DEL_FLAG DEL_FLAG, PT.SAMPLEQTY SLMAU,
   PT.SOTHANH_BO*PT.SOBO AS sothanh,PT.CODE CODE,PT.MANVL,
  
   (CAST(PT.QTY AS float)/CAST(PT.SOTHANH_BO as float)*PT.SAMPLEQTY)* CAST(PT.SOTHANH_BO as float)*PT.SOBO*PT.DAY*PT.RONG*PT.CAO as KLQC,
    CAST(PT.SOTHANH_BO as float)*PT.SOBO*PT.DAY*PT.RONG*PT.CAO AS KHOILUONG
    
    FROM nlg.PHIEUNHAPKHO_DT PT 
   
             where PT.ID = '${req.query.guid}'
             `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
bbtinhtien.get('/view', (req, res, next) => {
    new mssql.Request()
        .input('GUID', req.query.guid)
        .execute('nlg.Proc_View_bb', (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
                    //return res.api.sendData(record.recordset)
            req.dataDetail = record.recordset
            next()
        })
}, (req, res, next) => {
    let query = `SELECT TOP 1 TT.*
    FROM NLG.TINHTIEN AS TT
    INNER JOIN nlg.PHIEUNHAPKHO AS PN ON PN.ID = TT.SOPHIEU_ID
    WHERE PN.[GUID]='${req.query.guid}'
    `
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        return res.api.sendData({
            tinhtien: record.recordset,
            detail: req.dataDetail
        })
    })
})
bbtinhtien.post('/completed', (req, res, next) => {
    req.dataDetail = req.body.data
    const sophieuId = req.body.sophieuId
    const xuatHD = req.body.xuatHD,
        hotrovanchuyen = req.body.hotrovanchuyen,
        hotrokhac = req.body.hotrokhac,
        tongthanhtoan = req.body.tongthanhtoan,
        tongtienchuathue = req.body.tongtienchuathue,
        klkho = req.body.klkho,
        klqc = req.body.klqc,
        dongiatb = req.body.dongiatb,
        tylechinhpham = req.body.tylechinhpham,
        coc = req.body.coc,
        sophieuCode = req.body.sophieuCode,
        uid = req.body.uid
    const query = `INSERT INTO nlg.TINHTIEN([SOPHIEU],[XUATHOADON],[HOTROKHAC],[HOTROVANCHUYEN],[TONGTHANHTOAN],[CREATED_BY],CREATED_AT,[KLKHO],[KLQC],[DONGIATB],[TYLECHINHPHAM],
        [TONGTIENCHUATHUE],[COC],[SOPHIEU_ID])VALUES('${sophieuCode}','${xuatHD}',${hotrokhac},${hotrovanchuyen},${tongthanhtoan},'${uid}',GETDATE(),${klkho},${klqc},${dongiatb},${tylechinhpham},
        ${tongtienchuathue},'${coc}',${sophieuId})`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        next()
    })
}, (req, res, next) => {
    let query = `UPDATE nlg.PHIEUNHAPKHO SET TINHTIEN='N' WHERE ID=${req.body.sophieuId}`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        next()
    })
}, (req, res, next) => {
    req.dataDetail.forEach(element => {
        let query = `UPDATE nlg.HACAP SET  DONGIA_CTY=${element.GIA_CTY},DONGIA_LOAI=${element.GIA_LOAI} WHERE ID = ${element.ID}`
        if (element.PARENT_ID === null) {
            query = `UPDATE nlg.PHIEUNHAPKHO_DT SET  DONGIA=${element.GIA_CTY},DONGIA_LOAI=${element.GIA_LOAI},[DONGIATB]=${element.dongiatb} WHERE ID = ${element.ID}`
        }
        new mssql.Request().query(query, (err, record) => {
            if (err)
                next()
        })
    })
    return res.api.sendData([])
}, (req, res, next) => {
    //rollback
    const query = `DELETE FROM NLG.TINHTIEN WHERE SOPHIEU_ID =${req.body.sophieuId}`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        return res.api.sendFail({
            '999999': 'ROLLBACK'
        })
    })
})
bbtinhtien.post('/reject', (req, res, next) => {
    const query = `DELETE FROM NLG.TINHTIEN WHERE SOPHIEU_ID = ${req.body.sophieuId}`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        next()
    })
}, (req, res) => {
    const query = `UPDATE NLG.PHIEUNHAPKHO SET TINHTIEN='Y' WHERE ID = ${req.body.sophieuId}`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        return res.api.sendData(record.recordset)
    })
})
module.exports = bbtinhtien