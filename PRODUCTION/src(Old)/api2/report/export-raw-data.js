const XlsxPopulate = require('xlsx-populate')
const encode_cell = require('xlsx').utils.encode_cell
const mssql = require('mssql')

const express = require('express')
const router = express.Router()
const {
    getView_raw_data
} = require('./../../core/query')
const {
    getErrorMessage
} = require('./../../core/config')

Date.prototype.getWeekNumber = function() {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

router.get('/', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year || new Date().getFullYear())
        .input('WEEK', req.query.week || new Date().getWeekNumber())
        .query(getView_raw_data, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            let table = record.recordset.toTable()
            let header = []
            table.columns.forEach(e => {
                header.push(e.name)
            })
            let data = table.rows
            data.unshift(header)

            XlsxPopulate.fromBlankAsync()
                .then(async(workbook) => {
                    workbook.sheet(0).range(`A1:${encode_cell({
                c: data[0].length + 1,
                r: data.length + 1
            })}`).value(data)
                    const buf = await workbook.outputAsync()
                    res.setHeader('content-disposition', 'attachment; filename="Report.xlsx"')
                    res.setHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    res.attachment("Báo cáo.xlsx");
                    res.send(buf)
                })
        })
})

router.get('/raw', (req, res, next) => {
    new mssql.Request()
        .input('FACTORY_ID', req.query.factoryId)
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .query(`WITH temp(id)
        as (
                Select id
                From base.DEPARTMENT
                Where ID = @FACTORY_ID
                Union All
                Select b.id
                From temp as a, base.DEPARTMENT as b
                Where a.id = b.parent_id
        )
        Select *
        From temp D
		LEFT JOIN View_raw_data V ON V.DEPARTMENT_ID = D.ID
		WHERE [Ngày tạo] BETWEEN @FROM AND @TO`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.get('/week2', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('WEEK', req.query.week)
        .input('factoryId', req.query.factoryId)
        .query(getTyLeDongBo, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            let buf = []
            record.recordset.forEach(e => {
                if (buf.find(i => i.itemId == e.itemId && i.parentId == e.parentId && i.departmentId == e.departmentId)) {
                    buf.find(i => i.itemId == e.itemId && i.parentId == e.parentId && i.departmentId == e.departmentId)[e.dayOfWeek] = e.quantity
                } else {
                    buf.push({
                        year: e.year,
                        week: e.week,
                        departmentId: e.departmentId,
                        departmentName: e.departmentName,
                        itemId: e.itemId,
                        itemName: e.itemName,
                        parentId: e.parentId,
                        parentName: e.parentName,
                        volumn: e.volumn,
                        rate: e.rate,
                    })
                    buf.find(i => i.itemId == e.itemId && i.parentId == e.parentId && i.departmentId == e.departmentId)[e.dayOfWeek] = e.quantity
                }
            })
            buf.forEach((e, i) => {
                buf[i].tongSanLuong = (e['Thứ 2'] || 0) + (e['Thứ 3'] || 0) + (e['Thứ 4'] || 0) + (e['Thứ 5'] || 0) + (e['Thứ 6'] || 0) + (e['Thứ 7'] || 0)
            })
            req.buf = buf
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('WEEK', req.query.week)
        .query(getPO, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            req.buf.forEach((e, i) => {
                let po = record.recordset.find(i => i.itemId == e.itemId && i.stepId == e.departmentId) || {}
                req.buf[i].po = po.quantity || 0
                req.buf[i].number = po.number
                req.buf[i].tyLeDatKH = (e.tongSanLuong * 100) / (req.buf[i].po || 0) || 0
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('year', req.query.year)
        .input('week', req.query.week)
        .query(getTon, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            req.buf.forEach((e, i) => {
                let ton = record.recordset.find(i => i.itemId == e.itemId && i.stepId == e.departmentId) || {}
                req.buf[i].ton = ton.ton || 0
            })
            res.api.sendData(req.buf)
        })
})

router.get('/week3', (req, res, next) => {
    const {
        week,
        year
    } = req.query
    new mssql.Request()
        .input('week', week)
        .input('year', year)
        .query(queryWeek3, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})
router.get('/week4', (req, res, next) => {
    const {
        week,
        year,
        factoryId
    } = req.query
    new mssql.Request()
        .input('week', week)
        .input('year', year)
        .input('factoryId', factoryId)
        .query(queryBaoCaoTuan, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
router.get('/ty-le-dong-bo', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('WEEK', req.query.week)
        .input('DEPARTMENT_ID', req.query.departmentId)
        .query(getTyLeDongBo, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.get('/date', (req, res, next) => {
    new mssql.Request()
        .input('FROM', `${req.query.from} 00:00:00`)
        .input('TO', `${req.query.to} 23:59:59`)
        .query(getReportByDate, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset.filter(i => i.factoryId == req.query.factoryId))
        })
})


router.get('/week', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('WEEK', req.query.week)
        .query(getReportByWeek, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset.filter(i => i.factoryId == req.query.factoryId))
        })
})

router.get('/month', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('MONTH', req.query.month)
        .query(getReportByMonth, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset.filter(i => i.factoryId == req.query.factoryId))
        })
})

router.get('/order', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('MONTH', req.query.month)
        .input('FACTORY_ID', req.query.factoryId)
        .input('PRODUCTION_ORDERS_TYPE_ID', req.query.productionOrdersTypeId)
        .query(getReportByOrder, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
let getTon = `    select OS.DEPARTMENT_ID stepId, OS.ITEM_ID itemId, OS.QUANTITY ton
from prod.OPENING_STOCK OS
where YEAR(OS.[DATE]) = @year
and OS.WEEK = @week`

let getPO = `
SELECT 
PO.parent,
PO.code,
PO.stepId stepId,
PO.itemId itemId,
PO.quantity quantity,
PO.number
FROM prod.PO PO
WHERE [year] = @YEAR
and week = @WEEK
`

let getTyLeDongBo = `
SELECT *
FROM 
(
SELECT 
    CASE
        WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
        WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
        WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
        WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
        ELSE '-'
    END AS 'factoryId',
    CASE
        WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
        WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
        WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
        WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
        ELSE '-'
    END AS 'Nhà máy',
    CASE
        WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
        WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
        WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
        WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
        ELSE '-'
    END AS 'Kho/Xưởng',
    CASE
        WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
        WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
        WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
        WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
        ELSE '-'
    END AS 'Tổ',
    CASE
        WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
        WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
        WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
        WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
        ELSE '-'
    END AS 'Nhóm',
    A.departmentId,
    A.departmentCode,
    A.departmentName,
    A.[year],
    A.week,
    A.dayOfWeek,
    A.parentId,
    A.parentName,
    A.itemId,
    A.itemName,
    A.rate,
    A.volumn,
    A.quantity
FROM 
(
SELECT 
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentId
    ELSE DIM.departmentId
END AS departmentId,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentCode
    ELSE DIM.departmentCode
END AS departmentCode,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentName
    ELSE DIM.departmentName
END AS departmentName,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[year]
    ELSE DIM.[year]
END AS [year],
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[week]
    ELSE DIM.[week]
END AS [week],
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[dayOfWeek]
    ELSE DIM.[dayOfWeek]
END AS [dayOfWeek],
DIM.parentId,
DIM.parentName,
CASE 
    WHEN DT.itemId IS NULL THEN M.ID
    ELSE DT.itemId
END AS itemId,
CASE
    WHEN DT.itemId IS NULL THEN M.NAME
    ELSE DT.itemName
END AS itemName,
DIM.RATE rate,
CASE
    WHEN DT.itemId IS NULL THEN 0
    ELSE DT.volumn
END AS volumn,
CASE
    WHEN DT.itemId IS NULL THEN 0
    ELSE DT.quantity
END AS quantity
FROM (
    SELECT *
    FROM (
        SELECT 
        P.SOURCE_ID departmentId,
        D.[CODE] departmentCode,
        D.[NAME] departmentName,
        GD.[YEAR] [year],
        GD.WEEK week,
        IP.ID parentId,
        IP.NAME parentName
        FROM prod.PACKAGE P
        LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
        LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
        LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
        WHERE P.DESTINATION_ID <> 100078
        AND  P.DESTINATION_ID <> 100079
        AND  P.DESTINATION_ID <> 100080
        AND  P.DESTINATION_ID <> 100081
        AND GD.[YEAR] = @YEAR
        AND GD.WEEK = @WEEK
        --AND P.SOURCE_ID = @DEPARTMENT_ID
        AND IP.ID IS NOT NULL
        GROUP BY P.SOURCE_ID ,
        D.CODE,
        D.NAME ,
        GD.[YEAR] ,
        GD.WEEK ,
        IP.ID ,
        IP.NAME
    ) PR
    LEFT JOIN prod.BOM B ON B.ITEM_ID = PR.parentId
    LEFT JOIN (
        SELECT N'Thứ 2' dayOfWeek
        UNION ALL
        SELECT N'Thứ 3' dayOfWeek
        UNION ALL
        SELECT N'Thứ 4' dayOfWeek
        UNION ALL
        SELECT N'Thứ 5' dayOfWeek
        UNION ALL
        SELECT N'Thứ 6' dayOfWeek
        UNION ALL
        SELECT N'Thứ 7' dayOfWeek
    ) T ON 1 = 1
) DIM
FULL OUTER JOIN (
    SELECT 
    P.SOURCE_ID departmentId,
    D.[CODE] departmentCode,
    D.[NAME] departmentName,
    GD.[YEAR] [year],
    GD.WEEK week,
    GD.WEEK_DAY dayOfWeek,
    GD.DATE date,
    IP.ID parentId,
    IP.NAME parentName,
    B.RATE rate,
    IIP.ITEM_ID itemId,   
    I.NAME itemName,
    U.NAME unit,
    I.LENGTH length,
    I.WIDTH width,
    I.HEIGHT height,
    I.VOLUMN * SUM(IIP.QUANTITY) volumn,
    SUM(IIP.QUANTITY) quantity
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE P.DESTINATION_ID <> 100078
    AND  P.DESTINATION_ID <> 100079
    AND  P.DESTINATION_ID <> 100080
    AND  P.DESTINATION_ID <> 100081
    AND GD.[YEAR] = @YEAR
    AND GD.WEEK = @WEEK
    --AND P.SOURCE_ID = @DEPARTMENT_ID
    GROUP BY P.SOURCE_ID ,
    D.CODE,
    D.NAME ,
    GD.[YEAR] ,
    GD.WEEK ,
    GD.WEEK_DAY,
    GD.DATE ,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    U.NAME,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN
) DT ON DT.parentId = DIM.parentId AND DT.itemId = DIM.MATERIALS_ID AND DT.dayOfWeek = DIM.dayOfWeek
LEFT JOIN base.ITEM M ON M.ID = DIM.MATERIALS_ID
) A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.departmentId
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
) X
WHERE X.factoryId = @factoryId
`

let getReportByWeek2 = `SELECT 
P.SOURCE_ID departmentId,
D.[CODE] departmentCode,
D.[NAME] departmentName,
GD.[YEAR] [year],
GD.WEEK week,
GD.WEEK_DAY dayOfWeek,
GD.DATE date,
IP.ID parentId,
IP.NAME parentName,
B.RATE rate,
IIP.ITEM_ID itemId,   
I.NAME itemName,
U.NAME unit,
I.LENGTH length,
I.WIDTH width,
I.HEIGHT height,
I.VOLUMN * SUM(IIP.QUANTITY) volumn,
SUM(IIP.QUANTITY) quantity
FROM prod.PACKAGE P
LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
WHERE P.DESTINATION_ID <> 100078
AND  P.DESTINATION_ID <> 100079
AND  P.DESTINATION_ID <> 100080
AND  P.DESTINATION_ID <> 100081
AND GD.[YEAR] = @YEAR
AND GD.WEEK = @WEEK
AND P.SOURCE_ID = @DEPARTMENT_ID
GROUP BY P.SOURCE_ID ,
D.CODE,
D.NAME ,
GD.[YEAR] ,
GD.WEEK ,
GD.WEEK_DAY,
GD.DATE ,
IP.ID ,
IP.NAME ,
B.RATE ,
IIP.ITEM_ID ,   
I.NAME ,
U.NAME,
I.LENGTH ,
I.WIDTH ,
I.HEIGHT ,
I.VOLUMN`



let getReportByDate = `SELECT 
A.[YEAR] Năm,
A.WEEK Tuần,
A.WEEK_DAY Thứ,
A.[DAY] Ngày,
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
    WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
    WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
    WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
    ELSE '-'
END AS 'Nhóm',
A.ITEM_GROUP_NAME N'Nhóm sản phẩm',
A.RATE N'Tỷ lệ',
A.NAME N'Sản phẩm',
A.LENGTH Dài,
A.WIDTH Rộng,
A.HEIGHT Dày,
A.UNIT ,
A.VOLUMN N'Khối lượng',
CASE
    WHEN A.UNIT = 'M3' THEN 0
    ELSE A.QUANTITY
END AS N'Số lượng',
CASE
    WHEN A.UNIT = 'M3' THEN A.QUANTITY
    ELSE (A.VOLUMN * A.QUANTITY)
END AS N'Tổng khối lượng'
FROM (
    SELECT 
    GD.[YEAR] ,
    GD.WEEK ,
    GD.WEEK_DAY ,
    GD.DAY ,
    D.ID DEPARTMENT_ID,
    D.NAME DEPARTMENT_NAME,
    IP.NAME ITEM_GROUP_NAME,
    B.RATE ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN ,
    U.NAME 'UNIT',
    SUM(IIP.QUANTITY) QUANTITY
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE P.CREATE_DATE BETWEEN @FROM AND @TO
    GROUP BY P.SOURCE_ID ,
    D.ID,
    D.NAME ,
    GD.[YEAR] ,
    GD.WEEK ,
    GD.WEEK_DAY,
    GD.DAY ,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN,
    U.NAME
) AS A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID`


let getReportByWeek = `SELECT 
A.[YEAR] Năm,
A.WEEK Tuần,
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
    WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
    WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
    WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
    ELSE '-'
END AS 'Nhóm',
A.ITEM_GROUP_NAME N'Nhóm sản phẩm',
A.RATE N'Tỷ lệ',
A.NAME N'Sản phẩm',
A.LENGTH Dài,
A.WIDTH Rộng,
A.HEIGHT Dày,
A.VOLUMN N'Khối lượng',
A.UNIT ,
CASE
    WHEN A.UNIT = 'M3' THEN 0
    ELSE A.QUANTITY
END AS N'Số lượng',
CASE
    WHEN A.UNIT = 'M3' THEN A.QUANTITY
    ELSE (A.VOLUMN * A.QUANTITY)
END AS N'Tổng khối lượng'
FROM (
    SELECT 
    GD.[YEAR] ,
    GD.[WEEK],
    D.ID DEPARTMENT_ID,
    D.NAME DEPARTMENT_NAME,
    IP.NAME ITEM_GROUP_NAME,
    B.RATE ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN ,
    U.NAME 'UNIT',
    SUM(IIP.QUANTITY) QUANTITY
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE GD.[YEAR] = @YEAR
    AND GD.WEEK = @WEEK
    GROUP BY P.SOURCE_ID ,
    D.ID,
    D.NAME ,
    GD.[YEAR] ,
    GD.WEEK,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN,
    U.NAME
) AS A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
`

let getReportByMonth = `SELECT 
A.[YEAR] Năm,
A.MONTH Tháng,
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
    WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
    WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
    WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
    ELSE '-'
END AS 'Nhóm',
A.ITEM_GROUP_NAME N'Nhóm sản phẩm',
A.RATE N'Tỷ lệ',
A.NAME N'Sản phẩm',
A.LENGTH Dài,
A.WIDTH Rộng,
A.HEIGHT Dày,
A.VOLUMN N'Khối lượng',
A.UNIT ,
CASE
    WHEN A.UNIT = 'M3' THEN 0
    ELSE A.QUANTITY
END AS N'Số lượng',
CASE
    WHEN A.UNIT = 'M3' THEN A.QUANTITY
    ELSE (A.VOLUMN * A.QUANTITY)
END AS N'Tổng khối lượng'
FROM (
    SELECT 
    GD.[YEAR] ,
    GD.[MONTH],
    D.ID DEPARTMENT_ID,
    D.NAME DEPARTMENT_NAME,
    IP.NAME ITEM_GROUP_NAME,
    B.RATE ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN ,
    U.NAME 'UNIT',
    SUM(IIP.QUANTITY) QUANTITY
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE GD.[YEAR] = @YEAR
    AND GD.[MONTH] = @MONTH
    GROUP BY P.SOURCE_ID ,
    D.ID,
    D.NAME ,
    GD.[YEAR] ,
    GD.MONTH,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN,
    U.NAME
) AS A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID`


let getReportByOrder = `SELECT *
FROM (
SELECT 
A.[YEAR] Năm,
A.MONTH Tháng,
A.PRODUCTION_ORDERS_NAME LSX,
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' AND L0.[ORDER] < 10 THEN CONCAT('0',L0.[ORDER],'.', L0.[NAME])
	WHEN L0.[TYPE] = N'Nhóm' AND L0.[ORDER] > 9 THEN CONCAT(L0.[ORDER],'.', L0.[NAME])
	WHEN L1.[TYPE] = N'Nhóm' AND L1.[ORDER] < 10 THEN CONCAT('0',L1.[ORDER],'.', L1.[NAME])
	WHEN L1.[TYPE] = N'Nhóm' AND L1.[ORDER] > 9 THEN CONCAT(L1.[ORDER],'.', L1.[NAME])
    WHEN L2.[TYPE] = N'Nhóm' AND L2.[ORDER] < 10 THEN CONCAT('0',L2.[ORDER],'.', L2.[NAME])
	WHEN L2.[TYPE] = N'Nhóm' AND L2.[ORDER] > 9 THEN CONCAT(L2.[ORDER],'.', L2.[NAME])
    WHEN L3.[TYPE] = N'Nhóm' AND L3.[ORDER] < 10 THEN CONCAT('0',L3.[ORDER],'.', L3.[NAME])
	WHEN L3.[TYPE] = N'Nhóm' AND L3.[ORDER] > 9 THEN CONCAT(L3.[ORDER],'.', L3.[NAME])
    ELSE '-'
END AS 'Nhóm',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.[ORDER]
    WHEN L1.TYPE = N'Nhóm' THEN L1.[ORDER]
    WHEN L2.TYPE = N'Nhóm' THEN L2.[ORDER]
    WHEN L3.TYPE = N'Nhóm' THEN L3.[ORDER]
    ELSE '-'
END AS 'Order',
A.NAME N'Sản phẩm',
A.LENGTH Dài,
A.WIDTH Rộng,
A.HEIGHT Dày,
A.VOLUMN N'Khối lượng',
A.UNIT ,
A.TARGET N'Số lượng mục tiêu',
CASE
    WHEN A.UNIT = 'M3' THEN 0
    ELSE A.QUANTITY
END AS N'Số lượng',
CASE
    WHEN A.UNIT = 'M3' THEN A.QUANTITY
    ELSE (A.VOLUMN * A.QUANTITY)
END AS N'Tổng khối lượng'
FROM (
    SELECT 
    GD.[YEAR] ,
    GD.[MONTH],
    PO.NAME PRODUCTION_ORDERS_NAME,
    D.ID DEPARTMENT_ID,
    D.NAME DEPARTMENT_NAME,
	D.[ORDER],
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN ,
    U.NAME 'UNIT',
	POO.QUANTITY TARGET,
    SUM(IIP.QUANTITY) QUANTITY
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.ID = P.STEP_OF_PALLET_ID
    LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
    LEFT JOIN prod.PRODUCTION_ORDERS PO ON PO.ID = PL.PRODUCTION_ORDERS_ID
	LEFT JOIN prod.PRODUCT_OF_ORDERS POO ON POO.PRODUCTION_ORDERS_ID = PO.ID
    LEFT JOIN base.ITEM I ON I.ID  = POO.PRODUCT_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    WHERE GD.[YEAR] = @YEAR
    AND GD.[MONTH] = @MONTH
    AND PO.PRODUCTION_ORDERS_TYPE_ID = @PRODUCTION_ORDERS_TYPE_ID
    GROUP BY 
    PO.NAME,
    P.SOURCE_ID ,
    D.ID,
    D.NAME ,
	D.[ORDER],
    GD.[YEAR] ,
    GD.MONTH,
	POO.QUANTITY,
    IIP.ITEM_ID ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN,
    U.NAME
) AS A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
WHERE A.PRODUCTION_ORDERS_NAME IS NOT NULL
AND L0.[TYPE] = N'Nhóm'
) X
WHERE X.[Order] > 0
AND X.factoryId = @FACTORY_ID`


const queryWeek3 = `
select
q.[to],q.[itemId],q.[ten san pham],q.[item_parent],q.[root_name],
q.[thu2],q.[thu3],q.[thu4],q.[thu5],q.[thu6],q.[thu7],q.[number],SUM(q.ton) as [sumTon],
	sum(q.[can_thuc_hien]) as [sumCanThucHien],SUM(q.da_thuc_hien) as [sumDaThucHien]
from
(


--- lay ke hoach
select dp.NAME as [to],po.itemId,
'['+i.[code]+'] '+i.[name]+' ('+ CONVERT(varchar(40),i.[height])+'*'+CONVERT(varchar(40),i.[width])+'*'+CONVERT(varchar(40),i.[length])+')' as [ten san pham],
 ib.[name] as [item_parent],ma.[name] as [root_name],po.ton, po.quantity as [can_thuc_hien],0 as [da_thuc_hien],
0 as [thu2],0 as [thu3],0 as [thu4],0 as [thu5],0 as [thu6],0 as [thu7],0 as [cn],po.number
from prod.PO as po
inner join base.DEPARTMENT as dp on dp.id = po.stepId
inner join base.ITEM as i on i.id = po.itemId
full outer join prod.BOM as b on b.MATERIALS_ID = po.itemId
full outer join base.item ib on ib.id = b.ITEM_ID
inner join base.MARKET as ma on ma.CODE = po.[root]
where po.[week] = @week and po.[year] = @year

union all
-- lay ton

-- lay da thuc hien
select dp.[name] as [to] , ipg.ITEM_ID as [itemId],
'['+i.[code]+'] '+i.[name]+' ('+ CONVERT(varchar(40),i.[height])+'*'+CONVERT(varchar(40),i.[width])+'*'+CONVERT(varchar(40),i.[length])+')' as [ten san pham],
ib.[name] as [item_parent],mk.NAME as [root_name],0 as [ton],0 as [can_thuc_hien],ipg.QUANTITY as [da_thuc_hien],
0 as [thu2],0 as [thu3],0 as [thu4],0 as [thu5],0 as [thu6],0 as [thu7],0 as [cn],po.number
from prod.PACKAGE as pg
inner join base.DEPARTMENT as dp on dp.id = pg.SOURCE_ID
inner join prod.ITEM_IN_PACKAGE as ipg on ipg.PACKAGE_ID = pg.ID
inner join base.ITEM as i on i.id = ipg.ITEM_ID
inner join prod.BOM as b on b.MATERIALS_ID = ipg.ITEM_ID
inner join base.item ib on ib.id = b.ITEM_ID
inner join prod.PO as po on po.code = pg.PO
left join base.MARKET as mk on mk.CODE = po.root
where DATEPART(WEEK,pg.CREATE_DATE) = @week and DATEPART(YEAR,pg.CREATE_DATE) = @year

-- lay thuc hien theo thu


) as q

group by q.[to],q.[itemId],q.[ten san pham],q.[item_parent],q.[root_name],
q.[thu2],q.[thu3],q.[thu4],q.[thu5],q.[thu6],q.[thu7],q.number

`

const queryBaoCaoTuan = `
select 
	[to],[itemId],[ten san pham], [item_parent], [KeHoach],[LENGTH],[WIDTH],[HEIGHT],[error],
	[thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn],volumn,[WEEK_PO],[WEEK_PERFORM]
from 
(
select dp.[name] as [to],ib.[name] as [item_parent],p.keHoach as [KeHoach], p.week as[WEEK_PO],DATEPART(WEEK,pg.CREATE_DATE) as [WEEK_PERFORM],ERR.error as[error],
i.HEIGHT as [HEIGHT],i.WIDTH as [WIDTH],i.LENGTH as [LENGTH],
case	
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 2 then 'Thu2'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 3 then 'Thu3'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 4 then 'Thu4'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 5 then 'Thu5'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 6 then 'Thu6'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 7 then 'Thu7'
	else 'cn' 
end as [thu],pgi.QUANTITY as [qty],pgi.ITEM_ID as [itemId],i.[NAME] as [ten san pham],i.[name],i.volumn
from prod.PACKAGE as pg
inner join prod.PO p on p.code = pg.PO
LEFT JOIN (
                    select P.PO,SUM(IIP.QUANTITY) error
                    from prod.PACKAGE P
                    left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                    left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                    WHERE (PT.TYPE_ID = 100000 OR PT.TYPE_ID = 400000)
                    GROUP BY P.PO
                ) ERR ON ERR.PO = P.code
inner join prod.ITEM_IN_PACKAGE as pgi on pgi.PACKAGE_ID = pg.ID
inner join base.ITEM as i on i.id = pgi.ITEM_ID
inner join base.DEPARTMENT as dp on dp.id = pg.SOURCE_ID
inner join prod.BOM as b on b.MATERIALS_ID = pgi.ITEM_ID
inner join base.item ib on ib.id = b.ITEM_ID
where DATEPART(WEEK,pg.CREATE_DATE) = @week and DATEPART(YEAR,pg.CREATE_DATE) = @year and  dp.factoryId = @factoryId
) as a

pivot (
	sum(a.qty) for a.thu in ([thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn])
) as b

`
module.exports = router