const orm = require('./orm')
const customer = {
    id: 'ID',
    code: 'CODE',
    name: 'NAME',
    description : 'DESCRIPTION',
    city : 'CITY',
    address : 'ADDRESS',
    email : 'EMAIL',
    phone  : 'PHONE',
    active : 'ACTIVE',
    createBy : 'CREATE_BY',
    createDate : 'CREATE_DATE'
}
const customers = orm.create(customer, '[CUSTOMER]')

module.exports = customers