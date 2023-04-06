const express = require('express')
const range = express.Router()
const model = require('./../../../core/model')
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')

range.get('/', (req, res) => {
    new mssql.Request()
        .input('ID', req.headers['x-gateway-account-id'])
        .query(`SELECT R.ID id,
                R.CODE code,
                R.TYPE type,
                R.HEIGHT height,
                R.STEP_NEXT_ID stepNextId,
                R.TIME_OUT_TARGET timeOutTarget,
                R.FACTORY_ID factoryId
                FROM prod.RANGE R
                LEFT JOIN  (
                SELECT TOP(1) D.factoryId ID
                FROM base.ACCOUNT A
                LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ID
                LEFT JOIN base.DEPARTMENT D ON D.ID = RV.VALUE
                WHERE A.ID = @ID
                AND RV.ROLE_TYPE_ID = 100001
                AND D.TYPE2 = 'nhaMay'
                ) F ON F.ID = R.FACTORY_ID
                WHERE F.ID IS NOT NULL`, (err, record) => {
            if (err)
                res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

range.post('/', (req, res) => {
    model.ranges.create(req.body, data => {
        res.api.sendData(data)
    })
})

module.exports = range