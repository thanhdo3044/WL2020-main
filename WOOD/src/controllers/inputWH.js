const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES} = require('../config/database')
const inputWarehouse = express.Router()


//  LAY DANH SACH CHI TIET NHAP KHO THEO SO PHIEU
inputWarehouse.get('/',(req,res)=>{
    let receiptId = req.query.receiptId
    let query = `
    SELECT RDLT.ID,RDLT.ITEM_ID,IT.HEIGHT,IT.WIDTH,IT.LENGTH,RDLT.INPUT_TYPE_ID,RDLT.PCS_PER_PACKAGE,RDLT.PACKAGE_QUANTITY,RDLT.NOTE,RDLT.LEAVE,
    RDLT.RETURN_ID,RDLT.OVER_PLAN,RDLT.SAMPLE_PACKAGE_QUANTITY,RDLT.SAMPLE_QUANTITY,WT.[NAME] AS [WOOD_TYPE],XT.ID AS [WOOD_TYPE_ID],
    ROUND(IT.VOLUMN*RDLT.PACKAGE_QUANTITY*RDLT.PCS_PER_PACKAGE,4) AS 'VOLUMN',XT.[NAME] AS 'PHANLOAI',
    INS.SAMPLE_QTY,INS.INS_NOTE,INS.RATE_A,INS.RATE_B,INS.RATE_C,IT.NAME AS [ITEM_NAME]
    FROM ${TABLE.WH_RECEIPT_DETAIL} AS RDLT
    INNER JOIN ${TABLE.ITEM} AS IT ON  IT.ID = RDLT.ITEM_ID
    INNER JOIN ${TABLE.WOOD_TYPE} AS WT ON WT.ID = RDLT.WTYPE
    INNER JOIN ${TABLE.WOOD_INPUT_TYPE} AS XT ON XT.ID = RDLT.INPUT_TYPE_ID
    LEFT JOIN wood.WOOD_INSP AS INS ON INS.RECEIPT_ID = RDLT.ID
    WHERE RDLT.DEL_FLAG='N' AND RDLT.LEAVE=0 AND RDLT.[WH_RECEIPT_ID]=${receiptId}
    `
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


// lấy chi tiết theo id DETAIL
inputWarehouse.get('/:id',(req,res,next)=>{
    let id = req.params.id
    let query = `
        SELECT RDLT.ID,RDLT.ITEM_ID,IT.HEIGHT,IT.WIDTH,IT.LENGTH,RDLT.INPUT_TYPE_ID,RDLT.PCS_PER_PACKAGE,RDLT.PACKAGE_QUANTITY,RDLT.NOTE,RDLT.LEAVE,
        RDLT.RETURN_ID,RDLT.OVER_PLAN,RDLT.SAMPLE_PACKAGE_QUANTITY,RDLT.SAMPLE_QUANTITY,WT.[NAME] AS [WOOD_TYPE],WT.ID AS [WOOD_TYPE_ID],
        ROUND(IT.VOLUMN*RDLT.PACKAGE_QUANTITY*RDLT.PCS_PER_PACKAGE,4) AS 'VOLUMN',XT.[NAME] AS 'PHANLOAI',IT.[WOOD_TYPE_ID] AS [XTYPE],
        INS.SAMPLE_QTY,INS.INS_NOTE,INS.HUMIDITY_RATE,INS.A1_RATE,RDLT.WH_RECEIPT_ID,INS.ID AS [INS_ID],RDLT.DTYPE
        FROM ${TABLE.WH_RECEIPT_DETAIL} AS RDLT
        INNER JOIN ${TABLE.ITEM} AS IT ON  IT.ID = RDLT.ITEM_ID
        INNER JOIN ${TABLE.WOOD_TYPE} AS WT ON WT.ID =  RDLT.[WTYPE]
        INNER JOIN ${TABLE.WOOD_INPUT_TYPE} AS XT ON XT.ID = RDLT.INPUT_TYPE_ID
        LEFT JOIN ${TABLE.WOOD_INSP} AS INS ON INS.RECEIPT_ID = RDLT.ID
        WHERE RDLT.DEL_FLAG='N' AND RDLT.LEAVE=0 AND RDLT.ID=${id}
    `
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
inputWarehouse.post('/',(req,res)=>{
    let id = req.body.receiptId,
    itemId = req.body.itemId,
    pcsPackage = req.body.pcsPackage,
    packageQuantity = req.body.packageQuantity,
    inputTypeId = req.body.inputTypeId,
    note = req.body.note,
    leave = req.body.leave,
    overPlan = req.body.overPlan,
    dType = req.body.dType,
    wType = req.body.wType,
    uid  = req.headers['x-gateway-account-id']
    new mssql.Request()
        .input('RECEIPT_ID',mssql.Int,id)
        .input('ITEM_ID',mssql.Int,itemId)
        .input('PCS_PACKAGE',mssql.Int,pcsPackage)
        .input('PACKAGE_QUANTITY',mssql.Int,packageQuantity)
        .input('INPUT_TYPE_ID',mssql.Int,inputTypeId)
        .input('NOTE',mssql.NVarChar(300),note)
        .input('LEAVE',mssql.Int,leave)
        .input('OVERPLAN',mssql.Bit,overPlan)
        .input('UID',mssql.Int,uid)
        .input('DTYPE',mssql.NChar(10),dType)
        .input('WTYPE',mssql.NChar(10),wType)
        .execute(PROCEDUCES.CREATE_WH_RECEIPT_DLT,(err,data)=>{
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })   
            }
            return res.api.sendData(data.recordset)
        })
})

inputWarehouse.put('/:id',(req,res)=>{
    
    // console.log(req.body)
    let id = req.params.id,
    pcsPackage = req.body.pcsPackage || null,
    packageQuantity = req.body.packageQuantity  || null,
    leave = req.body.leave || null,
    samplePackageQty = req.body.samplePackageQty || null,
    sampleQuantity = req.body.sampleQuantity || null,
    itemId = req.body.itemId || null,
    note = req.body.note || null,
    dType = req.body.dType,
    iType = req.body.iType,
    uid = req.headers['x-gateway-account-id']
    new mssql.Request()
        .input('ID',mssql.Int,id)
        .input('PCS_OF_QUANTITY',mssql.Int,pcsPackage)
        .input('PACKAGE_QUANTITY',mssql.Int,packageQuantity)
        .input('LEAVE',mssql.Int,leave)
        .input('SAMPLE_QUANTITY',mssql.Int,sampleQuantity)
        .input('SAMPLE_PACKAGE_QTY',mssql.Int,samplePackageQty)
        .input('ITEM_ID',mssql.Int,itemId)
        .input('NOTE',mssql.NVarChar(300),note)
        .input('ITYPE',mssql.Int,iType)
        .input('DTYPE',mssql.NVarChar(300),dType)
        .input('UID',mssql.Int,uid)
        .execute(PROCEDUCES.UPDATE_WH_RECEIPT_DLT,(err,data)=>{
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })   
            }
            return res.api.sendData(data.recordset)
        })
})
module.exports = inputWarehouse