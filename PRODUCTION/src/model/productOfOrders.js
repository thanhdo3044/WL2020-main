const orm = require('./orm')
const productOfOrder = {
    id: 'ID',
    productionOrdersId: 'PRODUCTION_ORDERS_ID',
    productId: 'PRODUCT_ID',
    quantity: 'QUANTITY'
}
const productOfOrders = orm.create(productOfOrder, '[PRODUCT_OF_ORDERS]')

module.exports = productOfOrders