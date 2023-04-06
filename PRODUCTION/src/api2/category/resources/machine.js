const express = require('express')
const machine = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')
const m2 = require('./../../../core/m2')




machine.get('/', (req, res, next) => {
    new mssql.Request()
        .query(getAllMachine, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/item', (req, res, next) => {
    new mssql.Request()
        .query(getAllItem, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.post('/report-machine', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('accountId', req.body.accountId)
            .input('machineId', req.body.machineId)
            .input('CODE', req.body.CODE)
            .input('startTime', req.body.startTime)
            .input('factoryId', req.body.factoryId)
            .query(insertReportMachine, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

machine.get('/active', (req, res, next) => {
    new mssql.Request()
        .query(getMachineActive, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.post('/update-report', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('datetimeOut', req.body.datetimeOut)
            .input('actualOutput', parseInt(req.body.actualOutput))
            .input('id', req.body.id)
            .input('volumn', req.body.volumn)
            .input('length', req.body.length)
            .query(updateReportMachine, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

machine.get('/working', (req, res, next) => {
    new mssql.Request()
        .input('machineId', req.query.machineId)
        .query(getReportMachineByMachineId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/san-luong-may', (req, res, next) => {
    const {
        fromDate = moment(),
            toDate = moment()
    } = req.body
    new mssql.Request()
        .input('from', fromDate)
        .input('to', toDate)
        .query(getReportSanLuongMay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/show-report-by-accountId', (req, res, next) => {
    new mssql.Request()
        .input('accountId', req.query.accountId)
        .query(getReportMachineByAccountId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/department', (req, res, next) => {
    new mssql.Request()
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(getAllDepartment, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/departmentByFactoryId', (req, res, next) => {
    new mssql.Request()
        .input('code', req.query.code)
        .query(getDepartmentByFactoryId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/show', (req, res, next) => {
    new mssql.Request()
        .query(getAllMachine, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


machine.post('/add', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('machineId', req.body.machineId)
            .input('NAME', req.body.NAME)
            .input('outputTheory', req.body.outputTheory)
            .input('md_h', req.body.md_h)
            .input('departmentId', req.body.departmentId)
            .input('numberWorker', req.body.numberWorker)
            .query(addMachine, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
machine.get('/machineByFactoryId', (req, res, next) => {
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(getMachineByFactoryId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/', (req, res, next) => {
    m2.machine.create(req.body)
        .then(data => {
            res.api.sendData([])
        })
})






machine.delete('/:id', (req, res, next) => {

})



machine.put('/:id', (req, res, next) => {
    m2.machine.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        .then(instance => res.api.sendData([]))
        .catch(err => res.api.sendFail(getErrorMessage(4907)))
})

const getAllMachine = `
SELECT FM.id, machineId, FM.NAME, outputTheory, md_h, D.NAME departmentName, numberWorker, FM.factoryId 
FROM prod.FactoryMachine FM INNER JOIN base.DEPARTMENT D ON FM.departmentId = D.ID`
const getAllDepartment = `SELECT ID, NAME FROM base.DEPARTMENT where TYPE2 = 'department'`
const getDepartmentByFactoryId = `SELECT ID, NAME FROM base.DEPARTMENT where TYPE2 = 'department' AND NAME LIKE '%('+ @code + ')'`
const addMachine = `
INSERT INTO prod.FactoryMachine(machineId, NAME, outputTheory, md_h, departmentId, numberWorker)
VALUES (@machineId, @NAME, @outputTheory, @md_h, @departmentId, @numberWorker)`
    //st getAllMachine = `SELECT machineId, NAME, outputTheory, md_h, departmentId, numberWorker FROM prod.FactoryMachine`
    //const getAllDepartment = `SELECT ID, NAME FROM base.DEPARTMENT`
const getAllItem = `SELECT ID, NAME, VOLUMN, LENGTH  FROM base.ITEM`
const insertReportMachine = `
INSERT INTO prod.[ReportFactoryMachine](accountId, machineId, CODE, datetimeIn, factoryId)
VALUES (@accountId, @machineId, @CODE, @startTime, @factoryId)
`
const getMachineActive = `
SELECT id, datetimeIn FROM prod.[ReportFactoryMachine] WHERE datetimeOut is null
`
const getReportSanLuongMay = `
SELECT 
CASE
WHEN QR.factoryId = 100000 THEN N'Thuận Hưng'
WHEN QR.factoryId = 100003 THEN N'NM CBG Yên Sơn 1A'
WHEN QR.factoryId = 100004 THEN N'NM CBG Yên Sơn 1B'
WHEN QR.factoryId = 100005 THEN N'NM CBG Thái Bình'
END AS nhaMay, 
M.NAME MACHINE_NAME, 
I.NAME, 
SUM(QR.volumn) M3, 
SUM(QR.Md) Md,
SUM(QR.totalTime) as tgLam,
SUM(QR.actualOutput) AS actualOutput,
ROUND(SUM(QR.volumn)/SUM(QR.totalTime),4) as M3_h,
ROUND(SUM(QR.Md)/SUM(QR.totalTime), 4) Md_h,
ROUND((SUM(QR.volumn))/(SUM(QR.totalTime)*M.outputTheory*I.VOLUMN), 2) as tyLeM3,
ROUND(SUM(QR.Md)/(SUM(QR.totalTime)*M.md_h),2) as tyLeMd,
MIN(QR.datetimeIn) AS StartTime,
MAX(QR.datetimeOut) AS EndTime
FROM
prod.ReportFactoryMachine QR 
INNER JOIN prod.FactoryMachine M ON QR.machineId = M.machineId
INNER JOIN base.ITEM I ON QR.CODE = I.ID
WHERE QR.datetimeIn BETWEEN @from AND @to
GROUP BY
QR.factoryId,
I.NAME,
M.outputTheory,
I.VOLUMN,
M.NAME,
M.md_h
`

const getReportMachineByMachineId = `
select accountId from prod.[ReportFactoryMachine] where machineId = @machineId and datetimeOut is null
`
const getReportMachineByAccountId = `
select id, machineId, CODE, datetimeIn, factoryId from prod.[ReportFactoryMachine] where accountId = @accountId and datetimeOut is null
`
const getMachineByFactoryId = `SELECT machineId, NAME FROM prod.FactoryMachine WHERE factoryId = @factoryId`
const updateReportMachine = `
UPDATE prod.ReportFactoryMachine 
SET 
datetimeOut = @datetimeOut, 
actualOutput = @actualOutput,  
volumn = @volumn*@actualOutput, 
totalTime = ROUND(DATEDIFF(MINUTE,datetimeIn,@datetimeOut)/cast(60 as float), 2),
Md = (@length*@actualOutput)/1000
WHERE id = @id
`

const getMachine = `select 
M.ID id,
M.CODE code,
M.NAME name,
M.QUANTITY quantity,
D.NAME departmentId,
M.WORKERS workers
from prod.MACHINE M
left join base.DEPARTMENT D ON D.ID = M.DEPARTMENT_ID`
module.exports = machine