const Sequelize = require('sequelize')
const mssql = require('mssql')


mssql.connect({
    user: process.env.WMSDB_USER,
    password: process.env.WMSDB_PASSWORD,
    server: process.env.WMSDB_SERVER,
    database: process.env.WMSDB_DATABASE
}, (err) => {
    if (err)
        return console.error(`SQL Server mssql connect failse : ${err}`);
    console.log('SQL Server mssql conneted');
})
const env = process.env

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

sequelize
    .authenticate()
    .then(() => {
        console.log('SQL Server sequelize conneted');
    })
    .catch(err => {
        console.error(`SQL Server sequelize connect failse : ${err}`);
    });
const goodsIssues = require('./../model/goodsIssue')(sequelize, Sequelize)
const goodsIssueProducts = require('./../model/goodsIssueProduct')(sequelize, Sequelize)

const model = {
    goodsIssues,
    goodsIssueProducts
}

module.exports = model