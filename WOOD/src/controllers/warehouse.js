const express = require('express')
const mssql = require('mssql')
const { TABLE, mssqlExcutedQuery, PROCEDUCES } = require('../config/database')
const warehouse = express.Router()

//x-gateway-account-id

warehouse.get('/', (req, res) => {
    let filterByWarehouseId =``
    if(req.query.warehouseId){
        filterByFatoryId = `AND WH.WAREHOUSE_ID=${req.query.warehouseId}`
    }
    let query = `
    SELECT WH.[ID],[NUMBER_OF_MONTH],[MONTH],[YEAR],[WAREHOUSE_ID],[VENDOR_ID] AS vendorId,[QC_STAFF],CAR_LICENSE_PLATE,ALLOW_INSPECTION,ALLOW_PAY
    ,CONVERT(VARCHAR,RECEIPT_DATE,120) AS RECEIPT_DATE,CONVERT(VARCHAR,CREATE_AT,120) AS CREATE_AT, FORKLIFT,WH.CREATE_BY,VD.[NAME] AS [VENDOR_NAME],
    DP.[NAME]  AS [WAREHOUSE_NAME],DP.CODE AS [WAREHOUSE_CODE]
    FROM  ${TABLE.WH_RECEIPT} AS WH
    INNER JOIN base.VENDOR as VD ON VD.ID=WH.VENDOR_ID
    INNER JOIN base.DEPARTMENT AS DP ON DP.ID = WH.WAREHOUSE_ID
    WHERE WH.DEL_FLAG='N'  ${filterByWarehouseId} AND WH.MODULE='${req.query.moduleCode}'
    ORDER BY WH.ID DESC
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
warehouse.post('/', (req, res) => {
    let userId = req.headers['x-gateway-account-id']
    let receiptDate = req.body.receiptDate,
        carLicensePlate = req.body.carLicensePlate,
        vendorId = req.body.vendorId
        forklift = req.body.forklift || 0,
        warehouseId = req.body.warehouseId,
        moduleCode = req.body.moduleCode
    new mssql.Request()
        .input('WAREHOUSE_ID', mssql.Int, warehouseId)
        .input('RECEIPT_DATE', mssql.Date, receiptDate)
        .input('CAR_LICENSE_PLATE', mssql.VarChar(40), carLicensePlate)
        .input('VENDOR_ID', mssql.Int, vendorId)
        .input('FORLIFT', mssql.Bit, forklift)
        .input('UID', mssql.Int, userId)
        .input('MODULECODE', mssql.NVarChar(300), moduleCode)
        .execute(PROCEDUCES.CREATE_WH_RECEIPT, (err, data) => {
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            }
            return res.api.sendData(data.recordset)
        })
})
//kho hoàn thành biên bản để nhập tồn về kho trước sấy
warehouse.put('/:id',(req,res)=>{
    const id = req.params.id
    const query = `UPDATE ${TABLE.WH_RECEIPT} SET ALLOW_PAY=1,LOCK=1 WHERE ID=${id}`
    mssqlExcutedQuery(query,(data,err)=>{
        if (err) {
            res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        res.api.sendData(data.recordset)
    }) 
})
// lấy chi tiết phiếu nhập kho
warehouse.get('/:id', (req, res) => {
    let id = req.params.id
    let query = `
        SELECT WH.[ID],WH.CAR_LICENSE_PLATE,WH.CREATE_AT,WH.CREATE_BY,WH.MODULE_ID,WH.[MONTH],WH.[YEAR],WH.[NUMBER_OF_MONTH],
        CONVERT(varchar(200),WH.[RECEIPT_DATE],103) AS [RECEIPT_DATE],DP.CODE AS [WH_CODE],
        VD.[NAME] AS [VENDOR_NAME],AD.LAST_NAME AS [QC_SATFF_NAME],AC.[LAST_NAME] AS [WH_STAFF_NAME],
        DP.[NAME] AS [WAREHOUSE_NAME],VD.[ADDRESS] AS [VENDOR_ADDRESS],WH.[ALLOW_PAY],WH.[LOCK]
        FROM ${TABLE.WH_RECEIPT}  AS WH 
        INNER JOIN ${TABLE.BASE_VENDOR} AS VD ON VD.ID = WH.VENDOR_ID
        INNER JOIN ${TABLE.BASE_DEPARTMENT} AS DP  ON DP.ID=WH.WAREHOUSE_ID
        INNER JOIN ${TABLE.BASE_ACCOUNT}  AS AC ON AC.ID = WH.CREATE_BY
        INNER JOIN ${TABLE.BASE_ACCOUNT}  AS AD ON AD.ID = WH.QC_STAFF
        WHERE WH.DEL_FLAG='N' AND WH.ID=${id}
    `
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
// cập nhật trạng thái của biên bản nhập kho
warehouse.put('/:id', (req, res) => {
    const allowInspection = req.body.allowInspection,
        allowPay = req.body.allowPay,
        receiptDetailId = req.params.id,
        uid = req.headers['x-gateway-account-id'],
        delFlag = req.body.delFlag,
        qcCompleted = req.body.qcCompleted
    let isLock = 0
    let qcStaff=null
    if (qcCompleted) {
        qcStaff =uid
    }
    new mssql.Request()
        .input('ID',mssql.Int,receiptDetailId)
        .input('ALLOW_INSPECTION',mssql.Bit,allowInspection)
        .input('ALLOW_PAY',mssql.Bit,allowPay)
        .input('DEL_FLAG',mssql.NChar(10),delFlag)
        .input('QC_STAFF',mssql.Int,qcStaff)
        .input('LOCK',mssql.Int,isLock)
        .execute(PROCEDUCES.UPDATE_WH_RECEIPT,(err,data)=>{
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            }
            return res.api.sendData(data.recordset)
        })

})
module.exports = warehouse