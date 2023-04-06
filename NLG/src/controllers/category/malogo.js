const express = require('express')
const malogo = express.Router()
const mssql = require('mssql')
const model = require('../../data/model')


malogo.get('/', model.malogo.select)
malogo.get('/klmalogo', (req, res) => {
    new mssql.Request()
        .query(` select P.NAME tenNCC,P.MX madinhdang,  R.NAME tenchurung,C.thang,R.Xa,R.Tinh,
        C.logotron,C.logoxe,R.SOCHUNGCHI,C.KL_GOTRON,C.COST from [nlg].[CHU_RUNG] C
        left join nlg.RUNG R on R.ID = C.NAME
        left join nlg.PROVIDERS P ON P.MX = C.Xuongxe
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
malogo.get('/delete', (req, res) => {
    const id = req.query.id

    new mssql.Request()
        .query(`
DELETE FROM nlg.CHU_RUNG
WHERE ID = ${id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

malogo.post('/', model.malogo.insert)

malogo.put('/:id', model.malogo.updateById)

malogo.delete('/:id', model.malogo.deleteById)

module.exports = malogo