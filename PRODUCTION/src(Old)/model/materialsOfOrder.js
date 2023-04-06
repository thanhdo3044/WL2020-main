const orm = require('./orm')
const materialsOfOrder = {
    id: 'ID',
    productionOrdersId: 'PRODUCTION_ORDERS_ID',
    materialsId: 'MATERIALS_ID',
    quantity: 'QUANTITY'
}
const materialsOfOrders = orm.create(materialsOfOrder, '[MATERIALS_OF_ORDER]')

module.exports = materialsOfOrders