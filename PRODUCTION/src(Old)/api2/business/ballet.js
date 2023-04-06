const express = require('express')
const ballet = express.Router()
const {
    errorMessage,
    getErrorMessage
} = require('./../../core/config')
const mssql = require('mssql')
const model = require('./../../core/model')
const push = require('./push')
const {
    getPalletByCode,
    addSuppliesForPallet,
    getSuppliesByPalletId,
    getItemOfPalletId,
    getStepOfPalletId,
    getPackageOfPalletId,
    getStepNextIdByPalletId,
} = require('./../../core/query/index')

const {
    sequelize,
    ViewPalletChoSay,
    ViewItemInPallet
} = require("../../../models");
const {
    Op
} = require("sequelize");

ballet.get('/bao-cao-cho-say', async(req, res) => {
    let result = {};
    let status = 200;
    try {
        let records = await ViewPalletChoSay.findAll({
            include: [ViewItemInPallet],
            where: {
                factoryId: req.query.factoryId
            }
        });
        //   result.data = JSON.stringify(records[0], null, 2);
        console.log(records.length)
        result.data = records;
        return res.status(status).send(result);
    } catch (err) {
        status = 500;
        result.status = status;
        result.error = err;
        return res.status(status).send(result);
    }
})

ballet.get('/:code', (req, res, next) => { //  Thông tin id,createBy,createDate
    new mssql.Request()
        .input('CODE', req.params.code)
        .query(getPalletByCode)
        .then(record => {
            let pallet = record.recordset[0]
            if (pallet !== undefined) {
                req.pallet = {
                    id: pallet.ID,
                    code: req.params.code,
                    parcel: pallet.PARCEL,
                    woodTypeName: pallet.WOOD_TYPE_NAME,
                    productionOrdersCode: pallet.PRODUCTION_ORDERS_NAME,
                    item: [],
                    step: [],
                    supplies: [],
                    inventory: 0,
                    request: [],
                    type: model.packageTypes.find(i => i.id == pallet.TYPE_ID),
                    destinationDefaultId: [],
                    createBy: pallet.CREATE_BY,
                    createDate: pallet.CREATE_DATE
                }
                next()
            } else {
                res.api.sendFail(getErrorMessage(430))
            }
        })
        .catch(err => {
            res.api.sendFail(getErrorMessage(4907))
        })
}, (req, res, next) => { // Item trong pallet
    new mssql.Request()
        .input('PALLET_ID', req.pallet.id)
        .query(getItemOfPalletId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                req.pallet.item.push({
                    itemId: e.ITEM_ID,
                    quantity: e.QUANTITY
                })
            })
            next()
        })
}, (req, res, next) => { // Lấy vật tư
    new mssql.Request()
        .input('PALLET_ID', req.pallet.id)
        .query(getSuppliesByPalletId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                req.pallet.supplies.push({
                    itemId: e.SUPPLIES_ID,
                    parcel: e.PARCEL,
                    step: {
                        stepId: e.STEP_ID
                    },
                    vendor: {
                        vendorId: e.VENDOR_ID
                    },
                    createBy: {
                        accountId: e.CREATE_BY
                    },
                    createDate: e.CREATE_DATE,
                    quantity: e.QUANTITY,
                    parcelCode: e.PARCEL_CODE
                })
            })
            next()
        })
}, (req, res, next) => { // Các công đoạn trong pallet và tồn
    new mssql.Request()
        .input('PALLET_ID', req.pallet.id)
        .query(getStepOfPalletId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                req.pallet.step.push({
                    id: e.ID,
                    step: e.STEP_ID,
                    stepNext: e.STEP_NEXT_ID,
                    pass: e.PASS,
                    notPass: e.NOT_PASS,
                    kilnBatchId: e.KILN_BATCH_ID,
                    planId: e.PLAN_ID,
                    package: []
                })
            })
            req.pallet.inventory = record.recordset.sort((a, b) => (b.ID - a.ID))[0].PASS || req.pallet.item[0].quantity
            req.pallet.step.sort((a, b) => a.id - b.id)
            next()
        })
}, (req, res, next) => { // Các package của công đoạn
    new mssql.Request()
        .input('PALLET_ID', req.pallet.id)
        .query(getPackageOfPalletId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))

            record.recordset.forEach(e => {
                req.pallet.step.find(i => i.id == e.STEP_OF_PALLET_ID).package.push({
                    id: e.ID,
                    sourceId: e.SOURCE_ID,
                    destinationId: e.DESTINATION_ID,
                    createBy: e.CREATE_BY,
                    createDate: e.CREATE_DATE,
                    verifyBy: e.VERIFY_BY || '',
                    verifyDate: e.VERIFY_DATE || ''
                })
            })
            next()
        })
}, (req, res, next) => { // Tìm đích mặc định
    new mssql.Request()
        .input('PALLET_ID', req.pallet.id)
        .query(getStepNextIdByPalletId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            let stepNext = record.recordset[0]
            if (stepNext !== undefined && stepNext.STEP_ID != null)
                req.pallet.destinationDefaultId.push({
                    stepId: stepNext.STEP_ID
                })
            next()
        })
}, (req, res) => {
    res.setHeader('x-response-description', JSON.stringify({
        field: {
            step: 'departmentId',
            stepNext: 'departmentId'
        }
    }))
    res.api.sendData(req.pallet)
})


function format(code) {
    codes = code.split('')
    reuslt = ''
    codes.forEach(e => {
        if (e > -1 && e < 10) {
            reuslt = reuslt + e
        }
    })
    return reuslt
}


ballet.post('/', (req, res, next) => {
    //Chỉ có trường hợp tạo kiện bằng mã IKEA là không cần trường thông tin itemId
    if (req.body.ikeaCode !== undefined) {
        req.body.ikeaCode = format(req.body.ikeaCode)
    } else {
        if (req.body.itemId === undefined ||
            req.body.quantity === undefined ||
            req.body.itemId === null ||
            req.body.quantity === null) {
            return res.api.sendFail(getErrorMessage(4504))
        }
    }
    next()
}, (req, res, next) => {
    if (req.body.itemId) {
        let itemIds = req.body.itemId.toString().split(',')

        if (itemIds.length == 1) { // 1 item
            // không cần làm gì
        } else if (itemIds.length > 1) { // > 1 item
            let quantitys = req.body.quantity.toString().split(',')
            if (itemIds.length == quantitys.length) {
                let str = ''
                for (let i = 0, length = itemIds.length; i < length; i++) {
                    str = str + itemIds[i].trim() + '-' + quantitys[i].trim() + ','
                }
                req.body.items = str.substring(0, str.length - 1)
                req.body.itemId = undefined
                req.body.quantity = undefined
            } else {
                return res.api.sendFail(getErrorMessage(4504))
            }
        } else {
            return res.api.sendFail(getErrorMessage(4504))
        }
    }
    next()
}, (req, res, next) => {
    new mssql.Request()
        .input('FROM_ID', req.body.sourceId)
        .input('TO_ID', req.body.destinationId)
        .input('ITEM', req.body.items)
        .input('ITEM_ID', req.body.itemId)
        .input('QUANTITY', req.body.quantity)
        .input('MATERIALS_ID', req.body.materialsId)
        .input('MATERIALS_QUANTITY', req.body.materialsQuantity)
        .input('PLAN_ID', req.body.planId)
        .input('TYPE_ID', req.body.typeId)
        .input('IKEA_CODE', req.body.ikeaCode)
        .input('IKEA_GUID', req.body.ikeaGuid)
        .input('VENDOR_ID', req.body.vendorId)
        .input('CHEMISTRY_ID', req.body.chemistryId)
        .input('PARCEL', req.body.parcel)
        .input('WOOD_TYPE_ID', req.body.woodTypeId)
        .input('PRODUCTION_ORDERS_ID', req.body.productionOrdersId)
        .input('PROJECT_PRODUCT_ID', req.body.projectProductId)
        .input('RECEIPT_ID', req.body.receiptId)
        .input('ACCOUNT_ID', req.token.accountId)
        .output('ERROR')
        .execute('Proc_createPalletV2', (err, record) => {
            if (err)
                return res.api.sendFail(err)
            if (record.output.ERROR > 0 && record.output.ERROR != null)
                return req.api.sendFail(getErrorMessage(record.output.ERROR))
            res.api.sendData(record.recordset)

            // Tranformation event
            let packages = JSON.parse(JSON.stringify(record.recordsets[1]))
            let items = JSON.parse(JSON.stringify(record.recordsets[2]))
            let materials = JSON.parse(JSON.stringify(record.recordsets[3]))

            materials.forEach((e) => {
                let itemInPackage = items.find(i => i.itemInPackageId == e.itemInPackageId)
                if (itemInPackage.materials == undefined) {
                    itemInPackage.materials = []
                }
                itemInPackage.materials.push({
                    id: e.materialsInPackageId,
                    itemId: e.itemId,
                    quantity: e.quantity
                })
            })

            items.forEach(e => {
                let package = packages.find(i => i.packageId == e.packageId)
                if (package.items === undefined) {
                    package.items = []
                }
                package.items.push({
                    id: e.itemInPackageId,
                    itemId: e.itemId,
                    quantity: e.quantity,
                    materials: e.materials
                })
            })
            push(packages)
        })
})


ballet.post('/:code/move', (req, res, next) => {
    new mssql.Request()
        .input('PALLET_CODE', req.params.code)
        .input('FROM_ID', req.body.sourceId)
        .input('TO_ID', req.body.destinationId)
        .input('KILN_BATCH_ID', req.body.kilnBatchId)
        .input('PASS', parseFloat(req.body.pass))
        .input('IKEA_GUID', req.body.ikeaGuid)
        .input('PLAN_ID', req.body.planId)
        .input('VENDOR_ID', req.body.vendorId)
        .input('CHEMISTRY_ID', req.body.chemistryId)
        .input('PARCEL_ID', req.body.parcelId)
        .input('ACCOUNT_ID', req.token.accountId)
        .output('ERROR')
        .execute('Proc_movePallet', (err, record) => {
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

ballet.post('/:code/supplies', async(req, res) => {
    if (req.body.stepOfPalletId === undefined)
        return res.api.sendFail({
            number: 4900,
            message: errorMessage['4900']
        })
    await new mssql.Request()
        .input('STEP_OF_PALLET_ID', req.body.stepOfPalletId)
        .input('SUPPLIES_ID', req.body.suppliesId)
        .input('QUANTITY', req.body.quantity)
        .input('PARCEL_ID', req.body.parcelId)
        .input('PARCEL', req.body.parcel)
        .input('VENDOR_ID', req.body.vendorId)
        .input('CREATE_BY', req.token.accountId)
        .query(addSuppliesForPallet)
    res.api.sendData([])
})

function getPalletCodeFromIkeaGuid(code, callback) {
    let query = `SELECT [CODE] FROM prod.[PALLET] WHERE [IKEA_GUID] = '${code}'`
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) throw err
            if (record.recordset !== undefined) {
                if (record.recordset.length > 0) {
                    let code = record.recordset[0].CODE
                    if (code != null)
                        if (typeof callback == 'function')
                            return callback(code)
                }
            }
            callback(undefined)
        })
}


ballet.delete('/:code', (req, res) => {
    if (typeof req.params.code == 'number') {
        req.input('PALLET_CODE', (req.params.code))
            .execute('Proc_removePallet')
    } else {
        getPalletCodeFromIkeaGuid(req.params.code, (code) => {
            if (code !== undefined) {
                return req.input('PALLET_CODE', code)
                    .execute('Proc_removePallet')
            } else {
                return res.api.sendFail({
                    number: 430,
                    message: errorMessage['430']
                })
            }
        })
    }
})

module.exports = ballet