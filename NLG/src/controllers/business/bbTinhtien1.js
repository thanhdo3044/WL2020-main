const express = require('express')
const bbtinhtien = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../core/config')

bbtinhtien.get('/', (req, res) => {
    new mssql.Request()
        .query(` SELECT PT.ID id, PT.SOPHIEUNHAP SOPHIEUNHAP, PT.khacKho khacKho,
    PT.DAY DAY, PT.RONG RONG, PT.CAO CAO, PT.SOBO SOBO, PT.SOTHANH_BO SOTHANH_BO,
    PT.DEL_FLAG DEL_FLAG, PT.MANVL MANVL,PT.longit,PT.OVER_PLAN,PT.vuotkho,PT.MALOGONHAP,
   PT.QTY QTY, PT.SAMPLEQTY SAMPLEQTY,PT.CODENHOM codenhom,G.tylechinhpham tylecp,
     PT.NOTE NOTE,PT.DONGIA_LOAI DONGIA_LOAI, PT.DONGIA_CTY DONGIA_CTY,
    PT.SOTHANH_BO*PT.SAMPLEQTY AS SL_MAU,PT.PALLET, 
   PT.SOTHANH_BO*PT.SOBO AS TONGSOTHANH,
   (select TOP 1 COST from nlg.BANGGIANVL where nlg.BANGGIANVL.MASP = PT.MANVL and nlg.BANGGIANVL.APPLY_DATE <= P.CREATED_AT
    order by APPLY_DATE desc) AS COST,CASE WHEN PT.MANVL = '55551270' 
    then (CAST(PT.SOTHANH_BO as float)*PT.DAY*PT.RONG*PT.CAO*3.14*PT.SOBO/4000000000)
  else (CAST(PT.SOTHANH_BO as float)*PT.DAY*PT.RONG*PT.CAO*PT.SOBO/1000000000) END AS KLKHO

    FROM nlg.PHIEUNHAPKHO_DT PT 
    left join nlg.GROUP_CODE G on G.ID = PT.CODENHOM
    JOIN nlg.PHIEUNHAPKHO P on P.SOPHIEU = PT.SOPHIEUNHAP
                 where PT.SOPHIEUNHAP = '${req.query.sophieuId.replace("-", "/")}' and PT.DEL_FLAG = 'N' and PT.DELAI = 'N'
                 order by PT.ID  `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
bbtinhtien.get('/nhap-lai', (req, res) => {
    new mssql.Request()
        .query(` SELECT PT.ID id, PT.SOPHIEUTRAVE SOPHIEUNHAP, PT.khacKho khacKho,
    PT.DAY DAY, PT.RONG RONG, PT.CAO CAO, PT.SOBO SOBO, PT.SOTHANH_BO SOTHANH_BO,
    PT.DEL_FLAG DEL_FLAG, PT.MANVL MANVL,PT.longit,PT.OVER_PLAN,
   PT.QTY QTY, PT.SAMPLEQTY SAMPLEQTY,PT.CODENHOM codenhom,
     PT.NOTE NOTE,PT.DONGIA_LOAI DONGIA_LOAI, PT.DONGIA_CTY DONGIA_CTY,
    PT.SOTHANH_BO*PT.SAMPLEQTY AS SL_MAU, 
   PT.SOTHANH_BO*PT.SOBO AS TONGSOTHANH,
 
   (CAST(PT.SOTHANH_BO as float)*PT.DAY*PT.RONG*PT.CAO*PT.SOBO/1000000000)  AS KLKHO

    FROM nlg.PHIEUNHAPKHO_DT PT 
    JOIN nlg.PHIEUTRAVE P on P.SOPHIEUTRAVE = PT.SOPHIEUTRAVE
                 where PT.SOPHIEUTRAVE = '${req.query.sophieuId.replace("-", "/")}' and PT.DEL_FLAG = 'N' and PT.DELAI = 'M'
                 order by PT.ID  `, (err, record) => {
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