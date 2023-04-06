const express = require('express')
const plan = express.Router()
const mssql = require('mssql')
const {Items,Steps} = require('./../../model/protocol')
const {
    getErrorMessage
} = require('./../../core/config')
Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
plan.get('/kpi', async (req, res) => {
    let record = await mssql.query(`SELECT PLI.CODE,
                                    PLI.STEP_ID,
                                    P.ITEM_ID,
                                    P.QUANTITY [TARGET],
                                    TT.EXPORT
                                    FROM dbo.[PLAN] P
                                    LEFT JOIN dbo.[PLAN_ID] PLI ON PLI.CODE = P.CODE AND PLI.STEP_ID = P.STEP_ID
                                    LEFT JOIN (SELECT GD.[YEAR],
                                    GD.[WEEK],
                                    X.ID,
                                    X.ITEM_ID,
                                    SUM(X.EXPORT) EXPORT
                                    FROM View_XUAT X
                                    LEFT JOIN base.[GLOBAL_DATE] GD ON GD.CODE = X.CODE
                                    GROUP BY GD.[YEAR],
                                    GD.[WEEK],
                                    X.ID,
                                    X.ITEM_ID) TT ON TT.[YEAR] = P.[YEAR] AND TT.[WEEK] = P.[WEEK] AND TT.ID = P.STEP_ID AND TT.ITEM_ID = P.ITEM_ID`)
    let result = []
    record.recordset.forEach(e => {
        result.push({
            week: 'KH' + e.CODE,
            stepId: e.STEP_ID,
            stepName: null,
            stepCode: null,
            departmentId: null,
            itemId: e.ITEM_ID,
            itemCode: null,
            itemName: null,
            itemLength: null,
            itemWidth: null,
            itemHeight: null,
            target: e.TARGET,
            real: e.EXPORT || 0,
            rate: (((e.EXPORT || 0) / e.TARGET) * 100).toFixed(0) + ' %',
            rateFaile: ((e.TARGET - (e.EXPORT || 0)) > 0 ? (((e.TARGET - (e.EXPORT || 0)) / e.TARGET) * 100).toFixed(0) : 0) + '%'
        })
    })

    let itemsIds = []
    let stepsIds = []
    result.forEach(e => {
        itemsIds.push(e.itemId)
        stepsIds.push(e.stepId)
    })

    Items.getByIds({
        data: JSON.stringify({
            data: itemsIds
        })
    }, (err, response) => {
        let items = JSON.parse(response.data).data
        Steps.getByIds({
            data: JSON.stringify({
                data: stepsIds
            })
        }, (err, response2) => {
            let steps = JSON.parse(response2.data).data
            for (let i = 0, length = result.length; i < length; i++) {
                let plan = result[i]
                let item = items.find(i => i.id == plan.itemId)
                let step = steps.find(i => i.id == plan.stepId)
                result[i].stepCode = step.code
                result[i].stepName = step.name
                result[i].departmentId = step.departmentId
                result[i].itemCode = item.code
                result[i].itemName = item.name
                result[i].itemLength = item.length
                result[i].itemWidth = item.width
                result[i].itemHeight = item.height
            }
            res.api.sendData(result)
        })
    })
})

let getPlan = `SELECT 
PL.CODE N'Mã',
PL.[YEAR] N'Năm',
PL.WEEK N'Tuần',
D.NAME N'Tổ',
I.NAME N'Chi tiết/cụm',
PL.QUANTITY N'Số lượng'
FROM prod.[PLAN] PL
LEFT JOIN base.ITEM I ON I.ID = PL.ITEM_ID
LEFT JOIN base.DEPARTMENT D ON D.ID = PL.STEP_ID
WHERE PL.CODE = @CODE`

plan.get('/raw', (req,res,next)=>{
    let defaultCode = `${new Date().getFullYear()}${new Date().getWeekNumber()}`
    new mssql.Request()
    .input('CODE', req.query.code || defaultCode)
    .query(getPlan, (err,record)=>{
        if(err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})

module.exports = plan