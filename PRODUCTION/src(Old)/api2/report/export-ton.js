const XlsxPopulate = require('xlsx-populate')
const encode_cell = require('xlsx').utils.encode_cell
const mssql = require('mssql')

const express = require('express')
const router = express.Router()
const {
    getView_ton
} = require('./../../core/query')
const {
    getErrorMessage
} = require('./../../core/config')

Date.prototype.getMonthFormatted = function () {
    var month = this.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
}
router.get('/', (req, res, next) => {
    let from = `${new Date().getFullYear()}-${new Date().getMonthFormatted()}-01`
    let to = `${new Date().getFullYear()}-${new Date().getMonthFormatted()}-${new Date().getDate()} 23:59:59`
    new mssql.Request()
        .input('FROM', from)
        .input('TO', to)
        .query(getView_ton, (err, record) => {
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
                .then(async (workbook) => {
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
    let from = `${new Date().getFullYear()}-${new Date().getMonthFormatted()}-01`
    let to = `${new Date().getFullYear()}-${new Date().getMonthFormatted()}-${new Date().getDate()} 23:59:59`
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('WEEK', req.query.week)
        .input('FACTORY_ID', req.query.factoryId)
        .query(require('./../../core/query/index').getView_ton, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.get('/theo-to', (req, res, next) => {
    new mssql.Request()
        .input('stepId', req.query.stepId)
        .query(`SELECT
                A.stepId,
                D.NAME stepName,
                A.itemId,
                I.CODE itemCode,
                I.NAME itemName,
                I.LENGTH itemLenght,
                I.WIDTH itemWidth,
                I.HEIGHT itemHeight,
                A.nhap,
                A.xtt,
                A.ton
                FROM (
                    SELECT
                    CASE
                        WHEN XTT.STEP IS NOT NULL THEN XTT.STEP
                        WHEN N.STEP IS NOT NULL THEN N.STEP
                        WHEN XTT.STEP IS NOT NULL THEN XTT.STEP
                    END AS stepId,
                    CASE
                        WHEN XTT.ITEM_ID IS NOT NULL THEN XTT.ITEM_ID
                        WHEN N.ITEM_ID IS NOT NULL THEN N.ITEM_ID
                        WHEN XTT.ITEM_ID IS NOT NULL THEN XTT.ITEM_ID
                    END AS itemId,
                    N.NHAP nhap,
                    XTT.XTT xtt,
                    CASE 
                        WHEN N.NHAP IS NULL AND XTT.XTT IS NOT NULL THEN XTT.XTT * (-1)
                        WHEN N.NHAP IS NOT NULL AND XTT.XTT IS NULL THEN N.NHAP
                        WHEN N.NHAP IS NULL AND XTT.XTT IS NULL THEN 0
                        ELSE N.NHAP -  XTT  
                    END AS ton
                    FROM 
                    (
                        SELECT STEP,ITEM_ID,SUM(QUANTITY) NHAP
                        FROM (
                            SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.DESTINATION_ID STEP, IIP.ITEM_ID,IIP.QUANTITY
                            FROM prod.PACKAGE P
                            LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                            WHERE P.SOURCE_ID <> 100001 
                            AND P.SOURCE_ID <> 100098              --100001 100098  Xe nâng không cần thống kê
                        ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
                        GROUP BY L0.STEP, L0.ITEM_ID
                    )N FULL OUTER JOIN 
                    (
                        SELECT STEP,ITEM_ID,SUM(QUANTITY) XTT
                        FROM (
                            SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.SOURCE_ID  STEP, MIP.ITEM_ID, MIP.QUANTITY
                            FROM prod.PACKAGE P
                            LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                            LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
                            WHERE P.SOURCE_ID <> 100001 
                            AND P.SOURCE_ID <> 100098              --100001 100098  Xe nâng không cần thống kê
                        ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
                        GROUP BY L0.STEP, L0.ITEM_ID
                    ) XTT ON N.STEP = XTT.STEP AND N.ITEM_ID = XTT.ITEM_ID
                ) A
                left join base.DEPARTMENT D ON D.ID = A.stepId
                left join base.ITEM I ON I.ID = A.itemId
                WHERE A.stepId = @stepId`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


module.exports = router