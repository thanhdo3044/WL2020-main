const {mssqlExcutedQuery} = require('../config/database')
const express = require('express')
const machine = express.Router()
const mssql = require('mssql')
const {
    errorMessage,
    getErrorMessage
} = require('./../core/config')

machine.get('/', (req, res, next) => {
    new mssql.Request()
        .query(getAllMachine, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/machine-by-factoryId', (req, res, next) => {
    new mssql.Request()
    .input('factoryId', req.query.factoryId)
        .query(getMachineByFactoryId2, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/items', (req, res, next) => {
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
            .input('STANDARD_POWER', req.body.STANDARD_POWER)
            .query(insertReportMachine, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

machine.post('/cong-suat-may', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('machineId', req.body.machineId)
            .input('itemId', req.body.itemId)
            .input('optimalCapacity', req.body.optimalCapacity)
            .input('accountId', req.body.accountId)
            .query(insertCongSuatMay, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

machine.put('/cong-suat-may/:id', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('id', req.params.id)
            .input('machineId', req.body.machineId)
            .input('NAME', req.body.NAME)
            .input('departmentId', req.body.departmentId)
            .input('importantFactor', req.body.importantFactor)
            .input('factoryId', req.body.factoryId)
            .input('outputTheory', req.body.outputTheory)
            .input('itemId', req.body.itemId)
            .input('itemIdOld', req.body.itemIdOld)
            .input('machineIdOld', req.body.machineIdOld)
            .input('optimalCapacity', req.body.optimalCapacity)
            .input('numberWorker', req.body.numberWorker)
            .query(updateMachine + updateCongSuatMay, (err, record) => {
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

machine.post('/hieu-suat-may', (req, res, next) => {
    const {
        fromDate = moment(),
            toDate = moment()
    } = req.body
    new mssql.Request()
        .input('from', fromDate)
        .input('to', toDate)
        .input('factoryId', req.body.factoryId)
        .query(getReportHieuSuatMay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/get-bao-duong-cap-3', (req, res, next) => {
  
    new mssql.Request()
        .input('month',req.body.month)
        .input('year',req.body.year)
        .input('factoryId', req.body.factoryId)
        .query(getngaybaoduongcap3, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/get-bao-duong-cap-1', (req, res, next) => {
  
    new mssql.Request()
        .input('month',req.body.month)
        .input('year',req.body.year)
        .input('factoryId', req.body.factoryId)
        .query(getReportbaoduongcap1, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/get-bao-duong-cap-2', (req, res, next) => {
  
    new mssql.Request()
        .input('month',req.body.month)
        .input('year',req.body.year)
        .input('factoryId', req.body.factoryId)
        .query(getReportbaoduongcap2, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/get-bao-duong-cap-1-loi', (req, res, next) => {
  
    new mssql.Request()
        .input('month',req.body.month)
        .input('year',req.body.year)
        .input('factoryId', req.body.factoryId)
        .query(getReportbaoduongcap1loi, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/get-bao-duong-cap-2-loi', (req, res, next) => {
  
    new mssql.Request()
        .input('month',req.body.month)
        .input('year',req.body.year)
        .input('factoryId', req.body.factoryId)
        .query(getReportbaoduongcap2loi, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/get-bao-duong-cap-3-loi', (req, res, next) => {
  
    new mssql.Request()
        .input('month',req.body.month)
        .input('year',req.body.year)
        .input('factoryId', req.body.factoryId)
        .query(getReportbaoduongcap3loi, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/get-bao-duong-cap-1-dat', (req, res, next) => {
  
    new mssql.Request()
        .input('month',req.body.month)
        .input('year',req.body.year)
        .input('factoryId', req.body.factoryId)
        .query(getReportbaoduongcap1dat, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/get-bao-duong-cap-2-dat', (req, res, next) => {
  
    new mssql.Request()
        .input('month',req.body.month)
        .input('year',req.body.year)
        .input('factoryId', req.body.factoryId)
        .query(getReportbaoduongcap2dat, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.post('/su-co-may', (req, res, next) => {
    const {
        fromDate = moment(),
            toDate = moment()
    } = req.body
    new mssql.Request()
        .input('from', fromDate)
        .input('to', toDate)
        .input('factoryId', req.body.factoryId)
        .query(getReportSuCoMay, (err, record) => {
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
        .input('factoryId', req.query.factoryId)
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
            .input('departmentId', req.body.departmentId)
            .input('factoryId', req.body.factoryId)
            .input('importantFactor', req.body.importantFactor)
            .input('accountId', req.body.accountId)
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
        .input('starTime', req.query.starTime)
        .input('endTime', req.query.endTime)
        .query(getMachineByFactoryId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.get('/machinecap2', (req, res, next) => {
    new mssql.Request()
        .input('cap', req.query.cap)
  
        .query(getkiemtramaycap2, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.get('/getmuckiemtramaycap2', (req, res, next) => {
    new mssql.Request()
        .input('cap', req.query.cap)
        .input('MANHOMMAY', req.query.manhommay)
        .query(getmuckiemtramay2, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.get('/getmuckiemtramaycap3', (req, res, next) => {
    new mssql.Request()
        .input('cap', req.query.cap)
        .input('MANHOMMAY', req.query.manhommay)
        .input('phankiemtra', req.query.phankiemtra)
        .query(getmuckiemtramay3, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.get('/getdulieumuckiemtramaycap2', (req, res, next) => {
    new mssql.Request()
        .input('week', req.query.week)
        .input('nam', req.query.nam)
        .input('factoryId', req.query.factoryId)
        .input('tenMay', req.query.tenMay)
        .query(getdulieumuckiemtramay2, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.get('/kiem-tra-may-day', (req, res, next) => {
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('starTime', req.query.starTime)
        .input('endTime', req.query.endTime)
        .input('tenMay', req.query.tenMay)
        .query(getkiemtramayFactoryId, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.get('/kiem-tra-may-cap-3', (req, res, next) => {
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('starTime', req.query.starTime)
        .input('endTime', req.query.endTime)
        .input('tenMay', req.query.tenMay)
        .input('phankiemtra', req.query.phankiemtra)
        .input('month', req.query.month)
        .input('year', req.query.year)
        .query(getkiemtramaydulieucap3, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
// machine.post('/', (req, res, next) => {
//     m2.machine.create(req.body)
//         .then(data => {
//             res.api.sendData([])
//         })
// })






machine.delete('/:id', async(req, res, next) => {
    const code = await new mssql.Request()
    .input('id', req.params.id)
    .query(`
    DELETE FROM prod.FactoryMachine WHERE id = @id
`, (err, record) => {
    if (err) return res.api.sendFail(query);
    res.api.sendData(record.recordset);
})
})



machine.put('/:id', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('id', req.params.id)
            .input('machineId', req.body.machineId)
            .input('NAME', req.body.NAME)
            .input('departmentId', req.body.departmentId)
            .input('outputTheory', req.body.outputTheory)
            .input('importantFactor', req.body.importantFactor)
            .input('factoryId', req.body.factoryId)
            .input('numberWorker', req.body.numberWorker)
            .query(updateMachine, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

machine.post('/cong-suat-may-chung', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('machineId', req.body.machineId)
            .input('outputTheory', req.body.outputTheory)
            .query(updateCongSuatChung, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

machine.post('/add-managed-machine-trouble', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('machineId', req.body.machineId)
            .input('type', req.body.type)
            .input('starTime', req.body.starTime)
            .input('createdBy', req.body.createdBy)
            .input('factoryId', req.body.factoryId)
            .query(addManagedMachineTrouble, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
machine.post('/add-managed-machine-day', (req, res, next) => {
    const data = req.body.data
    data.forEach(element => {
        if (element.status) {
        const query = `INSERT INTO   [prod].[BD_MAY_CAP1] ([KT_ID]
            ,[MUC_KIEM_TRA],[CREATE_BY],[CREATE_DATE],[factoryId]
            ,[TRANGTHAI],MACHINE_ID) 
        VALUES ('${element.id}',N'${element.require}','${req.body.createdBy}','${req.body.starTime}',
        '${req.body.factoryId}', '${element.status}','${req.body.machineId}'
        )`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
        } else {
            const query = `INSERT INTO   [prod].[BD_MAY_CAP1] ([KT_ID]
                ,[MUC_KIEM_TRA],[CREATE_BY],[CREATE_DATE],[factoryId]
                ,[TRANGTHAI],MACHINE_ID,NGUYENNHAN,CACHKHACPHUC,THOIGIAN,GHICHU) 
            VALUES ('${element.id}',N'${element.require}','${req.body.createdBy}','${req.body.starTime}',
            '${req.body.factoryId}', '${element.status}','${req.body.machineId}',N'${element.nguyennhan}',
            N'${element.cachkhacphuc}', N'${element.thoigian}', N'${element.ghichu}'
            )`
        
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    }
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
    
})
machine.post('/add-managed-machine-cap-3', (req, res, next) => {
    const data = req.body.data
    data.forEach(element => {
        if (element.status) {
        const query = `INSERT INTO   [prod].[BD_MAY_CAP3] (
            [MUC_KIEM_TRA],[CREATE_BY],[CREATE_DATE],[factoryId]
            ,[TRANGTHAI],MACHINE_ID,PHANKIEMTRA) 
        VALUES (N'${element.require}','${req.body.createdBy}','${req.body.starTime}',
        '${req.body.factoryId}', '${element.status}','${req.body.machineId}','${req.body.phankiemtra}'
        )`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
        } else {
            const query = `INSERT INTO   [prod].[BD_MAY_CAP3] (
                [MUC_KIEM_TRA],[CREATE_BY],[CREATE_DATE],[factoryId]
                ,[TRANGTHAI],MACHINE_ID,NGUYENNHAN,CACHKHACPHUC,THOIGIAN,GHICHU,PHANKIEMTRA) 
            VALUES (N'${element.require}','${req.body.createdBy}','${req.body.starTime}',
            '${req.body.factoryId}', '${element.status}','${req.body.machineId}',N'${element.nguyennhan}',
            N'${element.cachkhacphuc}', N'${element.thoigian}', N'${element.ghichu}','${req.body.phankiemtra}'
            )`
        
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    }
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
    
})
machine.post('/add-managed-machine-cap-2', (req, res, next) => {
    const data = req.body.data
    data.forEach(element => {
        if (element.status) {
        const query = `INSERT INTO   [prod].[BD_MAY_CAP2] (
            [MUC_KIEM_TRA],[CREATE_BY],[CREATE_DATE],[factoryId]
            ,[TRANGTHAI],MACHINE_ID,YEAR,WEEK) 
        VALUES (N'${element.require}','${req.body.createdBy}',GETDATE(),
        '${req.body.factoryId}', '${element.status}','${req.body.machineId}',${req.body.nam},${req.body.week}
        )`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
        } else {
            const query = `INSERT INTO   [prod].[BD_MAY_CAP2] (
                [MUC_KIEM_TRA],[CREATE_BY],[CREATE_DATE],[factoryId]
                ,[TRANGTHAI],MACHINE_ID,NGUYENNHAN,CACHKHACPHUC,THOIGIAN,GHICHU,WEEK,YEAR) 
            VALUES (N'${element.require}','${req.body.createdBy}',GETDATE(),
            '${req.body.factoryId}', '${element.status}','${req.body.machineId}',N'${element.nguyennhan}',
            N'${element.cachkhacphuc}', N'${element.thoigian}', N'${element.ghichu}',${req.body.week},${req.body.nam}
            )`
        
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    }
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
    
})
machine.post('/add-managed-machine-maintenance', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('machineId', req.body.machineId)
            .input('type', req.body.type)
            .input('starTime', req.body.starTime)
            .input('createdBy', req.body.createdBy)
            .input('factoryId', req.body.factoryId)
            .input('description', req.body.description)
            .input('intendTime', req.body.intendTime)
            .query(addManagedMachineMaintenance, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
machine.post('/update-managed-machine-day', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('machineId', req.body.tenMay)
            .input('endTime', req.body.endTime)
            .input('starTime', req.body.starTime)
            .input('factoryId', req.body.factoryId)
            .input('createdBy', req.body.createdBy)
            .query(updateManagedMachineday, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
machine.post('/update-managed-machine-cap-2', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('machineId', req.body.tenMay)
            .input('week', req.body.week)
            .input('nam', req.body.nam)
            .input('factoryId', req.body.factoryId)
            .input('createdBy', req.body.createdBy)
            .query(updateManagedMachinecap2, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
machine.post('/update-managed-machine-cap-3', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
            .input('machineId', req.body.tenMay)
            .input('starTime', req.body.starTime)
            .input('endTime', req.body.endTime)
            .input('factoryId', req.body.factoryId)
            .input('createdBy', req.body.createdBy)
            .input('phankiemtra', req.body.phankiemtra)
            .query(updateManagedMachinecap3, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
machine.get('/managed-machine', (req, res, next) => {
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(getManagedMachines, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/cong-suat-may', (req, res, next) => {
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(getHieuSuatMay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/cong-suat-may-by-day', (req, res, next) => {
    new mssql.Request()
        .input('from', req.query.start)
        .input('to', req.query.end)
        .input('machineName', req.query.machineName)
        .query(getHieuSuatByDay, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/chart-md', (req, res, next) => {
    new mssql.Request()
        .input('from', req.query.start)
        .input('to', req.query.end)
        .input('machineName', req.query.machineName)
        .query(getChartMdReportMachine, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/chart-m3', (req, res, next) => {
    new mssql.Request()
        .input('from', req.query.start)
        .input('to', req.query.end)
        .input('machineName', req.query.machineName)
        .query(getChartM3ReportMachine, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/chart-sl', (req, res, next) => {
    new mssql.Request()
        .input('from', req.query.start)
        .input('to', req.query.end)
        .input('machineName', req.query.machineName)
        .query(getChartSLReportMachine, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
machine.get('/chart-md-month', (req, res, next) => {
    new mssql.Request()
        .input('from', req.query.start)
        .input('to', req.query.end)
        .input('machineName', req.query.machineName)
        .query(getChartMdReportMachineMonth, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/chart-m3-month', (req, res, next) => {
    new mssql.Request()
        .input('from', req.query.start)
        .input('to', req.query.end)
        .input('machineName', req.query.machineName)
        .query(getChartM3ReportMachineMonth, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/chart-sl-month', (req, res, next) => {
    new mssql.Request()
        .input('from', req.query.start)
        .input('to', req.query.end)
        .input('machineName', req.query.machineName)
        .query(getChartSLReportMachineMonth, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/machine-name', (req, res, next) => {
    new mssql.Request()
        .query(getMachineName, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.post('/update-managed-machine-trouble', (req, res, next) => {
    const query = `
    UPDATE prod.MANAGED_MACHINES
    SET [DESCRIPTION] = N'${req.body.description}', 
    PLAN_MAINTAIN = N'${req.body.planMaintain}', 
    INTEND_TIME = '${req.body.intendTime}', 
    AUDITOR_BY = ${req.body.accountId}, 
    AUDITOR_AT = GETDATE()
    WHERE ID = ${req.body.machineId}
    `;
    new mssql.Request()
        .query(query, (err, record) => {
            if (err)
                return res.api.sendFail(query)
            res.api.sendData(record.recordset)
        })
})

machine.put('/update-managed-machine-trouble/co-dien', (req, res, next) => {
    new mssql.Request()
        .input('accountId', req.body.accountId)
        .input('id', req.body.id)
        .query(updateTroubleCD, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.put('/update-managed-machine-trouble/factory', (req, res, next) => {
    new mssql.Request()
        .input('accountId', req.body.accountId)
        .input('id', req.body.id)
        .input('durationTime', req.body.durationTime)
        .input('machineId', req.body.machineId)
        .query(updateTroubleF, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


machine.get('/standard-power', (req, res, next) => {
    new mssql.Request()
    .input('machineId', req.query.machineId)
    .input('itemId', req.query.itemId)
        .query(getStandardPower, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

machine.get('/machine-maintain', (req, res, next) => {
    new mssql.Request()
        .query(getMachineMaintenance, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

const getAllMachine = `
SELECT FM.id, HSM.ITEM_ID,
FM.factoryId,
D.NAME DEPARTMENT_NAME
, FM.machineId, FM.NAME, I.NAME ITEM_NAME, FM.outputTheory, HSM.OPTIMAL_CAPACITY, FM.numberWorker, FM.IMPORTANT_FACTOR 
FROM prod.FactoryMachine FM
LEFT JOIN prod.HIEU_SUAT_MAY HSM ON FM.machineId = HSM.MACHINE_ID
LEFT JOIN base.ITEM I ON HSM.ITEM_ID = I.ID
LEFT JOIN base.DEPARTMENT D ON FM.departmentId = D.ID`

const getAllDepartment = `SELECT ID, NAME FROM base.DEPARTMENT where TYPE2 = 'department'`
const getDepartmentByFactoryId = `SELECT ID, NAME FROM base.DEPARTMENT where TYPE2 = 'to' and factoryId = @factoryId`
const addMachine = `
INSERT INTO prod.FactoryMachine(machineId, NAME, departmentId, factoryId, IMPORTANT_FACTOR, STATUS, CREATED_BY, CREATED_AT, numberWorker)
VALUES (@machineId, @NAME, @departmentId, @factoryId, @importantFactor, 'ok', @accountId, GETDATE(), @numberWorker)`
const updateMachine = `
UPDATE prod.FactoryMachine
SET 
machineId = @machineId,
NAME = @NAME,
factoryId = @factoryId,
departmentId = @departmentId,
outputTheory = @outputTheory,
IMPORTANT_FACTOR = @importantFactor,
numberWorker = @numberWorker
WHERE id = @id
UPDATE prod.ReportFactoryMachine SET STANDARD_POWER = @outputTheory
WHERE machineId = @machineId
`
const updateCongSuatChung = `
UPDATE prod.FactoryMachine
SET 
outputTheory = @outputTheory
WHERE machineId = @machineId
`
const getAllItem = `SELECT ID, NAME, VOLUMN, LENGTH  FROM base.ITEM`
const insertReportMachine = `
INSERT INTO prod.[ReportFactoryMachine](accountId, machineId, CODE, datetimeIn, factoryId, STANDARD_POWER)
VALUES (@accountId, @machineId, @CODE, @startTime, @factoryId, @STANDARD_POWER)
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
QR.factoryId as factoryId,
M.NAME MACHINE_NAME, 
I.NAME, 
SUM(QR.volumn) M3, 
SUM(QR.Md) Md,
SUM(QR.totalTime) as tgLam,
SUM(QR.actualOutput) AS actualOutput,
ROUND(SUM(QR.volumn)/SUM(QR.totalTime),4) as M3_h,
ROUND(SUM(QR.Md)/SUM(QR.totalTime), 4) Md_h,
ROUND(SUM(QR.Md)/(SUM(QR.totalTime)*QR.STANDARD_POWER),2) as tyLeMd,
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
QR.STANDARD_POWER,
I.VOLUMN,
M.NAME
`

const getReportHieuSuatMay = `
SELECT FM.NAME, I.NAME ITEM_NAME, I.LENGTH, I.WIDTH, I.HEIGHT, RFM.STANDARD_POWER, 
SUM(RFM.actualOutput) actualOutput, SUM(RFM.Md) Md, SUM(RFM.volumn) volumn, 
SUM(RFM.totalTime) totalTime, SUM(RFM.Md)/(STANDARD_POWER*SUM(RFM.totalTime)) AS HSSD, 
CONVERT(VARCHAR, RFM.datetimeIn, 23) AS DATETIME_IN 
FROM prod.ReportFactoryMachine RFM
INNER JOIN prod.FactoryMachine FM ON RFM.machineId = FM.machineId
INNER JOIN base.ITEM I ON RFM.CODE = I.ID
WHERE RFM.datetimeIn BETWEEN @from AND @to AND RFM.factoryId = @factoryId
GROUP BY FM.NAME, I.NAME, I.LENGTH, I.WIDTH, I.HEIGHT, RFM.STANDARD_POWER, RFM.datetimeIn
`
const getngaybaoduongcap3 = `
select *, CONVERT(varchar,DATEPART(day,CREATE_DATE)) + '/'+CONVERT(varchar,DATEPART(month,CREATE_DATE))+'/'+
CONVERT(varchar,DATEPART(year,CREATE_DATE)) as ngaykt,DATEPART(day,CREATE_DATE) ngay,DATEPART(month,CREATE_DATE) thang
,DATEPART(year,CREATE_DATE) nam,DATEPART(day,SX_VERIFY_DATE) ngaysx,DATEPART(month,SX_VERIFY_DATE) thangsx,DATEPART(year,SX_VERIFY_DATE) namsx from 
[prod].[BD_MAY_CAP3]  where factoryId = @factoryId and DATEPART(month,CREATE_DATE) = @month and DATEPART(year,CREATE_DATE) = @year
and SX_VERIFY_BY is not null and TRANGTHAI = 1
`
const getReportbaoduongcap1 = `
select *,CONCAT(mamay,' - ',tenmay) mamayten from [dbo].[View_BD_CAP_1]  where factoryId = @factoryId and thang = @month and nam = @year
`
const getReportbaoduongcap2 = `
select *,manhommay mamayten from [dbo].[View_BD_CAP_2]  where factoryId = @factoryId  and nam = @year
`
const getReportbaoduongcap1loi = `
select KT.CACH_KIEM_TRA, M.machineId mamay, M.NAME tenmay, BD.*,CONVERT(varchar,DATEPART(day,BD.CREATE_DATE)) + '/'+CONVERT(varchar,DATEPART(month,BD.CREATE_DATE))+'/'+
CONVERT(varchar,DATEPART(year,BD.CREATE_DATE)) as ngaykt from [prod].[BD_MAY_CAP1] BD
left join [prod].[FactoryMachine] M on M.machineId = BD.MACHINE_ID
left join prod.BD_MAY_MUC_KIEM_TRA KT on KT.KT_ID = BD.KT_ID
where BD.factoryId = @factoryId and DATEPART(month,BD.CREATE_DATE) = @month and TRANGTHAI = 0 and DATEPART(year,BD.CREATE_DATE) = @year
and BD.NGUYENNHAN is not null
`
const getReportbaoduongcap2loi = `
select   * from [prod].[BD_MAY_CAP2] BD
where BD.factoryId = @factoryId and  TRANGTHAI = 0 and YEAR = @year
and BD.NGUYENNHAN is not null and BD.NGUYENNHAN != 'null'
`
const getReportbaoduongcap3loi = `
select   * ,CONVERT(varchar,DATEPART(day,CREATE_DATE)) + '/'+CONVERT(varchar,DATEPART(month,CREATE_DATE))+'/'+
CONVERT(varchar,DATEPART(year,CREATE_DATE)) as ngaykt
from [prod].[BD_MAY_CAP3] BD
where BD.factoryId = @factoryId and  TRANGTHAI = 0 and DATEPART(month,BD.CREATE_DATE) = @month and DATEPART(year,BD.CREATE_DATE) = @year
and BD.NGUYENNHAN is not null and BD.NGUYENNHAN != 'null' 
`
const getReportbaoduongcap1dat = `
select M.NAME tenmay,AC.LAST_NAME codien,AC1.LAST_NAME sx, BD.*,CONVERT(varchar,DATEPART(day,BD.CREATE_DATE)) + '/'+CONVERT(varchar,DATEPART(month,BD.CREATE_DATE))+'/'+
CONVERT(varchar,DATEPART(year,BD.CREATE_DATE)) as ngaykt ,DATEPART(day,BD.CREATE_DATE) ngay,DATEPART(month,BD.CREATE_DATE) thang,
DATEPART(year,BD.CREATE_DATE) nam,DATEPART(day,BD.SX_VERIFY_DATE) ngaysx,DATEPART(month,BD.SX_VERIFY_DATE) thangsx,DATEPART(year,BD.SX_VERIFY_DATE) namsx
from [prod].[BD_MAY_CAP1] BD
left join [prod].[FactoryMachine] M on M.machineId = BD.MACHINE_ID
left join base.ACCOUNT AC on AC.ID = BD.CREATE_BY
left join base.ACCOUNT AC1 on AC1.ID = BD.SX_VERIFY_BY
where BD.factoryId = @factoryId and DATEPART(month,BD.CREATE_DATE) = @month and DATEPART(year,BD.CREATE_DATE) = @year and BD.SX_VERIFY_DATE is not null
`
const getReportbaoduongcap2dat = `
select AC.LAST_NAME codien,AC1.LAST_NAME sx, BD.*,CONVERT(varchar,DATEPART(day,BD.CREATE_DATE)) + '/'+CONVERT(varchar,DATEPART(month,BD.CREATE_DATE))+'/'+
CONVERT(varchar,DATEPART(year,BD.CREATE_DATE)) as ngaykt ,DATEPART(day,BD.CREATE_DATE) ngay,DATEPART(month,BD.CREATE_DATE) thang,
DATEPART(year,BD.CREATE_DATE) nam,DATEPART(day,BD.SX_VERIFY_DATE) ngaysx,DATEPART(month,BD.SX_VERIFY_DATE) thangsx,DATEPART(year,BD.SX_VERIFY_DATE) namsx
from [prod].[BD_MAY_CAP2] BD

left join base.ACCOUNT AC on AC.ID = BD.CREATE_BY
left join base.ACCOUNT AC1 on AC1.ID = BD.SX_VERIFY_BY
where BD.factoryId = @factoryId  and YEAR = @year and BD.SX_VERIFY_DATE is not null
`
const getReportSuCoMay = `
SELECT MM.MACHINE_ID, FM.NAME, MM.TYPE, MM.DESCRIPTION, MM.PLAN_MAINTAIN, MM.DURATION_TIME*FM.IMPORTANT_FACTOR as DURATION_TIME, MM.START_TIME, MM.END_TIME, A.LAST_NAME , FM.IMPORTANT_FACTOR
FROM prod.MANAGED_MACHINES MM
INNER JOIN prod.FactoryMachine FM ON MM.MACHINE_ID = FM.machineId
INNER JOIN base.ACCOUNT A ON MM.CREATED_BY = A.ID
WHERE MM.CREATED_AT BETWEEN @from AND @to AND MM.FACTORY_ID = @factoryId AND MM.END_TIME IS NOT NULL
`

const getReportMachineByMachineId = `
select accountId from prod.[ReportFactoryMachine] where machineId = @machineId and datetimeOut is null
`
const getReportMachineByAccountId = `
select id, machineId, CODE, datetimeIn, factoryId from prod.[ReportFactoryMachine] where accountId = @accountId and datetimeOut is null
`
const getMachineByFactoryId = `
SELECT DISTINCT machineId, NAME, MM.CREATE_BY,SX_VERIFY_BY
FROM prod.FactoryMachine fm
LEFT JOIN 
(SELECT * FROM prod.BD_MAY_CAP1 WHERE CREATE_DATE BETWEEN @starTime and @endTime )
MM 
ON FM.machineId = MM.MACHINE_ID and fm.factoryId = MM.factoryId
WHERE fm.factoryId = @factoryId 
`
const getkiemtramayFactoryId = `
SELECT * FROM prod.BD_MAY_CAP1 WHERE CREATE_DATE BETWEEN @starTime and @endTime 
and factoryId = @factoryId and MACHINE_ID = @tenMay
`
const getkiemtramaydulieucap3 = `
SELECT * FROM prod.BD_MAY_CAP3 WHERE DATEPART(month,CREATE_DATE) = @month and DATEPART(year,CREATE_DATE) = @year
and factoryId = @factoryId and MACHINE_ID = @tenMay and PHANKIEMTRA =@phankiemtra
`
const getkiemtramaycap2 = `
SELECT  DISTINCT NHOMMAY,MANHOMMAY FROM prod.BD_MAY_MUC_KIEM_TRA WHERE cap = @cap
`
const getmuckiemtramay2 = `
SELECT  * FROM prod.BD_MAY_MUC_KIEM_TRA WHERE cap = @cap and MANHOMMAY = @MANHOMMAY
`
const getmuckiemtramay3 = `
SELECT  * FROM prod.BD_MAY_MUC_KIEM_TRA WHERE cap = @cap and MANHOMMAY = @MANHOMMAY and PHANKIEMTRA = @phankiemtra
`
const getdulieumuckiemtramay2 = `
SELECT  * FROM prod.BD_MAY_CAP2 WHERE WEEK = @week and YEAR = @nam and MACHINE_ID = @tenMay and factoryId = @factoryId
`
const getMachineByFactoryId2 = `
select id, machineId, NAME from prod.FactoryMachine where factoryId = @factoryId
`
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

const addManagedMachineTrouble = `
INSERT INTO prod.MANAGED_MACHINES (MACHINE_ID, TYPE, START_TIME, CREATED_BY, FACTORY_ID)
VALUES (@machineId, @type, @starTime, @createdBy, @factoryId)
UPDATE prod.FactoryMachine SET STATUS = @type WHERE machineId = @machineId
`
const addManagedMachineMaintenance = `
INSERT INTO prod.MANAGED_MACHINES (MACHINE_ID, TYPE, START_TIME, CREATED_BY, FACTORY_ID, [DESCRIPTION], INTEND_TIME, AUDITOR_BY, AUDITOR_AT)
VALUES (@machineId, @type, @starTime, @createdBy, @factoryId, @description, @intendTime, @createdBy, GETDATE())
UPDATE prod.FactoryMachine SET STATUS = @type WHERE machineId = @machineId
`
const updateManagedMachineday = `
update [prod].[BD_MAY_CAP1] 
set SX_VERIFY_BY = @createdBy,SX_VERIFY_DATE = GETDATE()
where MACHINE_ID = @machineId and CREATE_DATE BETWEEN @starTime and @endTime
and factoryId = @factoryId
`
const updateManagedMachinecap2 =  `
update [prod].[BD_MAY_CAP2] 
set SX_VERIFY_BY = @createdBy,SX_VERIFY_DATE = GETDATE()
where MACHINE_ID = @machineId and YEAR =@nam and WEEK =@week
and factoryId = @factoryId
`
const updateManagedMachinecap3 =  `
update [prod].[BD_MAY_CAP3] 
set SX_VERIFY_BY = @createdBy,SX_VERIFY_DATE = GETDATE()
where MACHINE_ID = @machineId and CREATE_DATE BETWEEN @starTime and @endTime
and factoryId = @factoryId and PHANKIEMTRA = @phankiemtra
`
const getManagedMachines = `
SELECT MM.ID, FM.NAME, MM.INTEND_TIME, MM.DESCRIPTION, MM.PLAN_MAINTAIN, MM.START_TIME, A.LAST_NAME, MM.CREATED_AT, 
MM.AUDITOR_BY, MM.CD_VERIFY_BY, MM.F_VERIFY_BY, FM.machineId, MM.TYPE
FROM prod.MANAGED_MACHINES MM
INNER JOIN prod.FactoryMachine FM ON MM.MACHINE_ID = FM.machineId
INNER JOIN base.ACCOUNT A ON MM.CREATED_BY = A.ID
WHERE  MM.F_VERIFY_BY IS NULL AND FM.factoryId = @factoryId
`

const updateTroubleCD = `
UPDATE prod.MANAGED_MACHINES
SET CD_VERIFY_BY = @accountId, CD_VERIFY_AT = GETDATE()
WHERE ID = @id
`
const updateTroubleF = `
UPDATE prod.MANAGED_MACHINES
SET F_VERIFY_BY = @accountId, F_VERIFY_AT = GETDATE(), DURATION_TIME = @durationTime, END_TIME = GETDATE()
WHERE ID = @id
UPDATE prod.FactoryMachine SET STATUS = 'ok' WHERE machineId = @machineId
`

const getHieuSuatMay = `
SELECT FM.machineId ,FM.NAME MACHINE_NAME, I.NAME ITEM_NAME, HS.OPTIMAL_CAPACITY, FM.numberWorker 
FROM prod.HIEU_SUAT_MAY HS
INNER JOIN prod.FactoryMachine FM ON HS.MACHINE_ID = FM.machineId
INNER JOIN base.ITEM I ON HS.ITEM_ID = I.ID
WHERE FM.factoryId = @factoryId
`
const insertCongSuatMay = `
INSERT INTO prod.HIEU_SUAT_MAY(MACHINE_ID, ITEM_ID, OPTIMAL_CAPACITY, CREATED_BY, CREATED_AT)
VALUES ( @machineId, @itemId, @optimalCapacity, @accountId, GETDATE())
UPDATE prod.ReportFactoryMachine SET STANDARD_POWER = @optimalCapacity
WHERE machineId = @machineId AND CODE = @itemId
`
const updateCongSuatMay = `
UPDATE prod.HIEU_SUAT_MAY
SET OPTIMAL_CAPACITY = @optimalCapacity, MACHINE_ID = @machineId, ITEM_ID = @itemId
WHERE MACHINE_ID = @machineIdOld AND ITEM_ID = @itemIdOld
UPDATE prod.ReportFactoryMachine SET STANDARD_POWER = @optimalCapacity
WHERE machineId = @machineId AND CODE = @itemId
`

const getHieuSuatByDay = `
select * from prod.View_hieu_suat_may where  CONVERT(date, DATETIME_IN) BETWEEN @from AND @to and MACHINE_NAME = @machineName
`
const getMachineName = `
select distinct NAME from prod.FactoryMachine
`

const getChartMdReportMachine = `
SELECT  DATETIME_IN, [100000], [100003], [100004], [100005]
FROM 
(
SELECT factoryId,
DATETIME_IN, Md
FROM
(
SELECT RFM.factoryId, RFM.Md,
CONVERT(varchar, RFM.datetimeIn, 23) AS DATETIME_IN
FROM prod.ReportFactoryMachine RFM
INNER JOIN base.ITEM I ON RFM.CODE = I.ID
LEFT JOIN prod.HIEU_SUAT_MAY HS ON RFM.machineId = HS.MACHINE_ID
INNER JOIN prod.FactoryMachine FM ON RFM.machineId = FM.machineId
WHERE RFM.datetimeIn BETWEEN @from AND @to AND RFM.datetimeOut IS NOT NULL AND FM.NAME = @machineName
) AS T
) AS BANG_NGUON
PIVOT
(
SUM(Md)
FOR factoryId IN ([100000], [100003], [100004], [100005])
) AS BANG_CHUYEN

`
const getChartM3ReportMachine = `
SELECT  DATETIME_IN, [100000], [100003], [100004], [100005]
FROM 
(
SELECT factoryId,
DATETIME_IN, volumn
FROM
(
SELECT RFM.factoryId, RFM.volumn,
CONVERT(varchar, RFM.datetimeIn, 23) AS DATETIME_IN
FROM prod.ReportFactoryMachine RFM
INNER JOIN base.ITEM I ON RFM.CODE = I.ID
LEFT JOIN prod.HIEU_SUAT_MAY HS ON RFM.machineId = HS.MACHINE_ID
INNER JOIN prod.FactoryMachine FM ON RFM.machineId = FM.machineId
WHERE RFM.datetimeIn BETWEEN @from AND @to AND RFM.datetimeOut IS NOT NULL AND FM.NAME = @machineName
) AS T
) AS BANG_NGUON
PIVOT
(
SUM(volumn)
FOR factoryId IN ([100000], [100003], [100004], [100005])
) AS BANG_CHUYEN

`
const getChartSLReportMachine = `
SELECT  DATETIME_IN, [100000], [100003], [100004], [100005]
FROM 
(
SELECT factoryId,
DATETIME_IN, actualOutput
FROM
(
SELECT RFM.factoryId, RFM.actualOutput,
CONVERT(varchar, RFM.datetimeIn, 23) AS DATETIME_IN
FROM prod.ReportFactoryMachine RFM
INNER JOIN base.ITEM I ON RFM.CODE = I.ID
LEFT JOIN prod.HIEU_SUAT_MAY HS ON RFM.machineId = HS.MACHINE_ID
INNER JOIN prod.FactoryMachine FM ON RFM.machineId = FM.machineId
WHERE RFM.datetimeIn BETWEEN @from AND @to AND RFM.datetimeOut IS NOT NULL AND FM.NAME = @machineName
) AS T
) AS BANG_NGUON
PIVOT
(
SUM(actualOutput)
FOR factoryId IN ([100000], [100003], [100004], [100005])
) AS BANG_CHUYEN

`
const getChartMdReportMachineMonth = `
SELECT  monthRFM, [100000], [100003], [100004], [100005]
FROM 
(
SELECT factoryId,
monthRFM, Md
FROM
(
SELECT RFM.factoryId, RFM.Md,
MONTH(RFM.datetimeIn) as monthRFM
FROM prod.ReportFactoryMachine RFM
INNER JOIN base.ITEM I ON RFM.CODE = I.ID
LEFT JOIN prod.HIEU_SUAT_MAY HS ON RFM.machineId = HS.MACHINE_ID
INNER JOIN prod.FactoryMachine FM ON RFM.machineId = FM.machineId
WHERE RFM.datetimeIn BETWEEN @from AND @to AND RFM.datetimeOut IS NOT NULL AND FM.NAME = @machineName
) AS T
) AS BANG_NGUON
PIVOT
(
SUM(Md)
FOR factoryId IN ([100000], [100003], [100004], [100005])
) AS BANG_CHUYEN

`
const getChartM3ReportMachineMonth = `
SELECT  monthRFM, [100000], [100003], [100004], [100005]
FROM 
(
SELECT factoryId,
monthRFM, volumn
FROM
(
SELECT RFM.factoryId, RFM.volumn,
MONTH(RFM.datetimeIn) as monthRFM
FROM prod.ReportFactoryMachine RFM
INNER JOIN base.ITEM I ON RFM.CODE = I.ID
LEFT JOIN prod.HIEU_SUAT_MAY HS ON RFM.machineId = HS.MACHINE_ID
INNER JOIN prod.FactoryMachine FM ON RFM.machineId = FM.machineId
WHERE RFM.datetimeIn BETWEEN @from AND @to AND RFM.datetimeOut IS NOT NULL AND FM.NAME = @machineName
) AS T
) AS BANG_NGUON
PIVOT
(
SUM(volumn)
FOR factoryId IN ([100000], [100003], [100004], [100005])
) AS BANG_CHUYEN

`
const getChartSLReportMachineMonth = `
SELECT  monthRFM, [100000], [100003], [100004], [100005]
FROM 
(
SELECT factoryId,
monthRFM, actualOutput
FROM
(
SELECT RFM.factoryId, RFM.actualOutput,
MONTH(RFM.datetimeIn) as monthRFM
FROM prod.ReportFactoryMachine RFM
INNER JOIN base.ITEM I ON RFM.CODE = I.ID
LEFT JOIN prod.HIEU_SUAT_MAY HS ON RFM.machineId = HS.MACHINE_ID
INNER JOIN prod.FactoryMachine FM ON RFM.machineId = FM.machineId
WHERE RFM.datetimeIn BETWEEN @from AND @to AND RFM.datetimeOut IS NOT NULL AND FM.NAME = @machineName
) AS T
) AS BANG_NGUON
PIVOT
(
SUM(actualOutput)
FOR factoryId IN ([100000], [100003], [100004], [100005])
) AS BANG_CHUYEN

`

const getStandardPower = `
SELECT OPTIMAL_CAPACITY FROM prod.HIEU_SUAT_MAY WHERE MACHINE_ID = @machineId AND ITEM_ID = @itemId
`

const getMachineMaintenance = `
SELECT m.[ID]
      ,m.[GUID]
      ,[MACHINE_ID]
	  ,f.[NAME] as MACHINE_NAME
      ,m.[TYPE]
	  ,FORMAT ([INTEND_TIME], 'dd-MM-yyyy') as [INTEND_TIME]
      ,[DESCRIPTION]
      ,[PLAN_MAINTAIN]
      ,[DURATION_TIME]
	   ,FORMAT ([START_TIME] , 'dd-MM-yyyy') as [START_TIME] 
      ,[END_TIME]
      ,m.[CREATED_BY]
      ,m.[CREATED_AT]
      ,[AUDITOR_BY]
      ,[AUDITOR_AT]
      ,[CD_VERIFY_BY]
      ,[CD_VERIFY_AT]
      ,[F_VERIFY_BY]
      ,[F_VERIFY_AT]
      ,[FACTORY_ID]
	  ,d.[NAME] as [FACTORY_NAME]
  FROM [prod].[MANAGED_MACHINES] m
  INNER JOIN base.DEPARTMENT d on m.FACTORY_ID = d.id
  INNER JOIN prod.FactoryMachine f on f.machineId = m.MACHINE_ID
`
module.exports = machine