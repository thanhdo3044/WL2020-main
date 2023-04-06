const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES,asyncExcuted} = require('../config/database')
const payment = express.Router()

payment.get('/:id',(req,res,next)=>{
    // id là sô phiếu nhập kho
    let id = req.params.id
    new mssql.Request()
        .input('RECEIPT_ID',mssql.Int,id)
        .execute(PROCEDUCES.GET_PAY_CALCULATION,(err,data)=>{
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            }
            return res.api.sendData(data.recordset)
        })
})
payment.get('/',(req,res)=>{
    let query = `
    SELECT WH.[ID],[NUMBER_OF_MONTH],[MONTH],[YEAR],[WAREHOUSE_ID],[VENDOR_ID] AS vendorId,[QC_STAFF],CAR_LICENSE_PLATE,ALLOW_INSPECTION,ALLOW_PAY
    ,CONVERT(VARCHAR,RECEIPT_DATE,120) AS RECEIPT_DATE,CONVERT(VARCHAR,CREATE_AT,120) AS CREATE_AT, FORKLIFT,WH.CREATE_BY,VD.[NAME] AS [VENDOR_NAME],
    DP.NAME AS [STOCK_LOCATION_NAME],DP.CODE AS [SL_CODE],WH.[LOCK]
    FROM  ${TABLE.WH_RECEIPT} AS WH
    INNER JOIN ${TABLE.BASE_VENDOR} as VD ON VD.ID=WH.VENDOR_ID
    INNER JOIN ${TABLE.BASE_DEPARTMENT} AS DP ON DP.ID = WH.WAREHOUSE_ID
    WHERE WH.DEL_FLAG='N' AND ALLOW_PAY=1
    `
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        res.api.sendData(data.recordset)
    })
})

// Duyệt biên bản , đóng tính tiền
payment.post('/:id', (req,res,next) =>{
    let uid = req.headers['x-gateway-account-id']
    let receiptId = req.params.id
    let dataBody = req.body
    let dataArray = dataBody.arr
    let totalPay = dataBody.total.taxVAT+dataBody.total.totalAmount
    let manual = dataBody.manual
    new mssql.Request()
        .input('RECEIPT_ID',mssql.Int,receiptId)
        .input('OTHER_SUPPORT_FEE',mssql.Int,dataBody.total.taxVAT)
        .input('TOTAL_PAY',mssql.Int,totalPay)
        .input('AVG_PRICE',mssql.Int,dataBody.total.AVGAmount)
        .input('WH_VOLUMN',mssql.Float,dataBody.total.totalWHVolumn)
        .input('QC_VOLUMN',mssql.Float,dataBody.total.totalQCVolumn)
        .input('INPUT_RATE',mssql.Float,dataBody.total.insRate)
        .input('PAY_RATE',mssql.Float,dataBody.total.payRate)
        .input('TOTAL_NOT_TAX',mssql.Int,dataBody.total.totalAmount)
        .input('APPROVAL_STATUS',mssql.Int,1)
        .input('UID',mssql.Int,uid)
        .input('MANUAL',mssql.Int,manual)
        .execute(PROCEDUCES.COMPLETED_BB,async(err, data)=>{
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            }
            for (let i = 0; i < dataArray.length; i++) {
                const el = dataArray[i];
                let cid = el.CID
                let payRate =  el.PAY_RATE
                let typePrice = el.ICODE ==='INS' ? el.ITYPE_PRICE : el.COM_PRICE
                let queryDetail=`
                INSERT INTO ${TABLE.WOOD_PAY_CALTULATOR}(
                [INPUT_TYPE_ID],[RECEIPT_ID],[ITEM_ID],[DEL_FLAG],[COMPANY_PRICE],[ITYPE_PRICE],[AVERAGE_PRICE],
                [DTYPE],[WTYPE],[DIFF],[INS_RATE],[PAY_RATE],[GOOD_QTY],[SAMPLE_QTY],[TOTAL_QTY],
                [QC_VOLUMN],[WH_VOLUMN],[AMOUNT],[CID],[QCTT_VOLUMN],[ICODE],[PARENTID],[NOTE]
                )
                VALUES(${el.INPUT_TYPE_ID},${receiptId},${el.ITEM_ID},'N',${el.COM_PRICE},${typePrice},${el.avgAmount || 0},
                '${el.DTYPE}',${el.WTYPE},${el.rcDiff || 0},${el.INS_RATE},${payRate},${el.GOOD_QTY},${el.SAMPLE_QTY},
                ${el.TOTAL_QTY},${el.QC_VOLUMN},${el.WH_VOLUMN},${el.Amount},${cid},${el.QCTTVolum},'${el.ICODE}',${el.PARENTID},N'${el.NOTE}')
                `
                await asyncExcuted(queryDetail,(data1,err1)=>{
                    if (err1) {
                        let queryDel = `DELETE FROM ${TABLE.WOOD_PAY_CALTULATOR} WHERE RECEIPT_ID=${receiptId};
                                        DELETE FROM ${TABLE.WOOD_PAY_SAVE} WHERE RECEIPT_ID=${receiptId}`
                        mssqlExcutedQuery(queryDel,(data3,err3)=>{})
                        return res.api.sendFail({
                            number: 4907,
                            message: err1
                        })
                    }
                })
            }
            return res.api.sendData(data.recordset)
        })
})
payment.put('/:id',(req,res,next)=>{
    let uid = req.headers['x-gateway-account-id']
    let receiptId = req.params.id
    let query = `UPDATE ${TABLE.WH_RECEIPT} SET ALLOW_INSPECTION = 1, ALLOW_PAY = 0  WHERE ID = ${receiptId}`
    mssqlExcutedQuery(query,(data,err)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err1
            })
        }
        return res.api.sendData(data.recordset)
    })
})
payment.get('/:id/view',(req,res)=>{
    let id = req.params.id
    let dataSend = {}
    let query=`SELECT *
    FROM ${TABLE.WOOD_PAY_SAVE} WHERE RECEIPT_ID=${id}`
    mssqlExcutedQuery(query,async (data,err)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        dataSend.info=data.recordset[0]
        let queryDetail = `SELECT  PC.INPUT_TYPE_ID AS [ITYPE],PC.RECEIPT_ID,PC.ITEM_ID,IT.[HEIGHT],
        IT.[WIDTH],IT.[LENGTH],IT.VOLUMN AS [ITEM_VOLUMN],PC.NOTE,PC.COMPANY_PRICE AS COM_PRICE,
        PC.ITYPE_PRICE,PC.AVERAGE_PRICE,PC.CREATE_AT,PC.DIFF,PC.DTYPE,PC.INS_RATE,PC.PAY_RATE,PC.GOOD_QTY,PC.SAMPLE_QTY,
        PC.TOTAL_QTY,PC.QCTT_VOLUMN,PC.QC_VOLUMN,PC.WH_VOLUMN,PC.AMOUNT,PC.CID,PC.ICODE,PC.PARENTID,
        ITY.[NAME] AS [INPUT_NAME],INP.RATE_A
        FROM ${TABLE.WOOD_PAY_CALTULATOR} AS PC
        INNER JOIN ${TABLE.ITEM} AS IT ON  IT.ID = PC.ITEM_ID 
        INNER JOIN ${TABLE.WOOD_INPUT_TYPE} AS ITY ON ITY.ID=PC.INPUT_TYPE_ID
        INNER JOIN ${TABLE.WOOD_INSP} AS INP ON INP.RECEIPT_ID = PC.RECEIPT_ID
        WHERE PC.RECEIPT_ID=${id}`
        await asyncExcuted(queryDetail,(data1,err1)=>{
            if (err1) {
                return res.api.sendFail({
                    number: 4907,
                    message: err1
                })
            }
            dataSend.detail = data1.recordset
        })
        return res.api.sendData(dataSend)
    })
})
module.exports = payment