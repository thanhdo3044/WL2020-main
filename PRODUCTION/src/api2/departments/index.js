const express = require('express')
const route = express.Router()
const mssql = require('mssql')

const {
    Department,
    Op,
    ItemInPackage,
    MaterialsInPackage,
    ThongTinTruyNguyen,
    GhiNhanSL,
    sequelize
} = require('../../../models')
const moment = require('moment')
const e = require('express')

route.get('/', async(req, res) => {
    try {
        const result = await Department.findAll()
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


// await new mssql.Request()
//                 .input('departmentId', req.query.idDepartment)
//                 .query(`WITH temp(id,NAME)
// as (
//         Select id,NAME
//         From base.DEPARTMENT
//         Where ID = @departmentId
//         Union All
//         Select d.ID,d.NAME
//         From temp as a, base.DEPARTMENT as d
//         Where a.id = d.PARENT_ID
// )
// select *
// From temp t
//         `, async(err, record) => {
//                     if (err)
//                         return res.api.sendFail(getErrorMessage(4907))

//                     // console.log('record.recordset', record.recordset)
//                     idDepartment = record.recordset
//                     console.log('idDepartment', idDepartment)
//                     idDepartment.forEach(e => {
//                         idSearchDepartment.push(e.id)
//                     })
//                     console.log('idSearchDepartment', idSearchDepartment)
//                     const pos = await ThucHienKeHoach.findAll({
//                         include: [{
//                                 model: Item
//                             },
//                             {
//                                 model: Department
//                             }
//                         ],
//                         where: {
//                             stepId: {
//                                 [Op.in]: idSearchDepartment
//                             }
//                         }
//                     })

route.post('/:id/san-luong', async(req, res, next) => {
        const {
            fromDate = moment().subtract(30, 'days'),
                toDate = moment(),
                departmentId
        } = req.body
        const departmentIdAll = await new mssql.Request()
            .input('departmentId', departmentId)
            .query(`WITH temp(id,NAME)
as (
        Select id,NAME
        From base.DEPARTMENT
        Where ID = @departmentId
        Union All
        Select d.ID,d.NAME
        From temp as a, base.DEPARTMENT as d
        Where a.id = d.PARENT_ID
)
select *
From temp t`)
        let arrDepartmentId = []
        departmentIdAll.recordset.forEach(item => arrDepartmentId.push(item.id))

        try {
            await GhiNhanSL.findAll({
                attributes: [
                    'itemId', 'itemName', 'departmentId', 'departmentName', 'departmentName2', 'groupName', 'groupDepartment', 'length', 'height', 'width', 'VOLUMN', 'sanPham', [sequelize.fn('SUM', sequelize.col('QUANTITY')), 'QUANTITY']
                ],
                where: {
                    VERIFY_BY: {
                  [Op.not]:null
                    },                    
                    createDate: {
                        [Op.between]: [fromDate, toDate]
                    },
                    departmentId: {
                        [Op.in]: arrDepartmentId
                    }
                },
                raw: true,
                group: ['itemId', 'itemName','departmentId' , 'departmentName', 'departmentName2', 'length', 'height', 'width', 'VOLUMN', 'sanPham', 'groupName', 'groupDepartment']
            }).then(result => req.result = result)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
        next()
    },
    (req, res) => {
        res.status(200).send(req.result)
    })
route.post('/:id/san-luong-cho-nhan', async(req, res, next) => {
        const {
            fromDate = moment().subtract(30, 'days'),
                toDate = moment(),
                departmentId
        } = req.body
        const departmentIdAll = await new mssql.Request()
            .input('departmentId', departmentId)
            .query(`WITH temp(id,NAME)
  as (
          Select id,NAME
          From base.DEPARTMENT
          Where ID = @departmentId
          Union All
          Select d.ID,d.NAME
          From temp as a, base.DEPARTMENT as d
          Where a.id = d.PARENT_ID
  )
  select *
  From temp t`)
        let arrDepartmentId = []
        departmentIdAll.recordset.forEach(item => arrDepartmentId.push(item.id))

        try {
            await GhiNhanSL.findAll({
                attributes: [
                  'congdoannhan','itemId', 'itemName', 'createDate', 'VERIFY_BY', 'departmentName', 'length', 'height', 'width', 'VOLUMN', 'sanPham', 'QUANTITY','number'
                ],
                where: {
                    createDate: {
                        [Op.between]: [fromDate, toDate]
                    },
                    departmentId: {
                        [Op.in]: arrDepartmentId
                    }

                },
                raw: true
            }).then(result => req.result = result)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
        next()
    },
    (req, res) => {
        res.status(200).send(req.result)
    })
route.post('/:id/truy-nguyen', async(req, res, next) => {
        const {
            fromDate,
            toDate,
            factoryId
        } = req.body
        try {
            await ThongTinTruyNguyen.findAll({
                where: {
                    createDate: {
                        [Op.between]: [fromDate, toDate]
                    },
                    factoryId: factoryId
                },
                raw: true
            }).then(result => req.result = result)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
        next()
    },
    (req, res) => {
        res.status(200).send(req.result)
    })

// TODO

route.get('/nhom-tieu-thu-dien', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .query(`
        select ID value, NAME label from prod.NHOM_TIEU_THU_DIEN
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.post('/san-luong-lua-phoi', async(req, res) => {
    try {
        let query = "";
        if(req.body.departmentId == 102299 || !req.body.arrDepartment){
            query = `
            SELECT [departmentId]
      ,[departmentName]
      ,[departmentName2]
      ,[groupName]
      ,[groupDepartment]
      ,[DAY]
      ,[RONG]
      ,[DAI]
      ,[createdAt]
      ,[QUANTITY]
      ,[volumn]
  FROM [View_SanLuong_LuaPhoi] 
  where createdAt between '${req.body.fromDate}' and '${req.body.toDate}' 
            `;
        }else{
            let strDepartment = "";
            req.body.arrDepartment.forEach(el => {
                strDepartment += el + ', '
            });
            strDepartment = strDepartment.substring(0, strDepartment.length - 2);
            query = `
            SELECT [departmentId]
      ,[departmentName]
      ,[departmentName2]
      ,[groupName]
      ,[groupDepartment]
      ,[DAY]
      ,[RONG]
      ,[DAI]
      ,[createdAt]
      ,[QUANTITY]
      ,[volumn]
  FROM [View_SanLuong_LuaPhoi] 
  where createdAt between '${req.body.fromDate}' and '${req.body.toDate}' 
  and departmentId in (${strDepartment})
            `;
        }
        const data = await new mssql.Request()
        .query(query)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.get('/:id', async(req, res) => {
    try {
        const {
            id
        } = req.params
        const result = await Department.findAll({
            where: {
                id
            },
            include: [{
                model: Po,
                where: {
                    status: {
                        [Op.eq]: null
                    }
                }
            }]
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.post('/:id/package', async(req, res, next) => {
        const {
            fromDate,
            toDate,
            // factoryId
        } = req.body
        console.log(fromDate, toDate)
        ItemInPackage.findAll({
                where: {
                    CREATE_DATE: {
                        [Op.between]: [fromDate, toDate]
                    }
                    //   factoryId: factoryId
                },
                attributes: ['tenSP', 'name', 'ITEM_ID', 'DESTINATION_ID', [sequelize.fn('sum', sequelize.col('QUANTITY')), 'QUANTITY'],
                    [sequelize.fn('sum', sequelize.col('khoiLuongNhan')), 'khoiLuongNhan']
                ],
                group: ['tenSP', 'name', 'ITEM_ID', 'DESTINATION_ID'],
                raw: true
            }).then(result => {
                req.result = result
                next()
            })
            .catch(error => {
                console.log(error)
                res.status(500).send(error)
            })
    },
    (req, res, next) => {
        const {
            fromDate,
            toDate
        } = req.body
        MaterialsInPackage.findAll({
                where: {
                    [Op.and]: [{
                            CREATE_DATE: {
                                [Op.between]: [fromDate, toDate]
                            }
                        }
                        // {
                        //     VERIFY_BY: {
                        //         [Op.ne]: null
                        //     }
                        // }
                    ]
                },
                attributes: ['ITEM_ID', 'SOURCE_ID', [sequelize.fn('sum', sequelize.col('QUANTITY')), 'soLuongXuat'],
                    [sequelize.fn('sum', sequelize.col('khoiLuongNhan')), 'khoiLuongXuat']
                ],
                group: ['ITEM_ID', 'SOURCE_ID'],
                raw: true
            }).then(async nhaps => {
                await req.result.forEach((item) => {
                    const fitem = nhaps.find(
                        nhap =>
                        nhap.ITEM_ID === item.ITEM_ID && nhap.SOURCE_ID === item.DESTINATION_ID
                    )
                    Object.assign(item, {
                        khoiLuongXuat: fitem ? fitem.khoiLuongXuat : 0,
                        soLuongXuat: fitem ? fitem.soLuongXuat : 0
                    })
                })
                next()
            })
            .catch(error => {
                console.log(error)
                res.status(500).send(error)
            })
    },
    async(req, res, next) => {
        const {
            fromDate,
            toDate
        } = req.body
        console.log(fromDate, toDate)
        const nhanPhois = await ItemInPackage.findAll({
            where: {
                CREATE_DATE: {
                    [Op.lt]: fromDate
                }
            },
            attributes: ['ITEM_ID', 'DESTINATION_ID', [sequelize.fn('sum', sequelize.col('QUANTITY')), 'soLuongNhan'],
                [sequelize.fn('sum', sequelize.col('khoiLuongNhan')), 'khoiLuongNhan']
            ],
            group: ['ITEM_ID', 'DESTINATION_ID'],
            raw: true
        })
        const xuatPhois = await MaterialsInPackage.findAll({
            where: {
                [Op.and]: [{
                        CREATE_DATE: {
                            [Op.lt]: fromDate
                        }
                    }
                    // {
                    //     VERIFY_BY: {
                    //         [Op.ne]: null
                    //     }
                    // }
                ]
            },
            attributes: ['ITEM_ID', 'SOURCE_ID', [sequelize.fn('sum', sequelize.col('QUANTITY')), 'soLuongXuat'],
                [sequelize.fn('sum', sequelize.col('khoiLuongNhan')), 'khoiLuongXuat']
            ],
            group: ['ITEM_ID', 'SOURCE_ID'],
            raw: true
        })
        await req.result.forEach((item) => {
            const nhap = nhanPhois.find(nhap => nhap.ITEM_ID === item.ITEM_ID && nhap.DESTINATION_ID === item.DESTINATION_ID)
            const xuat = xuatPhois.find(xuat => xuat.ITEM_ID === item.ITEM_ID && xuat.SOURCE_ID === item.DESTINATION_ID)
            item.tonDauKy = nhap ? nhap.soLuongNhan : 0 - xuat ? xuat.soLuongXuat : 0
            item.khoiLuongTonDauKy = nhap ? nhap.khoiLuongNhan : -xuat ? xuat.khoiLuongXuat : 0
        })
        next()
    },
    async(req, res, next) => {
        // console.log('Công thức')
        await req.result.forEach(item => {
            item.tonCuoiKy = item.tonDauKy + item.QUANTITY - item.soLuongXuat
            item.khoiLuongTonCuoiKy = item.khoiLuongTonDauKy + item.khoiLuongNhan - item.khoiLuongXuat
        })
        next()
    },
    (req, res, next) => {
        // console.log('Kết quả')
        // console.log(req.result)
        next()
    },
    (req, res) => {
        res.status(200).send(req.result)
    })

module.exports = route