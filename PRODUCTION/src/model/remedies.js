const orm = require('./orm')
const remedies = {
    id: 'ID',
    typeId : 'TYPE_ID',
    code: 'CODE',
    name: 'NAME',
}
const remediess = orm.create(remedies, '[REMEDIES]')

module.exports = remediess