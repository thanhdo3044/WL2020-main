const Sequelize = require('sequelize')
const {
    database
} = require('../core/config')

const sequelize = new Sequelize(database.database, database.user, database.password, {
    host: database.server,
    port : database.port,
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

sequelize
    .authenticate()
    .then(() => {
        console.log('SQL Server : sequelize conneted');
    })
    .catch(err => {
        console.error(`SQL Server: sequelize connect fail!`);
        throw err
    })

module.exports = sequelize