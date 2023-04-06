const express = require('express')
const inventory = express.Router()
const mssql = require('mssql')
const {
    Items,
    Steps
} = require('./../../model/protocol')
inventory.get('/', async (req, res) => {
    if (req.query.unit == 'M3') {
        let record = await mssql.query(`SELECT T.STEP_ID,SUM(T.REMAIN*I.[LENGTH]*I.WIDTH*I.HEIGHT) REMAIN
                                            FROM View_TON T
                                            LEFT JOIN base.[ITEM] I ON I.ID = T.ITEM_ID 
                                            GROUP BY STEP_ID
                                            ORDER BY STEP_ID ASC`)
        let result = []
        record.recordset.forEach(e => {
            result.push({
                id: e.STEP_ID,
                code: null,
                name: null,
                remain: e.REMAIN
            })
        })
        let ids = []
        result.forEach(e => {
            ids.push(e.id)
        })
        Steps.getByIds({
            data: JSON.stringify({
                data: ids
            })
        }, (err, response) => {
            let steps = JSON.parse(response.data).data
            for (let i = 0, length = result.length; i < length; i++) {
                let stepId = result[i].id
                let step = steps.find(i => i.id == stepId)
                result[i].code = step.code
                result[i].name = step.name
                result[i].departmentId = step.departmentId
            }
            req.api.sendData(result)
        })
    } else {
        mssql.query(`SELECT STEP_ID,ITEM_ID,SUM(IMPORT) IMPORT,SUM(EXPORT_NVL) EXPORT_NVL,SUM(EXPORT) EXPORT,SUM(REMAIN) REMAIN
                                        FROM View_TON
                                        GROUP BY STEP_ID,ITEM_ID
                                        ORDER BY STEP_ID ASC
            `).then(record => {
            let result = []
            if (req.query.type !== undefined && req.query.type == 'array') {
                record.recordset.forEach(e => {
                    result.push({
                        stepId: e.STEP_ID,
                        stepCode: null,
                        stepName: null,
                        departmentId: null,
                        itemId: e.ITEM_ID,
                        itemCode: null,
                        itemName: null,
                        itemLength: null,
                        itemWidth: null,
                        itemHeight: null,
                        import: e.IMPORT || 0,
                        export: e.EXPORT || 0,
                        exportNVL: e.EXPORT_NVL || 0,
                        remain: e.REMAIN || 0
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
                    let items = []
                    if(response !== undefined){
                        items = JSON.parse(response.data).data
                    }
                    Steps.getByIds({
                        data: JSON.stringify({
                            data: stepsIds
                        })
                    }, (err, response2) => {
                        let steps = []
                        if(response2 !== undefined){
                            steps = JSON.parse(response2.data).data
                        }
                        for (let i = 0, length = result.length; i < length; i++) {
                            let plan = result[i]
                            let item = items.find(i => i.id == plan.itemId)
                            let step = steps.find(i => i.id == plan.stepId)
                            if(item === undefined){
                                item = {}
                            }
                            if(step === undefined){
                                step = {}
                            }

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
                return
            }

            record.recordset.forEach(e => {
                let element = result.filter(i => i.id == e.STEP_ID)
                if (element.length == 0) {
                    //let step = model.structores.steps.find(i => i.id == e.STEP_ID)
                    result.push({
                        id: e.STEP_ID,
                        code: null,
                        name: null,
                        item: []
                    })
                }
            })

            record.recordset.forEach(e => {
                let step = result.find(i => i.id == e.STEP_ID)
                step.item.push({
                    id: e.ITEM_ID,
                    import: e.IMPORT,
                    exportNVL: e.EXPORT_NVL,
                    export: e.EXPORT,
                    remain: e.REMAIN
                })
            })

            /*
            result.forEach(e => {
                record.recordset.forEach(x => {
                    if (x.STEP_ID = e.id) {
                        //let item =model.items.find(i => i.id == x.ITEM_ID)
                        e.item.push({
                            id: ITEM_ID,
                            code: null,
                            name: null,
                            lenght: null,
                            width: null,
                            height: null,
                            imageUrl: null,
                            import: x.IMPORT,
                            exportNVL: x.EXPORT_NVL,
                            export: x.EXPORT,
                            remain: x.REMAIN
                        })
                    }
                })
            })
            */
            let itemsIds = []
            let stepsIds = []
            result.forEach(e => {
                stepsIds.push(e.id)
            })
            record.recordset.forEach(e => {
                itemsIds.push(e.ITEM_ID)
            })
            Steps.getByIds({
                data: JSON.stringify({
                    data: stepsIds
                })
            }, (err, response) => {
                let steps = []
                if(response !== undefined){
                    steps = JSON.parse(response.data).data
                }
                for (let i = 0; i < result.length; i++) {
                    let stepResult = result[i]
                    let step = steps.find(i => i.id == stepResult.id)
                    if(step === undefined){
                        step = {}
                    }
                    result[i].code = step.code
                    result[i].name = step.name
                    result[i].departmentId = step.departmentId
                }

                Items.getByIds({
                    data: JSON.stringify({
                        data: itemsIds
                    })
                }, (err, response) => {
                    let items = []
                    if(response !== undefined){
                        items = JSON.parse(response.data).data
                    }
                    for (let x = 0; x < result.length; x++) {
                        for (let y = 0; y < result[x].item.length; y++) {
                            let item = result[x].item[y]
                            let buf = items.find(i=>i.id == item.id)
                            if(buf === undefined){
                                buf = {}
                            }
                            Object.assign(result[x].item[y],item,buf)
                        }
                    }
                    res.api.sendData(result)
                })
            })

        }).catch(err => {

            res.api.sendFail(err)
        })
    }
})

module.exports = inventory