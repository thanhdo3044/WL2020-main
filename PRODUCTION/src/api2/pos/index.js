const express = require('express')
const mssql = require('mssql')
const route = express.Router()
const {
    Po,
    Item,
    Department,
    Op,
    ThucHienKeHoach,
    Bom,
    // NhapTonDauKy,
    VItemInPackage,
    sequelize
} = require('../../../models')

route.put('/:id/update-bom', async(req, res) => {
    try {
        const result = Bom.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.get('/', async(req, res) => {
    console.log('Đang tính ...')
    try {
        const pos = await Po.findAll({
            where: {
                stepId: {
                    [Op.in]: [100264, 100274]
                },
                factoryId: req.query.factoryId
            },
            include: [{
                    model: Item
                },
                {
                    model: Department
                },
                {
                    model: Po,
                    as: 'HomePo'
                }
            ]
        })
        res.status(200).send(pos)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.put('/:id/tao', async(req, res) => {
    const {
        poIds
    } = req.body
    try {
        const result = await Po.update({
            taoPhoi: new Date()
        }, {
            where: {
                id: {
                    [Op.in]: poIds
                }

            }
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.put('/:id/huy', async(req, res) => {
    const {
        poIds
    } = req.body
    try {
        const result = await Po.update({
            taoPhoi: null
        }, {
            where: {
                id: {
                    [Op.in]: poIds
                }

            }
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.put('/:id/duyet', async(req, res) => {
    const {
        poIds
    } = req.body
    try {
        const result = await Po.update({
            capPhoi: new Date()
        }, {
            where: {
                id: {
                    [Op.in]: poIds
                }

            }
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.put('/:id/huy-duyet', async(req, res) => {
    const {
        poIds
    } = req.body
    try {
        const result = await Po.update({
            capPhoi: null
        }, {
            where: {
                id: {
                    [Op.in]: poIds
                }

            }
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.get('/:id/print', async(req, res) => {
    try {
        const {
            factoryId
        } = req.query
        const pos = await Po.findAll({
            where: {
                factoryId,
                [Op.and]: {
                    endPo: {
                        [Op.eq]: 0
                    },
                    deletedAt: {
                        [Op.eq]: null
                    }
                }

            },
            include: [{
                    model: Item
                },
                {
                    model: Department
                },
                // {
                //     model: NhapTonDauKy,
                //     as: 'conTon'

                // }
            ]
        })
        res.status(200).send(pos)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.get('/:id/cap-phoi', async(req, res) => {
    try {
        const {
            stepId
        } = req.query

        const filters = {
            [Op.and]: [{
                        stepId
                    },
                    {
                        number: req.params.id
                    },
                    sequelize.where(sequelize.literal('keHoach + loiCongDon + hanMucTon'), {
                        [Op.gt]: 0
                    })
                ]
                // number: req.params.id,
                // ton: {
                //   [Op.lt]: sequelize.fn('SUM', sequelize.col('soLuongUuTien'))
                // },
                // stepId
        }
        const pos = await Po.findAll({
            where: filters,
            include: [{
                model: Item
            }, {
                model: VItemInPackage
            }]
        })
        res.status(200).send(pos)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.put('/:accountId/approved', async(req, res) => {
   // const  accountId  = req.params
    let data = null
  //  const { poIds } = req.body

    try {
        data = await Po.update({
            KH_approvedByAccount: req.params.accountId,
            KH_approvedAt: new Date().addHours(7)
        }, {
            where: {
                number:  req.body.poIds
            }
        })
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.put('/:accountId/approved-2', async(req, res) => {
    // const  accountId  = req.params
     let data = null
   //  const { poIds } = req.body
 
     try {
         data = await Po.update({
             approvedByAccount: req.params.accountId,
             approvedAt: new Date().addHours(7)
         }, {
             where: {
                 number:  req.body.poIds
             }
         })
         res.status(200).send(data)
     } catch (error) {
         console.log(error)
         res.status(500).send(error)
     }
 })
route.put('/:accountId/xoa-ke-hoach', async(req, res) => {
    let data = null
    const { poIds } = req.body

    try {
        data = await Po.destroy({
            where: {
                number: {
                    [Op.in]: poIds
                }
            }
        })
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.put('/:accountId/xoa-ke-hoach-2', async(req, res) => {
    let data = null
    const { lsxs } = req.body
    try {
        data = await Po.destroy({
            where: {
                number: {
                    [Op.in]: lsxs
                }
            }
        })
        res.sendStatus(200).send(data)
    } catch (error) {
        console.log(error)
        res.sendStatus(500).send(error)
    }
})

route.get('/:factoryId/approved', async(req, res) => {
    try {
        const { factoryId } = req.params
        const pos = await Po.findAll({
            where: {
                factoryId,
                [Op.and]: {
                    approvedAt: {
                        [Op.eq]: null
                    }
                }

            },
            include: [{
                    model: Item
                },
                {
                    model: Department
                },
                // {
                //     model: NhapTonDauKy,
                //     as: 'conTon'
                // }
            ]
        })
        res.status(200).send(pos)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.get('/:id/bom', async(req, res) => {
    const {
        factoryId
    } = req.query
    try {
        const boms = await Bom.findAll({
            where: {
                factoryId
            }
        })
        res.status(200).send(boms)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.get('/:id/getDepartment', (req, res, next) => {
    const {
        departmentId
    } = req.query
    try {
        new mssql.Request()
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
From temp t`, async(err, record) => {
                res.api.sendData(record.recordset)
            })
    } catch (error) {
        res.api.sendFail(error)
    }
})

route.get('/:id/thuchien', async(req, res, next) => {
        try {
            let idDepartment;
            let idSearchDepartment = [];
                    let fromWeek = req.query.fromWeek;
                    let toWeek = req.query.toWeek;
                    let year = req.query.year;
                    // let number = req.query.number;
                    // console.log('record.recordset', record.recordset)
                    console.log('idDepartment', idDepartment)
                    console.log('idSearchDepartment', idSearchDepartment)
                    const pos = await new mssql.Request()
                .input('idDepartment', req.query.idDepartment)
                .input('factoryId', req.query.factoryId)
                .query(`
                
                select * ,i.NAME as itemName,d.NAME as departmentName, 
                case when VOLUMN = 1 then soLuongDat else soLuongDat*VOLUMN end m3Dat from dbo.View_ThucHienKeHoach thkh
                left join base.ITEM i on thkh.itemId = i.ID
                left join base.DEPARTMENT d on d.ID = thkh.stepId 
                where keHoach>0 and ROUND(soLuongDat/keHoach,1) <1 and endPO = 0 and thkh.factoryId = @factoryId
                 `);

                    // const pos = await ThucHienKeHoach.findAll({
                    //     include: [{
                    //             model: Item
                    //         },
                    //         {
                    //             model: Department
                    //         }
                    //     ],
                    //     where: {
                    //         stepId: {
                    //             [Op.in]: idSearchDepartment
                    //         },
                    //         week: week,
                    //         year: year,
                    //         number: number
                    //     }
                    // })
                    req.result = pos.recordset
                    next()
             
            console.log('hello')
                // const pos = await ThucHienKeHoach.findAll({
                //     include: [{
                //             model: Item
                //         },
                //         {
                //             model: Department
                //         }
                //     ],
                //     where: {
                //         factoryId: req.query.factoryId
                //     }
                // })

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }, async(req, res, next) => {

        await req.result.forEach(item => {
            item.tiLeDatKH = item.soLuongDat ? item.soLuongDat / item.keHoach : 0
        })
        next()
    },
    (req, res) => {
        res.status(200).send(req.result)
    })

route.get('/:id/getNumberByPO', async(req, res, next) => {
    const {
        departmentId
    } = req.query
    console.log('req.body', req.body)
    try {
        let idDepartment;
        let idSearchDepartment = [];

        await new mssql.Request()
            .input('departmentId', req.query.departmentId)

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
From temp t
        `, async(err, record) => {
            let week = req.query.week
            let year = req.query.year;
            if (err)
                return res.api.sendFail(getErrorMessage(4907))

            // console.log('record.recordset', record.recordset)
            idDepartment = record.recordset
            console.log('idDepartment', idDepartment)
            await idDepartment.forEach(e => {
                idSearchDepartment.push(e.id)
            })
            console.log('idSearchDepartment', idSearchDepartment)
            const pos = await Po.findAll({
                group: ['number'],
                attributes: ['number'],
                raw: true,
                where: {
                    stepId: {
                        [Op.in]: idSearchDepartment
                    },
                    week: week,
                    year: year
                }
            })
            res.api.sendData(pos)
        })
    } catch (error) {
        res.api.sendFail(error)
    }
})

route.get('/:id/thuchienByDepartment', async(req, res, next) => {
        try {
            let idDepartment;
            let idSearchDepartment = req.query.departmentId;
            let number = req.query.number;
            let week = req.query.week;
            let year = req.query.year;

            const pos = await ThucHienKeHoach.findAll({
                include: [{
                        model: Item
                    },
                    {
                        model: Department
                    }
                ],
                where: {
                    stepId: idSearchDepartment,
                    week: week,
                    year: year,
                    number: number
                }
            })
            req.result = pos
            next()
        } catch (err) {
            res.api.sendFail(err)
        }
    }, async(req, res, next) => {
        await req.result.forEach(item => {
            item.dataValues.tiLeDatKH = item.dataValues.soLuongDat ? item.dataValues.soLuongDat / item.dataValues.keHoach : 0
        })
        next()
    },
    (req, res) => {
        res.status(200).send(req.result)
    })

route.get('/:stepId/lenh-san-xuat-thuc-hien', async(req, res) => {
    const { stepId } = req.params
    try {
        const pos = await Po.findAll({
            where: {
                [Op.and]: [{
                    endPo: {
                        [Op.eq]: 0
                    },
                    approvedAt: {
                        [Op.ne]: null
                    },
                    stepId: {
                        [Op.eq]: stepId
                    },
                    keHoach: {
                        [Op.gt]: 0
                    }
                }]
            },
            include: [{
                    model: Item
                },
                {
                    model: VItemInPackage
                }
            ],
            order: [
                ['approvedAt']
            ]
        })
        res.status(200).send(pos)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.get('/getAllPO', async(req, res)=>{
    try {
        const data = await new mssql.Request().query(`
        select distinct number,number as label,number as value from prod.PO
        where
        createdAt >='${req.query.from}' and createdAt <='${req.query.to}'
        and stepId in (select id from base.DEPARTMENT where NAME LIKE N'%Lựa%')
        and po.factoryId =${req.query.factoryId} and endPO = 0 and approvedByAccount is not null and number not like N'PO%' order by number
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = route