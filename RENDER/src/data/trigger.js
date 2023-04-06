const client = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

const getSchemaFromTable = {
    ACCOUNT: 'accounts',
    ROLE: 'roles',
    ROLE_TYPE: 'roleTypes',
    ROLE_GROUP: 'roleGroups',
    ROLE_VALUE: 'roleValues',
    MODULE: 'modules',
    CUSTOMER: 'customers',
    DEPARTMENT: 'derpartments',
    ITEM: 'items',
    ITEM_VCN: 'itemsVCN',
    ITEM_TYPE: 'itemTypes',
    UNIT: 'units',
    MARKET: 'markets',
    VENDOR: 'vendors'
}
client.on("error", function (err) {
    //bỏ qua thông báo reconnect, hệ thống sẽ tự động connect ngầm, các thông báo lỗi khác sẽ vẫn hiển thị
    if (err.code != 'ETIMEDOUT' && err.code != 'ECONNREFUSED' && err.code != 'CONNECTION_BROKEN')
        console.log(err)
})
client.on('message', (channel, message) => {
    if (channel == require('../core/config').publishChannel.database) {
        try {
            message = JSON.parse(message) || {}
        } catch (err) {
            return console.log(err)
        }
        let table = getSchemaFromTable[message.table]
        const model = require('./model')
        const cache = require('./cache')
        if (model[table] && typeof message.row == 'object') {
            let id = message.row.id
            if (id > 0)
                model[table].findOne({
                    where: {
                        id: id
                    }
                }).then(data => {
                    if (data)
                        if (data.dataValues)
                            if (message.event) {
                                let row = cache[table].getById(id)
                                if (row.id) {
                                    cache[table].updateById(id, data.dataValues)
                                } else {
                                    cache[table].add(data.dataValues)
                                }
                            }

                })
        }
    }
})

module.exports = client