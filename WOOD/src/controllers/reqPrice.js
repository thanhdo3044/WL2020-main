const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES,asyncExcuted} = require('../config/database')
const reqPrice = express.Router()
const uuidv4 = require('uuid/v4');

reqPrice.get('/',(req,res)=>{
    let uid = req.query.uid
    let query =`SELECT RQ.ID,RQ.[GUID],RQ.CREATED_AT,AC.FIRST_NAME+' '+ AC.LAST_NAME AS [CREATE_BY],RQ.APPROVAL_STATUS,
    RQ.APPROVAL_BY,AD.FIRST_NAME+' '+AD.LAST_NAME AS [APPROVAL_BY],
    RQ.APPROVAL_AT
    FROM  ${TABLE.REQ_PRICE} AS RQ 
    INNER JOIN base.ACCOUNT AS AC ON AC.ID = RQ.CREATED_BY
    LEFT JOIN base.ACCOUNT AS AD ON AD.ID = RQ.APPROVAL_BY`
    if (uid) {
        query=` SELECT RQ.ID,RQ.[GUID],RQ.CREATED_AT,AC.FIRST_NAME+' '+ AC.LAST_NAME AS [CREATE_BY],
        RQ.APPROVAL_STATUS,RQ.APPROVAL_BY,AD.FIRST_NAME+' '+AD.LAST_NAME AS [APPROVAL_BY],
        RQ.APPROVAL_AT
        FROM  ${TABLE.REQ_PRICE} AS RQ 
        INNER JOIN base.ACCOUNT AS AC ON AC.ID = RQ.CREATED_BY
        LEFT JOIN base.ACCOUNT AS AD ON AD.ID = RQ.APPROVAL_BY
        WHERE RQ.[CREATED_BY] = ${uid}`
    }
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
reqPrice.get('/:id',(req,res) =>{
    let reqId = req.params.id
    let queryInfo = `SELECT * FROM ${TABLE.REQ_PRICE}  WHERE ID = ${reqId}`
    mssqlExcutedQuery(queryInfo,(data1,err1)=>{
        if (err1) {
            return res.api.sendFail({
                number: 4907,
                message: err1
            })
        }
        let dataSend = {
            info:data1.recordset[0],
            detail:[]
        }
        let query = `SELECT PR.ID,PR.PRICE,PR.ITEM_ID,IT.[NAME] AS [ITEM_NAME],PR.REGION_ID,RE.[NAME] AS [REGION_NAME],
        PR.[TYPE] AS [DTYPE_CODE],PRT.[NAME] AS [DTYPE_NAME],PR.WTYPE,WT.[NAME] AS [WTYPE_NAME],
        ITY.[NAME] AS [ITYPE],
        dbo.FUNC_GET_PRICE_WOOD(
        (SELECT CREATED_AT  FROM ${TABLE.REQ_PRICE} WHERE ID=${reqId}),
        PR.ITEM_ID,PR.[TYPE],PR.[REGION_ID],PR.[ITYPE],PR.WTYPE,0
        ) AS [CUR_PRICE]
        FROM ${TABLE.WOOD_PRICE_LIST} AS PR
        INNER JOIN ${TABLE.PRICE_TYPE} AS PRT ON PRT.CODE = PR.[TYPE]
        INNER JOIN ${TABLE.WOOD_INPUT_TYPE} AS ITY ON ITY.ID = PR.[ITYPE]
        INNER JOIN ${TABLE.REGION} AS RE ON RE.ID = PR.REGION_ID
        INNER JOIN ${TABLE.ITEM} AS IT ON IT.ID = PR.ITEM_ID
        INNER JOIN ${TABLE.WOOD_TYPE} AS WT ON WT.ID = PR.WTYPE
        WHERE PR.REQ_ID=${reqId}`
        mssqlExcutedQuery(query,(data,err)=>{
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            }
            dataSend.detail = data.recordset
            return res.api.sendData(dataSend)
        })
    })
})
reqPrice.post('/',(req,res) =>{
    let dataRequest = req.body.data
    let reason = req.body.reason
    let uid = req.headers['x-gateway-account-id']
    let newId = uuidv4()
    let queryCreateReq = `INSERT INTO ${TABLE.REQ_PRICE}([GUID],[CREATED_AT],[CREATED_BY],[APPROVAL_STATUS],[REQ_NOTE])
        VALUES('${newId}',GETDATE(),${uid},0,N'${reason}')`
    mssqlExcutedQuery(queryCreateReq, (data,err)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        dataRequest.forEach(async(el) => {
            let queryInsertDetail = `INSERT INTO ${TABLE.WOOD_PRICE_LIST} ([PRICE],[ITEM_ID],[REQ_ID],[REGION_ID],[CREATE_BY],[CREATE_AT],[APPLY_STATUS],[TYPE],[ITYPE],[WTYPE])
            VALUES(${el.price},${el.itemID},(SELECT ID FROM ${TABLE.REQ_PRICE} WHERE [GUID]='${newId}'),${el.regionId},${uid},GETDATE(),0,'${el.dTypeCode}',${el.iTypeID},${el.wTypeID})`
            console.log(queryInsertDetail)
            await asyncExcuted(queryInsertDetail,(d,e)=>{
            })
        });
        return res.api.sendData(data.recordset)
    })
    
})

reqPrice.put('/',(req,res)=>{
    let uid = req.headers['x-gateway-account-id']
    let status = req.body.status
    let reqId = req.body.reqId,
    approvalDate = req.body.approvalDate,
    approvalNote = req.body.approvalNote
    new mssql.Request()
    .input('REQ_ID',mssql.Int,reqId)
    .input('UID',mssql.Int,uid)
    .input('STATUS',mssql.Int,status)
    .input('APPROVAL_DATE',mssql.VarChar,approvalDate)
    .input('APPROVAL_NOTE',mssql.NVarChar(200),approvalNote)
    .execute(PROCEDUCES.APPROVAL_PRICE,(err,data)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
       if (data.recordset[0].RESULT) {
            return res.api.sendData(data.recordset)
       }else {
            return res.api.sendFail({
                number: 5555,
                message: data.recordset[0].MESSAGE
            })
       }
    })
})
module.exports = reqPrice