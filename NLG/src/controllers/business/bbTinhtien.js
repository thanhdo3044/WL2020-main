const express = require('express')
const bbtinhtien = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../core/config')

bbtinhtien.get('/', (req, res) => {
    new mssql.Request()
        .query(`  SELECT PT.SOPHIEUNHAP SOPHIEUNHAP, PT.khacKho khacKho,
        HC.DAY DAY, HC.RONG RONG, HC.CAO CAO, PT.SOBO SOBO, PT.SOTHANH_BO SOTHANH_BO,
        HC.DEL_FLAG DEL_FLAG, THC.TYPENAME AS TYPENAME, HC.MANVL AS MANVL,B.NHOM codenhom,
       PT.QTY QTY, PT.SAMPLEQTY SAMPLEQTY, HC.NOTE NOTE, HC.DONGIA_CTY DONGIA_CTY,
        HC.DONGIA_LOAI DONGIA_LOAI, HC.GAPDOI GAPDOI, HC.TYPE hangloai,
        PT.SOTHANH_BO*PT.SAMPLEQTY AS SL_MAU, HC.SOTHANH SOTHANH,PT.OVER_PLAN,PT.vuotkho,
       PT.SOTHANH_BO*PT.SOBO AS TONGSOTHANH, HC.ID_DT ID_DT, HC.ID ID,
       CAST(PT.QTY AS float)/CAST(PT.SOTHANH_BO as float)*CAST(PT.SAMPLEQTY AS float) AS TYLE,
       (CAST(PT.QTY AS float)/CAST(PT.SOTHANH_BO as float)*PT.SAMPLEQTY)* CAST(PT.SOTHANH_BO as float)*PT.SOBO*PT.DAY*PT.RONG*PT.CAO as KLQC,
       CASE WHEN (HC.DAY = 55 and HC.RONG = 55) then
       ROUND((PT.SOTHANH_BO*POWER(Cast(10 as float),CAST(-9 as float))*HC.DAY*HC.RONG*HC.CAO*PT.SOBO*3.14/4),4)
       else
       ROUND((PT.SOTHANH_BO*POWER(Cast(10 as float),CAST(-9 as float))*HC.DAY*HC.RONG*HC.CAO*PT.SOBO),4) END  AS KLKHO,
        (select TOP 1 COST from [nlg].[BANGGIANVL] where [nlg].[BANGGIANVL].MASP = HC.MANVL and [nlg].[BANGGIANVL].APPLY_DATE <= P.CREATED_AT
        order by APPLY_DATE desc) AS COST
        
        FROM nlg.PHIEUNHAPKHO_DT PT
        JOIN nlg.PHIEUNHAPKHO P ON P.SOPHIEU = PT.SOPHIEUNHAP
        JOIN nlg.HACAP HC on HC.ID_DT = PT.ID JOIN nlg.TYPE_HACAP THC on THC.ID = HC.TYPE
        JOIN nlg.BOM B on B.CODE = HC.CODE
             where PT.SOPHIEUNHAP = '${req.query.sophieuId.replace("-", "/")}'
             order by HC.ID
             `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
bbtinhtien.get('/view', (req, res) => {
    let query = `SELECT *
    FROM nlg.TINHTIEN  TT
    
    WHERE TT.SOPHIEU='${req.query.guid.replace("-", "/")}'
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
    // req.dataDetail = req.body.data
    //const sophieuId = req.body.sophieuId,
    const xuatHD = req.body.xuatHD,
        hotrovanchuyen = req.body.hotrovanchuyen,
        hotrokhac = req.body.hotrokhac,
        hotropallet = req.body.hotropallet,
        tongthanhtoan = req.body.tongthanhtoan,
        tongtienchuathue = req.body.tongtienchuathue,
        klkho = req.body.klkho,
        klqc = req.body.klqc,
        dongiatb = req.body.dongiatb,
        tylechinhpham = req.body.tylechinhpham,
        coc = req.body.coc,
        sophieuCode = req.body.sophieuCode,
        uid = req.body.uid
    const query = `INSERT INTO nlg.TINHTIEN ([SOPHIEU],[XUATHOADON],[HOTROKHAC],HOTROPALLET,[HOTROVANCHUYEN],[TONGTHANHTOAN],[CREATED_AT],[CREATED_BY],[KLKHO],[KLQC],[DONGIATB],[TYLECHINHPHAM],
        [TONGTIENCHUATHUE],[COC]) VALUES('${sophieuCode}','${xuatHD}','${hotrokhac}','${hotropallet}','${hotrovanchuyen}','${tongthanhtoan}',GETDATE(),'${uid}','${klkho}','${klqc}','${dongiatb}','${tylechinhpham}',
        '${tongtienchuathue}','${coc}')`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        next()
    })
}, (req, res, next) => {
    let query = `UPDATE nlg.PHIEUNHAPKHO SET ALLOWTINHTIEN ='N' WHERE SOPHIEU='${req.body.sophieuCode}'`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))

        next()
    })
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
        // }, (req, res, next) => {
        //     req.dataDetail.forEach(element => {
        //         let query = `UPDATE nlg.HACAP SET  DONGIA_CTY=${element.GIA_CTY},DONGIA_LOAI=${element.GIA_LOAI} WHERE ID = ${element.ID}`
        //         if (element.PARENT_ID === null) {
        //             query = `UPDATE nlg.PHIEUNHAPKHO_DT SET  DONGIA=${element.GIA_CTY},DONGIA_LOAI=${element.GIA_LOAI},[DONGIATB]=${element.dongiatb} WHERE ID = ${element.ID}`
        //         }
        //         new mssql.Request().query(query, (err, record) => {
        //             if (err)
        //                 next()
        //         })
        //     })
        //     return res.api.sendData([])
        // },
        // (req, res, next) => {
        //     //rollback
        //     const query = `DELETE FROM nlg.TINHTIEN WHERE SOPHIEU ='${req.body.sophieucode}'`
        //     new mssql.Request().query(query, (err, record) => {
        //         if (err)
        //             return res.api.sendFail(getErrorMessage(4907))
        //         return res.api.sendFail({
        //             '999999': 'ROLLBACK'
        //         })
        //     })
})
bbtinhtien.post('/completedNL', (req, res, next) => {
    // req.dataDetail = req.body.data
    //const sophieuId = req.body.sophieuId,
    const xuatHD = req.body.xuatHD,
        hotrovanchuyen = req.body.hotrovanchuyen,
        hotrokhac = req.body.hotrokhac,
        tongthanhtoan = req.body.tongthanhtoan,
        tongtienchuathue = req.body.tongtienchuathue,
        klkho = req.body.klkho,
        klqc = req.body.klqc,
        dongiatb = req.body.dongiatb,

        coc = req.body.coc,
        sophieuCode = req.body.sophieuCode,
        uid = req.body.uid
    const query = `INSERT INTO nlg.TINHTIEN ([SOPHIEU],[XUATHOADON],[HOTROKHAC],[HOTROVANCHUYEN],[TONGTHANHTOAN],[CREATED_AT],[CREATED_BY],[KLKHO],[KLQC],[DONGIATB],
        [TONGTIENCHUATHUE],[COC]) VALUES('${sophieuCode}','${xuatHD}','${hotrokhac}','${hotrovanchuyen}','${tongthanhtoan}',GETDATE(),'${uid}','${klkho}','${klqc}','${dongiatb}',
        '${tongtienchuathue}','${coc}')`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        next()
    })
}, (req, res, next) => {
    let query = `UPDATE nlg.PHIEUTRAVE SET ALLOWTINHTIEN ='N' WHERE SOPHIEUTRAVE='${req.body.sophieuCode}'`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))

        next()
    })
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
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