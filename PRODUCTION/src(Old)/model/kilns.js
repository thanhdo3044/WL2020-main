const orm = require('./orm')
const kiln = {
    id: 'ID',
    code: 'CODE',
    name: 'NAME',
    factoryId : 'FACTORY_ID'
}
const kilns = orm.create(kiln, '[KILN]')

module.exports = kilns