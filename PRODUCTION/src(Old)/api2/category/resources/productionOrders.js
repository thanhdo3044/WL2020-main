const express = require('express')
const productionOrders = express.Router()
const model = require('../../../core/model')
const mssql = require('mssql')
const {
    getProductionOrders,
    addParcelToProductionOrders,
    getProductionOrdersAll
} = require('./../../../core/query')
const {
    getErrorMessage
} = require('./../../../core/config')


productionOrders.get('/', (req, res) => {
    if (req.query.type == 'wood-processing') {
        let q = `SELECT TOP(15) ID id,CODE code,[NAME] name, [TYPE] type, CREATE_BY createBy,CREATE_DATE createDate
        FROM prod.PRODUCTION_ORDERS
        WHERE [TYPE] = 'wood-processing'
        ORDER BY ID DESC`
        new mssql.Request()
            .query(q, (err, record) => {
                if (err)
                    return res.api.sendData(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            })
    } else {
        if (req.query.get == 'all') {
            new mssql.Request()
                .input('FACTORY_ID', req.query.factoryId)
                .query(getProductionOrdersAll, (err, record) => {
                    if (err)
                        return res.api.sendData(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                })
        } else {
            new mssql.Request()
                .input('FACTORY_ID', req.query.factoryId)
                .query(getProductionOrders, (err, record) => {
                    if (err)
                        return res.api.sendData(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                })
        }
    }

})



productionOrders.get('/:id', (req, res, next) => {
    let getProductionOrdersById = `SELECT ID id,CODE code,[NAME] name, [TYPE] type, CREATE_BY createBy,CREATE_DATE createDate
                FROM prod.PRODUCTION_ORDERS
                WHERE ID = @ID
                `
    new mssql.Request()
        .input('ID', req.params.id)
        .query(getProductionOrdersById, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            req.productionOrder = record.recordset[0]
            if (req.productionOrder != undefined) {
                if (req.productionOrder.id != undefined) {
                    next()
                }
            } else {
                res.api.sendData([])
            }
        })
}, (req, res, next) => {
    let getProductOfOrder = `SELECT PRODUCT_ID itemId,
                            QUANTITY quantity
                            FROM prod.PRODUCT_OF_ORDERS
                            WHERE PRODUCTION_ORDERS_ID = @ID`
    new mssql.Request()
        .input('ID', req.params.id)
        .query(getProductOfOrder, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            req.productionOrder.products = []
            record.recordset.forEach(e => {
                req.productionOrder.products.push({
                    itemId: e.itemId,
                    quantity: e.quantity
                })
            })
            next()
        })
}, (req, res, next) => {
    let getMaterialsOfProduct = `SELECT 
                                ID id,
                                MATERIALS_ID itemId,
                                QUANTITY quantity
                                FROM prod.MATERIALS_OF_ORDER
                                WHERE PRODUCTION_ORDERS_ID = @ID`
    new mssql.Request()
        .input('ID', req.params.id)
        .query(getMaterialsOfProduct, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            req.productionOrder.materials = []
            record.recordset.forEach(e => {
                req.productionOrder.materials.push({
                    materialsId: e.id,
                    itemId: e.itemId,
                    quantity: e.quantity
                })
            })
            next()
        })
}, (req, res, next) => {
    let getQuantity = `SELECT 
                        P.SOURCE_ID departmentId,
                        SUM(IIP.QUANTITY) quantity
                        FROM prod.PALLET PL
                        LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.PALLET_ID = PL.ID
                        LEFT JOIN prod.PACKAGE P ON P.STEP_OF_PALLET_ID = SOP.ID
                        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                        WHERE PL.PRODUCTION_ORDERS_ID = @ID
                        GROUP BY P.SOURCE_ID`
    new mssql.Request()
        .input('ID', req.params.id)
        .query(getQuantity, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            req.productionOrder.current = []
            record.recordset.forEach(e => {
                req.productionOrder.current.push({
                    departmentId: e.departmentId,
                    quantity: e.quantity
                })
            })
            next()
        })
}, (req, res, next) => {
    let receive = `    SELECT 
    P.DESTINATION_ID departmentId,
    SUM(IIP.QUANTITY) quantity
    FROM prod.PALLET PL
    LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.PALLET_ID = PL.ID
    LEFT JOIN prod.PACKAGE P ON P.STEP_OF_PALLET_ID = SOP.ID
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    WHERE PL.PRODUCTION_ORDERS_ID = @ID
    GROUP BY P.DESTINATION_ID`
    new mssql.Request()
        .input('ID', req.params.id)
        .query(receive, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            req.productionOrder.receive = []
            record.recordset.forEach(e => {
                req.productionOrder.receive.push({
                    departmentId: e.departmentId,
                    quantity: e.quantity
                })
            })
            next()
        })
}, (req, res, next) => {
    let getRouting = `SELECT PO.ROUTING_NAME routingName,
                        R.DEPARTMENT_ID departmentId,
                        R.[ORDER] 'order'
                        FROM prod.PRODUCTION_ORDERS PO
                        LEFT JOIN prod.ROUTINGS R ON R.NAME = PO.ROUTING_NAME
                        WHERE PO.ID = @ID
                        ORDER BY R.[ORDER] ASC
                        `
    new mssql.Request()
        .input('ID', req.params.id)
        .query(getRouting, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            req.productionOrder.routings = []
            record.recordset.forEach(e => {
                req.productionOrder.routingName = e.routingName
                req.productionOrder.routings.push({
                    departmentId: e.departmentId,
                    order: e.order
                })
            })
            next()
        })
}, (req, res, next) => {
    req.api.sendData(req.productionOrder)
})

productionOrders.get('/:id/products', (req, res, next) => {
    res.api.sendData(model.productOfOrders.filter(i => i.productionOrdersId == req.params.id))
})

productionOrders.get('/:id/parcel', (req, res, next) => {
    let getParcel = `SELECT CODE code
                    FROM prod.PARCEL_WOOD
                    WHERE PRODUCTION_ORDERS_ID = @ID`
    new mssql.Request()
        .input('ID', req.params.id)
        .query(getParcel, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

productionOrders.post('/:id/parcel', (req, res, next) => {
    new mssql.Request()
        .input('PRODUCTION_ORDERS_ID', req.params.id)
        .input('CODE', req.body.code)
        .query(addParcelToProductionOrders, (err, record) => {
            res.api.sendData([])
        })
})

productionOrders.post('/:id/products', (req, res, next) => { // 1 LSX chỉ được thêm 1 sản phẩm
    new mssql.Request()
        .input('ID', req.params.id)
        .query(`select POO.ID
        from prod.PRODUCT_OF_ORDERS POO
        LEFT JOIN prod.PRODUCTION_ORDERS PO ON PO.ID = POO.PRODUCTION_ORDERS_ID
        WHERE PO.ID = @ID`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            if (record.recordset.length > 0) {
                return res.api.sendFail(getErrorMessage(420))
            } else {
                next()
            }
        })
}, (req, res, next) => {
    req.body.productionOrdersId = req.params.id
    model.productOfOrders.create(req.body, (role) => {
        res.api.sendData(role)
    })
})

productionOrders.post('/:id/materials', (req, res, next) => {
    req.body.productionOrdersId = req.params.id
    model.materialsOfOrders.create(req.body, (role) => {
        res.api.sendData(role)
    })
})

productionOrders.post('/', (req, res) => {
    req.body.createBy = req.token.accountId
    let date = new Date().toLocaleDateString()
    req.body.createDate = date
    model.productionOrders.create(req.body, (productionOrder) => {
        res.api.sendData(productionOrder)
    })
})

productionOrders.put('/:id', (req, res) => {
    model.productionOrders.updateById(req.params.id, req.body, (productionOrder) => {
        res.api.sendData(productionOrder)
    })
})

productionOrders.delete('/:id', (req, res) => {
    model.productionOrders.deleteById(req.params.id, (status) => {
        res.api.sendData({
            status
        })
    })
})

productionOrders.delete('/:id/materials/:materialsId', (req, res) => {
    let deleteMaterials = `DELETE prod.MATERIALS_OF_ORDER
                            WHERE PRODUCTION_ORDERS_ID = @PRODUCTION_ORDERS_ID
                            AND MATERIALS_ID = @MATERIALS_ID
                            `
    new mssql.Request()
        .input('PRODUCTION_ORDERS_ID', req.params.id)
        .input('MATERIALS_ID', req.params.materialsId)
        .query(deleteMaterials, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData([])
        })
})


module.exports = productionOrders