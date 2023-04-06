const mssql = require('mssql')
const orm = require('./orm')

const workResource = {
    id: 'ID',
    code: 'CODE',
    name: 'NAME'
}

const workResources = orm.create(workResource, '[WORK_RESOURCES]')


module.exports = workResources