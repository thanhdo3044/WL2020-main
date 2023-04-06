const express = require('express')
const inventoryQc = express.Router()
const mssql = require('mssql')

inventoryQc.get('/', (req, res, next) => {
    let query = 'SELECT * FROM dbo.View_TON_QC'
        // if (req.query.stepId !== undefined && req.query.stepId > 10)
        //     query = query + ` WHERE ID = @STEP_ID`
    new mssql.Request()
        .input('STEP_ID', req.query.stepId)
        .query(query, (err, record) => {
            if (err) return console.log(err)
            req.result = []
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
                        itemId: e.ITEM_ID
                    },
                    remain: e.REMAIN
                })
            })
            next()
        })
}, (req, res) => {
    res.api.sendData(req.result)
})

module.exports = inventoryQc