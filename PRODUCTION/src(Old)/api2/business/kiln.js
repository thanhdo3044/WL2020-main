const express = require('express')
const kiln = express.Router()
const mssql = require('mssql')
const model = require('./../../core/model')
const {
    getKilnBatch
} = require('./../../core/query/index')

kiln.get('/', (req, res, next) => { // Lấy thông tin lò sấy
    req.kilns = model.kilns.findAll()
    next()
}, (req, res, next) => { // Lấy thông tin mẻ sấy
    new mssql.Request()
    .query(getKilnBatch)
    .then(record => {
        let batchs = []
        record.recordset.forEach(e => {
            batchs.push({
                id: e.ID,
                code: '' + e.YEAR + e.WEEK + e.NUMBER,
                kilnId: e.KILN_ID,
                target: e.TIME_OUT_TARGET,
                totalPallet: e.TOTAL_PALLET,
                createBy: e.CREATE_BY,
                createDate: e.CREATE_DATE
            })
        })
        req.batchs = batchs
        next()
    }).catch(err => {
        res.api.sendFail(require('./../../core/config').getErrorMessage(4907))
    })
}, (req, res, next) => { // join mẻ với lò
    for (let i = 0, length = req.kilns.length; i < length; i++){
        let kiln = req.kilns[i]
        kiln.batch = req.batchs.find(x=> x.kilnId == kiln.id) || null
    }
    res.api.sendData(req.kilns)
})

kiln.post('/:kilnId/batch', (req, res) => {
    req.input('KILN_ID', req.params.kilnId)
        .input('STEP_NEXT_ID', req.body.stepNextId)
        .input('TARGET', req.body.target)
        .input('LENGTH', req.body.length)
        .input('HEIGHT', req.body.height)
        .input('TYPE', req.body.type)
        .execute('Proc_createKilnBatch')
})



module.exports = kiln