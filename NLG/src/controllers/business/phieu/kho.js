const express = require('express')
const mssql = require('mssql')
const { mssqlExcutedQuery, PROCEDUCES, VIEWS } = require('../../../config/database')
const kho = express.Router()
const model = require('../../../data/model')

kho.get('/:kho', async(req, res) => {
    const { start, end, kho } = req.query;
    let data = await new mssql.Request().query(`
    SELECT        p.ID, p.SOPHIEU, p.MAKHO, p.NHOMSP, p.MALOGONHAP, p.BIENSOXE, p.CREATED_AT, p.CREATED_BY, p.DEL_FLAG, p.ALLOWMODIFY, p.MANCC, p.ALLOWHACAP, p.DONGIATB, p.ALLOWTINHTIEN, p.QC_STAFF, 
                         p.XUONGXENANG, p.ACTUALDATE, c.ID AS Expr1, c.CODE, c.NAME, c.ADDRESS, c.STAFF, c.DEL_FLAG AS Expr2, c.VUNG, c.VUNG2, c.COHD, c.COC
FROM            (SELECT        TOP (100) PERCENT ID, SOPHIEU, MAKHO, NHOMSP, MALOGONHAP, BIENSOXE, CREATED_AT, CREATED_BY, DEL_FLAG, ALLOWMODIFY, MANCC, ALLOWHACAP, DONGIATB, ALLOWTINHTIEN, QC_STAFF, 
                                                    XUONGXENANG, ACTUALDATE
                          FROM            nlg.PHIEUNHAPKHO
                          WHERE        (ACTUALDATE BETWEEN '${start}' AND '${end}') AND (ALLOWHACAP = N'N') AND (MAKHO = N'${req.params.kho}')
                          ) AS p LEFT OUTER JOIN
                         nlg.PROVIDERS AS c ON p.MAKHO = c.CODE
                         ORDER BY CREATED_AT DESC
    `)

    res.status(200).send(data.recordset);
})

kho.get('/', (req, res) => {
    let condition = ` where A.MAKHO='${req.query.kho}'`
    if (req.query.kho == 'ALL') {
        condition = `Where A.ALLOWHACAP = 'N' `
    } else {
        if (req.query.kho == 'Phòng NLG') {
            condition = ``
        }
        // condition = ` where A.MAKHO='${req.query.kho}' and YEAR(A.CREATED_AT) = DATEPART(year, GETDATE()) and MONTH(A.CREATED_AT) = DATEPART(MONTH, GETDATE())`
        else if(req.query.kho  == 'TB') {
            condition = ` where A.MAKHO in ('${req.query.kho}','YS4')`
        }
        else  condition = ` where A.MAKHO ='${req.query.kho}' `
    }
    new mssql.Request()
        .query(`SELECT
            A.ID id,
            A.SOPHIEU sophieu,
           A.MAKHO makho ,
           A.ALLOWMODIFY ALLOWMODIFY,
           A.ALLOWTINHTIEN tinhtien,
           A.MANCC 'mancc',
           B.NAME name,
           A.XUONGXENANG xuongxenang,
           A.CREATED_AT ngaynhapht,
           A.ACTUALDATE ngaynhaptt,
           C.TENKHO tenkho,
           B.ADDRESS NCC_ADDRESS,
           A.BIENSOXE,
           A.ALLOWHACAP ALLOWHACAP


            FROM nlg.PHIEUNHAPKHO A JOIN nlg.PROVIDERS B ON B.CODE = A.MANCC JOIN nlg.MAKHO C on A.MAKHO = C.MAKHO 
             ${condition}
             ORDER BY A.CREATED_AT DESC,A.SOPHIEU DESC`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


kho.post('/', (req, res) => {
    req.body.createBy = req.headers['x-gateway-account-id']

}, model.kho.insert)
kho.put('/:id', (req, res, next) => {
    console.log(req.body.tinhtien)
    const id = req.params.id
        // const hacap = req.body.hacap ?  req.body.hacap : 'N'
        //  const tinhtien = req.body.tinhtien
        //  const delFlag = req.body.delFlag ? req.body.delFlag : 'N' 
    const query = `
    DELETE FROM nlg.TINHTIEN WHERE SOPHIEU ='${req.body.sophieu}'

    UPDATE nlg.PHIEUNHAPKHO SET 
    ALLOWTINHTIEN = '${req.body.tinhtien}',ALLOWHACAP = '${req.body.hacap}', DEL_FLAG = 'N',ALLOWMODIFY = '${req.body.ALLOWMODIFY}',
    ACTUALDATE = GETDATE()
    WHERE ID = ${id}`
    mssqlExcutedQuery(query, (data, err) => {
        return res.api.sendData(data.recordset)
    })
})
kho.put('/', (req, res, next) => {
    const id = req.body.id
        // const hacap = req.body.hacap ?  req.body.hacap : 'N'
        //  const tinhtien = req.body.tinhtien
        //  const delFlag = req.body.delFlag ? req.body.delFlag : 'N' 
    const query = `UPDATE nlg.PHIEUNHAPKHO SET ALLOWTINHTIEN = '${req.body.tinhtien}' , DEL_FLAG = '${req.body.delFlag }', ALLOWHACAP = '${req.body.hacap}',
    ACTUALDATE = GETDATE(),QC_STAFF = '${req.body.QC_STAFF}', ALLOWMODIFY = 'N'
    WHERE ID = ${id}`
    mssqlExcutedQuery(query, (data, err) => {

        if (err)
            return res.api.sendData(data.recordset)
        next()
    })
}, (req, res, next) => {
    //rollback
    const query = `DELETE FROM nlg.TINHTIEN WHERE SOPHIEU ='${req.body.sophieu}'`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        next()
    })

}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

module.exports = kho