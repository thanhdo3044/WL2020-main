require('dotenv').config()

const dbDetails = {
  username: process.env.WMSDB_USER,
  password: process.env.WMSDB_PASSWORD,
  database: process.env.WMSDB_DATABASE,
  host: process.env.WMSDB_SERVER,
  dialect: 'mssql',
  port: process.env.WMSDB_PORT,
  options: {
    trustServerCertificate: false,
  }
}

module.exports = {
  development: dbDetails,
  production: dbDetails
}