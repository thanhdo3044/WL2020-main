const orm = require('./orm')
const productionOrdersStatusSchema = {
    id: 'ID',
    code: 'CODE',
    name: 'NAME',
}
const productionOrdersStatus = orm.create(productionOrdersStatusSchema, '[PRODUCTION_ORDERS_STATUS]')

module.exports = productionOrdersStatus