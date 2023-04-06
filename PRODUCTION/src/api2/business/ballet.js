const express = require('express')
const ballet = express.Router()
const moment = require('moment')
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

    Op,
    ViewPalletChoSay,
    ViewItemInPallet
} = require("../../../models");
// const {
//     Op
// } = require("sequelize");

ballet.get('/bao-cao-cho-say', async(req, res) => {
    let result = {};
    let status = 200;
    //const { fromDate, toDate } = req.query

    try {
        let records = await ViewPalletChoSay.findAll({
            include: [ViewItemInPallet],
            where: {
                factoryId: req.query.factoryId,
                createDate: {
                    [Op.between]: [moment(req.query.from).format('YYYY-MM-DD HH:mm:ss.SSS'), moment(req.query.to).format('YYYY-MM-DD HH:mm:ss.SSS')]
                }

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

ballet.get('/bao-cao-cho-say/bien-ban', async(req, res) => {
    const getBienBanLoSay = `
    SELECT
    DISTINCT 
    PL.CODE, IIP.LENGTH, IIP.WIDTH, IIP.HEIGHT, PL.PARCEL,
    SUM(IIP.QUANTITY) AS QUANTITY
    ,SUM(IIP.khoiLuong) AS khoiLuong
    , B.GROUP_QC, kb.STATUS,
    CONCAT(DATEPART(day,KB.CREATE_DATE),'/',DATEPART(month,KB.CREATE_DATE),'/',DATEPART(year,KB.CREATE_DATE)) CREATE_DATE
    FROM prod.KILN_BATCH AS KB LEFT OUTER JOIN
    prod.KILN AS K ON K.ID = KB.KILN_ID LEFT OUTER JOIN
    prod.STEP_OF_PALLET AS SOP ON SOP.KILN_BATCH_ID = KB.ID LEFT OUTER JOIN
    prod.PALLET AS PL ON PL.ID = SOP.PALLET_ID LEFT OUTER JOIN
    View_ITEM_IN_PALLET AS IIP ON IIP.PALLET_ID = PL.ID LEFT JOIN nlg.BOM B 
    ON IIP.HEIGHT = B.DAY AND IIP.WIDTH = B.RONG AND IIP.LENGTH = B.DAI
    WHERE KB.KILN_ID = @kilnId and KB.STATUS = 'process'
    GROUP BY
    IIP.LENGTH,
    IIP.WIDTH,
    IIP.HEIGHT,
    B.GROUP_QC,
    kb.STATUS,
    PL.PARCEL,
    PL.CODE,
    DATEPART(day,KB.CREATE_DATE),
    DATEPART(month,KB.CREATE_DATE),
    DATEPART(year,KB.CREATE_DATE),
    KB.CREATE_DATE
    order by PL.CODE
    `
    new mssql.Request()
        .input('kilnId', req.query.kilnId)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

ballet.get('/bao-cao-cho-say-2', async(req, res) => {
    const getBienBanLoSay = `
    SELECT DISTINCT 
                         prod.PALLET.ID, prod.PALLET.CODE, I.ID ITEM_ID, I.NAME, I.LENGTH, I.WIDTH, I.HEIGHT, IIP.QUANTITY, IIP.QUANTITY*I.VOLUMN KL, prod.PACKAGE_TYPE.NAME TYPE_NAME,
						 prod.PALLET.WEEK, prod.PALLET.NUMBER, prod.PALLET.CREATE_DATE, CASE WHEN prod.PACKAGE.VERIFY_DATE IS NULL THEN N'Chưa sấy' else N'Đã sấy' end trangThai
               
FROM            prod.PALLET LEFT OUTER JOIN
                             (SELECT DISTINCT *
                               FROM            (SELECT DISTINCT PALLET_ID, ID, ROW_NUMBER() OVER (PARTITION BY PALLET_ID
                                                         ORDER BY ID) num
                               FROM            prod.STEP_OF_PALLET) s
WHERE        s.num = 1) AS ST ON ST.PALLET_ID = prod.PALLET.ID LEFT OUTER JOIN
prod.PACKAGE ON prod.PACKAGE.STEP_OF_PALLET_ID = ST.ID LEFT OUTER JOIN
base.ACCOUNT ON prod.PALLET.CREATE_BY = base.ACCOUNT.ID LEFT JOIN
prod.PACKAGE_TYPE ON prod.PALLET.TYPE_ID = prod.PACKAGE_TYPE.ID LEFT JOIN
prod.ITEM_IN_PALLET IIP ON prod.PALLET.ID = IIP.PALLET_ID LEFT JOIN
base.ITEM I ON IIP.ITEM_ID = I.ID
WHERE        prod.PACKAGE.SOURCE_ID != 100274 AND prod.PACKAGE.SOURCE_ID != 100264 AND prod.PALLET.CREATE_DATE > '20210701'
and base.ACCOUNT.factoryId = ${req.query.factoryId} and prod.PALLET.CREATE_DATE between '${req.query.from}' and '${req.query.to}'
    `
    new mssql.Request()
        .input('kilnId', req.query.kilnId)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

ballet.get('/bao-cao-cho-say/bien-ban/kiln', async(req, res) => {
    const getBienBanLoSay = `
    SELECT k.ID,CODE, NAME, kb.TYPE FROM prod.KILN k
    left join prod.KILN_BATCH kb on k.ID = kb.KILN_ID
    WHERE FACTORY_ID = @factoryId and kb.STATUS = 'process'
    order by CODE
    `
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
ballet.get('/bao-cao-cho-say/bien-ban/kiln-history', async(req, res) => {
    const getBienBanLoSay = `
    SELECT ID,CODE, NAME FROM prod.KILN 
  
    WHERE FACTORY_ID = @factoryId 
    order by CODE
    `
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
ballet.get('/pallet-code', async(req, res) => {
    const palletCode = `
    SELECT I.HEIGHT,I.WIDTH,I.LENGTH
 
    FROM [prod].[PALLET] P
    left join prod.ITEM_IN_PALLET IT on P.ID = IT.PALLET_ID
    left join base.ITEM I on I.ID = IT.ITEM_ID
    where P.CODE = @palletCode
    `
    new mssql.Request()
        .input('palletCode', req.query.palletCode)
        .query(palletCode, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
ballet.get('/bao-cao-cho-say/bien-ban/date-by-kilnId', async(req, res) => {
    const getBienBanLoSay = `
    select CONVERT(varchar, bb.CREATE_DATE, 23) as createdDate, kb.ID from prod.KILN_BATCH kb inner join prod.BIEN_BAN bb on kb.id = bb.LINK_ID
    where bb.TYPE = 'bien-ban-kiem-tra-lo-say' and kb.KILN_ID = @kilnId and bb.CREATE_DATE between @from and @to  order by bb.CREATE_DATE desc
    `
    new mssql.Request()
        .input('kilnId', req.query.kilnId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
ballet.get('/bao-cao-cho-say/bien-ban/date-by-kilnId-do-am', async(req, res) => {
    const getBienBanLoSay = `
    select CONVERT(varchar, bb.CREATE_DATE, 23) as createdDate, kb.ID from prod.KILN_BATCH kb inner join prod.BIEN_BAN bb on kb.id = bb.LINK_ID
    where bb.TYPE = 'bieu-mau-kiem-tra-do-am' and kb.KILN_ID = @kilnId and bb.CREATE_DATE between @from and @to  order by bb.CREATE_DATE desc
    `
    new mssql.Request()
        .input('kilnId', req.query.kilnId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
ballet.get('/bao-cao-cho-say/bien-ban/date-in-kiln', async(req, res) => {
    const getBienBanLoSay = `
    SELECT distinct
    convert(varchar, kb.CREATE_DATE, 23) CREATE_DATE
    FROM prod.KILN_BATCH AS KB LEFT OUTER JOIN
    prod.KILN AS K ON K.ID = KB.KILN_ID LEFT OUTER JOIN
    prod.STEP_OF_PALLET AS SOP ON SOP.KILN_BATCH_ID = KB.ID LEFT OUTER JOIN
    prod.PALLET AS PL ON PL.ID = SOP.PALLET_ID LEFT OUTER JOIN
    View_ITEM_IN_PALLET AS IIP ON IIP.PALLET_ID = PL.ID INNER JOIN nlg.BOM B 
    ON IIP.HEIGHT = B.DAY AND IIP.WIDTH = B.RONG AND IIP.LENGTH = B.DAI
    WHERE KB.KILN_ID = @kilnId and KB.CREATE_DATE  between @from and @to
    `
    new mssql.Request()
        .input('kilnId', req.query.kilnId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

ballet.get('/bao-cao-cho-say/bien-ban/bb-ra-lo-say', async(req, res) => {
    const getBienBanLoSay = `
    SELECT
    DISTINCT 
    PL.CODE, IIP.LENGTH, IIP.WIDTH, IIP.HEIGHT, PL.PARCEL,
    SUM(IIP.QUANTITY) AS QUANTITY
    ,SUM(IIP.khoiLuong) AS khoiLuong
    , B.GROUP_QC, kb.STATUS,KB.CREATE_DATE, KB.CREATE_BY, A.LAST_NAME
    FROM prod.KILN_BATCH AS KB LEFT OUTER JOIN
    prod.KILN AS K ON K.ID = KB.KILN_ID LEFT OUTER JOIN
    prod.STEP_OF_PALLET AS SOP ON SOP.KILN_BATCH_ID = KB.ID LEFT OUTER JOIN
    prod.PALLET AS PL ON PL.ID = SOP.PALLET_ID LEFT OUTER JOIN
    View_ITEM_IN_PALLET AS IIP ON IIP.PALLET_ID = PL.ID 
    LEFT JOIN nlg.BOM B ON IIP.HEIGHT = B.DAY AND IIP.WIDTH = B.RONG AND IIP.LENGTH = B.DAI
    INNER JOIN base.ACCOUNT A ON KB.CREATE_BY = A.ID
    WHERE KB.KILN_ID = @kilnId and KB.CREATE_DATE  between @from and @to
    GROUP BY
    IIP.LENGTH,
    IIP.WIDTH,
    IIP.HEIGHT,
    B.GROUP_QC,
    kb.STATUS,
    PL.PARCEL,
    PL.CODE,
    KB.CREATE_DATE,
    KB.CREATE_BY, 
    A.LAST_NAME
    order by PL.CODE
    `
    new mssql.Request()
        .input('kilnId', req.query.kilnId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

ballet.get('/bao-cao-cho-say/bien-ban/bb-kiem-tra-lo-say', async(req, res) => {
    const getBienBanLoSay = `
    SELECT DATA, a.LAST_NAME, a.ID, bb.CREATE_DATE
  FROM [prod].[BIEN_BAN] bb
  inner join base.ACCOUNT a on bb.CREATE_BY = a.ID
  where LINK_ID = @kilnBatchId and bb.TYPE = 'bien-ban-kiem-tra-lo-say'
    `
    new mssql.Request()
        .input('kilnBatchId', req.query.kilnBatchId)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
ballet.get('/bao-cao-cho-say/bien-ban/bb-kiem-tra-do-am', async(req, res) => {
    const getBienBanLoSay = `
    SELECT DATA, a.LAST_NAME, a.ID, bb.CREATE_DATE, kb.TYPE
  FROM [prod].[BIEN_BAN] bb
  inner join base.ACCOUNT a on bb.CREATE_BY = a.ID
  inner join prod.KILN_BATCH kb on bb.LINK_ID = kb.ID
  where LINK_ID = @kilnBatchId and bb.TYPE = 'bieu-mau-kiem-tra-do-am'
    `
    new mssql.Request()
        .input('kilnBatchId', req.query.kilnBatchId)
        .query(getBienBanLoSay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
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
        .input('factoryId', req.body.factoryId)
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
        .input('ACCOUNT_ID', req.body.accountId)
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
ballet.delete('/reInBath/:code', async(req, res) => {
    try {
        const data = await new mssql.Request().query(`
        Declare @sopIdDel int
        Declare @sopIdUpdate int
        set @sopIdDel = (select top(1) sop.id from prod.PALLET pal left join prod.STEP_OF_PALLET sop on pal.ID = sop.PALLET_ID where CODE = '${req.params.code}' and sop.KILN_BATCH_ID is not null)
        set @sopIdUpdate =  (select top (1) sop.id from prod.PALLET pal left join prod.STEP_OF_PALLET sop on pal.ID = sop.PALLET_ID where CODE = '${req.params.code}' and sop.KILN_BATCH_ID is null)
        print @sopIdDel 
        print @sopIdUpdate
        Delete prod.STEP_OF_PALLET where ID = @sopIdDel
        Delete prod.PACKAGE where STEP_OF_PALLET_ID = @sopIdDel
        Update prod.PACKAGE set VERIFY_BY = null, VERIFY_DATE = null where STEP_OF_PALLET_ID = @sopIdUpdate 
          `)
        console.log('lấy toàn bộ')
        res.status(200).send({
            meta: {
                success: true,
                data
            }
        })
    } catch (e) {
        res.status(405).send({
            meta: {
                success: false,
                error: e
            }
        })
    }

})

module.exports = ballet