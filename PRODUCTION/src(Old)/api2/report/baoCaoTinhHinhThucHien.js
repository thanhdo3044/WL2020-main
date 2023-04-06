const express = require('express')
const rp = express.Router()
const mssql = require('mssql')
const {
    baoCaoTinhHinhThucHien
} = require('./../../core/query')

rp.get('/', (req, res, next) => {
    new mssql.Request()
        .input('DEPARTMENT_ID', req.query.departmentId)
        .input('WEEK', req.query.week)
        .query(baoCaoTinhHinhThucHien, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            let data = []
            record.recordset.forEach(e => {
                let row = {}
                Object.keys(e).forEach(c => {
                    row[c.toLocaleLowerCase()] = e[c]
                })
                data.push(row)
            })
            res.api.sendData(data)
        })
})


module.exports = rp