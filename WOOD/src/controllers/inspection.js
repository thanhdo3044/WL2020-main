const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES,asyncExcuted} = require('../config/database')
const inspection = express.Router()

inspection.get('/:id',(req,res)=>{
    let whInputDetailId = req.params.id
    let query = `
    SELECT ISP.ID,ISP.[RECEIPT_ID],ITP.[NAME] AS [TYPE],ISP.ITEM_ID,IT.HEIGHT,IT.WIDTH,IT.[LENGTH],ISP.NOTE,ISP.SIZE_OUT_RATE,
    ISP.HUMIDITY,ISP.IS_DOUBLE,ISP.[DEFECT_QTY],WT.[NAME] AS [WOOD_TYPE],ISP.PAY_RATE
    FROM ${TABLE.WOOD_INSPECTOR} AS ISP
    INNER JOIN ${TABLE.ITEM} AS IT ON IT.ID = ISP.ITEM_ID
    INNER JOIN ${TABLE.WOOD_INPUT_TYPE} AS ITP ON ITP.ID = ISP.INPUT_TYPE_ID
    INNER JOIN ${TABLE.WOOD_TYPE} AS WT ON WT.ID = ISP.WTYPE
    WHERE ISP.DEL_FLAG='N' AND ISP.RECEIPT_ID IN 
    ( SELECT ID FROM wood.WH_RECEIPT_DTL WHERE WH_RECEIPT_ID =${whInputDetailId} AND DEL_FLAG='N' AND LEAVE=0)`
    mssqlExcutedQuery(query,(data,err)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })   
        }
        return res.api.sendData(data.recordsets)
    })
})

inspection.post('/',(req,res)=>{
    let receiptDetailId = req.body.receiptDetailId,
    note = req.body.note,
    sizeOutRate = req.body.sizeOutRate,
    heightOutRate = req.body.heightOutRate,
    humidity = req.body.humidity,
    sampleQuantity = req.body.sampleQuantity,
    rateA1 = req.body.rateA1,
    rateNonli = req.body.rateNonLi,
    rateLuonLi = req.body.rateLuonLi,
    uid = req.headers['x-gateway-account-id'],
    arrayInspection = req.body.arrayInspection
    let rateBArray = arrayInspection.filter(a=>{ return a.iTypeId === 100001})
    let rateCArray = arrayInspection.filter(a=>{ return a.iTypeId === 100015})
    let rateB = 0,rateC=0,totalDefectB = 0, totalDefectC = 0
    rateBArray.forEach(e=>{
        totalDefectB +=e.defectQty
    })
    rateCArray.forEach(e=>{
        totalDefectC +=e.defectQty
    })
    rateB = totalDefectB/sampleQuantity
    rateC =  totalDefectC/sampleQuantity
    let query = `INSERT INTO ${TABLE.WOOD_INSP}([RECEIPT_ID],[SAMPLE_QTY],[SIZE_OUT_RATE],
        [A1_RATE],[NONLI_RATE],[LUONLI_RATE],[HUMIDITY_RATE],[INS_NOTE],[CREATE_AT],[CREATE_BY],
        [RATE_B],[RATE_C],[RATE_A],HEIGHT_OUT_RATE)
    VALUES(${receiptDetailId},${sampleQuantity},${sizeOutRate},${rateA1},${rateNonli},
        ${rateLuonLi},${humidity},N'${note}',GETDATE(),${uid},${rateB},${rateC},${1-(rateC+rateB)},${heightOutRate})`
    asyncExcuted(query,(data,err)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })   
        }
        let success = true
        arrayInspection.forEach(element => {
           
            let queryInsertDetail = `INSERT INTO ${TABLE.WOOD_INSPECTOR}(
                [RECEIPT_ID],[ITEM_ID],[DEL_FLAG],[CREATE_AT],[CREATE_BY],[DEFECT_QTY],[WTYPE],[DTYPE],[INPUT_TYPE_ID],[PAY_RATE]
                ) VALUES(${receiptDetailId},${element.itemId},'N',GETDATE(),${uid},${element.defectQty},
                ${element.wTypeId},'${element.dTypeId}',${element.iTypeId},${element.payRate})`
                asyncExcuted(queryInsertDetail,(data1,err1)=>{
                    if (err1) {
                        success = false
                    }
                })
        })
        if (success) {
            return res.api.sendData(data.recordset)
        }else {
            let queryRollback = `
                DELETE FROM ${TABLE.WOOD_INSP} WHERE [RECEIPT_ID] = ${receiptDetailId};
                DELETE FROM ${TABLE.WOOD_INSPECTOR} WHERE [RECEIPT_ID] = ${receiptDetailId}
            `
            mssqlExcutedQuery(queryRollback,(data2,err2)=>{
                return res.api.sendFail({
                    number: 4907,
                    message: 'Fail and Serve Rollback !'
                })   
            })
        }
    })
})
inspection.put('/:id',(req,res)=>{
     // id là ID của bảng WOOD_INSP
    let id = req.params.id,
    receiptDetailId = req.body.receiptDetailId,
    humidity = req.body.humidity,
    sampleQuantity = req.body.sampleQuantity,
    rateA1 = req.body.rateA1,
    note = req.body.note,
    uid = req.headers['x-gateway-account-id'],
    arrayInspection = req.body.arrayInspection
    let rateBArray = arrayInspection.filter(a=>{ return a.INPUT_TYPE_ID === 100001})
    let rateCArray = arrayInspection.filter(a=>{ return a.INPUT_TYPE_ID === 100015})
    let rateB = 0,rateC=0,totalDefectB = 0, totalDefectC = 0
    rateBArray.forEach(e=>{
        totalDefectB +=e.DEFECT_QTY
    })
    rateCArray.forEach(e=>{
        totalDefectC +=e.DEFECT_QTY
    })
    rateB = totalDefectB/sampleQuantity
    rateC =  totalDefectC/sampleQuantity
    let queryDel = `DELETE FROM ${TABLE.WOOD_INSP} WHERE RECEIPT_ID=${receiptDetailId};DELETE FROM ${TABLE.WOOD_INSPECTOR} WHERE RECEIPT_ID=${receiptDetailId};`
    mssqlExcutedQuery(queryDel,(data,err)=>{
        let query = `INSERT INTO ${TABLE.WOOD_INSP}([RECEIPT_ID],[SAMPLE_QTY],[SIZE_OUT_RATE],
            [A1_RATE],[NONLI_RATE],[LUONLI_RATE],[HUMIDITY_RATE],[INS_NOTE],[CREATE_AT],[CREATE_BY],
            [RATE_B],[RATE_C],[RATE_A],HEIGHT_OUT_RATE)
        VALUES(${receiptDetailId},${sampleQuantity},0,${rateA1},0,
            0,${humidity},N'${note}',GETDATE(),${uid},${rateB},${rateC},${1-(rateC+rateB)},0)`
        asyncExcuted(query,(data2,err2)=>{
            if (err2) {
                return res.api.sendFail({
                    number: 4907,
                    message: err2
                })   
            }
            let success = true
            arrayInspection.forEach(element => {
                let queryInsertDetail = `INSERT INTO ${TABLE.WOOD_INSPECTOR}(
                    [RECEIPT_ID],[ITEM_ID],[DEL_FLAG],[CREATE_AT],[CREATE_BY],[DEFECT_QTY],[WTYPE],[DTYPE],[INPUT_TYPE_ID],[PAY_RATE]
                    ) VALUES(${receiptDetailId},${element.ITEM_ID},'N',GETDATE(),${uid},${element.DEFECT_QTY},
                    ${element.WTYPE},'${element.DTYPE}',${element.INPUT_TYPE_ID},${element.PAY_RATE})`
                    console.log(queryInsertDetail)
                    asyncExcuted(queryInsertDetail,(data1,err1)=>{
                        if (err1) {
                            success = false
                        }
                    })
            })
            if (success) {
                return res.api.sendData(data.recordset)
            }else {
                let queryRollback = `
                    DELETE FROM ${TABLE.WOOD_INSP} WHERE [RECEIPT_ID] = ${receiptDetailId};
                    DELETE FROM ${TABLE.WOOD_INSPECTOR} WHERE [RECEIPT_ID] = ${receiptDetailId}
                `
                mssqlExcutedQuery(queryRollback,(data3,err3)=>{
                    return res.api.sendFail({
                        number: 4907,
                        message: 'Fail and Serve Rollback !'
                    })   
                })
            }
        })
    })

})
inspection.get('/:id/view',(req,res)=>{
    let receiptDetailId = req.params.id
    let query =`SELECT INP.*,IT.[NAME] AS [ITEM_NAME],WT.[NAME] AS [WTYPE_NAME],PT.[NAME] AS [DTYPE_NAME],
    ITY.[NAME] AS [ITYPE_NAME]
    FROM ${TABLE.WOOD_INSPECTOR} AS INP
    INNER JOIN ${TABLE.ITEM} AS IT ON IT.ID = INP.ITEM_ID
    INNER JOIN ${TABLE.WOOD_INPUT_TYPE} AS ITY ON ITY.ID = INP.INPUT_TYPE_ID
    INNER JOIN ${TABLE.WOOD_TYPE} AS WT ON WT.ID = INP.WTYPE
    INNER JOIN ${TABLE.PRICE_TYPE} AS PT ON PT.CODE = INP.DTYPE
    WHERE RECEIPT_ID =${receiptDetailId}`
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
inspection.put('/:id',(req,res)=>{
    let id = req.params.id
    inputTypeId = req.body.inputTypeId,
    itemId = req.body.itemId,
    sizeOutRate = req.body.sizeOutRate,
    humidity = req.body.humidity,
    isDouble = req.body.isDouble,
    note = req.body.note,
    uid = req.headers['x-gateway-account-id']

    new mssql.Request()
        .input('ID',mssql.Int,id)
        .input('INPUT_TYPE_ID',mssql.Int,inputTypeId)
        .input('ITEM_ID',mssql.Int,itemId)
        .input('NOTE',mssql.NVarChar(350),note)
        .input('SIZE_OUT_RATE',mssql.Float,sizeOutRate)
        .input('ISDOUBLE',mssql.NChar(10),isDouble)
        .input('UID',mssql.Int,uid)
        .execute(PROCEDUCES.UPDATE_WOOD_INSPECTION,(err,data)=>{
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })   
            }
            return res.api.sendData(data.recordsets) 
        })
})
module.exports = inspection