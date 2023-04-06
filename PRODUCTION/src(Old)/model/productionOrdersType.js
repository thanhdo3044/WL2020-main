const orm = require('./orm')
const productionOrderType = {
    id: 'ID',
    code: 'CODE',
    name: 'NAME',
}
const productionOrdersType = orm.create(productionOrderType, '[PRODUCTION_ORDERS_TYPE]')

module.exports = productionOrdersType