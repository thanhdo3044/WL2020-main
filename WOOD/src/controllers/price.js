const express = require('express')
const mssql = require('mssql')
const {TABLE,mssqlExcutedQuery,PROCEDUCES,asyncExcuted} = require('../config/database')
const price = express.Router()

price.get('/',(req,res)=>{
    let moduleCode = req.query.moduleCode
    let regionId = req.query.regionId
    let price = {
        data:[],
        options:[]
    }
    let query = `
        SELECT PR.ID,PR.ITEM_ID,IT.HEIGHT,IT.WIDTH,IT.LENGTH,IT.NAME AS [ITEM_ANME],
        IT.CODE AS [ITEM_CODE],PR.REGION_ID,RE.NAME AS [REGION_NAME],PR.REQ_ID,PR.[TYPE] AS [DTYPE_CODE],PRT.[NAME] AS [DTYPE_NAME],
        PR.WTYPE,WT.NAME AS [WTYPE_NAME],PR.ITYPE,ITY.NAME AS [ITYPE_NAME],PR.PRICE
        FROM ${TABLE.WOOD_PRICE} AS PR
        INNER JOIN ${TABLE.ITEM} AS IT ON IT.ID = PR.ITEM_ID
        INNER JOIN ${TABLE.REGION} AS RE ON RE.ID = PR.REGION_ID AND RE.MODULE='${moduleCode}'
        INNER JOIN ${TABLE.WOOD_TYPE} AS WT ON WT.ID = PR.WTYPE
        INNER JOIN ${TABLE.PRICE_TYPE} AS PRT ON PRT.CODE = PR.[TYPE]
        INNER JOIN ${TABLE.WOOD_INPUT_TYPE} AS ITY ON ITY.ID = PR.[ITYPE]
        WHERE PR.APPLY_STATUS=1 AND PR.APPLY_DATE <= GETDATE() AND PR.ISNEW = 'Y' AND PR.REGION_ID=${regionId}
    `
    asyncExcuted(query,(data,err)=>{
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        price.data = data.recordset
        // let query_get_Option = `SELECT OMAP.REGION_ID,OMAP.COND_ID,COND.[DESCRIPTION]
        // FROM wood.OPT_MAP_CONDITION as OMAP
        // INNER JOIN wood.OPT_CONDITIONS AS COND ON COND.ID = OMAP.COND_ID
        // WHERE REGION_ID = ${regionId}`
        let query_get_Option =`SELECT OMAP.ID AS OID,OCON.ID AS CID,OCON.CODE,OCON.DESCRIPTION ,OMAP.REGION_ID,
        CASE WHEN OMAP.REGION_ID IS NULL THEN 0 ELSE 1 END AS USE_FLAG 
        FROM wood.OPT_CONDITIONS AS OCON
        left JOIN wood.OPT_MAP_CONDITION as OMAP ON OMAP.COND_ID = OCON.ID AND OMAP.REGION_ID=${regionId}`
        asyncExcuted(query_get_Option,(data1,err1)=>{
            if (err1) {
                return res.api.sendFail({
                    number: 4907,
                    message: err1
                })
            }
            price.options = data1.recordset
            return res.api.sendData(price)
        })
    })
})

price.post('/',(req,res)=>{
    const cid = req.body.cid,
            oid = req.body.oid,
            rid = req.body.rid
    new mssql.Request()
        .input('REGION_ID',mssql.Int,rid)
        .input('CONDITION_ID',mssql.Int,cid)
        .input('MAP_ID',mssql.Int,oid)
        .execute(PROCEDUCES.CHANGE_MAP_CONDITION,(err,data)=>{
            if (err) {
                console.log(err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            }
            return res.api.sendData(data.recordset)
        })
})
module.exports = price