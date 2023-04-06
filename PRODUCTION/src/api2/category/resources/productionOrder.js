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
    sequelize,
    Market,
    View_TonDauKy,
    V_GhiLoi100004,
    V_GhiDat100026,
    V_NhapVe100026
} = require('../../../../models')

const moment = require('moment')
moment.locale('vi')
// tỷ lệ hoàn thành lệnh sản xuất
productionOrder.get('/:factoryId/ke-hoach-san-xuat-con', async(req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
 
  select * from (
    select number,week,ROUND( AVG(case when tiLeTH >1 then 1 else tiLeTH end)*100,1) avgTiLeTH from (
      select number,week, case when v.soLuongDat is null then 0 else v.soLuongDat end / (PO.keHoach - PO.namhong - PO.th - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon+PO.loiCongDon) as tiLeTH from prod.PO
      left join View_DatKeHoach v on PO.code = v.poCode
        where  po.approvedAt is not null and po.deletedAt is null and po.endPO = 0 and factoryId = @factoryId and PO.keHoach - PO.namhong - PO.th - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon > 0
        and number in (
            select distinct number from prod.PO po
            left join View_DatKeHoach v on po.code = v.poCode
            where  v.soLuongDat is null or (po.approvedAt is not null and po.deletedAt is null and po.endPO = 0 and factoryId = @factoryId and keHoach > v.soLuongDat)
        ) and PO.stepId NOT IN (102347, 102855, 102789, 100274, 100264, 102370, 102809)
      ) x
   
    group by number,week 
   ) c
      where ROUND(c.avgTiLeTH,1) <100 and number not like '%BTP%'
      order by week desc,number desc
      `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/ke-hoach-san-xuat-con-BTP', async(req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
 
  select * from (
    select number,week,ROUND( AVG(case when tiLeTH >1 then 1 else tiLeTH end)*100,1) avgTiLeTH from (
      select number,week, case when v.soLuongDat is null then 0 else v.soLuongDat end / (PO.keHoach - PO.namhong - PO.th - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon+PO.loiCongDon) as tiLeTH from prod.PO
      left join View_DatKeHoach v on PO.code = v.poCode
        where  po.approvedAt is not null and po.deletedAt is null and po.endPO = 0 and factoryId = @factoryId and PO.keHoach - PO.namhong - PO.th - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon > 0
        and number in (
            select distinct number from prod.PO po
            left join View_DatKeHoach v on po.code = v.poCode
            left join 
            (SELECT        SUM(quantity) AS baoloi, code, stepId
            FROM            prod.HandleQc
            WHERE        (code IS NOT NULL)
            GROUP BY code, stepId) AS loi ON loi.code = po.code AND loi.stepId = po.stepId
            where  v.soLuongDat is null or (po.approvedAt is not null and po.deletedAt is null and po.endPO = 0 and factoryId = @factoryId and keHoach - v.soLuongDat+loi.baoloi>0)
        ) and PO.stepId NOT IN (102347, 102855, 102789, 100274, 100264, 102370, 102809)
      ) x
   
    group by number,week 
   ) c
      where ROUND(c.avgTiLeTH,1) <100 and number like '%BTP%'
      order by week desc,number desc
      `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/ke-hoach-san-xuat-con-CLAIM', async(req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
 
  select * from (
    select number,week,ROUND( AVG(tiLeTH)*100,1) avgTiLeTH from (
      select number,week, case when v.soLuongDat is null then 0 else v.soLuongDat end / (PO.keHoach - PO.namhong - PO.th - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon+PO.loiCongDon) as tiLeTH from prod.PO
      left join View_DatKeHoach v on PO.code = v.poCode
        where  po.approvedAt is not null and po.deletedAt is null and po.endPO = 0 and factoryId = @factoryId and PO.keHoach - PO.namhong - PO.th - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon > 0
        and number in (
            select distinct number from prod.PO po
            left join View_DatKeHoach v on po.code = v.poCode
            where  v.soLuongDat is null or (po.approvedAt is not null and po.deletedAt is null and po.endPO = 0 and factoryId = @factoryId and keHoach > v.soLuongDat)
        ) and PO.stepId NOT IN (102347, 102855, 102789, 100274, 100264, 102370, 102809)
      ) x
   
    group by number,week 
   ) c
      where ROUND(c.avgTiLeTH,1) <100 and number like '%CLAIM%'
      order by week desc,number desc
      `)
    res.status(200).send(data.recordset)
})
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

productionOrder.get('/:factoryId/numbers', async(req, res) => {
    const { factoryId } = req.params
    const { recordset } = await new mssql.Request().input('factoryId', factoryId).query(
        `
      SELECT DISTINCT number from prod.PO where factoryId = @factoryId
    `
    )
    res.status(200).send(recordset)
})

productionOrder.get('/:number/lay-ke-hoach-thuc-hien-san-xuat', async(req, res) => {
    const { number } = req.params

    const pos = await Po.findAll({
        where: {
            parent: {
                [Op.eq]: null
            },
            number
        },
        include: [{
            model: Market
        }]
    })

    res.status(200).send(pos)
})

productionOrder.get('/:number/tao-lai-ke-hoach-dong-goi', async(req, res) => {
    // const { number } = req.params

    // const data = await Po.findAll({
    //   where: {
    //     parent: {
    //       [Op.eq]: null
    //     },
    //     number
    //   },
    //   include: [{
    //     model: Market
    //   }]
    // })
    // for (let index = 0; index < data.length; index++) {
    //   const element = data[index];
    //   console.log(element.itemId)
    //   console.log(element.keHoach)
    //   console.log(element.)
    // }
    // res.status(200).send([])
})
productionOrder.get('/deletePoById', async(req, res) => {
    new mssql.Request()
        .input('id', req.query.id)
        .query(
            'delete from prod.PO where id = @id',
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
    await new mssql.Request().query(`
  delete prod.ROUTING where STEP_ID not in (select id from base.DEPARTMENT)
delete prod.ROUTING where ITEM_ID is null
delete prod.ROUTING where STEP_ID is null
update prod.ROUTING set factoryId = 100000 where factoryId is null
  `)
    await new mssql.Request().query(`
  ALTER VIEW [dbo].[View_ROUTINGD]
  AS
  SELECT       R.ID, R.ITEM_ID AS itemId, R.STEP_ID AS stepId, R.[ORDER] as [order], R.thoiGianThucHien, D.caLamViec, R.factoryId
  FROM            prod.ROUTING AS R LEFT OUTER JOIN
                           base.DEPARTMENT AS D ON R.STEP_ID = D.ID
    `)
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
    const { ys1a, ys1b, tb, soLuongUuTien,th,namhong } = req.body.data
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
                        and ITEM_ID = ${po.itemId} and factoryId = ${po.factoryId}
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.factoryId = ${po.factoryId}
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
    if (th !== undefined) {
       
        const po = await Po.findOne({
            where: {
                code
            }
        })
        const quantity = th - po.th
        const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} and factoryId = ${po.factoryId}
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.factoryId = ${po.factoryId}
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
    if (namhong !== undefined) {
       
        const po = await Po.findOne({
            where: {
                code
            }
        })
        const quantity = namhong - po.namhong
        const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} and factoryId = ${po.factoryId}
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.factoryId = ${po.factoryId}
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
    if (ys1a !== undefined) {
        console.log('So Luong nhap ve tu YS1a:', ys1a)
        const po = await Po.findOne({
            where: {
                code
            }
        })
        const quantity = ys1a - po.ys1a
        const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} and factoryId = ${po.factoryId}
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.factoryId = ${po.factoryId}
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
    if (ys1b !== undefined) {
        console.log('So luong nhap ve tu YS1b:', ys1a)
        const po = await Po.findOne({
            where: {
                code
            }
        })
        const quantity = ys1b - po.ys1b
        const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} and factoryId = ${po.factoryId}
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.factoryId = ${po.factoryId}
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
    if (tb !== undefined) {
       
        const po = await Po.findOne({
            where: {
                code
            }
        })
        const quantity = tb - po.tb
        const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId}  and factoryId = ${po.factoryId}
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.factoryId = ${po.factoryId}
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
    const data = await new mssql.Request().input('FROM_ID', req.params.stepId)
        .execute('KiemTraTonTaiTo')
        // const data = await new mssql.Request()
        //   .input('FROM_ID', req.params.stepId)
        //   .query(`
        //   select I.Id itemId,
        //   I.CODE itemCode,
        //   I.NAME itemName,
        //   I.LENGTH itemLenght,
        //   I.WIDTH itemWidth,
        //   I.HEIGHT itemHeight,
        //   I.UNIT_ID, ton.ton from (
        //     select ITEM_ID itemId, SUM(quantity) as ton
        //         from (
        //                   select iip.ITEM_ID, sum(iip.QUANTITY) as quantity
        //             from prod.ITEM_IN_PACKAGE iip
        //               left join prod.PACKAGE p on iip.PACKAGE_ID = p.ID
        //               left join prod.PO po on po.code = p.PO
        //             where DESTINATION_ID = @FROM_ID and p.VERIFY_DATE is not null and p.TYPE_ID = 100026 and p.PO is not null
        //       and po.endPO = 0 and po.approvedAt is not null and po.deletedAt is null
        //             group by iip.ITEM_ID

    //           UNION ALL

    //             select m.ITEM_ID, -sum(m.QUANTITY) as quantity
    //             from prod.MATERIALS_IN_PACKAGE m
    //               left join prod.ITEM_IN_PACKAGE iip on m.ITEM_IN_PACKAGE_ID = iip.ID
    //               left join prod.PACKAGE p on iip.PACKAGE_ID = p.ID
    //               left join prod.PO po on po.code = p.PO
    //             where SOURCE_ID = @FROM_ID and p.PO is not null
    //       and po.endPO = 0 and po.approvedAt is not null and po.deletedAt is null
    //             group by m.ITEM_ID
    //         ) as x
    //         group by ITEM_ID
    //   ) ton

    //   left join base.ITEM i on i.ID = ton.itemId
    // `)
    res.status(200).send(data.recordset)
})

productionOrder.get('/:stepId/ton-nhap-ve', async(req, res) => {
    const data = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
    select ITEM_ID itemId, DEPARTMENT_ID stepId, SUM(QUANTITY-daXuat) as conTon from prod.OPENING_STOCK where DEPARTMENT_ID = @stepId and PO_ID is null and QUANTITY-daXuat > 0
    group by ITEM_ID, DEPARTMENT_ID
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:stepId/ton-cong-doan', async(req, res) => {
    const data = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
        select chitiet,height,width,length,VOLUMN,congdoan,itemId,stepId,market
        , case when VOLUMN = 1 then 0 else tondk end tondk
        , case when VOLUMN = 1 then 0 else nhapTH end nhapTH
        , case when VOLUMN = 1 then 0 else nhapYS end nhapYS
        , case when VOLUMN = 1 then 0 else nhapTB end nhapTB
        , case when VOLUMN = 1 then 0 else xuat end xuat
        , case when VOLUMN = 1 then 0 else nhapkhac end nhapkhac
        , case when VOLUMN = 1 then 0 else loi end loi
        , case when VOLUMN = 1 then 0 else tonck end tonck
        ,tondk*VOLUMN tondkM,nhapTH*VOLUMN nhapTHM,nhapYS*VOLUMN nhapYSM,nhapTB*VOLUMN nhapTBM
        ,xuat*VOLUMN xuatM,nhapkhac*VOLUMN nhapkhacM,loi*VOLUMN loiM,tonck*VOLUMN tonckM from
        (select I.NAME chitiet,I.height,I.width,I.length,I.VOLUMN,'['+d.CODE+'] ' + D.NAME congdoan,[itemId],[stepId],[market],sum(tondk) tondk,sum(nhapTH) nhapTH,sum(nhapYS) nhapYS,
        sum(nhapTB) nhapTB,sum(xuat) xuat,sum(nhapkhac) nhapkhac,sum(loi) loi,sum(tonck) tonck  from
        (select [itemId],[stepId],[market],sum(tondk) tondk,0 nhapTH,0 nhapYS,0 nhapTB,0 xuat,0 nhapkhac,0 loi,0 tonck  from [dbo].[View_ton_dk_congdoan] where  createdAt <'${req.query.startDate}'
        GROUP BY [itemId],[stepId],[market]
        union all
        select [itemId],[stepId],[market],0 tondk,sum(nhapTH) nhapTH,sum(nhapYS) nhapYS,sum(nhapTB) nhapTB,sum(xuat) xuat,sum(nhapkhac) nhapkhac,sum(loi) loi,0 tonck from View_nhap_congdoan
        where  createdAt >'${req.query.startDate}' and createdAt <'${req.query.endDate}'
        GROUP BY [itemId],[stepId],[market]
        union all
        select [itemId],[stepId],[market],0 tondk,0 nhapTH,0 nhapYS,0 nhapTB,0 xuat,0 nhapkhac,0 loi,sum(tondk) tonck  from [dbo].[View_ton_dk_congdoan] where  createdAt <'${req.query.endDate}'
        GROUP BY [itemId],[stepId],[market]) h
        left join base.ITEM I on I.ID = h.itemId
        left join base.DEPARTMENT D on D.ID = h.stepId
      
        where D.NAME is not null and I.NAME is not null
        GROUP BY [itemId],[stepId],[market],I.NAME,I.VOLUMN,D.CODE,D.NAME,I.height,I.width,I.length)  k
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:stepId/ton-ghi-nhan', async(req, res) => {
    const data = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
        select chitiet,height,width,length,VOLUMN,congdoan,itemId,stepId,TonThucTe,market_code
        ,case when TonThucTe is null then 0 else(TonThucTe-tondk) end chenhlechSL
		,case when TonThucTe is null or tondk = 0 then 0 else(TonThucTe-tondk)/tondk*100 end chenhlechphantram
        , case when VOLUMN = 1 then 0 else tondk end tonck
        from
        (select I.NAME chitiet,I.height,I.width,I.length,I.VOLUMN,'['+d.CODE+'] ' + D.NAME congdoan,[itemId],[stepId],sum(tondk) tondk,sum(TonThucTe) TonThucTe,market_code from
        (select [itemId],[stepId],sum(tondk) tondk,0 nhapTH,0 nhapYS,0 nhapTB,0 xuat,0 nhapkhac,0 loi,0 tonck  from [dbo].[View_ton_dk_congdoan]
        where createdAt <'${req.query.endDate}' 
        GROUP BY [itemId],[stepId]) h
        left join base.ITEM I on I.ID = h.itemId
        left join base.DEPARTMENT D on D.ID = h.stepId
		left join (select DEPARTMENT_ID,IDSanPham,sum(TonThucTe) TonThucTe,market_code from  prod.GhiNhanTonThucTe
		GROUP BY DEPARTMENT_ID,IDSanPham,market_code) g on g.DEPARTMENT_ID = h.stepId and g.IDSanPham = h.itemId
      
         where D.NAME is not null
        GROUP BY [itemId],[stepId],I.NAME,I.VOLUMN,D.CODE,D.NAME,I.height,I.width,I.length,market_code)  k
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:fa/cap-nhat-qc', async(req, res) => {
    const data = await new mssql.Request()
        .input('fa', req.params.fa)
        .query(`
        update base.ACCOUNT 
        set factoryId = @fa where ID = ${req.query.roleId}
  `)
    res.status(200).send(data.recordset)
})
productionOrder.post('/ton-ghi-nhan', (req, res, next) => {
        const query = `
        INSERT INTO [prod].[GhiNhanTonThucTe]
           ([DEPARTMENT_ID]
           ,[IDSanPham]
           ,[TonThucTe]
           ,[market])
     VALUES
           (${req.body.DEPARTMENT_ID}
           ,${req.body.IDSanPham}
           ,${req.body.TonThucTe}
           ,N'${req.body.market}')
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
productionOrder.get('/:stepId/ton-cong-doan-ngang', async(req, res) => {
    const data = await new mssql.Request()
        .input('factoryId', req.params.stepId)
        .input('startDate', req.query.startDate)
        .input('endDate', req.query.endDate)
        .execute('Proc_Proc_TonCongDoan_ALL')
    res.status(200).send(data.recordset)
})
productionOrder.post('/ton-cong-doan-2', async(req, res) => {
    let query = "";
    if(req.body.departmentId == 102299){
        query = `
        with CTE_ton as
(
        select TON.itemId, TON.stepId, TON.market, 
        case when I.VOLUMN = 1 then 0 else TON.tondk end tondk,
        case when I.VOLUMN = 1 then 0 else TON.nhap end nhap,
        case when I.VOLUMN = 1 then 0 else TON.xuat end xuat,
        case when I.VOLUMN = 1 then 0 else TON.nhapton end nhapton
        ,I.NAME chitiet,'['+d.CODE+'] ' + D.NAME congdoan,I.height,I.width,I.length,I.VOLUMN
        ,TON.tondk*I.VOLUMN tonDauKyM,TON.nhap*I.VOLUMN nhapM,TON.xuat*I.VOLUMN xuatM,TON.nhapton*I.VOLUMN nhaptonM
        ,case when I.VOLUMN = 1 then 0 else TON.tondk+TON.nhap-TON.xuat+ TON.nhapton end tonCuoiKy,ROUND((TON.tondk+TON.nhap-TON.xuat+TON.nhapton)*I.VOLUMN,4) tonCuoiKyM, CONVERT(nvarchar, gd.[ORDER]) + ' '+ UPPER(gd.NAME) groupName, gd.NAME groupDepartment from
        (select itemId,stepId,market,sum(tondk) tondk,sum(nhap) nhap,sum(xuat) xuat,sum(nhapton) nhapton  from
        (select itemId,stepId,market, sum(nhap) tondk,0 nhap,0 xuat,0 loi,0 nhapton from V_NhapVe100026s where createdAt<'${req.body.startDate}'
        group by itemId,stepId,market
        union all
        select itemId,stepId,market, sum(-xuat) tondk,0 nhap,0 xuat,0 loi,0 nhapton from V_GhiDat100026s where createdAt<'${req.body.startDate}'
        group by itemId,stepId,market
        union all
        select ID itemId,DESTINATION_ID stepId,'' market,sum(KL) tondk,0 nhap,0 xuat,0 loi,0 nhapton from View_nhap_go_tuoi where CREATED_AT<'${req.body.startDate}'
        group by ID,DESTINATION_ID
        union all
        select ITEM_ID itemId,DESTINATION_ID stepId,'' market,sum(-sl) tondk,0 nhap,0 xuat,0 loi,0 nhapton from View_san_luong_say where EXPORT_DATE<'${req.body.startDate}'
        group by ITEM_ID,DESTINATION_ID
        union all
        select itemId,stepId,market, sum(quantity) tondk,0 nhap,0 xuat,0 loi,0 nhapton from View_TonDauKy where createdAt<'${req.body.startDate}'
        group by itemId,stepId,market
        union all
        select itemId,stepId,market, 0 tondk,sum(nhap) nhap,0 xuat,0 loi,0 nhapton from V_NhapVe100026s where createdAt>='${req.body.startDate}' and createdAt<'${req.body.endDate}'
        group by itemId,stepId,market
        union all
        select itemId,stepId,market, 0 tondk,0 nhap,sum(xuat) xuat,0 loi,0 nhapton from V_GhiDat100026s where createdAt>='${req.body.startDate}' and createdAt<'${req.body.endDate}'
        group by itemId,stepId,market
        union all
        select ID itemId,DESTINATION_ID stepId,'' market, 0 tondk,sum(KL) nhap,0 xuat,0 loi,0 nhapton from View_nhap_go_tuoi where CREATED_AT>='${req.body.startDate}' and CREATED_AT<'${req.body.endDate}'
        group by ID,DESTINATION_ID
        union all
        select ITEM_ID itemId,DESTINATION_ID stepId,'' market, 0 tondk,0 nhap,sum(sl) xuat,0 loi,0 nhapton from View_san_luong_say where EXPORT_DATE>='${req.body.startDate}' and EXPORT_DATE<'${req.body.endDate}'
        group by ITEM_ID,DESTINATION_ID
        union all
        select itemId,stepId,market, 0 tondk,0 nhap,0 xuat,0 loi,sum(quantity) nhapton from View_TonDauKy where createdAt>='${req.body.startDate}' and createdAt<'${req.body.endDate}'
        group by itemId,stepId,market) B
        group by itemId,stepId,market) TON
        left join base.ITEM I on TON.itemId = I.ID
        left join base.DEPARTMENT D on D.ID = TON.stepId
        left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
        )
select * from CTE_ton
        `
    }else{
        let strDepartment = "";
    req.body.arrDepartment.forEach(el => {
        strDepartment += el + ", "
    });
    strDepartment = strDepartment.substring(0, strDepartment.length-2);
        query = `
        with CTE_ton as
(
        select TON.itemId, TON.stepId, TON.market, 
        case when I.VOLUMN = 1 then 0 else TON.tondk end tondk,
        case when I.VOLUMN = 1 then 0 else TON.nhap end nhap,
        case when I.VOLUMN = 1 then 0 else TON.xuat end xuat,
        case when I.VOLUMN = 1 then 0 else TON.nhapton end nhapton
        ,I.NAME chitiet,'['+d.CODE+'] ' + D.NAME congdoan,I.height,I.width,I.length,I.VOLUMN
        ,TON.tondk*I.VOLUMN tonDauKyM,TON.nhap*I.VOLUMN nhapM,TON.xuat*I.VOLUMN xuatM,TON.nhapton*I.VOLUMN nhaptonM
        ,case when I.VOLUMN = 1 then 0 else TON.tondk+TON.nhap-TON.xuat+ TON.nhapton end tonCuoiKy,ROUND((TON.tondk+TON.nhap-TON.xuat+TON.nhapton)*I.VOLUMN,4) tonCuoiKyM, CONVERT(nvarchar, gd.[ORDER]) + ' '+ UPPER(gd.NAME) groupName, gd.NAME groupDepartment from
        (select itemId,stepId,market,sum(tondk) tondk,sum(nhap) nhap,sum(xuat) xuat,sum(nhapton) nhapton  from
        (select itemId,stepId,market, sum(nhap) tondk,0 nhap,0 xuat,0 loi,0 nhapton from V_NhapVe100026s where createdAt<'${req.body.startDate}'
        group by itemId,stepId,market
        union all
        select itemId,stepId,market, sum(-xuat) tondk,0 nhap,0 xuat,0 loi,0 nhapton from V_GhiDat100026s where createdAt<'${req.body.startDate}'
        group by itemId,stepId,market
        union all
        select ID itemId,DESTINATION_ID stepId,'' market,sum(KL) tondk,0 nhap,0 xuat,0 loi,0 nhapton from View_nhap_go_tuoi where CREATED_AT<'${req.body.startDate}'
        group by ID,DESTINATION_ID
        union all
        select ITEM_ID itemId,DESTINATION_ID stepId,'' market,sum(-sl) tondk,0 nhap,0 xuat,0 loi,0 nhapton from View_san_luong_say where EXPORT_DATE<'${req.body.startDate}'
        group by ITEM_ID,DESTINATION_ID
        union all
        select itemId,stepId,market, sum(quantity) tondk,0 nhap,0 xuat,0 loi,0 nhapton from View_TonDauKy where createdAt<'${req.body.startDate}'
        group by itemId,stepId,market
        union all
        select itemId,stepId,market, 0 tondk,sum(nhap) nhap,0 xuat,0 loi,0 nhapton from V_NhapVe100026s where createdAt>='${req.body.startDate}' and createdAt<'${req.body.endDate}'
        group by itemId,stepId,market
        union all
        select itemId,stepId,market, 0 tondk,0 nhap,sum(xuat) xuat,0 loi,0 nhapton from V_GhiDat100026s where createdAt>='${req.body.startDate}' and createdAt<'${req.body.endDate}'
        group by itemId,stepId,market
        union all
        select ID itemId,DESTINATION_ID stepId,'' market, 0 tondk,sum(KL) nhap,0 xuat,0 loi,0 nhapton from View_nhap_go_tuoi where CREATED_AT>='${req.body.startDate}' and CREATED_AT<'${req.body.endDate}'
        group by ID,DESTINATION_ID
        union all
        select ITEM_ID itemId,DESTINATION_ID stepId,'' market, 0 tondk,0 nhap,sum(sl) xuat,0 loi,0 nhapton from View_san_luong_say where EXPORT_DATE>='${req.body.startDate}' and EXPORT_DATE<'${req.body.endDate}'
        group by ITEM_ID,DESTINATION_ID
        union all
        select itemId,stepId,market, 0 tondk,0 nhap,0 xuat,0 loi,sum(quantity) nhapton from View_TonDauKy where createdAt>='${req.body.startDate}' and createdAt<'${req.body.endDate}'
        group by itemId,stepId,market) B
        group by itemId,stepId,market) TON
        left join base.ITEM I on TON.itemId = I.ID
        left join base.DEPARTMENT D on D.ID = TON.stepId
        left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
        )
select * from CTE_ton where stepId in (${strDepartment})
        `
    }

    
    const data = await new mssql.Request()
        .query(query)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:stepId/ton-tren-chuyen', async(req, res, next) => {
    const { stepId } = req.params
    const { startDate, endDate } = req.query
    console.log(startDate, endDate)
        // const startDate = moment().subtract(90, 'days').startOf('D').format().substring(0, 10)
        // const endDate = moment().endOf('D').format().substring(0, 10)
    const map = new Map()
    const item = { nhapquantity: 0, quantity: 0, NhapDauKy: 0, XuatDauKy: 0, tonDauKy: 0, loiDauKy: 0, nhap: 0, xuat: 0, loi: 0, chuanhan: 0, tonCuoiKy: 0, stepId }
        //tồn tại tổ
    const tontaito = await View_TonDauKy.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('quantity')), 'quantity']
        ],
        where: {
            stepId,
            createdAt: {
                [Op.lt]: startDate
            }
        },
        raw: true,
        group: ['itemId', 'market']
    })
    await tontaito.forEach(t => {
            if (map.has(t.itemId)) {
                console.log('xuat ton to:', t.quantity)
                map.get(t.itemId).quantity = t.quantity
            } else {
                map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, quantity: t.quantity })
            }

        })
        //nhập tôn tại tổ
    const nhaptontaito = await View_TonDauKy.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('quantity')), 'quantity']
        ],
        where: {
            stepId,

            createdAt: {
                [Op.between]: [startDate, endDate]
            }

        },
        raw: true,
        group: ['itemId', 'market']
    })
    await nhaptontaito.forEach(t => {
            if (map.has(t.itemId)) {
                console.log('xuat ton to:', t.quantity)
                map.get(t.itemId).nhapquantity = t.quantity
            } else {
                map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, nhapquantity: t.quantity })
            }

        })
        // Tồn đầu kỳ
    const tonDauKys = await V_NhapVe100026.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('nhap')), 'nhap']
        ],
        where: {
            stepId,
            [Op.and]: [{
                    createdAt: {
                        [Op.lt]: startDate
                    }
                },
                {
                    updatedAt: {
                        [Op.not]: null
                    }
                }
            ]

        },
        raw: true,
        group: ['itemId', 'market']
    })

    await tonDauKys.forEach(t => {
        if (map.has(t.itemId)) {
            map.get(t.itemId).NhapDauKy = t.nhap
        } else {
            map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, NhapDauKy: t.nhap })
        }
    })

    // Phôi lỗi đầu kỳ
    const loiDauKys = await V_GhiLoi100004.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('loi')), 'loi']
        ],
        where: {
            stepId,
            createdAt: {
                [Op.lt]: startDate
            }
        },
        raw: true,
        group: ['itemId', 'market']
    })

    await loiDauKys.forEach(t => {
        if (map.has(t.itemId)) {
            map.get(t.itemId).loiDauKy = t.loi
        } else {
            map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, loiDauKy: t.loi })
        }
    })

    // Nhập về
    const nhapVes = await V_NhapVe100026.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('nhap')), 'nhap']
        ],
        where: {
            stepId,
            [Op.and]: [{
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                {
                    updatedAt: {
                        [Op.not]: null
                    }
                }
            ]


        },
        raw: true,
        group: ['itemId', 'market']
    })
    await nhapVes.forEach(t => {
            if (map.has(t.itemId)) {
                console.log('san pham:', map.get(t.itemId))
                map.get(t.itemId).nhap = t.nhap
            } else {
                map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, nhap: t.nhap })
            }
        })
        //chưa nhận
    const chuanhans = await V_NhapVe100026.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('nhap')), 'nhap']
        ],
        where: {
            stepId,
            [Op.and]: [{
                    createdAt: {
                        [Op.lte]: endDate
                    }
                },
                {
                    updatedAt: {
                        [Op.is]: null
                    }
                }
            ]


        },
        raw: true,
        group: ['itemId', 'market']
    })
    await chuanhans.forEach(t => {
        if (map.has(t.itemId)) {
            console.log('san pham:', map.get(t.itemId))
            map.get(t.itemId).chuanhan = t.nhap
        } else {
            map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, chuanhan: t.nhap })
        }
    })
    const xuatPhoiston = await V_GhiDat100026.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('xuat')), 'xuat']
        ],
        where: {
            stepId,
            createdAt: {
                [Op.lt]: startDate
            }
        },
        raw: true,
        group: ['itemId', 'market']
    })
    await xuatPhoiston.forEach(t => {
            if (map.has(t.itemId)) {
                // console.log('xuat dau ky:', t.xuat)
                map.get(t.itemId).XuatDauKy = t.xuat

            } else {
                // console.log('xuat dau ky:', t.xuat)
                map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, XuatDauKy: t.xuat })
                    // console.log('xuat dau ky:', XuatDauKy)
            }
        })
        // Xuất đi
    const xuatPhois = await V_GhiDat100026.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('xuat')), 'xuat']
        ],
        where: {
            stepId,
            createdAt: {
                [Op.between]: [startDate, endDate]
            }
        },
        raw: true,
        group: ['itemId', 'market']
    })
    await xuatPhois.forEach(t => {
        if (map.has(t.itemId)) {
            // console.log('xuat ky:', t.xuat)
            // console.log('san pham:', map.get(t.itemId))
            map.get(t.itemId).xuat = t.xuat
        } else {
            map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, xuat: t.xuat })
        }
    })


    // Phôi lỗi
    const loiPhois = await V_GhiLoi100004.findAll({
        attributes: [
            'itemId', 'market', [sequelize.fn('SUM', sequelize.col('loi')), 'loi']
        ],
        where: {
            stepId,
            createdAt: {
                [Op.between]: [startDate, endDate]
            }
        },
        raw: true,
        group: ['itemId', 'market']
    })
    await loiPhois.forEach(t => {
        if (map.has(t.itemId)) {

            map.get(t.itemId).loi = t.loi
        } else {

            map.set(t.itemId, {...item, market: t.market, itemId: t.itemId, loi: t.loi })
        }
    })
    req.data = [...map.values()]
    next()
}, async(req, res) => {
    const items = await Item.findAll({ raw: true })
    const data = req.data
        .map(t => {
            const {market, itemId, nhapquantity, quantity, XuatDauKy, NhapDauKy, loiDauKy, nhap, xuat, loi, chuanhan } = t
            // console.log('xuat dau ky:', XuatDauKy)
            // console.log('xuat ky:', xuat)
            const item = items.find(i => i.id == itemId)
           // const p = items.find(i => i.id == t.market)
            return {...t, ...item, market, tonDauKy: quantity + NhapDauKy - XuatDauKy, tonCuoiKy: nhap > 0 ? quantity + NhapDauKy - XuatDauKy - loiDauKy + nhapquantity + nhap - xuat - loi + chuanhan : quantity + NhapDauKy - XuatDauKy - loiDauKy + nhapquantity - xuat - loi + chuanhan }
        })
    res.status(200).send(data)
})

productionOrder.get('/numberLSX', (req, res, next) => {
    new mssql.Request()
        .query(
            `
            SELECT I.ID, I.NAME, P.keHoach, B.FACTOR, 
            CASE 
                WHEN B.QUANTITY_THUC_TE IS NULL THEN 0
                ELSE B.QUANTITY_THUC_TE
            END QUANTITY_THUC_TE
            , B.VAN, 0 QUANTITY, P.code
            FROM prod.PO P INNER JOIN base.ITEM I 
            ON P.itemId = I.ID
            LEFT JOIN prod.BIRCH B ON I.ID = B.ITEM_ID AND P.number = B.NUMBER
            WHERE P.number = '${req.query.number}' AND P.stepId = 100266
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

productionOrder.post('/item-in-package-by-birch', (req, res, next) => {
    const data = req.body;
    let query = `
    INSERT INTO prod.ITEM_IN_PACKAGE (GUID ,PACKAGE_ID, ITEM_ID, QUANTITY, factoryId)
    VALUES (NEWID(), ${data.packageId}, ${data.itemId}, ${data.quantity}, ${data.factoryId})
    `;

    new mssql.Request()
        .query(query, (err, record) => {
            if (err) {
                console.log(err)
                return res.api.sendFail(query)
            }
            res.api.sendData(record.recordset)
        })
})

productionOrder.post('/birch', (req, res, next) => {
    const birch = req.body.birch;
    const number = req.body.number;
    const factoryId = req.body.factoryId;
    const accountId = req.body.accountId;
    let query = `
    INSERT INTO prod.BIRCH (NUMBER, ITEM_ID, QUANTITY_KE_HOACH, FACTOR, QUANTITY_THUC_TE, VAN)
    VALUES ('${number}', ${birch.ID}, ${birch.keHoach}, ${birch.HE_SO}, ${birch.QUANTITY}, ${birch.VAN})
    INSERT INTO prod.PACKAGE (SOURCE_ID, DESTINATION_ID, [TYPE_ID], CREATE_BY, CREATE_DATE, PO, factoryId)
    VALUES(102498, 100266, 100026, ${accountId}, GETDATE(), '${birch.code}', ${factoryId})
    SELECT ID FROM prod.PACKAGE WHERE PO = '${birch.code}' AND SOURCE_ID = 102498
    `;

    new mssql.Request()
        .query(query, (err, record) => {
            if (err) {
                console.log(err)
                return res.api.sendFail(query)
            }
            res.api.sendData(record.recordset)
        })
})
productionOrder.get('/:stepId/nhan-phoi-nhap-ve', async(req, res) => {
    const data = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
    select po.*, op.conTon, i.CODE itemCode, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, case when po.soLuong <= op.conTon then po.soLuong else op.conTon end as nhanVe from (
      select code, number, itemId, loiCongDon + namhong + ys1a + ys1b + tb + th + soLuongUuTien - ton as soLuong from prod.PO where stepId = @stepId and deletedAt is null and approvedAt is not null and endPO = 0 and ton < ys1a + ys1b + tb + th + soLuongUuTien
      ) po left join (select ITEM_ID itemId, SUM(QUANTITY-daXuat) as conTon from prod.OPENING_STOCK where DEPARTMENT_ID = @stepId and PO_ID is null and QUANTITY-daXuat > 0
      group by ITEM_ID) op on po.itemId = op.itemId
      left join base.ITEM i on i.ID = po.itemId
      where conTon is not null
  `)
    console.log(data.recordset)
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
    select x.*,M.NAME thitruong, x.keHoach  - x.namhong - x.th - x.ys1a - x.ys1b - x.tb + x.hanMucTon as canThucHien,x.keHoach + x.hanMucTon - x.soLuongUuTien as conThucHien, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, d.NAME stepName 
    ,AC.LAST_NAME SXduyet,AC1.LAST_NAME KHduyet from (
      select * from prod.PO where  deletedAt is null and endPo = 0  and number in (select number from (
      select number,week,ROUND( AVG(tiLeTH)*100,1) avgTiLeTH from (
        select number,week, case when v.soLuongDat is null then 0 else v.soLuongDat end / (PO.keHoach - PO.namhong - PO.th - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon) as tiLeTH from prod.PO
        left join View_DatKeHoach v on PO.code = v.poCode
          where  po.approvedAt is not null and po.deletedAt is null and po.endPO = 0 and factoryId = @factoryId and PO.keHoach - PO.namhong - PO.th - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon > 0
          and number in (
              select distinct number from prod.PO po
              left join View_DatKeHoach v on po.code = v.poCode
              where  v.soLuongDat is null or (po.approvedAt is not null and po.deletedAt is null and po.endPO = 0 and factoryId = @factoryId and keHoach > v.soLuongDat)
          )
        ) x
     
      group by number,week
     ) c
        where ROUND(c.avgTiLeTH,1) <100
        union all
        select distinct number from prod.PO where po.approvedAt is null and factoryId = @factoryId
        )
    ) x
    left join base.MARKET M on M.CODE = x.root
    left join base.ITEM i on i.ID = x.itemId
    left join base.ACCOUNT AC on AC.ID = x.approvedByAccount
    left join base.ACCOUNT AC1 on AC1.ID = x.KH_approvedByAccount
    left join base.DEPARTMENT d on d.ID = x.stepId 
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/ke-hoach-san-xuat-cong-doan-chua-duyet', async(req, res) => {
    const data = await new mssql.Request()
    .input('factoryId', req.params.factoryId)
    .input('week', req.query.week)
    .input('year', req.query.year)
    .query(`
  select x.*, x.keHoach  - x.namhong - x.th - x.ys1a - x.ys1b - x.tb + x.hanMucTon as canThucHien,x.keHoach + x.hanMucTon - x.soLuongUuTien as conThucHien, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, d.NAME stepName,A.LAST_NAME from (
    select * from prod.PO where deletedAt is null and factoryId = @factoryId and week = @week and year = @year and approvedByAccount is null
  ) x
  left join base.ITEM i on i.ID = x.itemId
  left join base.DEPARTMENT d on d.ID = x.stepId
  left join base.ACCOUNT A on A.ID = x.approvedByAccount
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/ke-hoach-san-xuat-cong-doan-phe-duyet', async(req, res) => {
    const data = await new mssql.Request()
    .input('factoryId', req.params.factoryId)
    .input('week', req.query.week)
    .input('year', req.query.year)
    .query(`
  select x.*,M.NAME maket, x.keHoach  - x.namhong - x.th - x.ys1a - x.ys1b - x.tb + x.hanMucTon as canThucHien,x.keHoach + x.hanMucTon - x.soLuongUuTien as conThucHien, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, d.NAME stepName,A.LAST_NAME from (
    select * from prod.PO where deletedAt is null and factoryId = @factoryId and week = @week and year = @year
  ) x
  left join base.ITEM i on i.ID = x.itemId
  left join base.DEPARTMENT d on d.ID = x.stepId
  left join base.ACCOUNT A on A.ID = x.approvedByAccount
  left join base.MARKET M on M.CODE = x.market
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/lich-su-sua-po', async(req, res) => {
    const data = await new mssql.Request()
    .input('factoryId', req.params.factoryId)
    .input('week', req.query.week)
    .input('year', req.query.year)
    .query(`
    select S.ID id,D.NAME congdoan,I.NAME sanpham,I.LENGTH,I.WIDTH,I.HEIGHT,PO.number,AC.LAST_NAME nguoisua,S.createdAt ngaysua
    ,S.keHoach,S.th,S.ys1a,S.ys1b,S.tb,S.namhong,S.updatekh
    from prod.SUA_PO S
    left join prod.PO PO on S.code = PO.code
    left join base.ACCOUNT AC on AC.ID = S.CREATE_BY
    left join base.ITEM I on I.ID = PO.itemId
    left join base.DEPARTMENT D on D.ID = PO.stepId
    where PO.factoryId = @factoryId and PO.week = @week and PO.year = @year
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/bc-trang-thai-lsx', async(req, res) => {
    const data = await new mssql.Request()
    .input('factoryId', req.params.factoryId)
    .input('week', req.query.week)
    .input('year', req.query.year)
    .query(`
    select C1.factoryId ,C1.number number,C1.createdAt,C1.approvedAt sxduyet,C1.KH_approvedAt,PH.number pcd,PH.approvedAt,X.number khosausay from
    (select DISTINCT   number, FIRST_VALUE(code)  
    over (PARTITION BY number ORDER BY approvedAt) code
    from prod.PO) C 
    left join
    (select * from prod.PO ) C1 ON C1.code = C.code
    left join (select DISTINCT number,approvedAt from prod.PHIEU_CHI_DINH where BX = '') PH on PH.number = C1.number
    left join (select DISTINCT number from prod.XUAT_GO) X on X.number = C1.number 
    where C1.factoryId = @factoryId and C1.year = @year and C1.week = @week
    order by C1.approvedAt desc
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/so-ke-hoach-san-xuat-cong-doan', async(req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
  select x.*, x.keHoach - x.namhong - x.th - x.ys1a - x.ys1b - x.tb + x.hanMucTon as canThucHien,x.keHoach + x.hanMucTon - x.soLuongUuTien as conThucHien, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, d.NAME stepName from (
    select * from prod.PO where approvedAt is not null and deletedAt is null and endPo = 0 and soLuongUuTien is not null and factoryId = @factoryId
  ) x
  left join base.ITEM i on i.ID = x.itemId
  left join base.DEPARTMENT d on d.ID = x.stepId
  `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/:factoryId/so-ke-hoach-san-xuat-cong-doan-2', async(req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
  select distinct number from prod.PO where approvedAt is not null and deletedAt is null and endPo = 0 and soLuongUuTien is not null and factoryId = @factoryId
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

productionOrder.get('/:departentId/number-steps', (req, res, next) => {
    new mssql.Request()
        .input('year', req.query.year)
        .input('week', req.query.week)
        .query(
            `
      SELECT  p.number, p.code, p.stepId, itemId
      FROM            prod.PO AS p 
      WHERE p.status is null and p.endPO = 0 and p.approvedAt is not null and deletedAt is null 
      ORDER BY p.number DESC
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
productionOrder.post('/:code/:code1/number-steps', (req, res, next) => {
    console.log('code:', req.params.code)
    new mssql.Request()
        .input('year', req.body.year)
        .input('week', req.query.week)
        .query(
            `select L.*,isnull(K.QUANTITY,0) QUANTITY,L.keHoach - isnull(K.QUANTITY,0) conthuhien from
    (SELECT  p.number, p.code, p.stepId, itemId,p.keHoach- namhong - th - ys1a-ys1b-tb + p.hanMucTon + p.loiCongDon as keHoach
    FROM            prod.PO AS p 
    WHERE p.status is null and p.endPO = 0 and p.approvedAt is not null and deletedAt is null 
    and p.stepId = '${req.params.code}'  and itemId = '${req.params.code1}') L 
    left join 
	(select P.PO,SUM(IT.QUANTITY) QUANTITY from prod.PACKAGE P
	left join prod.ITEM_IN_PACKAGE IT on P.ID = IT.PACKAGE_ID
	group by P.PO) K on K.PO = L.code
	where L.keHoach - isnull(K.QUANTITY,0)>0
    order by L.number
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

productionOrder.post('/:code/cap-phoi-3', async(req, res) => {
    const po = await Po.findOne({
        where: {
            code: req.params.code
        }
    })

    const { quantity } = req.body

    const tonNhapVes = await OpeningStock.findAll({
        where: {
            [Op.and]: [
                { departmentId: po.stepId },
                { itemId: po.itemId },
                sequelize.where(sequelize.literal('QUANTITY - daXuat'), {
                    [Op.gt]: 0
                })
            ]
        }
    }, { raw: true })

    let conLai = quantity

    await tonNhapVes.forEach(ton => {
        if (conLai > 0) {
            const coTheXuat = ton.quantity - ton.daXuat
            OpeningStock.create({
                itemId: po.itemId,
                departmentId: po.stepId,
                quantity: conLai <= coTheXuat ? conLai : coTheXuat,
                nguonPhoi: ton.nguonPhoi,
                date: new Date(),
                poId: po.code,
                createdBy: req.headers['x-gateway-account-id']
            })
            ton.increment({
                daXuat: conLai <= coTheXuat ? conLai : coTheXuat
            })
            conLai -= coTheXuat
        } else {
            return null
        }
    })

    await po.increment({
        ton: quantity
    })
    res.status(200).send(po)
})

productionOrder.get('/:factoryId/rp-thuc-hien-san-xuat', async(req, res) => {
    const { recordset } = await new mssql.Request().query(`
  select d.NAME stepName, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, t.*, v.soLuongDat, thucHien - case when v.soLuongDat is null then 0 else v.soLuongDat end + (ton - xuatTon) as conThucHien from (
    select id, code, number, itemId, stepId, keHoach, soLuongUuTien + namhong + ys1a + ys1b + tb + th as soLuongUuTien, keHoach + hanMucTon - soLuongUuTien - namhong - ys1a - ys1b - tb - th as thuanHung, loiCongDon, ton, xuatTon, ton - xuatTon as coTheXuat, keHoach + hanMucTon - soLuongUuTien - th - ys1a - ys1b - tb -th + xuatTon + loiCongDon as thucHien from prod.PO where deletedAt is null and approvedAt is not null and endPO = 0 and factoryId = ${req.params.factoryId} --and number = N'TH-W47-2020'
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
        new mssql.Request().input('factoryId', req.body.factoryId).query(getBomAndRouting, (err, record) => {
            if (err) {
                console.log(err)
                return res.api.sendFail(getErrorMessage(4907))
            }
            if (req.body.po) { req.bom = [] } else { req.bom = record.recordsets[0] || [] }
            req.routing = record.recordsets[1] || []
            req.productionTimeNorms = []
            req.os = []
            req.po = require('./function/phanGiaiDinhMucAndDinhTuyen')(
                req.bom,
                req.routing,
                req.os,
                0
            )(
                req.body.departmentId,
                parseInt(req.body.itemId),
                parseFloat(req.body.quantity)
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
            if((e.stepId == 100272||e.stepId == 100269 ||e.stepId == 100279 ||e.stepId == 102828 ||e.stepId == 102850  )) {
                e.market = req.body.market
            }
            e.number = req.body.number
            e.week = req.body.week
            e.year = req.body.year
            e.root = req.body.market
            e.ngayDongGoi = req.body.ngayDongGoi
            e.factoryId = req.body.factoryId
            e.fromPo = req.body.po ? req.body.po : null
            e.createBy = req.body.createBy
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
productionOrder.post('/nhan-phoi-nhieu-lenh', async(req, res) => {
    let condition = ``
    if ([102746,102747,102812,102829,100282,100270,100273,100272,100269,100279,102857].includes(req.body.stepId) == true ){
        condition = ` AND root =N'${req.body.root}'`
      
    } else {
        condition = ``
    }
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.body.stepId)
        .input('itemId', req.body.itemId)
        .input('root', req.body.root)
        .query(`
  select * from (
    select
                       PO.week,
                       PO.year,
                       PO.code code,
                       PO.endPO,
                       PO.ngayDongGoi,
                       PO.ton,
                       PO.thoiGianCho,
                       PO.thoiGianBatDau,
                       PO.ngayLamViec,
                       PO.caLamViec,
                       PO.root maket,
                       PO.loiCongDon,
                       ROUND(PO.keHoach,6) keHoach,
                       PO.daNhanTon,
                       PO.thoiGianCanSanXuat,
                       PO.thoiGianThucHien,
                       PO.keHoach - PO.quantity as xuatTon,
                       D.ID stepId,
                       D.NAME stepName,
                       case when PO.stepId in (102746,102812,100272,100269,100279,100273,100270,100282,102747,102857) then
                       M.NAME
                       else P.NAME end as root,
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
                       ROUND(PO.keHoach - namhong - th - ys1a-ys1b-tb + PO.hanMucTon+case when loi.baoloi is null then 0
                        else loi.baoloi end + PO.loiCongDon-(CASE
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
                       left join (select sum(quantity) baoloi,code,stepId from [prod].[HandleQc] where code is not null
                       GROUP BY code,stepId) loi on loi.code = PO.code and loi.stepId = PO.stepId
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
               where PO.stepId = @stepId and itemId = @itemId and approvedAt is not null and endPO = 0 and deletedAt is null 
   ) as x
   where conThucHien > 0 and  itemName is not null  ${condition}
   order by year,week,number
  `)
    res.status(200).send(keHoachThucHien.recordset)
})
productionOrder.get('/:stepId/san-pham', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
  select * from (
    select
                       PO.week,
                       PO.year,
                       PO.code code,
                       PO.endPO,
                       PO.ngayDongGoi,
                       PO.ton,
                       PO.thoiGianCho,
                       PO.thoiGianBatDau,
                       PO.ngayLamViec,
                       PO.caLamViec,
                       PO.root maket,
                       PO.loiCongDon,
                       ROUND(PO.keHoach,6) keHoach,
                       PO.daNhanTon,
                       PO.thoiGianCanSanXuat,
                       PO.thoiGianThucHien,
                       PO.keHoach - PO.quantity as xuatTon,
                       D.ID stepId,
                       D.NAME stepName,
                       case when PO.stepId in (100272,100269,100279,100273,100270,100282,102746,102812,102747,102851,102850,102857) then
                       M.NAME
                       else P.NAME end as root,
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
                       END - case when loi.baoloi is null then 0
                       else loi.baoloi end  AS 'totalQuantity',
                       ROUND(PO.keHoach - namhong - th - ys1a-ys1b-tb + PO.hanMucTon+case when loi.baoloi is null then 0
                       else loi.baoloi end  + PO.loiCongDon-(CASE
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
                       left join (select sum(quantity) baoloi,code,stepId from [prod].[HandleQc] where code is not null
                       GROUP BY code,stepId) loi on loi.code = PO.code and loi.stepId = PO.stepId
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
               where PO.stepId = @stepId and approvedAt is not null and endPO = 0 and deletedAt is null 
   ) as x
   where conThucHien > 0 and  itemName is not null
   order by year,week,number
  `)
    res.status(200).send(keHoachThucHien.recordset)
})
productionOrder.get('/:stepId/san-pham-tung-lenh', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
        select C1.*,P.number from
        (select DISTINCT   itemId,stepId,stepName, FIRST_VALUE(code)  
        over (PARTITION BY itemID,stepId ORDER BY approvedAt) code
        from dbo.View_conthuchien) C 
        left join
        (select * from dbo.View_conthuchien ) C1 ON C1.code = C.code
        left join prod.PO P on P.code = C1.code
        where C1.stepId = @stepId
        order by C1.loiCongDon DESC
  `)
    res.status(200).send(keHoachThucHien.recordset)
})
productionOrder.post('/ke-hoach-san-xuat-kythuat', async(req, res) => {

    try {
    const insertlsx = await new mssql.Request()
        .input('number', req.body.number)
        .input('xulybemat', req.body.xulybemat)
        .input('phukienkk', req.body.phukienkk)
        .input('nvlchinh', req.body.nvlchinh)
        .input('nvlphu', req.body.nvlphu)
        .input('keodan', req.body.keodan)
        .input('donggoisp', req.body.donggoisp)
        .input('yeucauchatluong', req.body.yeucauchatluong)
        .input('ghichu', req.body.ghichu)
        .input('tailieu', req.body.tailieu)
        .input('ngaybatdau', req.body.ngaybatdau)
        .input('ngayketthuc', req.body.ngayketthuc)
        .query(`insert into prod.YEUCAUKYTHUAT
         (number,NVLCHINH,NVLPHU,PHUKIENKIMKHI,KEODAN,DGSANPHAM,XULYBEMAT,YEUCAUCHATLUONG,GHICHU,TAILIEU,createdAt,end_date)
       values(@number,@nvlchinh,@nvlphu,@phukienkk,@keodan,@donggoisp,@xulybemat,@yeucauchatluong,@ghichu,@tailieu,@ngaybatdau,@ngayketthuc)`)
    res.status(200).send(insertlsx)
} catch (error) {
    res.status(500).send(error)
}

})
productionOrder.post('/ke-hoach-san-xuat-dinh-tuyen', async(req, res, next) => {
    const data = await new mssql.Request()
        .input('factoryId', req.body.factoryId)
        .input('lsx', req.body.lsx)
        .execute('Proc_DinhtuyenLSX')
    res.status(200).send(data.recordset)
})
productionOrder.post('/ke-hoach-san-xuat-cau-thanh', async(req, res, next) => {
    const data = await new mssql.Request()
        .input('factoryId', req.body.factoryId)
        .input('lsx', req.body.lsx)
        .query(`  INSERT INTO  prod.BOM_LSX  (ITEM_ID,MATERIALS_ID,[RATE],number)
        (select * from
        ( select DISTINCT PO.itemId,B.MATERIALS_ID,B.[RATE],PO.number from prod.PO PO
        left join prod.BOM B on B.ITEM_ID = PO.itemId
        where number = @lsx and B.MATERIALS_ID is not null) H)`)
    res.status(200).send(data.recordset)
})
productionOrder.post('/:factoryId/san-xuat', async(req, res) => {
    console.log('req.body')
    console.log(req.body)
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.body.stepId)
        .input('itemId', req.body.itemId)
        .input('root', req.body.root)
        .query(`
select * from (
  select
                  
                     PO.code code,
                  
                  
                     PO.ton,
                     PO.approvedAt,
                  
                     PO.market,
                     PO.loiCongDon,
                     ROUND(PO.keHoach,6) keHoach,
                  
                
                   
                    
                     D.ID stepId,
                     D.NAME stepName,
                     case when PO.stepId in (100272,100269,100279,100273,100270,100282,102747,102857) then
					 M.NAME
					 else P.NAME end as root,
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
                     ROUND(PO.keHoach + PO.hanMucTon + PO.loiCongDon+case when loi.baoloi is null then 0
                        else loi.baoloi end - namhong - th- ys1a-ys1b-tb-(CASE
                         WHEN SL.quantity IS NULL THEN 0
                         ELSE ROUND(SL.quantity,6)
                     END),6) conThucHien
                  
                  
                     from prod.PO PO
                     left join base.ITEM I ON I.ID = PO.itemId
                     left join base.DEPARTMENT D ON D.ID  = PO.stepId
                     left join base.MARKET M ON M.CODE = PO.root
                     left join base.ITEM P ON P.ID = M.PRODUCT_ID
                     left join (select sum(quantity) baoloi,code,stepId from [prod].[HandleQc] where code is not null
                     GROUP BY code,stepId) loi on loi.code = PO.code and loi.stepId = PO.stepId
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
             where PO.stepId = @stepId and I.ID = @itemId and approvedAt is not null and endPO = 0 and deletedAt is null 
 ) as x
 where conThucHien > 0 and root = N'${req.body.root}'
 order by x.approvedAt
`)
    res.status(200).send(keHoachThucHien.recordset)
})
productionOrder.get('/:stepId/san-pham-lp', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
        SELECT  P.[week],P.year,P.[code] ,P.[endPO],P.[maket],P.[loiCongDon],SUM(S.[keHoach]) [keHoach],P.[stepId] ,P.[stepName]
        ,P.[root] ,P.[productName] ,P.[itemId] ,P.[itemCode],P.[itemName],P.[itemLength],P.[itemWidth]
        ,P.[itemHeight],sum(S.[conThucHien]) conThucHien,P.[number],S.tong totalQuantity
    FROM [dbo].[View_SL_LUA_PHOI] P
    left join [dbo].View_SL_SO_CHE S on S.itemId = P.itemId_SC and s.number = P.number
    left join [base].[ITEM] I on I.ID = P.[itemId]
    where S.conThucHien is not null and P.[stepId] = @stepId and I.TYPE_ID != 100011
    group by  P.[week],P.year,P.[code],P.[endPO],P.[maket],P.[loiCongDon] 
        ,P.[stepId],P.[stepName],P.[root],P.[productName],P.[itemId],P.[itemCode]
        ,P.[itemName],P.[itemLength],P.[itemWidth],P.[itemHeight],P.number,S.tong
    union all 
    SELECT distinct P.[week],P.year,P.[code] ,P.[endPO],P.[maket],P.[loiCongDon],P.[keHoach],P.[stepId] ,P.[stepName]
    ,P.[root] ,P.[productName] ,P.[itemId] ,P.[itemCode],P.[itemName],P.[itemLength],P.[itemWidth]
    ,P.[itemHeight],P.[conThucHien] conThucHien,P.[number],P.tong totalQuantity
FROM [dbo].[View_SL_LUA_PHOI] P
left join [base].[ITEM] I on I.ID = P.[itemId]
    where P.conThucHien >0 and (P.[itemId] in (129541,129542,129543,129544,129545,129546,129547,129577,129578,129579,129580,129581,129582,129583,129584,129585,129586,129587,
        122557,122558,122559,128137,128149,128150,128151,128152,128153,128154,128155,128156,128157,128158,128159,128160,128161,128162,128163,129176,
        128148,128164,128165,128166,128167,128168,129154,129155,129156,129157,129158,
        125555,125557,125558,125559,125560,125561,125564,125565,125562,125626,125564,125565,125566,
129080,129075,129085,129079,129077,129084,129083,129078,129082,129075,129083,129076,129081,125580) or I.TYPE_ID = 100011)
     and P.[stepId] = @stepId
   order by year,week,number
  `)
    res.status(200).send(keHoachThucHien.recordset)
})

productionOrder.get('/:stepId/ke-hoach-thuc-hien-lp', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
        SELECT  
        P.[factoryId],P.[stepId],P.[itemId],P.[itemCode],P.[itemName]
        ,P.[itemHeight],P.[itemWidth],P.[itemLength],P.[root],SUM(S.[conThucHien]) [conThucHien]
    FROM [dbo].[View_KH_LUA_PHOI] P
    left join [dbo].[View_KH_SO_CHE] S on S.itemId = P.itemId_SC and S.factoryId = P.factoryId
    left join [base].[ITEM] I on I.ID = P.[itemId]
    where S.[conThucHien] is not null and P.[stepId] = @stepId and I.TYPE_ID != 100011
    GROUP BY  P.[factoryId],P.[stepId],P.[itemId],P.[itemCode],P.[itemName]
        ,P.[itemHeight],P.[itemWidth],P.[itemLength],P.[root]
        union all
      select  P.[factoryId],P.[stepId],P.[itemId],P.[itemCode],P.[itemName]
        ,P.[itemHeight],P.[itemWidth],P.[itemLength],P.[root],SUM(P.[conThucHien]) [conThucHien]
    FROM [dbo].[View_KH_LUA_PHOI] P
    left join [base].[ITEM] I on I.ID = P.[itemId]
    where P.[conThucHien] >0 and P.[stepId] = @stepId 
    and (P.[itemId] in (129541,129542,129543,129544,129545,129546,129547,129577,129578,129579,129580,129581,129582,129583,129584,129585,129586,129587,
        122557,122558,122559,128137,128149,128150,128151,128152,128153,128154,128155,128156,128157,128158,128159,128160,128161,128162,128163,129176,
        128148,128164,128165,128166,128167,128168,129154,129155,129156,129157,129158,
        125555,125557,125558,125559,125560,125561,125564,125565,125562,125626,125564,125565,125566,
129080,129075,129085,129079,129077,129084,129083,129078,129082,129075,129083,129076,129081,125580) or I.TYPE_ID = 100011)
    GROUP BY  P.[factoryId],P.[stepId],P.[itemId],P.[itemCode],P.[itemName]
        ,P.[itemHeight],P.[itemWidth],P.[itemLength],P.[root]
            order by P.root DESC
 
`)
    res.status(200).send(keHoachThucHien.recordset)
})
productionOrder.get('/:stepId/ke-hoach-thuc-hien', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
        select itemId,itemCode,itemName,itemHeight,itemWidth,itemLength,root,sum(conThucHien) conThucHien from (
            select
          
                               I.ID itemId,
                               I.CODE itemCode,
                               I.NAME itemName,
                               I.LENGTH itemLength,
                               I.WIDTH itemWidth,
                               I.HEIGHT itemHeight,
                             case when PO.stepId in (100272,100269,100279,100273,100270,100282,102746,102812,102747,102851,102850,102857)  then
                               M.NAME
                               else P.NAME end as root,
                              
                               ROUND(PO.keHoach  + PO.hanMucTon + PO.loiCongDon+case when loi.baoloi is null then 0
                                else loi.baoloi end - namhong - th - ys1a - ys1b- tb -(CASE
                                   WHEN SL.quantity IS NULL THEN 0
                                   ELSE ROUND(SL.quantity,6)
                               END),6) conThucHien
                              
                               
                               from prod.PO PO
                               left join base.ITEM I ON I.ID = PO.itemId
                               left join base.DEPARTMENT D ON D.ID  = PO.stepId
                               left join base.MARKET M ON M.CODE = PO.root
                               left join base.ITEM P ON P.ID = M.PRODUCT_ID
                               left join (select sum(quantity) baoloi,code,stepId from [prod].[HandleQc] where code is not null
                               GROUP BY code,stepId) loi on loi.code = PO.code and loi.stepId = PO.stepId
                               LEFT JOIN (
                                   select P.PO,SUM(IIP.QUANTITY) quantity
                                   from prod.PACKAGE P
                                   left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                                   left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                                   WHERE 
                                   (PT.TYPE_ID <> 100000 OR PT.TYPE_ID IS NULL)
                                   AND (PT.TYPE_ID <> 400000 OR PT.TYPE_ID IS NULL )
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
                       where PO.stepId = @stepId and approvedAt is not null and endPO = 0 and deletedAt is null
                      
           ) as x
           where conThucHien > 0 
           GROUP BY 
           itemId,itemCode,itemHeight,itemName,itemWidth,root,itemLength
            order by root DESC
 
`)
    res.status(200).send(keHoachThucHien.recordset)
})

productionOrder.get('/:stepId/number-by-stepId', async(req, res) => {
    const number = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
        select distinct number from prod.PO where stepId = @stepId and endPO = 0
`)
    res.status(200).send(number.recordset)
})

productionOrder.get('/:stepId/ty-le-thuc-hien', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .query(`
    -- declare @stepId int  = 100280
    select itemId, AVG(tyLeTH) avgTyLeTH from (
    select itemId, case when v.soLuongDat is null then 0 else v.soLuongDat end / (keHoach + loiCongDon) as tyLeTH from prod.PO po
    left join View_DatKeHoach v on v.poCode = po.code
        where stepId = @stepId and deletedAt is null and endPO = 0 and approvedAt is not null and keHoach > 0
    ) t
    group by itemId
`)
    res.status(200).send(keHoachThucHien.recordset)
})

productionOrder.get('/:stepId/:item/dinh-muc', async(req, res) => {
    const keHoachThucHien = await new mssql.Request()
        .input('stepId', req.params.stepId)
        .input('item', req.params.item)
        .input('factoryId', req.query.factoryId)
        .query(`
        select ID id, ITEM_ID itemId, MATERIALS_ID materialId, RATE as heSo from prod.BOM
        where ITEM_ID = @item and MATERIALS_ID = @stepId 
    `)
    res.status(200).send(keHoachThucHien.recordset)
})

productionOrder.get('/:code/thuc-hien', async(req, res) => {
    const data = await new mssql.Request()
        .input('code', req.params.code)
        .execute('Proc_ThucHienByPO')
    const data2 = await new mssql.Request()
        .input('code', req.params.code)
        .execute('Proc_GetNguyenLieuByPO')
    const data3 = await new mssql.Request()
        .input('code', req.params.code)
        .execute('Proc_GetDongBo')
    const data4 = await new mssql.Request()
        .input('code', req.params.code)
        .execute('Proc_GetnextstepId')
    const result = data.recordset.find(p => p.code === `PO${req.params.code}`)

    res.status(200).send({...result, nguyenLieu: data2.recordset,dongbo:data3.recordset,nextstepId:data4.recordset  })
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
productionOrder.get('/xuat-vat-tu', async(req, res) => {
    const data = await new mssql.Request().input('number', req.query.number).query(`
    select DISTINCT PO.*,D.MARKET_CODE,F.dvt,CASE when (F.ma_vt in ('43.02.0061','43.02.0062') and PO.itemId in (119952,118614,119954)) then 'Sơn lót WB sealer clear (860-7226-20W)/Sơn bóng WB Lacquer clear (900-6105-20W)'
    else F.ten_vt end as ten_vt,
    CASE when (F.ma_vt in ('43.02.0061','43.02.0062') and PO.itemId in (119952,118614,119954)) then '43.02.0061/43.02.0062' else
    D.MA_VT end AS MA_VT , CASE when (F.ma_vt in ('43.02.0061','43.02.0062') and PO.itemId in (119952,118614,119954)) then ROUND((keHoach*0.15),4) else ROUND((keHoach*DM_SP),4) end as SLSX,isnull(dacap,0) dacap,isnull(PH.soLan,0) soLan from
  (select  itemId, number,root,keHoach from prod.PO where number = @number and stepId in (100270,100273,100282,102746,102747)) PO
  inner join prod.DINH_MUC_VAT_TU D on D.MARKET_CODE = PO.root
  left join view_VatTuPhuKien_Fast F on D.MA_VT = F.ma_vt
  left join(select MARKET_CODE,MA_VT,NUMBER,SUM(SLYC) dacap from [prod].[PHIEU_YEU_CAU_VT]
  GROUP BY MARKET_CODE,MA_VT,NUMBER) P on P.MARKET_CODE = D.MARKET_CODE and P.NUMBER = PO.number and D.MA_VT = P.MA_VT
  left join (select TOP 1 soLan,NUMBER from [prod].[PHIEU_YEU_CAU_VT] where NUMBER = @number
  order by soLan desc) PH  on PH.NUMBER = PO.number
    
      `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/get-ma-vt', async(req, res) => {
    const data = await new mssql.Request().query(`
    select ma_vt, ten_vt, dvt from view_VatTuPhuKien_Fast where ma_vt like '43%'
      `)
    res.status(200).send(data.recordset)
})
productionOrder.post('/yeu-cau-xuat-vat-tu', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO  [prod].[PHIEU_YEU_CAU_VT] ([NUMBER],[CREATED_DATE],[CREATED_BY],[MARKET_CODE]
            ,MA_VT,SLSX,SLYC,DESCRIPTION,factoryId,soLan, isPass) 
        VALUES ('${req.body.number}', GETDATE(),'${req.body.createBy}','${element.MARKET_CODE}'
        ,'${element.MA_VT=='43.02.0061/43.02.0062'?'43.02.0061':element.MA_VT}','${element.SLSX}','${element.SLYC}',N'${element.DESCRIPTION?element.DESCRIPTION:''}','${req.body.factoryId}','${req.body.solan}', ${req.body.isPass})`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
productionOrder.post('/nhap-ton-son', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[KHAI_TON_SON] ([MA_VT],[CREATED_DATE],[CREATED_BY],[TEN_VT],TON) 
        VALUES ('${element.ma_vt}', GETDATE(),'${req.body.createBy}',N'${element.ten_vt}','${element.TON}')`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

productionOrder.post('/post-nhap-so-dien', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[TIEU_THU_DIEN] ([MANHOM],[CREATED_DATE],[CREATED_BY],SODIEN,MONTH,YEAR,factoryId,GHICHU) 
        VALUES ('${element.ID}', GETDATE(),'${req.body.createBy}','${element.SODIEN}',${req.body.thang},${req.body.year},${req.body.factoryId},N'${element.GHICHU ? element.GHICHU : ''}')`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
productionOrder.post('/post-nhap-dm-dien', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `UPDATE   [prod].[BANG_DM_TIEU_THU_DIEN] 
        set DM_TTD = '${element.DM_TTD1}' where ID ='${element.ID}'`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
productionOrder.get('/get-nhap-so-dien', async(req, res) => {
    const data = await new mssql.Request().input('factoryId', req.query.factoryId)
    .input('thang', req.query.thang)
    .input('nam', req.query.nam)
    .query(`
    select N.*,T.SODIEN SODIEN,T.SODIEN SODIEN1 from [prod].[NHOM_TIEU_THU_DIEN]  N
    left join prod.TIEU_THU_DIEN T on T.factoryId = N.factoryId and T.MANHOM = N.ID and T.MONTH = @thang and T.YEAR = @nam
            where N.factoryId = @factoryId
      `)
    res.status(200).send(data.recordset)
})
productionOrder.get('/get-nhap-dm-dien', async(req, res) => {
    const data = await new mssql.Request().input('factoryId', req.query.factoryId)
    .input('thang', req.query.thang)
    .input('nam', req.query.nam)
    .query(`
    SELECT  B.ID,
      B.[NHOMSP_TTD]
      ,B.[NHOM_DM_TTD]
	  ,N.NAME
      ,B.[DM_TTD]
	  ,'' DM_TTD1
  FROM [Woodsland-PHUONG].[prod].[BANG_DM_TIEU_THU_DIEN] B
  left join [prod].[NHOM_DM_TIEU_THU_DIEN] N on B.NHOM_DM_TTD = N.ID 
      `)
    res.status(200).send(data.recordset)
})
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

productionOrder.post('/ton-go-tho', async(req, res) => {
    const tonGoTho = await new mssql.Request()
        .input('stepId', req.body.stepId)
        .input('dai', req.body.length)
        .input('rong', req.body.width)
        .input('day', req.body.height)
        .query(`
        select DAY, RONG, DAI, SUM(quantity)  as quantity from
        (SELECT DAY, RONG, DAI,SUM(SL_TH) as quantity
             FROM prod.XUAT_GO_BAO 
             WHERE DESTINATION_ID = @stepId  AND DAY = @day AND RONG = @rong AND DAI = @dai AND approvedByAccount is not null
             GROUP BY DAY, RONG, DAI
             union all 
                SELECT DAY, RONG, DAI,-SUM(ABS(SL_TH)) as quantity
             FROM prod.XUAT_GO_BAO 
             WHERE SOURCE_ID = @stepId  AND DAY = @day AND RONG = @rong AND DAI = @dai 
             GROUP BY DAY, RONG, DAI
             union all
             select  I.HEIGHT DAY,I.WIDTH RONG,I.LENGTH DAI,SUM(ST.QUANTITY) as quantity from prod.OPENING_STOCK ST
             LEFT JOIN
             base.ITEM I ON ST.ITEM_ID = I.ID
             where DEPARTMENT_ID = @stepId and ST.createdAt> '20220221' and LENGTH = @dai and WIDTH = @rong and HEIGHT = @day
             GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH
             union all
             select  I.HEIGHT DAY,I.WIDTH RONG,I.LENGTH DAI,SUM(IT.QUANTITY) as quantity from prod.PACKAGE P
             left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
             LEFT JOIN
             base.ITEM I ON IT.ITEM_ID = I.ID
             where DESTINATION_ID = @stepId and P.CREATE_DATE > '20220221' and LENGTH = @dai and WIDTH = @rong and HEIGHT = @day
             GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) h
             GROUP BY DAY, RONG, DAI
             
`)
    res.status(200).send(tonGoTho.recordset)
})

productionOrder.post('/ton-go-tho-ke-hoach', async(req, res) => {
    const tonGoTho = await new mssql.Request()
        .input('stepId', req.body.stepId)
        .input('dai', req.body.length)
        .input('rong', req.body.width)
        .input('day', req.body.height)
        .query(`
        select DAY, RONG, DAI,SUM(quantity) as quantity from
   (
		   SELECT DAY, RONG, DAI,SUM(ABS(SL_TH)) as quantity
        FROM prod.XUAT_GO_BAO 
        WHERE SOURCE_ID = @stepId  AND DAY = @day AND RONG = @rong AND DAI = @dai 
        GROUP BY DAY, RONG, DAI) h
        GROUP BY DAY, RONG, DAI
`)
    res.status(200).send(tonGoTho.recordset)
})

productionOrder.post('/ton-go-tho-tra-lai', async(req, res) => {
    const tonGoTho = await new mssql.Request()
        .input('stepId', req.body.stepId)
        .input('dai', req.body.length)
        .input('rong', req.body.width)
        .input('day', req.body.height)
        .query(`
        SELECT ID, DAY, RONG, DAI, -SL_TH as quantity, STATUS
        FROM prod.XUAT_GO_BAO 
        WHERE (DESTINATION_ID = @stepId OR SOURCE_ID = @stepId) AND DAY = @day AND RONG = @rong AND DAI = @dai AND XUATNHAP IN ('xuatluaphoi','loi') and STATUS is not null
`)
    res.status(200).send(tonGoTho.recordset)
})
productionOrder.post('/delete-go-tho-tra-lai', async(req, res) => {
    const tonGoTho = await new mssql.Request()
        .input('id', req.body.id)
        .query(`
        delete from prod.XUAT_GO_BAO where id = @id
`)
    res.status(200).send(tonGoTho.recordset)
})

productionOrder.post('/xuat-go-bao', async(req, res) => {
    try {
    const xuatGoBao = await new mssql.Request()
        .input('dai', req.body.length)
        .input('rong', req.body.width)
        .input('day', req.body.height)
        .input('accountId', req.body.accountId)
        .input('factoryId', req.body.factoryId)
        .input('volumn', req.body.volumn)
        .input('quantity', req.body.quantity)
        .input('xuatNhap', req.body.xuatNhap)
        .input('destinationId', req.body.destinationId)
        .input('sourceId', req.body.sourceId)
        .input('priceCode', req.body.priceCode)
        .query(`
        INSERT INTO prod.XUAT_GO_BAO(DAI, RONG, DAY, createdAt, createdby, factoryId, KLC_TH, SL_TH, XUATNHAP, DESTINATION_ID, SOURCE_ID, PRICE_CODE)
		VALUES (@dai, @rong, @day, GETDATE(), @accountId, @factoryId, @volumn, @quantity, @xuatNhap, @destinationId, @sourceId, @priceCode)
`)
    res.status(200).send(xuatGoBao)
} catch (error) {
    res.status(500).send(error)
}
})
productionOrder.post('/ke-hoach-san-xuat-update', async(req, res) => {
    if (req.body.goodsType == 'BTP')
    try {
    const updatelsx = await new mssql.Request()
        .input('number', req.body.number)
        .input('goodsType', req.body.goodsType)
     
        .query(`
       delete from prod.PO where stepId not in (100274,100264,100265,100278,102632,102787,102788,102797,102796,102370,102380,102809,102374,
        102347,102353,102355,102789,102804,102855,102529)
       and number = @number and approvedByAccount is null
`)
    res.status(200).send(updatelsx)
} catch (error) {
    res.status(500).send(error)
}
else 
try {
    const updatelsx = await new mssql.Request()
        .input('number', req.body.number)
        .input('goodsType', req.body.goodsType)
     
        .query(`
        delete from prod.PO where stepId  in (100274,100276,101266,100264,100265,100278,102632,102787,102788,102797,102796,102370,102380,102809,102374,
            102347,102353,102355,102789,102804,102855,102529)
         and number = @number and approvedByAccount is null
`)
    res.status(200).send(updatelsx)
} catch (error) {
    res.status(500).send(error)
}
})

productionOrder.post('/xuat-go-cat-ha-cap', async(req, res) => {
    try {
    const xuatGoBao = await new mssql.Request()
        .input('itemId', req.body.itemId)
        .input('dai', req.body.length)
        .input('rong', req.body.width)
        .input('day', req.body.height)
        .input('accountId', req.body.accountId)
        .input('factoryId', req.body.factoryId)
        .input('volumn', req.body.volumn)
        .input('quantity', req.body.quantity)
        .input('xuatNhap', req.body.xuatNhap)
        .input('destinationId', req.body.destinationId)
        .input('sourceId', req.body.sourceId)
        .input('volumnHC', req.body.volumnHC)
        .input('quantityHC', req.body.quantityHC)
        .input('DESTINATION_ID_HC', req.body.DESTINATION_ID_HC)
        .input('priceCode', req.body.priceCode)
        .input('lualai', req.body.lualai)
        .query(`
        INSERT INTO prod.XUAT_GO_BAO( itemId, DAI, RONG, DAY, createdAt, createdby, factoryId, KLC_TH, SL_TH, XUATNHAP, DESTINATION_ID, SOURCE_ID, KLC_HC, SL_HC,DESTINATION_ID_HC, PRICE_CODE,LUALAI)
		VALUES (@itemId, @dai, @rong, @day, GETDATE(), @accountId, @factoryId, @volumn, @quantity, @xuatNhap, @destinationId, @sourceId, @volumnHC, @quantityHC,@DESTINATION_ID_HC, @priceCode,@lualai)
        select TOP 1 * from prod.XUAT_GO_BAO  order by ID desc
`)
    res.status(200).send(xuatGoBao)
} catch (error) {
    res.status(500).send(error)
}
})

const getBomAndRouting = `SELECT DISTINCT ITEM_ID itemId, MATERIALS_ID materialsId, RATE rate
FROM prod.BOM 

SELECT DISTINCT [itemId]
,[stepId]
,[order]
,[thoiGianThucHien]
,[caLamViec]
,[factoryId] FROM View_ROUTINGD where factoryId = @factoryId
`

module.exports = productionOrder