const express = require('express')
const productionOrder = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')

const {
    Po,
    Op,
    Item,
    OpeningStock,
    VItemInPackage,
    sequelize
} = require('../../../../models')

const moment = require('moment')
moment.locale('vi')

productionOrder.get('/number', (req, res, next) => {
    new mssql.Request()
        .input('year', req.query.year)
        .input('week', req.query.week)
        .query(
            'select distinct [number] from prod.PO',
            (err, record) => {
                if (err) {
                    console.log(err)
                    return res.api.sendFail(getErrorMessage(4907))
                }
                res.api.sendData(record.recordset)
            }
        )
})

productionOrder.get('/numbers', async(req, res) => {
    const { recordset } = await new mssql.Request()
        .query(
            'SELECT DISTINCT number from prod.PO'
        )
    res.status(200).send(recordset.map(n => n.number))
})

productionOrder.put('/:code', async(req, res) => {
    const { code } = req.params
    const { data } = req.body
    console.log(data)
    const { soLuongUuTien } = req.body.data
    if (soLuongUuTien !== undefined) {
        console.log('Số lượng ưu tiên:', soLuongUuTien)
        const po = await Po.findOne({
            where: {
                code
            }
        })
        const quantity = soLuongUuTien - po.soLuongUuTien
        const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} 
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq
                    )
                select distinct * from temp0
                `)
        const dinhMuc = await new mssql.Request().query(`
    WITH temp0(id, rate)
    as(
      select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${po.itemId})
      Union All
      select b.MATERIALS_ID as id, b.RATE as rate
      from temp0 as a, prod.BOM as b
      where a.id = b.ITEM_ID
    )
    select distinct * from temp0
  GO;
    
    `)

        if (congDoanDuois.recordset.length > 0) {
            const congDonBiTrus = congDoanDuois.recordset.map(s => s.stepId).filter(s => s != po.stepId)
            const pos = await Po.findAll({
                where: {
                    number: po.number,
                    itemId: po.itemId
                }
            })

            pos.forEach(async p => {
                console.log('Cong doan:', p.stepId)
                const foundStep = congDonBiTrus.find(s => s == p.stepId)
                if (foundStep) {
                    await p.decrement({
                        hanMucTon: quantity
                    })
                } else {
                    console.log('Khong tim thay')
                }
            })
        }

        if (dinhMuc.recordset.length > 0) {
            const chiTiets = dinhMuc.recordset.filter(d => d.id != po.itemId).map(i => i.id)
            console.log('Chi tiet:', chiTiets)
            const lsx = await Po.findAll({
                where: {
                    number: po.number,
                    itemId: {
                        [Op.in]: chiTiets
                    }
                }
            })
            lsx.forEach(async p => {
                const foundDinhMuc = await dinhMuc.recordset.find(d => d.id == p.itemId)
                await p.decrement({
                    hanMucTon: foundDinhMuc ? foundDinhMuc.rate * quantity : quantity
                })
            })
        }
    }
    await Po.update(data, {
        where: {
            code
        }
    })
    res.status(200).send('Ok')
})

productionOrder.get('/:number/:stepId/thuc-hien', async(req, res) => {
    const data = await new mssql.Request().query(`
  select kh.*, i.NAME sanPham, d.NAME congDoan, 
  CAST(
  CASE
      WHEN kh.xuat is null THEN 0
    WHEN kh.keHoach = 0 THEN 1
      ELSE kh.xuat / kh.keHoach
  END*100 as NUMERIC) as tyLe
  from (
  select po.code, po.number, po.root, po.keHoach, po.quantity, po.ton, po.xuatTon, po.stepId, po.itemId, s.xuat from prod.PO po
  left join (select pa.PO, iip.ITEM_ID, pa.SOURCE_ID, sum(iip.QUANTITY) xuat from prod.ITEM_IN_PACKAGE iip 
  left join prod.PACKAGE pa on pa.ID = iip.PACKAGE_ID
  where pa.SOURCE_ID in (${req.params.stepId}) and pa.TYPE_ID = 100026 and pa.PO is not null and pa.PO in (
    select code from prod.PO where number in (N'${req.params.number}') and deletedAt is null
  )
  group by pa.PO, iip.ITEM_ID, pa.SOURCE_ID
  ) as s on po.code = s.PO
  where number in (N'${req.params.number}') and po.stepId in (${req.params.stepId}) and po.deletedAt is null
  ) kh
  left join base.ITEM i on i.ID = kh.itemId
  left join base.DEPARTMENT d on d.ID = kh.stepId
  `)
    res.status(200).send(data.recordset)
})

productionOrder.get('/:stepId/ton-tai-to', async(req, res) => {
    const data = await new mssql.Request()
        .input('FROM_ID', req.params.stepId)
        .query(`
  select I.Id itemId,
  I.CODE itemCode,
  I.NAME itemName,
  I.LENGTH itemLenght,
  I.WIDTH itemWidth,
  I.HEIGHT itemHeight,
  I.UNIT_ID, ton.ton from (
    select ITEM_ID itemId, SUM(quantity) as ton
        from (
                  select iip.ITEM_ID, sum(iip.QUANTITY) as quantity
            from prod.ITEM_IN_PACKAGE iip
              left join prod.PACKAGE p on iip.PACKAGE_ID = p.ID
              left join prod.PO po on po.code = p.PO
            where DESTINATION_ID = @FROM_ID /*and p.VERIFY_DATE is not null*/ and p.TYPE_ID = 100026 
            and p.PO in (select code from prod.PO where deletedAt is null and endPO = 0 and approvedAt is not null) --and (po.number = @LENHSX or @FROM_ID in (select ID from base.DEPARTMENT where NAME like N'%đóng gói%' and TYPE2 = 'department')) and p.VERIFY_DATE is not null and p.TYPE_ID = 100026
            group by iip.ITEM_ID
  
          UNION ALL
  
            select m.ITEM_ID, -sum(m.QUANTITY) as quantity
            from prod.MATERIALS_IN_PACKAGE m
              left join prod.ITEM_IN_PACKAGE iip on m.ITEM_IN_PACKAGE_ID = iip.ID
              left join prod.PACKAGE p on iip.PACKAGE_ID = p.ID
              left join prod.PO po on po.code = p.PO
            where SOURCE_ID = @FROM_ID and p.PO in (select code from prod.PO where deletedAt is null and endPO = 0 and approvedAt is not null) --and (po.number = @LENHSX or @FROM_ID in (select ID from base.DEPARTMENT where NAME like N'%đóng gói%' and TYPE2 = 'department'))
            group by m.ITEM_ID
        ) as x
        group by ITEM_ID
  ) ton
  left join base.ITEM i on i.ID = ton.itemId
  `)
    res.status(200).send(data.recordset)
})

productionOrder.get('/:stepId/lenh-san-xuat', async(req, res) => {
    const data = await new mssql.Request().query(`
    select distinct number from prod.po where stepId = ${req.params.stepId} and deletedAt is null order by number desc
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/ke-hoach-san-xuat-cong-doan', async(req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
  select x.*, x.keHoach + x.hanMucTon as canThucHien,x.keHoach + x.hanMucTon - x.soLuongUuTien as conThucHien, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, d.NAME stepName from (
    select * from prod.PO where approvedAt is null and deletedAt is null and endPo = 0 and soLuongUuTien is not null and factoryId = @factoryId
  ) x
  left join base.ITEM i on i.ID = x.itemId
  left join base.DEPARTMENT d on d.ID = x.stepId
  `)
    res.status(200).send(data.recordset)
})

productionOrder.get('/:factoryId/rp-ke-hoach-san-xuat', async(req, res) => {
    const { recordset } = await new mssql.Request().query(`
  select t.*, d.NAME stepName, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, ton-xuatTon as chuaXuat, soLuongDat, keHoach - soLuongUuTien + hanMucTon + ton + loiCongDon - v.soLuongDat as conThucHien from (
    select id,code,stepId,itemId,keHoach,ton,soLuongUuTien,hanMucTon,number,loiCongDon,xuatTon from prod.PO po where deletedAt is null and endPO = 0 and number in (select distinct number from prod.PO where deletedAt is null and endPO = 0 and approvedAt is not null and factoryId = ${req.params.factoryId}) -- and ton > xuatTon
  ) as t
  left join View_DatKeHoach v on v.poCode = t.code
  left join base.DEPARTMENT d on d.ID = t.stepId
  left join base.ITEM i on i.ID = t.itemId
  `)
    res.status(200).send(recordset)
})

productionOrder.get('/:number/ke-hoach-chi-tiet', async(req, res) => {
    const data = await new mssql.Request()
        .input('number', req.params.number)
        .query(`
    select x.*, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, d.NAME stepName from (
      select * from prod.PO where number = @number
    ) x
    left join base.ITEM i on i.ID = x.itemId
    left join base.DEPARTMENT d on d.ID = x.stepId
  `)
    res.status(200).send(data.recordset)
})

productionOrder.get('/lenh-san-xuat', async(req, res) => {
    const data = await new mssql.Request().query(`
  select x.*,  d.NAME as dongGoi from (
    select distinct number, ngayDongGoi, stepId from prod.po where deletedAt is null and stepId in (select ID from base.DEPARTMENT where NAME like '%gói%')
    ) x 
    left join base.DEPARTMENT d on d.ID = x.stepId
    
    order by ngayDongGoi DESC
  `)
    res.status(200).send(data.recordset)
})

productionOrder.get('/number-steps', (req, res, next) => {
    new mssql.Request()
        .input('year', req.query.year)
        .input('week', req.query.week)
        .query(
            `
      SELECT DISTINCT TOP (100) PERCENT p.number, p.stepId, d.NAME AS name
      FROM            prod.PO AS p LEFT OUTER JOIN
                               base.DEPARTMENT AS d ON d.ID = p.stepId
      WHERE p.status is null and p.endPO = 0 and p.approvedAt is not null and deletedAt is null and soLuongUuTien > ton
      ORDER BY p.number, p.stepId
      `,
            (err, record) => {
                if (err) {
                    console.log(err)
                    return res.api.sendFail(getErrorMessage(4907))
                }
                res.api.sendData(record.recordset)
            }
        )
})

productionOrder.get('/:code/nguon-phoi', async(req, res) => {
    const po = await Po.findOne({
        where: {
            code: req.params.code
        },
        raw: true
    })
    const openningStocks = await OpeningStock.findAll({
        attributes: ['nguonPhoi', [sequelize.fn('SUM', sequelize.col('quantity')), 'quantity']],
        where: {
            itemId: po.itemId
        },
        group: ['nguonPhoi'],
        raw: true
    })
    res.status(200).send(openningStocks)
})

productionOrder.get('/:stepId/lenh-san-xuat', async(req, res) => {
    const po = await Po.findAll({
        where: {
            stepId: req.params.stepId
                // approvedAt: { [Op.ne]: null },
                // endPO: 0
        },
        include: [{
            model: Item
        }, {
            model: VItemInPackage
        }]
    })
    res.status(200).send(po)
})

productionOrder.post('/:code/cap-phoi', async(req, res) => {
    const po = await Po.findOne({
        where: {
            code: req.params.code
        }
    })
    await po.increment({
        ton: req.body.quantity
    })
    const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} 
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq
                    )
                select distinct * from temp0
                `)
    const dinhMuc = await new mssql.Request().query(`
    WITH temp0(id, rate)
    as(
      select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${po.itemId})
      Union All
      select b.MATERIALS_ID as id, b.RATE as rate
      from temp0 as a, prod.BOM as b
      where a.id = b.ITEM_ID
    )
    select distinct * from temp0
  GO;
    
    `)

    if (congDoanDuois.recordset.length > 0) {
        const congDonBiTrus = congDoanDuois.recordset.map(s => s.stepId).filter(s => s != po.stepId)
        const pos = await Po.findAll({
            where: {
                number: po.number,
                itemId: po.itemId
            }
        })

        pos.forEach(async p => {
            console.log('Cong doan:', p.stepId)
            const foundStep = congDonBiTrus.find(s => s == p.stepId)
            if (foundStep) {
                await p.decrement({
                    keHoach: req.body.quantity
                })
            } else {
                console.log('Khong tim thay')
            }
        })
    }

    if (dinhMuc.recordset.length > 0) {
        const chiTiets = dinhMuc.recordset.filter(d => d.id != po.itemId).map(i => i.id)
        console.log('Chi tiet:', chiTiets)
        const lsx = await Po.findAll({
            where: {
                number: po.number,
                itemId: {
                    [Op.in]: chiTiets
                }
            }
        })
        lsx.forEach(async p => {
            const foundDinhMuc = await dinhMuc.recordset.find(d => d.id == p.itemId)
            await p.decrement({
                keHoach: foundDinhMuc ? foundDinhMuc.rate * req.body.quantity : req.body.quantity
            })
        })
    }

    const openningStocks = await OpeningStock.findAll({
        attributes: ['nguonPhoi', [sequelize.fn('SUM', sequelize.col('quantity')), 'quantity']],
        where: {
            itemId: po.itemId
        },
        group: ['nguonPhoi'],
        raw: true
    })
    let quantityRemain = req.body.quantity
    openningStocks.forEach(async o => {
        if (quantityRemain > 0) {
            await OpeningStock.create({
                itemId: po.itemId,
                departmentId: po.stepId,
                quantity: -quantityRemain,
                nguonPhoi: o.nguonPhoi,
                date: new Date(),
                poId: po.code,
                createdBy: req.body.createdBy
            })
            quantityRemain -= o.quantity
        }
    })

    res.status(200).send(po)
})

productionOrder.post('/:code/cap-phoi-2', async(req, res) => {
    console.log('A Phuong')
    const po = await Po.findOne({
        where: {
            code: req.params.code
        }
    })
    const o = await OpeningStock.findByPk(req.body.openingStockId)

    await o.increment({
        daXuat: req.body.quantity
    })

    await OpeningStock.create({
        itemId: po.itemId,
        departmentId: po.stepId,
        quantity: -req.body.quantity,
        nguonPhoi: o.nguonPhoi,
        date: new Date(),
        poId: po.code,
        createdBy: req.body.createdBy
    })
    await po.increment({
        ton: req.body.quantity
    })
    res.status(200).send(po)
})

productionOrder.get('/:factoryId/rp-thuc-hien-san-xuat', async(req, res) => {
    const { recordset } = await new mssql.Request().query(`
  select d.NAME stepName, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, t.*, v.soLuongDat, thucHien - case when v.soLuongDat is null then 0 else v.soLuongDat end as conThucHien from (
    select id, code, number, itemId, stepId, keHoach, soLuongUuTien, keHoach - soLuongUuTien + hanMucTon as thuanHung, loiCongDon, ton, xuatTon, ton - xuatTon as coTheXuat, keHoach - soLuongUuTien + ton + hanMucTon + loiCongDon as thucHien from prod.PO where deletedAt is null and approvedAt is not null and endPO = 0 and factoryId = ${req.params.factoryId} --and number = N'TH-W47-2020'
    ) t
    left join View_DatKeHoach v on v.poCode = t.code
      left join base.DEPARTMENT d on d.ID = t.stepId
      left join base.ITEM i on i.ID = t.itemId
    
      order by stepId, number desc
  `)
    res.status(200).send(recordset)
})

productionOrder.get('/:factoryId/rp-thuc-hien-dong-goi', async(req, res) => {
    const { recordset } = await new mssql.Request()
        .input('factoryId', req.params.factoryId)
        .query(`
  select d.NAME stepName, m.NAME marketName, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, t.*, v.soLuongDat, thucHien - case when v.soLuongDat is null then 0 else v.soLuongDat end as conThucHien from (
    select id, code,market, number, itemId, stepId, keHoach, soLuongUuTien, keHoach - soLuongUuTien + hanMucTon as thuanHung, loiCongDon, ton, xuatTon, ton - xuatTon as coTheXuat, keHoach - soLuongUuTien + ton + hanMucTon + loiCongDon as thucHien from prod.PO where parent is null and deletedAt is null and endPO = 0 and factoryId = @factoryId --and market=@market
    ) t
    left join View_DatKeHoach v on v.poCode = t.code
      left join base.DEPARTMENT d on d.ID = t.stepId
      left join base.ITEM i on i.ID = t.itemId
      left join base.MARKET m on m.CODE = t.market
      order by number desc
  `)
    res.status(200).send(recordset)
})

productionOrder.get('/steps', (req, res, next) => {
    let productsIds = ''
    if (req.query.productIds) { productsIds = req.query.productIds.join(',') }
    new mssql.Request()
        .query(`WITH temp(id)
  as(
    select distinct ITEM_ID as id from prod.BOM where ITEM_ID in (${productsIds})
    Union All
    select b.MATERIALS_ID as id
    from temp as a, prod.BOM as b
    where a.id = b.ITEM_ID
  )
  select distinct r.STEP_ID as id, d.NAME as name from prod.ROUTING r left join base.DEPARTMENT d on d.ID = STEP_ID
  where r.ITEM_ID in (
  select distinct id from temp
  )`, (err, record) => {
            if (err) {
                console.log(err)
                return res.api.sendFail(getErrorMessage(4907))
            }
            res.api.sendData(record.recordset)
        })
})

productionOrder.get(
    '/',
    (req, res, next) => {
        if (req.query.departmentId) {
            new mssql.Request()
                .input('year', req.query.year)
                .input('week', req.query.week)
                .query(
                    `select
            PO.[year],
            PO.week,
            PO.stepId,
            D.NAME stepName,
            PO.market,
            M.NAME tenVung,
            I.ID itemId,
            I.NAME tenSanPham,
            PO.quantity,
            PO.number,
            PO.factoryId
            from prod.PO PO
            left join base.MARKET M ON M.CODE = PO.market
            left join base.ITEM I ON I.ID = M.PRODUCT_ID
            left join base.DEPARTMENT D ON D.ID = PO.stepId
            where parent is null and PO.factoryId = ${req.query.factoryId} 
            `,
                    (err, record) => {
                        if (err) {
                            console.log(err)
                            return res.api.sendFail(getErrorMessage(4907))
                        }
                        res.api.sendData(record.recordset)
                    }
                )
        } else {
            next()
        }
    },
    (req, res, next) => {
        new mssql.Request()
            .input('year', req.query.year)
            .input('week', req.query.week)
            .input('market', req.query.market)
            .input('number', req.query.number)
            .query(getPo, (err, record) => {
                if (err) {
                    console.log(err)
                    return res.api.sendFail(getErrorMessage(4907))
                }
                record.recordset.forEach((e) => {
                    e.item = e.itemId
                    e.step = e.stepId
                    e.code = `PO${e.code}`
                    e.parent = e.parent ? `PO${e.parent}` : ''
                    delete e.itemId
                    delete e.stepId
                })
                res.setHeader(
                    'x-response-description',
                    JSON.stringify({
                        field: {
                            item: 'itemId',
                            step: 'departmentId'
                        }
                    })
                )
                record.recordset.map((po) => {
                    po.thoiGianCanSanXuat = po.thoiGianCanSanXuat / (60 * 60 * 8)
                    po.thoiGianBatDau = moment(po.ngayDongGoi)
                        .subtract(Math.ceil(po.thoiGianBatDau + po.thoiGianCho), 'days')
                        .format('L')
                })
                res.api.sendData(record.recordset)
            })
    }
)

productionOrder.post(
    '/',
    async(req, res, next) => {
        if (req.body.po) { next() } else {
            new mssql.Request()
                .input('year', req.body.year)
                .input('week', req.body.week)
                .input('market', req.body.market)
                .input('number', req.body.number)
                .input('factoryId', req.body.factoryId)
                .query(getPo, (err, record) => {
                    if (err) {
                        console.log(err)
                        return res.api.sendFail(getErrorMessage(4907))
                    }
                    if (record.recordset.length > 0) {
                        return res.api.sendFail(getErrorMessage(420))
                    } else {
                        next()
                    }
                })
        }
    },
    (req, res, next) => {
        new mssql.Request().query(getBomAndRouting, (err, record) => {
            if (err) {
                console.log(err)
                return res.api.sendFail(getErrorMessage(4907))
            }
            if (req.body.po) { req.bom = [] } else { req.bom = record.recordsets[0] || [] }
            req.routing = record.recordsets[1] || []
            req.productionTimeNorms = record.recordsets[2] || []
            req.os = []
            req.po = require('./function/phanGiaiDinhMucAndDinhTuyen')(
                req.bom,
                req.routing,
                req.os,
                0
            )(
                req.body.departmentId,
                parseInt(req.body.itemId),
                parseInt(req.body.quantity)
            )
            if (req.po.length > 0) {
                next()
            } else {
                res.api.sendData([])
            }
        })
    },
    async(req, res, next) => {
        await req.po.forEach((e) => {
            if (e.parent === 0 && !req.body.po) {
                e.parent = null
                e.market = req.body.market
            }
            e.number = req.body.number
            e.week = req.body.week
            e.year = req.body.year
            e.root = req.body.market
            e.ngayDongGoi = req.body.ngayDongGoi
            e.factoryId = req.body.factoryId
            e.fromPo = req.body.po ? req.body.po : null
            let thoiGianCongDoanTruoc = 0
            let myParent = e.parent
            let poParent = req.po.find((po) => po.code === myParent)
            while (poParent) {
                const po1 = req.po.filter((po) => po.stepId === poParent.stepId)
                thoiGianCongDoanTruoc = po1.reduce(function(accumulator, po) {
                    return accumulator + po.ngayLamViec
                }, 0)
                myParent = poParent.parent
                poParent = req.po.find((po) => po.code === myParent)
                e.thoiGianCho += thoiGianCongDoanTruoc
            }
        })
        next()
    },
    async(req, res, next) => {
        await req.po.forEach(async e => {
            const oldPo = await Po.findAll({
                attributes: [
                    [
                        sequelize.fn('SUM', sequelize.col('ngayLamViec')),
                        'tongNgayLamViec'
                    ]
                ],
                where: {
                    status: {
                        [Op.is]: null
                    },
                    stepId: e.stepId
                },
                raw: true
            })
            e.thoiGianCho += oldPo[0].tongNgayLamViec
        })
        next()
    },
    async(req, res, next) => {
        await req.po.filter(p => p.parent !== 0).forEach(async(e) => {
            try {
                const foundPo = await Po.findOne({
                    where: {
                        number: e.number,
                        itemId: e.itemId,
                        stepId: e.stepId,
                        market: e.market ? e.market : null,
                        fromPo: e.fromPo
                    }
                })
                if (foundPo === null) await Po.create(e)
                else {
                    await foundPo.increment({
                        quantity: e.quantity,
                        ton: e.ton,
                        thoiGianCho: e.thoiGianCho,
                        thoiGianBatDau: e.thoiGianBatDau,
                        ngayLamViec: e.ngayLamViec,
                        thoiGianCanSanXuat: e.thoiGianCanSanXuat,
                        thoiGianThucHien: e.thoiGianThucHien,
                        keHoach: e.keHoach
                    })
                }
            } catch (error) {
                console.log(error)
                return res.api.sendFail(getErrorMessage(4907))
            }
        })
        next()
    },
    (req, res, next) => {
        // dánh dấu đã sinh lệnh sản xuất bù phôi lỗi
        next()
    },
    (req, res) => {
        res.api.sendData([])
    }
)

productionOrder.get('/:stepId/ke-hoach-thuc-hien', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
  select * from (
    select
                       PO.week,
                       PO.code code,
                       PO.endPO,
                       PO.ngayDongGoi,
                       PO.ton,
                       PO.thoiGianCho,
                       PO.thoiGianBatDau,
                       PO.ngayLamViec,
                       PO.caLamViec,
                       PO.market,
                       PO.loiCongDon,
                       ROUND(PO.keHoach,6) keHoach,
                       PO.daNhanTon,
                       PO.thoiGianCanSanXuat,
                       PO.thoiGianThucHien,
                       PO.keHoach - PO.quantity as xuatTon,
                       D.ID stepId,
                       D.NAME stepName,
                       M.NAME root,
                       P.NAME productName,
                       I.ID itemId,
                       I.CODE itemCode,
                       I.NAME itemName,
                       I.LENGTH itemLength,
                       I.WIDTH itemWidth,
                       I.HEIGHT itemHeight,
                       ROUND(PO.quantity,6) target,
                       CASE
                           WHEN SL.quantity IS NULL THEN 0
                           ELSE ROUND(SL.quantity,6)
                       END AS 'totalQuantity',
                       ROUND(PO.keHoach - PO.soLuongUuTien + PO.ton + PO.hanMucTon + PO.loiCongDon-(CASE
                           WHEN SL.quantity IS NULL THEN 0
                           ELSE ROUND(SL.quantity,6)
                       END),6) conThucHien,
                       SLN.quantity quantityByDay,
                       PO.number,
                       ERR.error,
                       CASE
                           WHEN PO.status IS NULL THEN N'Đang sản xuất'
                           ELSE PO.status
                       END AS 'status'
                       from prod.PO PO
                       left join base.ITEM I ON I.ID = PO.itemId
                       left join base.DEPARTMENT D ON D.ID  = PO.stepId
                       left join base.MARKET M ON M.CODE = PO.root
                       left join base.ITEM P ON P.ID = M.PRODUCT_ID
                       LEFT JOIN (
                           select P.PO,SUM(IIP.QUANTITY) quantity
                           from prod.PACKAGE P
                           left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                           left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                           WHERE 
                           (PT.TYPE_ID <> 100000 OR PT.TYPE_ID IS NULL)
                           AND (PT.TYPE_ID <> 400000 OR PT.TYPE_ID IS NULL)
                           GROUP BY P.PO
                       ) SL ON SL.PO = PO.code
                       LEFT JOIN (
                           select P.PO,SUM(IIP.QUANTITY) quantity
                           from prod.PACKAGE P
                           left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                           left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                           WHERE PT.TYPE_ID <> 100000
                           AND PT.TYPE_ID <> 400000
                           AND CAST(P.CREATE_DATE  AS DATE) = CAST(GETDATE() AS DATE)
                           GROUP BY P.PO
                       ) SLN ON SLN.PO = PO.code
                        LEFT JOIN (
                               select P.PO,SUM(IIP.QUANTITY) error
                               from prod.PACKAGE P
                               left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                               left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                               WHERE (PT.TYPE_ID = 100000 OR PT.TYPE_ID = 400000)
                               GROUP BY P.PO
                           ) ERR ON ERR.PO = PO.code
               where stepId = @stepId and approvedAt is not null and endPO = 0 and deletedAt is null
   ) as x
   where conThucHien > 0
   order by number
  `)
    res.status(200).send(keHoachThucHien.recordset)
})
productionOrder.post('/:factoryId/san-xuat', async(req, res) => {
    console.log('req.body')
    console.log(req.body)
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.body.stepId)
        .input('itemId', req.body.itemId)
        .query(`
  select * from (
    select
                       PO.week,
                       PO.code code,
                       PO.endPO,
                       PO.ngayDongGoi,
                       PO.ton,
                       PO.thoiGianCho,
                       PO.thoiGianBatDau,
                       PO.ngayLamViec,
                       PO.caLamViec,
                       PO.market,
                       PO.loiCongDon,
                       ROUND(PO.keHoach,6) keHoach,
                       PO.daNhanTon,
                       PO.thoiGianCanSanXuat,
                       PO.thoiGianThucHien,
                       PO.keHoach - PO.quantity as xuatTon,
                       D.ID stepId,
                       D.NAME stepName,
                       M.NAME root,
                       P.NAME productName,
                       I.ID itemId,
                       I.CODE itemCode,
                       I.NAME itemName,
                       I.LENGTH itemLength,
                       I.WIDTH itemWidth,
                       I.HEIGHT itemHeight,
                       ROUND(PO.quantity,6) target,
                       CASE
                           WHEN SL.quantity IS NULL THEN 0
                           ELSE ROUND(SL.quantity,6)
                       END AS 'totalQuantity',
                       ROUND(PO.keHoach - PO.soLuongUuTien + PO.ton + PO.hanMucTon + PO.loiCongDon-(CASE
                           WHEN SL.quantity IS NULL THEN 0
                           ELSE ROUND(SL.quantity,6)
                       END),6) conThucHien,
                       SLN.quantity quantityByDay,
                       PO.number,
                       ERR.error,
                       CASE
                           WHEN PO.status IS NULL THEN N'Đang sản xuất'
                           ELSE PO.status
                       END AS 'status'
                       from prod.PO PO
                       left join base.ITEM I ON I.ID = PO.itemId
                       left join base.DEPARTMENT D ON D.ID  = PO.stepId
                       left join base.MARKET M ON M.CODE = PO.root
                       left join base.ITEM P ON P.ID = M.PRODUCT_ID
                       LEFT JOIN (
                           select P.PO,SUM(IIP.QUANTITY) quantity
                           from prod.PACKAGE P
                           left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                           left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                           WHERE 
                           (PT.TYPE_ID <> 100000 OR PT.TYPE_ID IS NULL)
                           AND (PT.TYPE_ID <> 400000 OR PT.TYPE_ID IS NULL)
                           GROUP BY P.PO
                       ) SL ON SL.PO = PO.code
                       LEFT JOIN (
                           select P.PO,SUM(IIP.QUANTITY) quantity
                           from prod.PACKAGE P
                           left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                           left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                           WHERE PT.TYPE_ID <> 100000
                           AND PT.TYPE_ID <> 400000
                           AND CAST(P.CREATE_DATE  AS DATE) = CAST(GETDATE() AS DATE)
                           GROUP BY P.PO
                       ) SLN ON SLN.PO = PO.code
                        LEFT JOIN (
                               select P.PO,SUM(IIP.QUANTITY) error
                               from prod.PACKAGE P
                               left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                               left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                               WHERE (PT.TYPE_ID = 100000 OR PT.TYPE_ID = 400000)
                               GROUP BY P.PO
                           ) ERR ON ERR.PO = PO.code
               where stepId = @stepId and I.ID = @itemId and approvedAt is not null and endPO = 0 and deletedAt is null
   ) as x
   where conThucHien > 0
   order by x.WEEK
  `)
    res.status(200).send(keHoachThucHien.recordset)
})
productionOrder.get('/:stepId/san-pham', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
  select * from (
    select
  
                       I.ID itemId,
                       I.CODE itemCode,
                       I.NAME itemName,
                       I.LENGTH itemLength,
                       I.WIDTH itemWidth,
                       I.HEIGHT itemHeight,
                      
                      
                       SUM(ROUND(PO.keHoach - PO.soLuongUuTien + PO.ton + PO.hanMucTon + PO.loiCongDon-(CASE
                           WHEN SL.quantity IS NULL THEN 0
                           ELSE ROUND(SL.quantity,6)
                       END),6)) conThucHien
                      
                       
                       from prod.PO PO
                       left join base.ITEM I ON I.ID = PO.itemId
                       left join base.DEPARTMENT D ON D.ID  = PO.stepId
                       left join base.MARKET M ON M.CODE = PO.root
                       left join base.ITEM P ON P.ID = M.PRODUCT_ID
                       LEFT JOIN (
                           select P.PO,SUM(IIP.QUANTITY) quantity
                           from prod.PACKAGE P
                           left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                           left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                           WHERE 
                           (PT.TYPE_ID <> 100000 OR PT.TYPE_ID IS NULL)
                           AND (PT.TYPE_ID <> 400000 OR PT.TYPE_ID IS NULL)
                           GROUP BY P.PO
                       ) SL ON SL.PO = PO.code
                       LEFT JOIN (
                           select P.PO,SUM(IIP.QUANTITY) quantity
                           from prod.PACKAGE P
                           left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                           left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                           WHERE PT.TYPE_ID <> 100000
                           AND PT.TYPE_ID <> 400000
                           AND CAST(P.CREATE_DATE  AS DATE) = CAST(GETDATE() AS DATE)
                           GROUP BY P.PO
                       ) SLN ON SLN.PO = PO.code
                        LEFT JOIN (
                               select P.PO,SUM(IIP.QUANTITY) error
                               from prod.PACKAGE P
                               left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                               left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                               WHERE (PT.TYPE_ID = 100000 OR PT.TYPE_ID = 400000)
                               GROUP BY P.PO
                           ) ERR ON ERR.PO = PO.code
               where stepId = @stepId and approvedAt is not null and endPO = 0 and deletedAt is null
               GROUP BY 
             
               I.ID,
               I.CODE ,
               I.NAME ,
               I.LENGTH ,
               I.WIDTH ,
               I.HEIGHT 
   ) as x
   where conThucHien > 0
  
   
  `)
    res.status(200).send(keHoachThucHien.recordset)
})
productionOrder.get('/:code/thuc-hien', async(req, res) => {
    const data = await new mssql.Request()
        .input('code', req.params.code)
        .query(
            `
            select *, x.quantity - x.loiCongDon as sanLuongTruLoi, x.ton - x.xuatTon as conTon, x.keHoach - x.soLuongUuTien + x.hanMucTon + x.loiCongDon - x.quantity + x.ton as conThucHien from (
            select CONCAT('PO',PO1.code) code,
    PO1.daNhanTon,
    PO1.stepId,
    PO1.number,
    PO1.week,
    PO1.year,
    PO1.market,
    PO1.ngayDongGoi,
    PO1.factoryId,
    PO1.keHoach,
    PO1.hanMucTon,
    PO1.soLuongUuTien,
    PO1.loiCongDon,
    PO1.xuatTon,
    D.NAME stepName,
            R.STEP_ID stepNextId,
            N.NAME stepNextName,
            orderNext.[order],
            I.Id itemId,
            I.CODE itemCode,
            I.NAME itemName,
            I.LENGTH itemLenght,
            I.WIDTH itemWidth,
            I.HEIGHT itemHeight,
            I.UNIT_ID,
            ROUND(PO1.quantity,6) 'target',
            PO1.ton,
            CASE
                WHEN SL.quantity IS NULL THEN 0
                ELSE SL.quantity
            END AS 'quantity',
            ERR.error,
            CASE
                WHEN PO1.status IS NULL THEN N'Đang sản xuất'
                ELSE PO1.status
            END AS 'status'
            --, OS.QUANTITY tonDauKy
    from prod.PO PO1
    left join prod.PO PO2 on PO2.itemId = PO1.itemId and PO2.stepId = PO1.stepId and PO2.week = PO1.week and PO2.[year] = PO1.[year]
            LEFT JOIN base.ITEM I ON I.ID = PO1.itemId
            LEFT JOIN base.DEPARTMENT D ON D.ID = PO1.stepId
            LEFT JOIN (
                SELECT PO.stepId stepId,R.[ORDER] + 1 'order'
                FROM prod.PO PO
                LEFT JOIN prod.ROUTING R ON R.ITEM_ID = PO.itemId AND PO.stepId = R.STEP_ID
                WHERE PO.code = @code
            ) orderNext ON orderNext.stepId = PO1.stepId
            LEFT JOIN prod.ROUTING R ON R.ITEM_ID = PO1.itemId AND R.[ORDER] = orderNext.[order]
            LEFT JOIN base.DEPARTMENT N ON N.ID = R.STEP_ID
            LEFT JOIN (
                select P.PO,SUM(IIP.QUANTITY) quantity
                from prod.PACKAGE P
                left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                WHERE 
                (PT.TYPE_ID <> 100000 OR PT.TYPE_ID IS NULL)
                AND (PT.TYPE_ID <> 400000 OR PT.TYPE_ID IS NULL)
                GROUP BY P.PO
            ) SL ON SL.PO = PO1.code
            LEFT JOIN (
                select P.PO,SUM(IIP.QUANTITY) error
                from prod.PACKAGE P
                left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                WHERE (PT.TYPE_ID = 100000 OR PT.TYPE_ID = 400000)
                GROUP BY P.PO
            ) ERR ON ERR.PO = PO1.code
            --LEFT JOIN prod.OPENING_STOCK OS ON OS.PO_ID = PO1.code
    where PO2.code = @code
    ) x
    `)

    const data2 = await new mssql.Request()
        .input('code', req.params.code)
        .query(
            `
            declare @LENHSX nvarchar(100), @FROM_ID int, @ITEM_ID int, @NGUONPHOI int
select @LENHSX = number, @FROM_ID = stepId, @ITEM_ID = itemId from prod.PO where code = '${req.params.code}'
            select * from (
              select ITEM_ID, SUM(quantity) as ton
                      from (
                           select ITEM_ID, -QUANTITY as QUANTITY
                              from prod.MATERIALS_IN_PACKAGE
                              where ITEM_IN_PACKAGE_ID in (
                select ID
                                  from prod.ITEM_IN_PACKAGE
                                  where PACKAGE_ID in (
                  select ID
                                  from prod.PACKAGE
                                  where PO is not null and PO in (select code
                                      from prod.PO
                                      where deletedAt is null and endPO = 0 and approvedAt is not null
                                      ) and SOURCE_ID = @FROM_ID
                )
              ) and (ITEM_ID = @ITEM_ID or ITEM_ID in(
                select B.MATERIALS_ID
                          from prod.BOM B
                          where B.ITEM_ID = @ITEM_ID
              ))
                          union all
                              select ITEM_ID, QUANTITY
                              from prod.ITEM_IN_PACKAGE
                              where PACKAGE_ID in (
                  select ID
                                  from prod.PACKAGE
                                  where PO is not null and PO in (select code
                                      from prod.PO
                                      where deletedAt is null and endPO = 0 and approvedAt is not null
                                      ) and DESTINATION_ID = @FROM_ID and TYPE_ID = 100026  and VERIFY_DATE is not null
                ) and (ITEM_ID = @ITEM_ID or ITEM_ID in(
                select B.MATERIALS_ID
                          from prod.BOM B
                          where B.ITEM_ID = @ITEM_ID
              ))) as x
              group by ITEM_ID
              ) as NL left join base.ITEM I on I.ID = NL.ITEM_ID
              where ton > =0
    `)
    const result = data.recordset.find(p => p.code === `PO${req.params.code}`)

    res.status(200).send({...result, nguyenLieu: data2.recordset })
})

productionOrder.get(
    '/:code/supplies',
    (req, res, next) => {
        req.params.code = req.params.code.replace('PO', '')
        new mssql.Request()
            .input('code', req.params.code)
            .query(getVatTuHoaChatParent, (err, record) => {
                if (err) {
                    console.log(err)
                    return res.api.sendFail(getErrorMessage(4907))
                }
                req.kq = []
                record.recordset.forEach((e) => {
                    req.kq.push(e)
                })
                next()
            })
    },
    (req, res, next) => {
        new mssql.Request()
            .input('code', req.params.code)
            .query(getVatTuHoaChatChild, (err, record) => {
                if (err) {
                    console.log(err)
                    return res.api.sendFail(getErrorMessage(4907))
                }
                record.recordset.forEach((e) => {
                    req.kq.push(e)
                })
                res.api.sendData(req.kq)
            })
    }
)

const getVatTuHoaChatParent = `WITH temp(id,code,parent ,alevel)
as (
        Select id,code,parent, 0 as aLevel
        From prod.PO
        Where code = @code
        Union All
        Select b.id, b.code, b.parent, a.alevel + 1
        From temp as a, prod.PO as b
        Where a.parent = b.code
)
Select 
CONCAT('PO',t.code) po,
I.ID suppliesId,
I.NAME supplies,
V.ID vendorId,
V.NAME vendor,
PS.QUANTITY quantity,
PS.PARCEL parcel,
A.LAST_NAME createBy,
PS.CREATE_DATE createDate
From temp t
left join prod.PALLET_SUPPLIES PS ON PS.PO = t.code
left join base.ITEM I ON I.ID = PS.SUPPLIES_ID
left join base.VENDOR V ON V.ID = PS.VENDOR_ID
left join base.ACCOUNT A ON A.ID = PS.CREATE_BY
where PS.SUPPLIES_ID is not null
and t.code <> @code
`

const getVatTuHoaChatChild = `
WITH temp(id,code,parent,alevel)
        as (
                Select id,code,parent , 0 as aLevel
                From prod.PO
                Where code = @code
                Union All
                Select b.id, b.code, b.parent, a.alevel + 1
                From temp as a, prod.PO as b
                Where a.code = b.parent
        )
        Select 
        CONCAT('PO',t.code) po,
        I.ID suppliesId,
        I.NAME supplies,
        V.ID vendorId,
        V.NAME vendor,
        PS.QUANTITY quantity,
        PS.PARCEL parcel,
        A.LAST_NAME createBy,
        PS.CREATE_DATE createDate
        From temp t
        left join prod.PALLET_SUPPLIES PS ON PS.PO = t.code
        left join base.ITEM I ON I.ID = PS.SUPPLIES_ID
        left join base.VENDOR V ON V.ID = PS.VENDOR_ID
                left join base.ACCOUNT A ON A.ID = PS.CREATE_BY
        where PS.SUPPLIES_ID is not null

`

productionOrder.post('/:code/supplies', (req, res, next) => {
    req.params.code = req.params.code.replace('PO', '')
    new mssql.Request()
        .input('PO', req.params.code)
        .input('SUPPLIES_ID', req.body.suppliesId)
        .input('QUANTITY', req.body.quantity)
        .input('PARCEL', req.body.parcel)
        .input('VENDOR_ID', req.body.vendorId)
        .input('CREATE_BY', req.headers[''])
        .query(
            `INSERT INTO prod.PALLET_SUPPLIES(GUID,PO,SUPPLIES_ID,QUANTITY,PARCEL,VENDOR_ID,CREATE_BY,CREATE_DATE)
        VALUES (NEWID(),@PO,@SUPPLIES_ID,@QUANTITY,@PARCEL,@VENDOR_ID,@CREATE_BY,GETDATE())`,
            (err, record) => {
                if (err) {
                    console.log(err)
                    return res.api.sendFail(getErrorMessage(4907))
                }
                res.api.sendData([])
            }
        )
})

// productionOrder.put('/:code', (req, res, next) => {
//   req.params.code = req.params.code.replace('PO', '')
//   new mssql.Request()
//     .input('code', req.params.code)
//     .input('status', req.body.status)
//     .query(
//             `update prod.PO
//                 set [status] = @status, updatedAt = getdate()
//                 where code = @code`,
//             (err, record) => {
//               if (err) {
//                 console.log(err)
//                 return res.api.sendFail(getErrorMessage(4907))
//               }
//               res.api.sendData([])
//             }
//     )
// })

productionOrder.put(
    '/',
    (req, res, next) => {
        new mssql.Request().query(getBomAndRouting, (err, record) => {
            if (err) {
                console.log(err)
                return res.api.sendFail(getErrorMessage(4907))
            }
            req.bom = record.recordsets[0] || []
            req.routing = record.recordsets[1] || []
            req.productionTimeNorms = record.recordsets[2] || []
            req.os = record.recordsets[3] || []
            req.po = require('./function/phanGiaiDinhMucAndDinhTuyen')(
                req.bom,
                req.routing,
                req.os,
                0
            )(
                req.body.departmentId,
                parseInt(req.body.itemId),
                parseInt(req.body.quantity)
            )
            if (req.po.length > 0) {
                next()
            } else {
                res.api.sendData([])
            }
        })
    },
    (req, res, next) => {
        new mssql.Request()
            .input('market', req.body.market)
            .input('year', req.body.year)
            .input('week', req.body.week)
            .input('number', req.body.number)
            .query(
                `WITH temp(id,code,parent, stepId, itemId, quantity, ton, soLuongUuTien, hanMucTon, soLuongCanSanXuat,market ,alevel)
        as (
                Select id,code,parent,stepId, itemId, quantity, ton, soLuongUuTien, hanMucTon, soLuongCanSanXuat,market , 0 as aLevel
                From prod.PO
                Where parent is null
                and market = @market
                and [year] = @year
                and week = @week
                and [number] = @number
                Union All
                Select b.id, b.code, b.parent,b.stepId, b.itemId, b.quantity, b.ton, b.soLuongUuTien, b.hanMucTon, b.soLuongCanSanXuat,b.market , a.alevel + 1
                From temp as a, prod.PO as b
                Where a.code = b.parent
        )
        Select *
        From temp`,
                (err, record) => {
                    if (err) {
                        console.log(err)
                        return res.api.sendFail(getErrorMessage(4907))
                    }
                    const po = record.recordset.find((i) => i.parent == null)
                    if (po) {
                        const firtCode = po.code - 1
                        req.po.forEach((e) => {
                            if (e.parent === 0) {
                                e.parent = null
                                e.market = req.body.market
                            } else {
                                e.parent = parseInt(e.parent) + firtCode
                            }
                            e.code = parseInt(e.code) + firtCode
                            let thoiGianCongDoanTruoc = 0
                            let myParent = e.parent
                            let poParent = req.po.find((po) => po.code === myParent)
                            while (poParent) {
                                const po1 = req.po.filter((po) => po.stepId === poParent.stepId)
                                thoiGianCongDoanTruoc = po1.reduce(function(accumulator, po) {
                                    return accumulator + po.ngayLamViec
                                }, 0)
                                myParent = poParent.parent
                                poParent = req.po.find((po) => po.code === myParent)
                                e.thoiGianCho += thoiGianCongDoanTruoc
                            }
                        })
                        record.recordset.forEach(async(e) => {
                            const buf = req.po.find((i) => i.code === e.code)
                            if (buf) {
                                try {
                                    await Po.update({
                                        quantity: buf.quantity,
                                        thoiGianBatDau: buf.thoiGianBatDau,
                                        thoiGianCho: buf.thoiGianCho,
                                        ngayLamViec: buf.ngayLamViec,
                                        thoiGianCanSanXuat: buf.thoiGianCanSanXuat
                                    }, {
                                        where: {
                                            code: e.code
                                        }
                                    })
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                        })
                        res.api.sendData([])
                    } else {
                        return res.api.sendFail([])
                    }
                }
            )
    }
)

const getPo = `
WITH temp(id,code,parent, stepId, itemId, quantity, ton, soLuongUuTien, hanMucTon, soLuongCanSanXuat,market, thoiGianBatDau, thoiGianCanSanXuat,caLamViec,ngayLamViec, thoiGianCho, ngayDongGoi, factoryId, alevel)
        as (
                Select id,code,parent,stepId, itemId, quantity, ton, soLuongUuTien, hanMucTon, soLuongCanSanXuat,market, thoiGianBatDau, thoiGianCanSanXuat , caLamViec,ngayLamViec, thoiGianCho, ngayDongGoi, factoryId, 0 as aLevel
                From prod.PO
                Where parent is null
                and market = @market
                and [year] = @year
                and week = @week
                and [number] = @number
                Union All
                Select b.id, b.code, b.parent,b.stepId, b.itemId, b.quantity, b.ton, b.soLuongUuTien, b.hanMucTon, b.soLuongCanSanXuat,b.market, b.thoiGianBatDau, b.thoiGianCanSanXuat , b.caLamViec, b.ngayLamViec, b.thoiGianCho, b.ngayDongGoi, b.factoryId, a.alevel + 1
                From temp as a, prod.PO as b
                Where a.code = b.parent
                --and [number] = 1
        )
        Select t.id,
        t.code,
        t.parent,
        t.stepId,
        t.itemId,
        t.quantity 'target',
        t.market,
        t.alevel,
        t.ton,
        t.ngayDongGoi,
        E.QUANTITY error,
        P.QUANTITY quantity,
        t.thoiGianBatDau,
        t.thoiGianCanSanXuat,
        t.caLamViec,
        t.ngayLamViec,
        t.factoryId,
        t.thoiGianCho,
        (P.QUANTITY/t.quantity) rate,
        @number number
        From temp t
        left join (
            select P.SOURCE_ID,p.DESTINATION_ID, P.PO, IIP.ITEM_ID, SUM(IIP.QUANTITY) QUANTITY
            from prod.PACKAGE P
            left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
            left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
            WHERE (PT.TYPE_ID <> 100000  OR PT.TYPE_ID IS NULL) AND ( PT.TYPE_ID <> 400000 OR PT.TYPE_ID IS NULL)
            GROUP BY P.SOURCE_ID,p.DESTINATION_ID, P.PO, IIP.ITEM_ID
        ) P ON P.PO = t.code
        left join (
            select P.SOURCE_ID,p.DESTINATION_ID, P.PO, IIP.ITEM_ID, SUM(IIP.QUANTITY) QUANTITY
            from prod.PACKAGE P
            left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
            left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
            WHERE PT.TYPE_ID = 100000 OR PT.TYPE_ID = 400000 
            GROUP BY P.SOURCE_ID,p.DESTINATION_ID, P.PO, IIP.ITEM_ID
        ) E ON E.PO = t.code
        order by t.code
`

const getBomAndRouting = `SELECT ID id, ITEM_ID itemId, MATERIALS_ID materialsId, RATE rate
FROM prod.BOM
GO
SELECT * FROM View_ROUTINGD
GO
select ID, DEPARTMENT_ID stepId, ITEM_ID itemId,[TIME] 'time', QUANTITY quantity
from prod.PTN
`

module.exports = productionOrder