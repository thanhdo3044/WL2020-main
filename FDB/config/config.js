const config = require('./global')

config.schema = 'dbo'

// config.port = process.env.BASE_PORT || 221
// config.rpc = {
//     host: '127.0.0.1',
//     port: process.env.BASE_GRPC_PORT || 50001
// }

const Sequelize = require('sequelize')
const mssql = require('mssql')
const {
    database
} = config

// const hooks = require('./hooks')


mssql.connect(database, (err) => {
    if (err) {
        console.log('SQL Server ssms connect failse !')
        throw err
    }
    console.log('database', database)
    console.log('SQL Server ssms connected')
})

const sequelize = new Sequelize(database.database, database.user, database.password, {
    host: database.server,
    port: database.port,
    dialect: 'mssql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    timestamps: false,
    define: {
        // hooks: {
        //     afterCreate: function(instance, option) {
        //         option.event = 'INSERT'
        //         hooks(instance, option)
        //     },
        //     afterUpdate: function(instance, option) {
        //         option.event = 'UPDATE'
        //         hooks(instance, option)
        //     },
        //     afterDestroy: function(instance, option) {
        //         option.event = 'DELETE'
        //         hooks(instance, option)
        //     },
        //     beforeBulkUpdate: function(options) { //https://github.com/sequelize/sequelize/issues/6368
        //         options.individualHooks = true
        //     },
        //     beforeBulkDestroy: function(options) { //https://github.com/sequelize/sequelize/issues/6368
        //         options.individualHooks = true
        //     }
        // }
    }
})
sequelize
    .authenticate()
    .then(() => {
        console.log('SQL Server conneted')
    })
    .catch(err => {
        console.error(`SQL Server connect failse : ${err}`)
        throw err
    })
module.exports = {
    sequelize: sequelize,
    mssql: mssql
}