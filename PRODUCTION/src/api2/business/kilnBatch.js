const express = require('express')
const kilnBatch = express.Router()
const mssql = require('mssql')
const model = require('./../../core/model')
const {
    View_kilnBatch,
    View_palletInKilnBatch,
    View_itemInPalletInKilnBatch,
} = require('./../../core/query/index')
const {
    getErrorMessage
} = require('./../../core/config')
const push = require('./push')
kilnBatch.get('/', (req, res, next) => {
    new mssql.Request()
        .query(View_kilnBatch, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            req.result = []
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    code: e.YEAR + e.WEEK + e.NUMBER,
                    target: e.TIME_OUT_TARGET,
                    timeout: e.TIME_OUT,
                    kilnId: e.KILN_ID,
                    kilnCode: e.KILN_CODE,
                    kilnName: e.KILN_NAME,
                    factoryId: e.FACTORY_ID,
                    stepNext: e.STEP_NEXT_ID,
                    height: e.HEIGHT,
                    length: e.LENGTH,
                    verify: e.VERIFY,
                    verifyBy: e.VERIFY_BY,
                    humidity: e.HUMIDITY,
                    state: e.STATE,
                    status: e.STATUS,
                    ballets: [],
                    totalM3: parseFloat(e.TOTAL_M3).toFixed(2),
                    type: e.TYPE,
                    createBy: e.CREATE_BY,
                    createDate: e.CREATE_DATE
                })
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .query(View_palletInKilnBatch, (err, record) => {
            if (err) return res.api.sendFail({
                number: 4907,
                message: err
            })
            record.recordset.forEach(e => {
                let kilnBatch = req.result.find(i => i.id == e.KILN_BATCH_ID)
                kilnBatch.ballets.push({
                    id: e.ID,
                    code: e.CODE,
                    item: []
                })
            })
            next()
        })
}, (req, res, next) => { // Lấy thông tin item trong pallet đó
    new mssql.Request()
        .query(View_itemInPalletInKilnBatch, (err, record) => {
            if (err)
                return res.api.sendData({
                    number: 4907,
                    message: err
                })
            let items = record.recordset
            for (let i = 0, length = req.result.length; i < length; i++) {
                let kilnBatch = req.result[i]
                for (let x = 0, palletCount = kilnBatch.ballets.length; x < palletCount; x++) {
                    let pallet = kilnBatch.ballets[x]
                    let palletItems = items.filter(z => z.ID == pallet.id) || []
                    palletItems.forEach(e => {
                        pallet.item.push({
                            itemId: e.ITEM_ID,
                            quantity: e.QUANTITY
                        })
                    })
                }
            }
            req.kilnBatch = req.result
            next()
        })
}, (req, res, next) => {
    res.setHeader('x-response-description', JSON.stringify({
        field: {
            stepNext: 'departmentId',
        }
    }))
    if (req.query.status)
        res.api.sendData(req.kilnBatch.filter(i => i.status == req.query.status) || [])
    else
        res.api.sendData(req.kilnBatch || [])
})

kilnBatch.get('/:id/bieu-mau-kiem-tra-do-am', (req, res, next) => {
    model.bienban.getByTypeAndLinkId({
        type: 'bieu-mau-kiem-tra-do-am',
        linkId: req.params.id,
        linkType: 'kilnBatch'
    }, (err, data) => {
        if (err)
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        res.api.sendData(data)
    })
})

kilnBatch.get('/:id/bien-ban-kiem-tra-lo-say', (req, res, next) => {
    model.bienban.getByTypeAndLinkId({
        type: 'bien-ban-kiem-tra-lo-say',
        linkId: req.params.id,
        linkType: 'kilnBatch'
    }, (err, data) => {
        if (err)
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        res.api.sendData(data)
    })
})

kilnBatch.get('/:id/bao-cao-khuyet-tat', (req, res, next) => {
    model.bienban.getByTypeAndLinkId({
        type: 'bao-cao-khuyet-tat',
        linkId: req.params.id,
        linkType: 'kilnBatch'
    }, (err, data) => {
        if (err)
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        res.api.sendData(data)
    })
})

kilnBatch.put('/:id/status', (req, res, next) => {
    let query = `UPDATE prod.KILN_BATCH
                SET [STATUS] = @STATUS
                WHERE ID = @ID
                `
    new mssql.Request()
        .input('ID', req.params.id)
        .input('STATUS', req.body.status)
        .query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            res.api.sendData([])
        })
})

kilnBatch.post('/:batchId/export', (req, res) => {
    new mssql.Request()
        .input('KILN_BATCH_ID', req.params.batchId)
        .input('ACCOUNT_ID', req.token.accountId)
        .output('ERROR')
        .execute('Proc_exportKilnBatch', (err, record) => {
            if (err)
                return res.api.sendFail(err)
            if (record.output.ERROR > 0 && record.output.ERROR != null)
                return req.api.sendFail(getErrorMessage(record.output.ERROR))
            res.api.sendData(record.recordset)
                // push event
            let packages = JSON.parse(JSON.stringify(record.recordsets[1]))
            let items = JSON.parse(JSON.stringify(record.recordsets[2]))

            items.forEach(e => {
                let package = packages.find(i => i.packageId == e.packageId)
                if (package.items === undefined) {
                    package.items = []
                }
                package.items.push({
                    id: e.itemInPackageId,
                    itemId: e.itemId,
                    quantity: e.quantity,
                    materials: [{
                        id: 0,
                        itemId: e.itemId,
                        quantity: e.quantity
                    }]
                })
            })
            push(packages)
        })
})
kilnBatch.post('/:batchId/export-say-lai', (req, res) => {
    new mssql.Request()
        .input('KILN_BATCH_ID', req.params.batchId)
        .input('ACCOUNT_ID', req.token.accountId)
        .output('ERROR')
        .execute('Proc_exportKilnBatchSaylai', (err, record) => {
            if (err)
                return res.api.sendFail(err)
            if (record.output.ERROR > 0 && record.output.ERROR != null)
                return req.api.sendFail(getErrorMessage(record.output.ERROR))
            res.api.sendData(record.recordset)
                // push event
            let packages = JSON.parse(JSON.stringify(record.recordsets[1]))
            let items = JSON.parse(JSON.stringify(record.recordsets[2]))

            items.forEach(e => {
                let package = packages.find(i => i.packageId == e.packageId)
                if (package.items === undefined) {
                    package.items = []
                }
                package.items.push({
                    id: e.itemInPackageId,
                    itemId: e.itemId,
                    quantity: e.quantity,
                    materials: [{
                        id: 0,
                        itemId: e.itemId,
                        quantity: e.quantity
                    }]
                })
            })
            push(packages)
        })
})
kilnBatch.post('/:batchId/verify', async(req, res) => {
    let record = await mssql.query(`UPDATE prod.[KILN_BATCH]
        SET VERIFY = 1, VERIFY_BY = ${req.token.accountId}, HUMIDITY = '${req.body.humidity}', STATE = '${req.body.state}'
        WHERE ID = ${req.params.batchId}
    `)
    req.api.sendData([])
})

kilnBatch.get('/itemInKilnBatch', (req, res, next) => {
    new mssql.Request()
        .input('plCode', req.query.plCode)
        .query(getItemInKilnBatchById, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

kilnBatch.post("/so-sanh-khoi-luong-say-phoi", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select t1.NAME, t1.volumnNow, t2.volumnBefore from 
(
SELECT D.NAME, SUM(iip.QUANTITY*i.VOLUMN) volumnNow
FROM prod.KILN_BATCH KB
            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
			INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
			WHERE KB.STATUS = 'finish'  and DATEPART(YEAR, KB.EXPORT_DATE) = ${req.body.year}
			GROUP BY D.NAME
) t1 left join 
(
SELECT D.NAME, SUM(iip.QUANTITY*i.VOLUMN) volumnBefore
FROM prod.KILN_BATCH KB
            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
			INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
			WHERE KB.STATUS = 'finish'  and DATEPART(YEAR, KB.EXPORT_DATE) = ${req.body.year - 1}
			GROUP BY D.NAME
)as t2 on t1.NAME = t2.NAME
order by t1.NAME
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
kilnBatch.post("/khoi-luong-say-phoi-theo-loai", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            SELECT T1.NAME, T1.volumnSayChinh, T2.volumnSayLai, T3.TOTAL FROM (
                SELECT D.NAME, SUM(iip.QUANTITY*i.VOLUMN) volumnSayChinh
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish'  and DATEPART(YEAR, KB.EXPORT_DATE) = ${req.body.year} and kb.TYPE in (N'OUTDOOR', N'INDOOR', N'SẤY UỐN')
                            GROUP BY D.NAME
                ) t1 LEFT JOIN
                (
                SELECT D.NAME, SUM(iip.QUANTITY*i.VOLUMN) volumnSayLai
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish'  and DATEPART(YEAR, KB.EXPORT_DATE) = ${req.body.year} and kb.TYPE in (N'SẤY LẠI OUTDOOR', N'SẤY LẠI INDOOR')
                            GROUP BY D.NAME
                ) t2 ON T1.NAME = T2.NAME
                LEFT JOIN 
                (
                SELECT D.NAME, SUM(iip.QUANTITY*i.VOLUMN) TOTAL
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish'  and DATEPART(YEAR, KB.EXPORT_DATE) = ${req.body.year}
                            GROUP BY D.NAME
                )T3 ON T1.NAME = T3.NAME
                ORDER BY T1.NAME
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
kilnBatch.post("/chart-khoi-luong-say-phoi-theo-nha-may", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            SELECT * FROM (
                SELECT kb.TYPE, 'Tháng '+ convert(nvarchar, RIGHT('0' + RTRIM(MONTH(kb.EXPORT_DATE)), 2)) thang, iip.QUANTITY*i.VOLUMN VOLUMN
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish'  and DATEPART(YEAR, KB.EXPORT_DATE) = ${req.body.year} AND K.FACTORY_ID = ${req.body.factoryId}
                            ) T
                PIVOT
                (
                SUM(VOLUMN)
                FOR TYPE IN ([INDOOR], [OUTDOOR], [SẤY LẠI INDOOR], [SẤY LẠI OUTDOOR], [SẤY UỐN])
                ) AS BangChuyen
                order by thang
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

module.exports = kilnBatch

const getItemInKilnBatchById = `
SELECT I.HEIGHT height, i.WIDTH width, i.LENGTH length, P.CODE plCode, IK.QUANTITY quantity, i.volumn FROM prod.View_kilnBatch K
INNER JOIN prod.View_PalletInKilnBatch P ON K.ID = P.KILN_BATCH_ID
INNER JOIN prod.View_itemInPalletInKilnBatch IK ON P.ID = IK.ID
INNER JOIN base.ITEM I ON I.ID = IK.ITEM_ID
WHERE K.ID = @plCode
order by I.HEIGHT`