const express = require('express')
const tondk = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')

tondk.get('/:stepId/capphoi', (req, res) => {
    // console.log()
    const query = `SELECT   po.number number,     ST.ID, ST.ITEM_ID, ST.DEPARTMENT_ID, ST.nguonPhoi, ST.CREATE_BY CREATE_BY, ST.createdAt, IT.NAME + ' (' + CONVERT(VARCHAR(30), IT.HEIGHT) + '*' + CONVERT(VARCHAR(30), IT.WIDTH) 
  + '*' + CONVERT(VARCHAR(30), IT.LENGTH) + ' )' AS ITEM_NAME, ST.QUANTITY AS STOC_QTY, ST.daXuat
FROM            prod.OPENING_STOCK AS ST LEFT OUTER JOIN
  base.ITEM AS IT ON IT.ID = ST.ITEM_ID
  LEFT JOIN prod.PO as po on po.code = ST.PO_ID
WHERE        (ST.QUANTITY  < 0) and ST.DEPARTMENT_ID = '${req.params.stepId}'
     `
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})

tondk.post('/', (req, res, next) => {
    const query = `INSERT INTO prod.OPENING_STOCK([DATE],[MONTH],[DEPARTMENT_ID],[ITEM_ID],
    [QUANTITY],[WEEK],[market_code], [nguonPhoi],[color],[CREATE_BY]) VALUES(GETDATE(),DATEPART(MONTH,GETDATE()),@DEPARTMENT_ID,@ITEM_ID,@QUANTITY,DATEPART(WEEK,GETDATE()),@market_code, @nguonPhoi, @color,@createBy)`
    console.log(req.body.nguonPhoi)
    new mssql.Request()
        .input('DEPARTMENT_ID', req.body.departmentId)
        .input('QUANTITY', req.body.quantity)
        .input('ITEM_ID', req.body.itemId)
        .input('market_code', req.body.marketCode)
        .input('nguonPhoi', req.body.nguonPhoi)
        .input('color', req.body.color)
        .input('createBy', req.token.accountId)
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})

module.exports = tondk