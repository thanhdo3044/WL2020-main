const mssql = require('mssql')
const {
    database
} = require('./config')
//const MongoClient = require('./MongoClient')
// database.user = 'sa'
// database.password = 'WMSDB@2019'
// database.server = '192.168.1.26'

const view = {}
const model = {
    kilns: require('../model/kilns'),
    packageTypes: require('../model/packageTypes'),
    ranges: require('../model/ranges'),
    Logging: require('../model/logging'),
    workResources: require('../model/workResources'),
    parcels: require('../model/parcels'),
    remedies: require('../model/remedies'),
    customers: require('../model/customers'),
    woodTypes: require('../model/woodTypes'),
    productionOrders: require('../model/productionOrders'),
    productionOrdersType: require('../model/productionOrdersType'),
    productionOrdersStatus: require('../model/productionOrdersStatus'),
    productOfOrders: require('../model/productOfOrders'),
    materialsOfOrders: require('../model/materialsOfOrder'),
    view: view,
    bienban: {
        create(data, cb) {
            try {
                data.data = JSON.stringify(data.data)
            } catch (error) {
                if (err)
                    if (typeof cb === 'function')
                        return cb(err)
            }
            new mssql.Request()
                .input('TYPE', data.type)
                .input('DATA', JSON.stringify(data))
                .input('LINK_ID', data.linkId)
                .input('LINK_TYPE', data.linkType)
                .input('CREATE_BY', data.createBy)
                .query(createBienBan, (err, record) => {
                    if (err)
                        if (typeof cb === 'function')
                            return cb(err)
                    cb()
                })
        },
        get(cb) {
            new mssql.Request()
                .query(getBienBan, (err, record) => {
                    if (err)
                        if (typeof cb === 'function')
                            return cb(err, null)
                    data = record.recordset
                    data.forEach((e, i) => {
                        data[i].data = JSON.parse(data[i].data)
                    })
                    cb(null, data)
                })
        },
        getByType(type, cb) {
            new mssql.Request()
                .input('TYPE', type)
                .query(getBienBanByType, (err, record) => {
                    if (err)
                        if (typeof cb === 'function')
                            return cb(err, null)
                    data = record.recordset
                    data.forEach((e, i) => {
                        data[i].data = JSON.parse(data[i].data)
                    })
                    cb(null, data)
                })
        },
        getByTypeAndLinkId(data, cb) {
            new mssql.Request()
                .input('TYPE', data.type)
                .input('LINK_ID', data.linkId)
                .input('LINK_TYPE', data.linkType)
                .query(getByTypeAndLinkId, (err, record) => {
                    if (err)
                        if (typeof cb === 'function')
                            return cb(err, null)
                    data = record.recordset
                    data.forEach((e, i) => {
                        data[i].data = JSON.parse(data[i].data)
                    })
                    cb(null, data)
                })
        },
        updateById(id, data, cb) {
            new mssql.Request()
                .input('DATA', JSON.stringify(data))
                .input('ID', id)
                .query(updateById, (err, record) => {
                    if (err)
                        if (typeof cb === 'function')
                            return cb(err, null)
                    cb()
                })
        },
        deleteById(id, cb) {
            new mssql.Request()
                .query(deleteById, (err, record) => {
                    if (err)
                        if (typeof cb === 'function')
                            return cb(err, null)
                    cb()
                })
        }
    }
}

mssql.connect(database, (err) => {
    if (err) {
        console.log('SQL Server : connect failse')
        throw err
    }
    console.log('SQL Server : connected')
    model.kilns.begin()
    model.packageTypes.begin()
    model.ranges.begin()
    model.workResources.begin()
    model.parcels.begin()
    model.remedies.begin()
    model.customers.begin()
    model.woodTypes.begin()
    model.productionOrders.begin()
    model.productionOrdersType.begin()
    model.productionOrdersStatus.begin()
    model.productOfOrders.begin()
    model.materialsOfOrders.begin()
})

view.model = model

let getBienBan = `SELECT ID id, [TYPE] type, [DATA] [data], LINK_ID linkId, LINK_TYPE linkType, CREATE_BY createBy, CREATE_DATE createDate FROM prod.BIEN_BAN`
let createBienBan = `INSERT INTO prod.BIEN_BAN([GUID],[TYPE],[DATA],LINK_ID, LINK_TYPE,CREATE_BY, CREATE_DATE)
                    VALUES (NEWID(), @TYPE, @DATA, @LINK_ID, @LINK_TYPE, @CREATE_BY, GETDATE())`
let getBienBanByType = 'SELECT ID id, [TYPE] type, [DATA] [data], LINK_ID linkId, LINK_TYPE linkType, CREATE_BY createBy, CREATE_DATE createDate FROM prod.BIEN_BAN WHERE [TYPE] = @TYPE'
let getByTypeAndLinkId = `SELECT ID id, [TYPE] type, [DATA] [data], LINK_ID linkId, LINK_TYPE linkType, CREATE_BY createBy, CREATE_DATE createDate FROM prod.BIEN_BAN 
                            WHERE [TYPE] = @TYPE
                            AND [LINK_ID] = @LINK_ID
                            AND [LINK_TYPE] = @LINK_TYPE`
let updateById = `UPDATE prod.BIEN_BAN
                    SET [DATA] = @DATA
                    WHERE ID = @ID`
let deleteById = `DELETE prod.BIEN_BAN
                    WHERE ID = @ID`



module.exports = model