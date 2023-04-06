const mssql = require('mssql')
const woodSchema = 'wood'
const baseSchema = 'base'

const configDB = {
    user: process.env.WMSDB_USER,
    password: process.env.WMSDB_PASSWORD,
    server: process.env.WMSDB_SERVER, // You can use 'localhost\\instance' to connect to named instance
    database: process.env.WMSDB_DATABASE,
    port : parseInt(process.env.WMSDB_PORT || 1433)
}



mssql.connect(configDB, (err)=>{
    if(err)
        console.log(err)
    console.log('SQL SERVER is conneted !')
})

const mssqlExcutedQuery = (query,callback)=>{
    mssql.query(query)
    .then(result => {
        callback(result)
    }).catch(err => {
        callback(null,err)
    })
}
const asyncExcuted =  async (query,callback)=>{
    try {
        let result = await mssql.query(query)
        callback(result)
    } catch (error) {
        callback(null,error)
    }
}

module.exports = {mssqlExcutedQuery,asyncExcuted}