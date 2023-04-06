const orm = require('./orm')
const productionOrder = {
    id: 'ID',
    code: 'CODE',
    name: 'NAME',
    type : 'TYPE',
    routingName : 'ROUTING_NAME',
    description: 'DESCRIPTION',
    statusId: 'STATUS_ID',
    fromDate: 'FROM_DATE',
    toDate: 'TO_DATE',
    createBy: 'CREATE_BY',
    createDate: 'CREATE_DATE',
    factoryId : 'FACTORY_ID',
    productionOrdersTypeId : 'PRODUCTION_ORDERS_TYPE_ID'
}
const productionOrders = orm.create(productionOrder, '[PRODUCTION_ORDERS]')

module.exports = productionOrders