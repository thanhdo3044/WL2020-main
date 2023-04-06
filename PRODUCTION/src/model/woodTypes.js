const orm = require('./orm')
const woodType = {
    id: 'ID',
    code: 'CODE',
    name: 'NAME',
    type : 'TYPE'
}
const woodTypes = orm.create(woodType, '[WOOD_TYPE]')

module.exports = woodTypes