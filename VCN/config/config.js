require("dotenv").config();

const dbDetails = {
    username: process.env.WMSDB_USER,
    password: process.env.WMSDB_PASSWORD,
    database: process.env.WMSDB_DATABASE,
    host: process.env.WMSDB_SERVER,
    dialect: "mssql",
    port: process.env.WMSDB_PORT,
    options: {
        trustServerCertificate: false
    }
};
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.WMSDB_DATABASE,
    process.env.WMSDB_USER,
    process.env.WMSDB_PASSWORD, {
        host: process.env.WMSDB_SERVER,
        port: process.env.WMSDB_PORT,
        dialect: 'mssql',
        logging: console.log,
        freezeTableName: true,

        pool: {
            max: 1000000,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    })


module.exports = {
    sequelize: sequelize,
    development: dbDetails,
    test: dbDetails,
    production: dbDetails
};