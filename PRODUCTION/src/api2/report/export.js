//require('dotenv').config()
const XlsxPopulate = require('xlsx-populate')
const encode_cell = require('xlsx').utils.encode_cell
const mssql = require('mssql')
const path = require('path')

const express = require('express')
const router = express.Router()
const {
    getErrorMessage
} = require('./../../core/config')
Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

let getBom = `SELECT P.ID productId,
P.[NAME] productName,
M.ID materialsId,
M.[NAME] materialsName,
M.[LENGTH] materialsLength,
M.[WIDTH] materialsWidth,
M.[HEIGHT] materialsHeight,
M.[VOLUMN] materialsVolumn,
B.RATE rate
FROM prod.BOM B
LEFT JOIN base.ITEM P ON P.ID = B.ITEM_ID
LEFT JOIN base.ITEM M ON M.ID = B.MATERIALS_ID`

router.get('/', (req, res, next) => {
    XlsxPopulate.fromFileAsync(path.join(__dirname, './template.xlsx'))
        .then(async (wb) => {
            wb.sheets().forEach((ws, i) => {
                if (ws.name() != 'Sheet1') {
                    wb.deleteSheet(ws.name())
                }
            })
            let record
            record = await new mssql.Request().query(getBom)
            let bom = record.recordset
            new mssql.Request()
                .input('WEEK', req.query.week || new Date().getWeekNumber())
                .input('YEAR', req.query.year || new Date().getFullYear())
                .query(require('./../../core/query/index').getBaoCaoTinhHInhThucHien, async (err, record) => {
                    if (err) throw err
                    let departments = [...new Set(record.recordset.map(x => x.departmentName))]
                    let sheet = wb.sheet('Sheet1')
                    departments.forEach(department => {
                        if (department != null) {
                            let ws = wb.cloneSheet(sheet, department)
                            addDataToWorksheet(ws, record.recordset.filter(i => i.departmentName == department), bom)
                        }
                    })
                    wb.deleteSheet('Sheet1')
                    const data = await wb.outputAsync()

                    res.setHeader('content-disposition', 'attachment; filename="Report.xlsx"')
                    res.setHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    res.attachment("Báo cáo.xlsx");
                    res.send(data);
                })
        })
        .catch(err => console.log(err))
})

let queryRaw = `
SELECT 
GD.[YEAR] N'Năm',
GD.WEEK N'Tuần',
GD.WEEK_DAY N'Thứ',
GD.DATE N'Ngày',
D.NAME N'Tổ',
IP.NAME N'Nhóm sản phẩm',
B.RATE N'Tỷ lệ',   
I.NAME N'Chi tiết/cụm',
I.LENGTH N'Dài',
I.WIDTH N'Rộng',
I.HEIGHT N'Dày',
I.VOLUMN N'Khối lượng',
SUM(IIP.QUANTITY) N'Số lượng'
FROM prod.PACKAGE P
LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
WHERE P.CREATE_DATE BETWEEN @FROM AND @TO
GROUP BY P.SOURCE_ID ,
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
I.LENGTH ,
I.WIDTH ,
I.HEIGHT ,
I.VOLUMN`

router.get('/raw', (req, res, next) => {
    new mssql.Request()
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .query(queryRaw, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            let result = []
            record.recordset.forEach(e => {
                result.push(Object.assign({}, e, {
                    'Ngày': e['Ngày'].toJSON().substring(0, 10)
                }))
            })
            res.api.sendData(result)
        })
})

module.exports = router

function addDataToWorksheet(ws, data, bom) {
    //Điền tuần và tên bộ phận
    initWorksheet(ws, {
        week: data[0].week,
        department: data[0].departmentName
    })

    let itemRows = addItem(ws, data, bom)
    addQuantity(ws, data, itemRows)
}

function addQuantity(ws, data, itemRows) {
    //Ô bắt đầu
    let cellStart = {
        r: 6,
        c: 8
    }
    data.forEach(e => {
        ws.cell(encode_cell({
            c: getColumnByDayOfWeek(e.dayOfWeek) + cellStart.c,
            r: itemRows.find(i => i.itemId == e.itemId).row + cellStart.r
        })).value(e.quantity)
    })
}




function getColumnByDayOfWeek(dayOfWeek) {
    switch (dayOfWeek) {
        case 'Thứ 2':
            return 0
        case 'Thứ 3':
            return 1
        case 'Thứ 4':
            return 2
        case 'Thứ 5':
            return 3
        case 'Thứ 6':
            return 4
        case 'Thứ 7':
            return 5
        case 'Chủ nhật':
            return 6
        default:
            return null
    }
}



function addItem(ws, data, bom) {
    //Ô bắt đầu
    let cellStart = {
        r: 6,
        c: 1
    }
    let itemRows = []
    let groups = [{
        id: 0,
        name: '',
        childs: []
    }]
    // lấy định mức nguyên vật liệu
    data.forEach(e => {
        let parent = bom.filter(i => i.materialsId == e.itemId) || []
        if (parent.length == 1) {
            if (!groups.find(i => i.id == parent[0].productId)) {
                let childs = bom.filter(i => i.productId == parent[0].productId)
                childs.forEach((e, i) => {
                    childs[i] = {
                        id: e.materialsId,
                        name: e.materialsName,
                        length: e.materialsLength,
                        width: e.materialsWidth,
                        height: e.materialsHeight,
                        volumn: e.materialsVolumn,
                        rate: e.rate
                    }
                })
                groups.push({
                    id: parent[0].productId,
                    name: parent[0].productName,
                    childs: childs
                })
            }
        } else { // khong co parent hoac nhieu parent
            if (!groups.find(i => i.id == 0).childs.find(i => i.id == e.itemId))
                groups.find(i => i.id == 0).childs.push({
                    id: e.itemId,
                    name: e.itemName,
                    length: e.length,
                    width: e.width,
                    height: e.height,
                    volumn: e.volumn,
                    rate: 1
                })
        }
    })
    groups.push(Object.assign({}, groups[0]))
    groups.shift()
    let itemRow = 0
    //
    groups.forEach((e, index) => {
        //add san pham cha
        ws.cell(encode_cell({
            c: cellStart.c,
            r: cellStart.r + itemRow
        })).value(e.name)

        ws.cell(encode_cell({
            c: cellStart.c - 1,
            r: cellStart.r + itemRow
        })).value(romanize(index + 1))

        let top = encode_cell({
            c: cellStart.c + 21,
            r: cellStart.r + itemRow + 1
        })
        let bottom = encode_cell({
            c: cellStart.c + 21,
            r: cellStart.r + itemRow + e.childs.length
        })
        let cellMin = encode_cell({
            c: cellStart.c + 21,
            r: cellStart.r + itemRow
        })

        ws.cell(cellMin).formula(`=MIN(${top}:${bottom})`)


        for (let i = -1; i < 23; i++) {
            ws.cell(encode_cell({
                c: cellStart.c + i,
                r: cellStart.r + itemRow
            })).style({
                fill: 'BBBBBB'
            })
        }

        // add san pham con
        e.childs.forEach((i, index) => {
            itemRow++
            itemRows.push({
                itemId: i.id,
                row: itemRow
            })

            ws.cell(encode_cell({
                c: cellStart.c,
                r: cellStart.r + itemRow
            })).value(i.name)

            ws.cell(encode_cell({
                c: cellStart.c - 1,
                r: cellStart.r + itemRow
            })).value(index + 1)

            ws.cell(encode_cell({
                c: cellStart.c + 1,
                r: cellStart.r + itemRow
            })).value(i.rate)

            ws.cell(encode_cell({
                c: cellStart.c + 2,
                r: cellStart.r + itemRow
            })).value(i.length)

            ws.cell(encode_cell({
                c: cellStart.c + 3,
                r: cellStart.r + itemRow
            })).value(i.width)

            ws.cell(encode_cell({
                c: cellStart.c + 4,
                r: cellStart.r + itemRow
            })).value(i.height)

            ws.cell(encode_cell({
                c: cellStart.c + 21,
                r: cellStart.r + itemRow
            })).formula(`=${encode_cell({
                c: cellStart.c + 13,
                r: cellStart.r + itemRow
            })}/${encode_cell({
                c: cellStart.c + 1,
                r: cellStart.r + itemRow
            })}`)

            ws.cell(encode_cell({
                c: cellStart.c + 22,
                r: cellStart.r + itemRow
            })).formula(`=IFERROR(${encode_cell({
                c: cellStart.c + 21,
                r: cellStart.r + itemRow
            })}/${cellMin},0)`)

            if (i.volumn) {
                ws.cell(encode_cell({
                    c: cellStart.c + 5,
                    r: cellStart.r + itemRow
                })).value(i.volumn)
            }
        })

        itemRow++
    })

    return itemRows
}


function romanize(num) {
    var lookup = {
            M: 1000,
            CM: 900,
            D: 500,
            CD: 400,
            C: 100,
            XC: 90,
            L: 50,
            XL: 40,
            X: 10,
            IX: 9,
            V: 5,
            IV: 4,
            I: 1
        },
        roman = '',
        i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

function initWorksheet(ws, option = {}) {
    ws.cell('C1').value(option.week)
    // ws.cell('A2').value('Phiên bản số : 2.2').style({
    //     bold: true,
    //     border: false,
    //     fontSize: 12,
    //     fontFamily: 'Times New Roman'
    // })
    ws.cell('G1').value(`${option.department}`)
    // ws.cell('G2').value('Không gia công các chi tiết có số lượng thừa (ghi trong ngoặc) ở cột PHẢI T. HIỆN TRONG TUẦN!').style({
    //     bold: false,
    //     border: false,
    //     fontSize: 12,
    //     fontFamily: 'Times New Roman'
    // })

}