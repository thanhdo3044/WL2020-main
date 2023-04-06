const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES} = require('../config/database')
const report = express.Router()

report.get('/theo-doi-nhap-van',(req,res,next)=>{
    const warehouseId = req.query.warehouseId
    const month = req.query.month
    const year = req.query.year
    let condition = `WHERE WR.[YEAR]=${year} AND WR.[MONTH]=${month} `
    if (warehouseId) {
        condition +=` AND WR.WAREHOUSE_ID=${warehouseId}`
    }
    const query =`SELECT WR.RECEIPT_DATE,VD.[NAME] AS [NCC],WR.CAR_LICENSE_PLATE AS [BKS],
    CONVERT(VARCHAR(300),WR.[YEAR])+'.'+CONVERT(VARCHAR(300),WR.[NUMBER_OF_MONTH])+'/'+CONVERT(VARCHAR(300),WR.[MONTH])+''+DP.[CODE] AS [SOPHIEU],
    WT.[NAME]+' '+PT.[NAME]+' '+WI.[NAME] AS [PHANLOAI],
    IT.[HEIGHT],IT.[WIDTH],IT.[LENGTH],DLT.PCS_PER_PACKAGE*DLT.PACKAGE_QUANTITY AS [SOLUONG],
    IT.[VOLUMN]*DLT.PCS_PER_PACKAGE*DLT.PACKAGE_QUANTITY AS [KHOILUONG],
    ISP.RATE_A,wood.Func_get_Rate_A(DLT.ID) AS [NEW_RATE_A],CASE WHEN ISP.HUMIDITY_RATE > 25 THEN '>25' ELSE '<25' END AS [DOAM],
    ISP.A1_RATE,wood.Func_get_NonLi_Rate(DLT.ID) AS [RATE_NON_LI],
    wood.Func_get_LuonLi_Rate(DLT.ID) AS [RATE_LUON_LI]
    FROM wood.WH_RECEIPT_DTL AS DLT
    INNER JOIN wood.WH_RECEIPT AS WR ON WR.ID = DLT.WH_RECEIPT_ID
    INNER JOIN base.VENDOR AS VD ON VD.ID = WR.VENDOR_ID
    INNER JOIN base.ITEM AS IT ON IT.ID  = DLT.ITEM_ID
    INNER JOIN base.DEPARTMENT AS DP ON DP.ID = WR.WAREHOUSE_ID
    INNER JOIN wood.WH_INPUT_TYPE AS WI ON WI.ID = DLT.INPUT_TYPE_ID
    INNER JOIN wood.WOOD_TYPE AS WT ON WT.ID = DLT.WTYPE
    INNER JOIN wood.PRICE_TYPE AS PT ON PT.CODE = DLT.DTYPE
    INNER JOIN wood.WOOD_INSP AS ISP ON ISP.RECEIPT_ID = DLT.ID 
     ${condition}`
     mssqlExcutedQuery(query,(data,err)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })   
        }
        return res.api.sendData(data.recordset) 
     })
})

module.exports = report