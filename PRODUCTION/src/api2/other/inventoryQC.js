const express = require('express')
const inventoryQc = express.Router()
const mssql = require('mssql')

inventoryQc.get('/', (req, res, next) => {
    
    let query = 'SELECT * FROM dbo.View_TON_QC'
    if (req.headers['x-gateway-account-id']== 100400 || req.headers['x-gateway-account-id']== 102089)
    {
        query = query + ` WHERE  factoryId in (100003,100004,100000)`
    } else
    if (req.headers['x-gateway-account-id']== 101894 || req.headers['x-gateway-account-id']== 101882)
    query = query + ` WHERE  factoryId in (100003,100004)`
    else

        query = query + ` WHERE  factoryId = @STEP_ID`
    new mssql.Request()
        .input('STEP_ID', req.query.stepId)
        .query(query, (err, record) => {
            if (err) return console.log(err)
            req.result = []
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    factoryId:e.factoryId,
                    fromId: e.FROM,
                    LSX:e.number?e.number:null,
                    ID_QC:e.ID_QC,
                    PO:e.PO,
                    step: {
                        departmentId: e.ID
                    },
                    from: {
                        departmentId: e.FROM
                    },
                    item: {
                        itemId: e.ITEM_ID
                    },
                    remain: e.REMAIN
                })

            })

            next()
        })
}, (req, res) => {
    // console.log(req.result)

    res.api.sendData(req.result)

})
inventoryQc.get('/VCN', (req, res, next) => {
    let query = 'SELECT * FROM dbo.View_TON_QC_VCN'
    if (req.query.stepId !== undefined && req.query.stepId > 10)
        query = query + ` WHERE  factoryId = @STEP_ID`
    new mssql.Request()
        .input('STEP_ID', req.query.stepId)
        .query(query, (err, record) => {
            if (err) return console.log(err)
            req.result = []
            console.log(record.recordsets)
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    fromId: e.FROM,
                    step: {
                        departmentId: e.ID
                    },
                    from: {
                        departmentId: e.FROM
                    },
                    item: {
                        itemIdVCN: e.ITEM_ID
                    },
                    remain: e.REMAIN
                })
                console.log(req.result)

            })
            console.log(req.result)

            next()
        })
}, (req, res) => {
    // console.log(req.result)

    res.api.sendData(req.result)

})


module.exports = inventoryQc