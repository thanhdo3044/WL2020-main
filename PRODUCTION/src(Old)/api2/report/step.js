const express = require('express')
const step = express.Router()

const mssql = require('mssql')
const model = require('./../../core/model')

const {
    View_in_not_verify,
    View_in_not_verify_item,
    View_not_verify,
    View_not_verify_item,
    View_not_out,
    View_not_out_item,
    View_packages_not_verify,
    View_packages_not_verify_item,
    getPackageByDestinationIdAndDay,
    getItemInPackageByDestinationIdAndDay,
    getPackageByDestinationIdAndFromAndDay,
    getItemInPackageByDestinationIdAndFromAndDay
} = require('./../../core/query/index')
step.get('/:stepId/in-not-verify', (req, res, next) => {
    req.result = {
        stepId: req.params.stepId,
        pallet: []
    }
    new mssql.Request()
        .input('STEP_ID', req.params.stepId)
        .query(View_in_not_verify, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            record.recordset.forEach(e => {
                let item = {
                    itemId: e.ITEM_ID,
                    quantity: e.PASS
                }
                req.result.pallet.push({
                    id: e.PALLET_ID,
                    code: e.PALLET_CODE,
                    from: e.STEP_ID,
                    to: e.STEP_NEXT_ID,
                    item: [item],
                    packageId: e.PACKAGE_ID,
                    createBy: e.CREATE_BY,
                    createDate: e.CREATE_DATE
                })
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('STEP_ID', req.params.stepId)
        .query(View_in_not_verify_item, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            for (let i = 0, length = req.result.pallet.length; i < length; i++) {
                let pallet = req.result.pallet[i]
                let items = record.recordset.filter(i => i.ID == pallet.id) || []
                if (items.length == 1) {
                    pallet.item[0].quantity = pallet.item[0].quantity || items[0].QUANTITY
                } else {
                    pallet.item = []
                    items.forEach(e => {
                        pallet.item.push({
                            itemId: e.ITEM_ID,
                            quantity: e.QUANTITY
                        })
                    })
                }
            }
            next()
        })
}, (req, res) => {
    res.setHeader('x-response-description', JSON.stringify({
        field: {
            from: 'departmentId',
            to: 'departmentId'
        }
    }))
    res.api.sendData(req.result)
})

step.get('/:stepId/out-not-verify', (req, res, next) => {
    req.result = {
        stepId: req.params.stepId,
        pallet: []
    }
    new mssql.Request()
        .input('STEP_ID', req.params.stepId)
        .query(View_not_verify, (err, record) => {
            if (err) return res.api.sendFail({
                number: 4907,
                message: err
            })
            record.recordset.forEach(e => {
                let item = {
                    itemId: e.ITEM_ID,
                    quantity: e.PASS
                }
                req.result.pallet.push({
                    id: e.PALLET_ID,
                    code: e.PALLET_CODE,
                    from: e.STEP_ID,
                    to: e.STEP_NEXT_ID,
                    item: [item],
                    packageId: e.PACKAGE_ID,
                    createBy: e.CREATE_BY,
                    createDate: e.CREATE_DATE
                })
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('STEP_ID', req.params.stepId)
        .query(View_not_verify_item, (err, record) => {
            for (let i = 0, length = req.result.pallet.length; i < length; i++) {
                let pallet = req.result.pallet[i]
                let items = record.recordset.filter(i => i.ID == pallet.id) || []
                if (items.length == 1) {
                    pallet.item[0].quantity = pallet.item[0].quantity || items[0].QUANTITY
                } else {
                    pallet.item = []
                    items.forEach(e => {
                        pallet.item.push({
                            itemId: e.ITEM_ID,
                            quantity: e.QUANTITY
                        })
                    })
                }
            }
            next()
        })
}, (req, res) => {
    res.setHeader('x-response-description', JSON.stringify({
        field: {
            from: 'departmentId',
            to: 'departmentId'
        }
    }))
    res.api.sendData(req.result)
})

step.get('/:stepId/not-out', (req, res, next) => {
    req.result = {
        stepId: req.params.stepId,
        pallet: []
    }
    new mssql.Request()
        .input('STEP_ID', req.params.stepId)
        .query(View_not_out, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            record.recordset.forEach(e => {
                let item = {
                    itemId: e.ITEM_ID,
                    quantity: e.PASS
                }
                req.result.pallet.push({
                    id: e.PALLET_ID,
                    code: e.PALLET_CODE,
                    from: e.STEP_ID,
                    to: e.STEP_NEXT_ID,
                    type: model.packageTypes.find(i => i.id == e.PALLET_TYPE_ID),
                    item: [item],
                    packageId: e.PACKAGE_ID,
                    createBy: e.CREATE_BY,
                    createDate: e.CREATE_DATE,
                    verifyBy: e.VERIFY_BY,
                    verifyDate: e.VERIFY_DATE
                })
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('STEP_ID', req.params.stepId)
        .query(View_not_out_item, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            for (let i = 0, length = req.result.pallet.length; i < length; i++) {
                let pallet = req.result.pallet[i]
                let items = record.recordset.filter(i => i.ID == pallet.id) || []
                if (items.length == 1) {
                    pallet.item[0].quantity = pallet.item[0].quantity || items[0].QUANTITY
                } else {
                    pallet.item = []
                    items.forEach(e => {
                        pallet.item.push({
                            itemId: e.ITEM_ID,
                            quantity: e.QUANTITY
                        })
                    })
                }
            }
            next()
        })

}, (req, res, next) => {
    res.setHeader('x-response-description', JSON.stringify({
        field: {
            from: 'departmentId',
            to: 'departmentId'
        }
    }))
    res.api.sendData(req.result)
})


step.get('/:stepId/packages-not-verify', (req, res, next) => {
    new mssql.Request()
        .input('DESTINATION_ID', req.params.stepId)
        .query(View_packages_not_verify, async (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            req.result = []
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    source: {
                        departmentId: e.SOURCE_ID
                    },
                    destination: {
                        departmentId: e.DESTINATION_ID
                    },
                    items: [],
                    typeId: e.TYPE_ID,
                    createBy: {
                        accountId: e.CREATE_BY
                    },
                    createDate: e.CREATE_DATE
                })
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('DESTINATION_ID', req.params.stepId)
        .query(View_packages_not_verify_item, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            for (let i = 0, length = req.result.length; i < length; i++) {
                let package = req.result[i]
                let items = record.recordset.filter(i => i.PACKAGE_ID == package.id) || []
                items.forEach(e => {
                    package.items.push({
                        itemId: e.ITEM_ID,
                        quantity: e.QUANTITY
                    })
                })
            }
            next()
        })
}, (req, res, next) => {
    res.api.sendData(req.result)
})

step.get('/:id/import', (req, res, next) => {
    new mssql.Request()
        .input('DESTINATION_ID', req.params.id)
        .query(getPackageByDestinationIdAndDay, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            req.result = []
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    from: {
                        departmentId: e.SOURCE_ID
                    },
                    to: {
                        departmentId: e.DESTINATION_ID
                    },
                    items: [],
                    createBy: e.CREATE_BY,
                    createDate: e.CREATE_DATE
                })
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('DESTINATION_ID', req.params.id)
        .query(getItemInPackageByDestinationIdAndDay, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            record.recordset.forEach(e => {
                req.result.find(i => i.id == e.PACKAGE_ID).items
                    .push({
                        itemId: e.ITEM_ID,
                        quantity: e.QUANTITY
                    })
            })
            next()
        })
}, (req, res, next) => {
    res.api.sendData(req.result)
})

step.get('/:id/from/:fromId', (req, res, next) => {
    new mssql.Request()
        .input('SOURCE_ID', req.params.fromId)
        .input('DESTINATION_ID', req.params.id)
        .query(getPackageByDestinationIdAndFromAndDay, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            req.result = []
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    from: {
                        departmentId: e.SOURCE_ID
                    },
                    to: {
                        departmentId: e.DESTINATION_ID
                    },
                    items: [],
                    createBy: e.CREATE_BY,
                    createDate: e.CREATE_DATE
                })
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('SOURCE_ID', req.params.fromId)
        .input('DESTINATION_ID', req.params.id)
        .query(getItemInPackageByDestinationIdAndFromAndDay, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            record.recordset.forEach(e => {
                req.result.find(i => i.id == e.PACKAGE_ID).items
                    .push({
                        itemId: e.ITEM_ID,
                        quantity: e.QUANTITY
                    })
            })
            next()
        })
}, (req, res, next) => {
    if (req.query.itemId !== undefined) {
        res.api.sendData(req.result.filter(i => i.items[0].itemId == req.query.itemId))
    } else {
        res.api.sendData(req.result)
    }

})

module.exports = step