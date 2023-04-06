const mssql = require('mssql')

const orm = require('./orm')

const range = {
    id : 'ID',
    code : 'CODE',
    type : 'TYPE',
    height : 'HEIGHT',
    stepNextId : 'STEP_NEXT_ID',
    timeOutTarget : 'TIME_OUT_TARGET'
}


const ranges = orm.create(range,'[RANGE]')


module.exports = ranges