const express = require('express')
const routing = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')

routing.get('/', (req, res, next) => {
    getRoutingName = `
                    SELECT NAME name 
                    FROM prod.ROUTINGS
                    GROUP BY NAME`
    new mssql.Request()
        .query(getRoutingName, (err, record) => {
            if (err)
                return res.api.sendData(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

routing.get('/:name', (req, res, next) => {
    getRoutingByName = `
    SELECT 
    R.ID id,
    R.NAME name,
    D.ID departmentId,
    D.CODE departmentCode,
    D.NAME departmentName,
    R.[ORDER] 'order'
    FROM prod.ROUTINGS R
    LEFT JOIN base.DEPARTMENT D ON D.ID = R.DEPARTMENT_ID
    WHERE R.NAME = @NAME`
    new mssql.Request()
        .input('NAME', req.params.name)
        .query(getRoutingByName, (err, record) => {
            if (err)
                return res.api.sendData(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


routing.post('/', (req, res, next) => {
    let q = `INSERT INTO prod.ROUTINGS(GUID,NAME,DEPARTMENT_ID,[ORDER])
    VALUES (NEWID(),@NAME,@DEPARTMENT_ID,@ORDER)`
    new mssql.Request()
        .input('NAME', req.body.name)
        .input('DEPARTMENT_ID', req.body.departmentId)
        .input('ORDER', req.body.order)
        .query(q, (err, record) => {
            if (err)
                return res.api.sendData(getErrorMessage(4907))
            res.api.sendData([])
        })
})

routing.delete('/:name', (req, res, next) => {
    let q = `    DELETE prod.ROUTINGS
                WHERE [NAME] = @NAME`
    new mssql.Request()
        .input('NAME', req.params.name)
        .query(q, (err, record) => {
            if (err)
                return res.api.sendData(getErrorMessage(4907))
            res.api.sendData([])
        })
})

module.exports = routing