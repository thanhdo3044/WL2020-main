const mssql = require('mssql')
const woodSchema = 'wood'
const baseSchema = 'base'
const TABLE ={
    WH_RECEIPT:woodSchema+`.[WH_RECEIPT]`,
    REGION:woodSchema+'.[REGION]',
    WH_RECEIPT_DETAIL: woodSchema+'.[WH_RECEIPT_DTL]',
    WOOD_INSPECTOR:woodSchema+'.[WOOD_INSPECTION]',
    WOOD_PAY_CALTULATOR: woodSchema+'.[WOOD_PAY_CALCULATOR]',
    WOOD_PAY_SAVE:woodSchema+'.[WOOD_PAY_SAVE]',
    WOOD_PRICE_LIST: woodSchema+'.[WOOD_PRICE_LIST]',
    WOOD_INPUT_TYPE: woodSchema+'.[WH_INPUT_TYPE]',
    WOOD_PRICE: woodSchema+'.[WOOD_PRICE_LIST]',
    BASE_VENDOR : baseSchema+'.[VENDOR]',
    BASE_DEPARTMENT : baseSchema +'.[DEPARTMENT]',
    WOOD_TYPE: woodSchema+'.[WOOD_TYPE]',
    PRICE_TYPE: woodSchema+'.[PRICE_TYPE]',
    BASE_ACCOUNT : baseSchema+'.[ACCOUNT]',
    ITEM: baseSchema+'.[ITEM]',
    REQ_PRICE : woodSchema+ '.[REQ_PRICE]',
    WOOD_INSP : woodSchema+'.[WOOD_INSP]'
    
}
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
const PROCEDUCES = {
    CREATE_WH_RECEIPT : woodSchema+'.[Proc_Create_WareHouse_Receipt]',
    UPDATE_WH_RECEIPT: woodSchema+'.[Proc_Update_WH_Receipt]',
    CREATE_WH_RECEIPT_DLT : woodSchema+'.[Proc_Create_Detail_WH_Receipt]',
    UPDATE_WH_RECEIPT_DLT: woodSchema+'.[Proc_Update_WH_Receipt_Detail]',
    CREATE_WOOD_INSPECTION: woodSchema+'.[Proc_Create_Wood_Inspection]',
    UPDATE_WOOD_INSPECTION: woodSchema+'.[Proc_Update_Wood_Inspection]',
    GET_PAY_CALCULATION: woodSchema+'.[Proc_get_Pay_Cal_By_Receipt_id_Van]',
    APPROVAL_PRICE : woodSchema+'.[Proc_Approval_Price]',
    COMPLETED_BB: woodSchema+'.[Proc_Completed_Receipt]',
    CHANGE_MAP_CONDITION: woodSchema+'.[Proc_Change_Map_Condition]'
}
module.exports = {TABLE,mssqlExcutedQuery,PROCEDUCES,asyncExcuted}