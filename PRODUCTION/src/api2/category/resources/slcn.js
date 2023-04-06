const express = require('express')
const slcn = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')
const m2 = require('./../../../core/m2')




slcn.get('/', (req, res, next) => {
    new mssql.Request()
        .query(getSLCN, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


slcn.post('/', (req, res, next) => {
    m2.slcn.create(req.body)
        .then(data => {
            res.api.sendData([])
        })
})


slcn.put('/:id', (req, res, next) => {

})



slcn.delete('/:id', (req, res, next) => {

})


let getSLCN = `
select 
SL.ID id,
A.ACCOUNT workerCode,
A.LAST_NAME workerName,
D.NAME departmentName,
M.CODE machineCode,
M.NAME machineName,
I.NAME itemName,
CAST(CAST(SL.DATE_ON AS DATE) AS nvarchar(20)) 'date',
LEFT(CAST(CAST(SL.DATE_ON AS TIME) AS nvarchar(20)),5) 'dateOn',
LEFT(CAST(CAST(SL.DATE_OFF AS TIME) AS nvarchar(20)),5) 'dateOff',
LEFT(CAST(CAST((SL.DATE_OFF - SL.DATE_ON) AS TIME) AS nvarchar(20)),5) 'dateRun',
SL.QUANTITY quantityTH,
M.QUANTITY quantityLT,
M.WORKERS workers,
(SL.QUANTITY * 10000)/((((DATEPART(HOUR, (SL.DATE_OFF - SL.DATE_ON))*60 + DATEPART(MINUTE, (SL.DATE_OFF - SL.DATE_ON)))*100)/480)*(M.QUANTITY/M.WORKERS)) rate
from prod.SLCN SL
LEFT JOIN base.ACCOUNT A ON A.ID = SL.WORKER_ID
LEFT JOIN prod.MACHINE M ON M.ID = SL.MACHINE_ID
LEFT JOIN base.DEPARTMENT D ON D.ID = M.DEPARTMENT_ID
LEFT JOIN base.ITEM I ON I.ID = SL.ITEM_ID





`
module.exports = slcn