const orm = require('./orm')
const parcel = {
    id : 'ID',
    code : 'CODE',
    active : 'ACTIVE',
    createBy : 'CREATE_BY',
    createDate : 'CREATE_DATE',
    modifyBy : 'MODIFY_BY',
    modifyDate : 'MODIFY_DATE'
}

const parcels = orm.create(parcel,'[PARCEL]')
module.exports = parcels