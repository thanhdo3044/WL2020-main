const Sequelize = require('sequelize')
const sequelize = require('./connect')

const model = {
    accounts: require('../model/ACCOUNT')(sequelize, Sequelize),
    roles: require('../model/ROLE')(sequelize, Sequelize),
    roleTypes: require('../model/ROLE_TYPE')(sequelize, Sequelize),
    roleGroups: require('../model/ROLE_GROUP')(sequelize, Sequelize),
    roleValues: require('../model/ROLE_VALUE')(sequelize, Sequelize),
    modules: require('../model/ROLE_MODULE')(sequelize, Sequelize),
    customers: require('../model/CUSTOMER')(sequelize, Sequelize),
    departments: require('../model/DEPARTMENT')(sequelize, Sequelize),
    items: require('../model/ITEM')(sequelize, Sequelize),
    itemTypes: require('../model/ITEM_TYPE')(sequelize, Sequelize),
    units: require('../model/ITEM_UNIT')(sequelize, Sequelize),
    markets: require('../model/MARKET')(sequelize, Sequelize),
    vendors: require('../model/VENDOR')(sequelize, Sequelize),
    itemsVCN: require('../model/ITEM_VCN')(sequelize, Sequelize)
}

const trigger = require('./trigger')
trigger.subscribe(require('../core/config').publishChannel.database)
module.exports = model