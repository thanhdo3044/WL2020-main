const express = require('express')
const sanLuong = express.Router()
const mssql = require('mssql')
const { getErrorMessage } = require('./../../core/config')

sanLuong.get(
    '/',
    (req, res, next) => {
        if (req.query.stepId) {
            new mssql.Request()
                .input('stepId', req.query.stepId)
                .input('week', req.query.week)
                .input('year', req.query.year)
                .input('number', req.query.number)
                .query(
                    `select * from (
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
                                         ROUND(PO.keHoach + PO.loiCongDon-(CASE
                                             WHEN SL.quantity IS NULL THEN 0
                                             ELSE ROUND(SL.quantity,6)
                                         END),4) conThucHien,
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
                                 where stepId = @stepId and approvedAt is not null and endPO = 0 
                     ) as x
                     where conThucHien > 0
                     order by number`,
                    (err, record) => {
                        if (err) {
                            // console.log(err)
                            return res.api.sendFail(getErrorMessage(4907))
                        }
                        if (record.recordset.length === 0) {
                            // console.log('khong co du lieu')
                            return res.api.sendData([])
                        }
                        return res.api.sendData(record.recordset)
                    }
                )
        } else {
            next()
        }
    },
    (req, res, next) => {
        req.query.code = req.query.code.replace('PO', '')
            // console.log('GET')
            // console.log(req.query)
        new mssql.Request()
            .input('code', req.query.code)
            .input('number', req.query.number)
            .query(
                `select CONCAT('PO',PO1.code) code,
        PO1.daNhanTon,
        PO1.stepId,
        PO1.number,
        PO1.week,
        PO1.year,
        PO1.market,
        PO1.ngayDongGoi,
        PO1.factoryId,
        PO1.keHoach,
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
                SL.quantity,
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

        order by PO1.code

        SELECT SUM(QUANTITY) tonDauKy
        FROM prod.OPENING_STOCK
        WHERE PO_ID= @code
        `,
                (err, record) => {
                    // console.log(record.recordset)
                    if (err) {
                        // console.log('LỖI')
                        // console.log(err)
                        return res.api.sendFail(getErrorMessage(4907))
                    }

                    if (
                        record.recordset[0] === null ||
                        record.recordset[0] === undefined
                    ) {
                        // console.log('KHONG CO BAN GGI')
                        return res.api.sendFail(getErrorMessage(4907))
                    }
                    req.kq = record.recordset.find(
                        (i) => i.code === `PO${req.query.code}`
                    )

                    next()
                }
            )
    },
    (req, res, next) => {
        // Nguyên liệu
        // console.log('NGUYEN LIEU')
        // console.log(req.query)
        new mssql.Request()
            .input('code', req.query.code)
            .input('number', req.query.number)
            .query(
                `
                declare @LENHSX nvarchar(100), @FROM_ID int, @ITEM_ID int, @NGUONPHOI int
select @LENHSX = number, @FROM_ID = stepId, @ITEM_ID = itemId from prod.PO where code = '${req.query.code}'
select TOP 1 @NGUONPHOI = SOURCE_ID
                    from prod.PACKAGE
                    where PO in (select code
                        from prod.PO
                        where number = @LENHSX) and DESTINATION_ID = @FROM_ID and TYPE_ID = 100026
                select NL.*, I.*, D.NAME as NGUONPHOI from (
                  select ITEM_ID, SUM(quantity) as ton, @NGUONPHOI as NP
                          from (
                               select ITEM_ID, -QUANTITY as QUANTITY
                                  from prod.MATERIALS_IN_PACKAGE
                                  where ITEM_IN_PACKAGE_ID in (
                    select ID
                                      from prod.ITEM_IN_PACKAGE
                                      where PACKAGE_ID in (
                      select ID
                                      from prod.PACKAGE
                                      where PO in (select code
                                          from prod.PO
                                          where number = @LENHSX) and SOURCE_ID = @FROM_ID
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
                                      where PO in (select code
                                          from prod.PO
                                          where number = @LENHSX) and DESTINATION_ID = @FROM_ID and TYPE_ID = 100026  and VERIFY_BY is not null
                    ) and (ITEM_ID = @ITEM_ID or ITEM_ID in(
                    select B.MATERIALS_ID
                              from prod.BOM B
                              where B.ITEM_ID = @ITEM_ID
                  ))) as x
                  group by ITEM_ID
                  ) as NL left join base.ITEM I on I.ID = NL.ITEM_ID left join base.DEPARTMENT D on D.ID = NL.NP
        `,
                (err, record) => {
                    if (err) {
                        // console.log('Nguyen lieu')
                        // console.log(err)
                        return res.api.sendFail(getErrorMessage(4907))
                    }

                    req.kq.nguyenLieu = record.recordset
                    next()
                }
            )
    },
    (req, res, next) => {
        // chi tiết các kiện hàng
        // console.log(req.query)
        new mssql.Request()
            .input('code', req.query.code)
            .input('number', req.query.number)
            .query(
                ` 
                select 
                CONCAT('PO',PO.code) code,
                PO.daNhanTon,
                F.ID fromId,
                F.NAME fromName,
                T.ID toId,
                T.NAME toName,
                I.Id itemId,
                I.CODE itemCode,
                I.NAME itemName,
                I.LENGTH itemLenght,
                I.WIDTH itemWidth,
                I.HEIGHT itemHeight,
                PO.quantity 'target',
                PO.keHoach - PO.quantity as xuatTon,
                P.ID packageId,
                PT.[DESCRIPTION] packageTypeGroup,
                PT.NAME packageType,
                IIP.QUANTITY quantity,
                A.LAST_NAME createBy,
                P.CREATE_DATE createDate
                from prod.PACKAGE P
                left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                LEFT JOIN base.DEPARTMENT F ON F.ID = P.SOURCE_ID
                LEFT JOIN base.DEPARTMENT T ON T.ID = P.DESTINATION_ID
                LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                left join base.ACCOUNT A ON A.ID = P.CREATE_BY
                left join prod.PO ON PO.code = P.PO
                where PO.code = @code
                and PO.number = @number
                order BY P.ID DESC
        `,
                (err, record) => {
                    if (err) {
                        // console.log('chi tiết kiện hàng')
                        // console.log(err)
                        return res.api.sendFail(getErrorMessage(4907))
                    }

                    req.kq.detail = record.recordset
                    res.api.sendData(req.kq)
                }
            )
    }
)
sanLuong.get('/san-luong-ton', (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input('stepId', req.body.stepId).query(
            `
            SELECT distinct * , p.keHoach - p.quantity as nhanTon  from prod.PO p
            left join base.ITEM i on i.ID = p.itemId
            left join base.DEPARTMENT d on d.ID = p.stepId
            left join prod.OPENING_STOCK s on s.ID = d.id
            where stepId = @stepId and p.keHoach - p.quantity > 0
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                    // console.log('selected PO : ', req.body.stepId)
                req.kq.ton = record.recordset
            }
        )
    } else {
        res.api.sendData([])
    }
})

sanLuong.get('/confirmEndPO', (req, res) => {
    try {
        // console.log('req', req.query)
        new mssql.Request().query(
            `declare @result int
                if EXISTS (select id from prod.PO where number like '${req.query.number}%' and week = ${req.query.week})
                begin
                update prod.PO set endPO = 1 where number like '${req.query.number}%' and week = ${req.query.week}
                set @result = 1 
                end
                else 
                begin
                set @result = 0
                end
                select @result as result`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                    // console.log('updated endPO  : ', req.query.number)
                    // console.log('updated endPO  : ', parseInt(req.query.week))
                res.api.sendData(record.recordset)
            }
        )
    } catch (error) {
        // console.log('error', error)
    }
})
sanLuong.get('/getPO', (req, res, next) => {
    try {
        new mssql.Request().query(
            `select distinct number,week,factoryId from prod.PO where week = ${req.query.week} and factoryId=${req.query.factoryId}`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
    } catch (error) {
        // console.log('err', error)
    }
})

sanLuong.get('/unConfirmEndPO', (req, res, next) => {
    try {
        new mssql.Request().query(
            `declare @result int
                if EXISTS (select id from prod.PO where number like '${req.query.number}%' and week = ${req.query.week})
                begin
                update prod.PO set endPO = 0 where number like '${req.query.number}%' and week = ${req.query.week}
                set @result = 1 
                end
                else 
                begin
                set @result = 0
                end
                select @result as result`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                    // console.log('unupdated endPO  : ', req.query.number)
                    // console.log('unupdated endPO  : ', req.query.week)
                res.api.sendData(record.recordset)
            }
        )
    } catch (error) {
        // console.log('err', error)
    }
})
sanLuong.post('/insert-package', (req, res, next) => {
    try {
        console.log('', )
        new mssql.Request()
            .input('code', req.body.PO)
            .input('quantity', req.body.quantity)

        .input('GUID', req.body.no)
            .input('DESTINATION_ID', req.body.departmentId)
            .query(
                `INSERT INTO prod.[PACKAGE](GUID,SOURCE_ID,DESTINATION_ID,TYPE_ID,PO,CREATE_DATE,CREATE_BY)
            VALUES (NEWID(),'${req.body.departmentId}','${req.body.stepNextId}',100026,'${req.body.PO}',GETDATE(),'${req.body.createBy}')
            SELECT * FROM prod.[PACKAGE] where PO = '${req.body.PO}'
            order by ID DESC`,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                        // console.log('unupdated endPO  : ', req.query.number)
                        // console.log('unupdated endPO  : ', req.query.week)
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
        // console.log('err', error)
    }
})
sanLuong.post('/insert-in-package', (req, res, next) => {
    try {
        console.log('', )
        new mssql.Request()
            .input('code', req.body.PO)
            .input('quantity', req.body.quantity)

        .input('GUID', req.body.no)

        .query(
            `INSERT INTO prod.[ITEM_IN_PACKAGE](GUID,PACKAGE_ID,ITEM_ID,QUANTITY)
          VALUES (NEWID(),'${req.body.PACKAGE_ID}','${req.body.itemId}','${req.body.quantity}')`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                    // console.log('unupdated endPO  : ', req.query.number)
                    // console.log('unupdated endPO  : ', req.query.week)
                res.api.sendData(record.recordset)
            }
        )
    } catch (error) {
        // console.log('err', error)
    }
})
sanLuong.post(
    '/cap-phoi',
    (req, res, next) => {
        req.body.code = req.body.code.replace('PO', '')
        new mssql.Request()
            .input('code', req.body.code)
            .input('quantity', req.body.quantity)
            .input('sourceId', req.body.source)
            .input('accountId', req.headers['x-gateway-account-id'])
            .input('DESTINATION_ID', req.body.destinationId)
            .query(
                `WITH temp(id,code,parent, stepId,itemId ,quantity,alevel)
        as (
                Select PO.id,PO.code,PO.parent,PO.stepId, PO.itemId,PO.quantity, 0 as aLevel
                From prod.PO PO
                Where PO.code = @code
                
        )
Select 
t.id,
NEWID() packageGuid,
t.code,
t.parent,
t.stepId fromId,
D.NAME fromName,
NT.ID toId,
NT.NAME toName,
t.itemId,
I.NAME itemName,
t.quantity,
t.alevel,
R.[ORDER] currentOrder,
R.[ORDER] nextOrder
into #buf
From temp t
left join base.DEPARTMENT D ON D.ID = T.stepId
left join base.ITEM I ON I.ID = T.itemId
left join prod.ROUTING R ON R.ITEM_ID = t.itemId and R.STEP_ID = t.stepId
left join prod.ROUTING N ON N.ITEM_ID = t.itemId and N.[ORDER] = R.[ORDER] + 1
left join base.DEPARTMENT NT ON NT.ID = N.STEP_ID
order by t.alevel asc

DECLARE @quantityGoc int

select @quantityGoc = quantity
from #buf b
where b.code = @code


 
INSERT INTO prod.[PACKAGE]([GUID],SOURCE_ID,DESTINATION_ID,CREATE_BY,CREATE_DATE, PO)
select NEWID(),@sourceId,@DESTINATION_ID,@accountId,GETDATE(),code
from  #buf


select NEWID() itemGuid, P.ID packageId, b.itemId, (b.quantity/@quantityGoc)*@quantity as quantity
into #bufItem
from #buf b
left join prod.PACKAGE P ON P.GUID = b.packageGuid

INSERT INTO prod.[ITEM_IN_PACKAGE]([GUID],PACKAGE_ID,ITEM_ID,QUANTITY)
select itemGuid,packageId,itemId,quantity
from #bufItem

INSERT INTO prod.[MATERIALS_IN_PACKAGE]([GUID],ITEM_IN_PACKAGE_ID,ITEM_ID,QUANTITY)
select NEWID(),
IIP.ID,
IIP.ITEM_ID,
IIP.QUANTITY
from #bufItem bi
left join prod.ITEM_IN_PACKAGE IIP ON IIP.GUID = bi.itemGuid

drop table #buf
drop table #bufItem

`,
                (err, record) => {
                    if (err) {
                        // console.log('err', err)
                        return res.api.sendFail(getErrorMessage(4907))
                    }
                    next()
                }
            )
    },
    (req, res, next) => {
        req.body.code = req.body.code.replace('PO', '')
        new mssql.Request()
            .input('code', req.body.code)
            .input('quantity', req.body.quantity)
            .input('sourceId', req.body.source)
            .input('accountId', req.headers['x-gateway-account-id'])
            .input('DESTINATION_ID', req.body.destinationId)
            .query(
                'update prod.po set quantity = quantity + @quantity, ton = ton - @quantity, daNhanTon = @quantity, status = null where code = @code ',
                (err, record) => {
                    // if (err) { console.log(err) }
                    next()
                }
            )
    },
    (req, res) => {
        req.body.code = req.body.code.replace('PO', '')
        new mssql.Request()
            .input('code', req.body.code)
            .input('quantity', req.body.quantity)
            .input('sourceId', req.body.source)
            .input('accountId', req.headers['x-gateway-account-id'])
            .input('DESTINATION_ID', req.body.destinationId)
            .input('itemId', req.body.itemId)
            .query(
                `update prod.OPENING_STOCK set QUANTITY = QUANTITY - @quantity
                where DEPARTMENT_ID = @DESTINATION_ID and ITEM_ID = @itemId and QUANTITY > @quantity`,
                (err, record) => {
                    // if (err) console.log(err)
                    res.api.sendData([])
                }
            )
    }
)

module.exports = sanLuong