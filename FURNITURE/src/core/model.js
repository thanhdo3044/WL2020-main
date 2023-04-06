const Sequelize = require('sequelize')
const mssql = require('mssql')
const env = process.env
const pubsubClient = require('./../model/pubsubClient')
const {
    encode,
    decode,
    cmd
} = require('../../../proto/TCP_protocol')
const {
    modelSubcribeChannel
} = require('./config')
mssql.connect({
    user: process.env.WMSDB_USER,
    password: process.env.WMSDB_PASSWORD,
    server: process.env.WMSDB_SERVER,
    database: process.env.WMSDB_DATABASE
}, (err) => {
    if (err)
        console.log('SQL Server ssms connect failse')
    console.log('SQL Server ssms connected')
})

const sequelize = new Sequelize(env.WMSDB_DATABASE, env.WMSDB_USER, env.WMSDB_PASSWORD, {
    host: env.WMSDB_SERVER,
    dialect: 'mssql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    timestamps: false,
})

//bắt event change data để thông báo lên server pubsub
sequelize.afterCreate(changeData)
sequelize.afterUpdate(changeData)


function changeData(instance, option) {
    pubsubClient.write(encode({
        header: cmd.PUBLISH,
        body: JSON.stringify({
            channel: modelSubcribeChannel,
            message: {
                id: instance.id,
                object: getObjectByTableName(instance._modelOptions.tableName),
                schema: instance._options._schema
            }
        })
    }), (err) => {
        if (err) console.log(err)
    })
}

function getObjectByTableName(tableName) {
    switch (tableName) {
        case 'PROJECT':
            return 'projects'
        default:
            return null
    }
}

sequelize
    .authenticate()
    .then(() => {
        console.log('SQL Server conneted');
    })
    .catch(err => {
        console.error(`SQL Server connect failse : ${err}`);
    });


const projects = require('./../model/fpm/PROJECT')(sequelize, Sequelize)
const projectProducts = require('./../model/fpm/PROJECT_PRODUCT')(sequelize, Sequelize)
const accepts = require('./../model/fpm/ACCEPT')(sequelize, Sequelize)
const acceptProducts = require('./../model/fpm/ACCEPT_PRODUCT')(sequelize, Sequelize)
const contracts = require('./../model/fpm/CONTRACT')(sequelize, Sequelize)
const customers = require('./../model/fpm/CUSTOMER')(sequelize, Sequelize)
const priceQuotes = require('./../model/fpm/PRICE_QUOTE')(sequelize, Sequelize)
const priceQuoteProducts = require('./../model/fpm/PRICE_QUOTE_PRODUCT')(sequelize, Sequelize)
const receipts = require('./../model/fpm/RECEIPT')(sequelize, Sequelize)
const receiptProducts = require('./../model/fpm/RECEIPT_PRODUCT')(sequelize, Sequelize)

const model = {
    projects,
    projectProducts,
    accepts,
    acceptProducts,
    contracts,
    customers,
    priceQuotes,
    priceQuoteProducts,
    receipts,
    receiptProducts,
    pubsubClient
}




// Project.update({
//     name: 'hieu'
// }, {
//     where: {
//         id : 100014
//     }
// }).then(data => {
//     console.log(data)
// })

module.exports = model