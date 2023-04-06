const mssql = require('mssql')
const woodSchema = 'nlg'
const baseSchema = 'base'
const TABLE = {

}
const configDB = {
    user: process.env.WMSDB_USER,
    password: process.env.WMSDB_PASSWORD,
    server: process.env.WMSDB_SERVER, // You can use 'localhost\\instance' to connect to named instance
    database: process.env.WMSDB_DATABASE,
    port: parseInt(process.env.WMSDB_PORT)
}


mssql.connect(configDB, (err) => {
    if (err)
        return console.log(err)
    console.log('SQL SERVER is conneted !')
})

const mssqlExcutedQuery = (query, callback) => {
    mssql.query(query)
        .then(result => {
            callback(result)
        }).catch(err => {
            callback(null, err)
        })
}
const asyncExcuted = async (query, callback) => {
    try {
        let result = await mssql.query(query)
        callback(result)
    } catch (error) {
        callback(null, error)
    }
}
const PROCEDUCES = {
    TAO_PHIEU_NHAP_KHO: woodSchema + '.[Proc_Create_Phieu_Nhap_Kho]',
    NHAPKHO: woodSchema + '.[Proc_Them_Ma_Nhap_Kho]',
    EDIT_NHAP_KHO: woodSchema+'.[Proc_edit_nhap_kho_detail]',
    VIEW_HA_CAP: woodSchema+'.[Proc_View_Ha_Cap_Theo_So_Phieu]',
    PROC_DELAI_1PHAN: woodSchema+'.Proc_delai_1_phan'
}
const VIEWS = {
    DANH_SACH_PHIEU_NHAP_KHO: woodSchema + '.[Danh_Sach_Phieu_Nhap_Kho]'
}
module.exports = {
    TABLE,
    mssqlExcutedQuery,
    PROCEDUCES,
    asyncExcuted,
    VIEWS
}