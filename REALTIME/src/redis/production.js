const redis = require("redis")
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
const production = require('./../state/production')
const mssql = require('mssql')

const getEvent = `SELECT 
                    E.ID id,
                    E.[NO] no,
                    e.[MESSAGE] message,
                    E.CREATE_DATE createDate
                    FROM app.[EVENT] E
                    WHERE CAST(E.CREATE_DATE AS DATE) = CAST(GETDATE() AS DATE)
                    AND E.[CHANNEL] = 'production'
                    ORDER BY [NO] ASC`
mssql.connect({
    user: process.env.WMSDB_USER,
    password: process.env.WMSDB_PASSWORD,
    server: process.env.WMSDB_SERVER,
    database: process.env.WMSDB_DATABASE
}, (err) => {
    if (err) {
        console.log('SQL Server : connect failse')
        throw err
    }
    console.log('SQL Server : connected !')
    new mssql.Request()
        .query(getEvent, (err, record) => {
            if (err)
                throw err
            record.recordset.forEach(e => {
                production.hasTransaction(JSON.parse(e.message), e.no)
                // try {
                //     production.hasTransaction(JSON.parse(e.message), e.no)
                // } catch (error) {
                //     console.log('Có tin nhắn lỗi : ', e.message)
                // }
            })
        })
})

client.on("error", function (err) {
    //bỏ qua thông báo reconnect, hệ thống sẽ tự động connect ngầm, các thông báo lỗi khác sẽ vẫn hiển thị
    if (err.code != 'ETIMEDOUT' && err.code != 'ECONNREFUSED')
        console.log(err)
})

client.on('connect', () => {
    console.log('REDIS : connected')
})

client.on('message', (channel, message) => {
    new mssql.Request()
        .input('CHANNEL', channel)
        .input('MESSAGE', message)
        .execute(`Proc_addEvent`, (err, record) => {
            if (err)
                throw err
            try {
                if (channel == 'production')
                    production.hasTransaction(JSON.parse(message), record.recordset[0].no)
            } catch (error) {
                console.log({
                    channel,
                    message
                })
            }

        })
})

client.subscribe('production')
// event được bắn ra khi palet được tạo hoàn tất

const createPallet = {
    from: 100000,
    to: 100001,
    items: [{
        itemId: 100000,
        quantity: 100,
        materials: [{
            itemId: 100002,
            quantity: 100
        }]
    }],
}


module.exports = client