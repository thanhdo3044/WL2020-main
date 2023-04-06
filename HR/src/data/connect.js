const Sequelize = require('sequelize')
const mssql = require('mssql')
const {
    database
} = require('../core/config')

mssql.connect(database, (err) => {
    if (err){
        console.log('SQL Server ssms connect failse !')
        throw err
    }
    console.log('SQL Server ssms connected')
})

const sequelize = new Sequelize(database.database, database.user, database.password, {
    host: database.server,
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
        console.log('SQL Server conneted')
    })
    .catch(err => {
        console.error(`SQL Server connect failse : ${err}`)
        throw err
    })

module.exports = {
    sequelize,
    mssql
}