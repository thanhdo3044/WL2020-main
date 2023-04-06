const express = require('express')
const sanLuong = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../core/config')
const {
    v4: uuidv4
  } = require('uuid')
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

sanLuong.get('/san-luong-TH', (req, res, next) => {

    new mssql.Request()
        .input('stepId', req.query.stepId)
        .query(
            `
           
            SELECT NAME,VOLUMN,HEIGHT,LENGTH,WIDTH,DEPARTMENT_NAME,SUM(isnull(YS1A,0)) YS1A,SUM(isnull(YS1B,0)) YS1B
            ,SUM(isnull(TB,0)) TB,SUM(isnull(QM,0)) QM,SUM(isnull(MN,0)) MN from (select * FROM
            (
                select I.NAME,I.VOLUMN , I.HEIGHT, I.LENGTH, I.WIDTH,OS.QUANTITY,CASE when OS.nguonPhoi = N'Mua ngoài' then D1.NAME else D.NAME end as DEPARTMENT_NAME,  
            case when OS.nguonPhoi = N'Yên Sơn 1a' then 'YS1A' 
              when OS.nguonPhoi = N'Yên Sơn 1b' then 'YS1B' 
              when OS.nguonPhoi = N'Thái Bình' then 'TB' 
              when OS.nguonPhoi = N'Mua ngoài' then 'MN' 
              else 'QM'
              END AS  nguonPhoi 
            from prod.OPENING_STOCK OS
            INNER JOIN base.ITEM I ON OS.ITEM_ID = I.ID
            INNER JOIN base.ACCOUNT A ON OS.CREATE_BY = A.ID
            INNER JOIN base.DEPARTMENT D ON OS.DEPARTMENT_ID = D.ID AND (D.NAME NOT LIKE 'Kho%' or D.NAME = N'Kho BTP') AND D.factoryId = ${req.query.NM}
            INNER JOIN base.DEPARTMENT D1 ON OS.DESTINATION_ID = D1.ID AND D1.NAME NOT LIKE 'Kho%' 
            WHERE OS.createdAt BETWEEN '${req.query.start} 00:00' AND '${req.query.end} 23:59' 
            and OS.nguonPhoi IN (N'Yên Sơn 1a', N'Yên Sơn 1b', N'Thái Bình', N'NM Quang Minh', N'Mua ngoài' ) AND OS.QUANTITY > 0
            ) AS BAO_CAO
            PIVOT
            (
            SUM(QUANTITY)
            FOR nguonPhoi IN ( [YS1A], [YS1B], [TB], [QM],[MN])
            ) AS A
            UNION
            SELECT IT.NAME,IT.VOLUMN, IT.HEIGHT, IT.LENGTH, IT.WIDTH,  DPM.NAME AS DEPARTMENT_NAME, SUM(INPK.QUANTITY) AS YS1A, null as YS1B, NULL AS TB ,NULL as MN, NULL AS QM
            FROM prod.PACKAGE as PK
            INNER JOIN prod.ITEM_IN_PACKAGE as INPK ON PK.ID = INPK.PACKAGE_ID
            INNER JOIN base.ITEM as IT ON INPK.ITEM_ID = IT.ID
            INNER JOIN base.DEPARTMENT as DPM ON PK.DESTINATION_ID = DPM.ID
            where  PK.VERIFY_DATE BETWEEN '${req.query.start} 00:00' AND '${req.query.end} 23:59' and PK.SOURCE_ID in (102488,102848,102859) and PK.PO='100000'
            GROUP BY IT.NAME,IT.VOLUMN, IT.HEIGHT, IT.LENGTH, IT.WIDTH,  DPM.NAME
            UNION
            SELECT IT.NAME,IT.VOLUMN, IT.HEIGHT, IT.LENGTH, IT.WIDTH,  DPM.NAME AS DEPARTMENT_NAME, NULL AS YS1A, null as YS1B, SUM(INPK.QUANTITY) AS TB ,NULL as MN, NULL AS QM
            FROM prod.PACKAGE as PK
            INNER JOIN prod.ITEM_IN_PACKAGE as INPK ON PK.ID = INPK.PACKAGE_ID
            INNER JOIN base.ITEM as IT ON INPK.ITEM_ID = IT.ID
            INNER JOIN base.DEPARTMENT as DPM ON PK.DESTINATION_ID = DPM.ID
            where   PK.VERIFY_DATE BETWEEN '${req.query.start} 00:00' AND '${req.query.end} 23:59' and PK.SOURCE_ID = 102460 and PK.PO='100000'
            GROUP BY IT.NAME,IT.VOLUMN, IT.HEIGHT, IT.LENGTH, IT.WIDTH,  DPM.NAME ) H
            GROUP BY NAME,VOLUMN, HEIGHT, LENGTH, WIDTH,DEPARTMENT_NAME
            ;
               `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )

})

//Xuat go bao

sanLuong.get('/san-luong-xuat-go-bao', (req, res, next) => {

    new mssql.Request()
        .input('stepId', req.query.stepId)
        .query(
            `
            SELECT OS.DAY, OS.RONG, OS.DAI, AB.NAME AS SOURCE_NAME, DP.NAME AS DESTINATION_NAME FROM [prod].[XUAT_GO_BAO] as OS  
            INNER JOIN base.DEPARTMENT as DP ON OS.SOURCE_ID = DP.ID 
            INNER JOIN base.DEPARTMENT as AB ON OS.DESTINATION_ID = AB.ID
            WHERE OS.createdAt BETWEEN '${req.query.start} 00:00' AND '${req.query.end} 23:59' AND XUATNHAP = 'xuat' AND OS.factoryId = ${req.query.departmentId}
                `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )

})

sanLuong.get('/tieu-thu-dien', (req, res, next) => {

    new mssql.Request()
        .input('factoryId', req.query.NM)
        .query(
            `
            select NHOM_DM_TTD,isnull(SUM(LP),0) LP,isnull(SUM(SC),0) SC,isnull(SUM(HTM),0) HTM,isnull(SUM(DG),0) DG , 
            isnull(AVG(DMLP),0) DMLP,isnull(AVG(DMSC),0) DMSC,isnull(AVG(DMHTM),0) DMHTM,isnull(AVG(DMDG),0) DMDG,
             isnull(SUM(LP),0)*isnull(AVG(DMLP),0) SDLP
             ,isnull(SUM(SC),0)*isnull(AVG(DMSC),0) SDSC,isnull(SUM(HTM),0)*isnull(AVG(DMHTM),0) SDHTM
             ,isnull(SUM(DG),0)*isnull(AVG(DMDG),0) SDDG from
           
           (select NHOM_DM_TTD, 
           CASE when congdoan = 100001 then KL end as LP,
           CASE when congdoan = 100001 then DINHMUC end as DMLP,
           CASE when congdoan = 100002 then KL end as SC,
           CASE when congdoan = 100002 then DINHMUC end as DMSC,
            CASE when congdoan = 100003 then KL end as HTM,
            CASE when congdoan = 100003 then DINHMUC end as DMHTM,
              CASE when congdoan = 100004 then KL end as DG,
              CASE when congdoan = 100004 then DINHMUC end as DMDG
            from
           ( select k.*,DM.DINHMUC from
           (
                
          (select NHOM_DM_TTD,sum(KL) KL,
          CASE when SOURCE_ID in (100264,100274) then 100001 
           when SOURCE_ID in (100265,100278,102352,102355,102373,102380) then 100002 
           when SOURCE_ID in (100268,100271,100275) then 100003 
            when SOURCE_ID in (100270,100273,100282) then 100004 end as  congdoan from 
                  (select I.NHOM_DM_TTD,I.ID,P.SOURCE_ID, SUM(QUANTITY)*I.VOLUMN KL from prod.PACKAGE P
                  left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
          
                  left join base.ITEM I on I.ID = IT.ITEM_ID
                  where I.NHOM_DM_TTD is not null and P.CREATE_DATE BETWEEN '20211201' and '20211231'  and P.SOURCE_ID in (100264,100274,100265,100278,100268,100271,100275,100270,100273,100282,102352,102355,102373,102380)
                  GROUP BY I.NHOM_DM_TTD,I.ID,P.SOURCE_ID,I.VOLUMN) H
                  
                  
                  GROUP BY NHOM_DM_TTD,SOURCE_ID)) k
          
                  left join prod.DM_TIEU_THU_DIEN DM on k.congdoan = DM.MANHOM_TO and k.NHOM_DM_TTD = DM.NHOMSP) ph) l
                  
                  GROUP BY NHOM_DM_TTD
                 
                `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )

})
sanLuong.get('/san-luong-theo-tuan', (req, res, next) => {

    new mssql.Request()
        .query(
            `
            SELECT *
FROM
(
SELECT m.NAME parentName, i.NAME itemName, d.NAME departmentName, iip.QUANTITY, DATENAME(dw,p.CREATE_DATE) thu  FROM prod.PACKAGE P 
INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
INNER JOIN base.ITEM I ON  IIP.ITEM_ID = I.ID
INNER JOIN base.DEPARTMENT D ON P.SOURCE_ID = D.ID
left join prod.PO on p.PO = po.code
left join base.MARKET m on po.root = m.CODE
WHERE D.factoryId = ${req.query.factoryId} AND TYPE2 = 'to' and p.TYPE_ID = 100026 and p.CREATE_DATE between '${req.query.start}' and '${req.query.end}'
) AS BangNguon
PIVOT
(
SUM(QUANTITY)
FOR thu IN ([Monday], [Tuesday], [Wednesday], [Thursday], [Friday], [Saturday], [Sunday])
) AS BangChuyen;
                `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )

})
sanLuong.get('/giao-san-luong-nm', (req, res, next) => {

    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(
            `
            SELECT * FROM
            (
            select I.NAME , I.HEIGHT, I.LENGTH, I.WIDTH,OS.SL_TH, D.NAME DEPARTMENT_NAME,  
			case when OS.DESTINATION_ID = 100003 then 'YS1A' 
              when OS.DESTINATION_ID = 100004 then 'YS1B' 
			  when OS.DESTINATION_ID = 100005 then 'TB' 
			  else 'QM'
			  END AS  DESTINATION_ID 
            from prod.XUAT_GO OS
            INNER JOIN base.ITEM I ON OS.itemId = I.ID
            INNER JOIN base.ACCOUNT A ON OS.createdby = A.ID
			INNER JOIN base.DEPARTMENT D ON OS.SOURCE_ID = D.ID 
            WHERE OS.SOURCE_ID = 102628 and OS.createdAt BETWEEN '${req.query.start} 00:00' AND '${req.query.end} 23:59' 
            and OS.DESTINATION_ID IN (100003,100004,100005,102427) AND OS.SL_TH > 0
            ) AS BAO_CAO
            PIVOT
            (
            SUM(SL_TH)
            FOR DESTINATION_ID IN ( [YS1A], [YS1B], [TB], [QM])
            ) AS A
                `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )

})
sanLuong.get('/tien-do-bao', (req, res, next) => {

    new mssql.Request()
        .query(
            `
            SELECT NAME, DAI, RONG, DAY, [xuatbao2M],[xuat], isnull([xuatluaphoi],0) AS [xuatluaphoi]
FROM
(
select B.NAME, XGB.DAI, XGB.RONG, XGB.DAY, XGB.SL_TH, XGB.XUATNHAP from prod.XUAT_GO_BAO XGB
LEFT JOIN NLG.BOM B ON  XGB.DAI = B.DAI AND XGB.RONG = B.RONG AND XGB.DAY = B.DAY
WHERE XGB.createdAt BETWEEN '${req.query.start} 00:00' AND '${req.query.end} 23:59'
and XGB.factoryId = ${req.query.factoryId} and B.NAME is not null
) AS BANG_NGUON
PIVOT
(
SUM(SL_TH)
FOR XUATNHAP IN ([xuatbao2M],[xuat],[xuatluaphoi])
) AS BANG_CHUYEN
                `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )

})
sanLuong.get('/san-luong-bao', (req, res, next) => {

    new mssql.Request()
        .query(
            `
            select DISTINCT XGB.ID,CASE WHEN XGB.approvedByAccount is null then N'Chưa nhận' else N'Đã nhận' end AS nhan,AC.LAST_NAME nguoigiao
            ,XGB.createdAt,I.NAME,I.LENGTH DAI,I.WIDTH RONG,I.HEIGHT DAY,L.QUANTITY,L.QUANTITY*I.VOLUMN KLBAO, AN.LAST_NAME nguoiNhan, xgb.approvedAt
            from [prod].[XUAT_GO_BAO] XGB 
            left join prod.QC_LUA_DAT L on L.BAO_ID = XGB.ID
            left join base.ITEM I on I.ID = L.ITEM_ID
            left join base.ACCOUNT AC on AC.ID =  XGB.createdby
			left join base.ACCOUNT AN on AN.ID = xgb.approvedByAccount
            where XUATNHAP = 'xuatluaphoi' and XGB.factoryId = ${req.query.factoryId} and XGB.createdAt BETWEEN '${req.query.start} 00:00' AND '${req.query.end} 23:59' 
            and L.ITEM_ID is not null
            order by XGB.createdAt desc
                `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )

})

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

sanLuong.put('/confirmEndPO', (req, res) => {
    try {
        console.log('req', req.body)
        new mssql.Request().query(
            `declare @result int
                if EXISTS (select id from prod.PO where number = N'${req.body.number}' and week = ${req.body.week} and year =${req.body.year} and factoryId = ${req.body.factoryId})
                begin
                update prod.PO set endPO = 1 where number = N'${req.body.number}' and week = ${req.body.week} and year =${req.body.year} and factoryId = ${req.body.factoryId}
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
                console.log('updated endPO  : ', record)
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
            `select distinct number,week,factoryId,endPO,year from prod.PO where week = ${req.query.week} and factoryId=${req.query.factoryId} and year = ${req.query.year}`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
    } catch (error) {
        // console.log('err', error)
    }
})

sanLuong.put('/unConfirmEndPO', (req, res, next) => {
    try {
        new mssql.Request().query(
            `declare @result int
                if EXISTS (select id from prod.PO where number = N'${req.body.number}' and week = ${req.body.week} and year =${req.body.year} and factoryId = ${req.body.factoryId})
                begin
                update prod.PO set endPO = 0 where number = N'${req.body.number}' and week = ${req.body.week} and year =${req.body.year} and factoryId = ${req.body.factoryId}
                set @result = 1 
                end
                else 
                begin
                set @result = 0
                end
                select @result as result`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                // console.log('unupdated endPO  : ', req.body.number)
                // console.log('unupdated endPO  : ', req.query.week)
                res.api.sendData(record.recordset)
            }
        )
    } catch (error) {
        // console.log('err', error)
    }
})

sanLuong.delete('/deletePODeep/:number/:factoryId', async (req, res) => {
    try {
        const data = await new mssql.Request()
            .input('factoryId', req.params.factoryId)
            .input('number', req.params.number)
            .execute('[dbo].[Proc_xoaDuLieuSanXuat]')
        res.api.sendData(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})

sanLuong.get('/deletePO', (req, res, next) => {
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('number', req.query.number)
        .query(
            `delete from prod.PO where number = @number and approvedAt is null`, (err, record) => {
                if (err)
                    return res.api.sendFail(err)

                return res.api.sendData(record.recordset)

            })
})

sanLuong.get('/tuChoiPO', (req, res, next) => {
    new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('number', req.query.number)
        .query(
            `update prod.PO 
            set 
            KH_approvedByAccount = null, 
            KH_approvedAt = null 
            where number =  @number and approvedAt is null`, (err, record) => {
                if (err)
                    return res.api.sendFail(err)

                return res.api.sendData(record.recordset)

            })
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
                `INSERT INTO prod.[PACKAGE](GUID,SOURCE_ID,DESTINATION_ID,TYPE_ID,PO,CREATE_DATE,CREATE_BY,factoryId,DESCRIPTION)
            VALUES (NEWID(),'${req.body.departmentId}','${req.body.stepNextId}',100026,'${req.body.PO}',GETDATE(),'${req.body.createBy}','${req.body.factoryId}','${req.body.marketCode}')
            SELECT TOP 1 * FROM prod.[PACKAGE] where PO = '${req.body.PO}'
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
sanLuong.post('/insert-qc-lua-dat', (req, res, next) => {
    const datanhan = req.body.dulieu

    datanhan.forEach(element => {
        const query = `INSERT INTO   [prod].[QC_LUA_DAT] (BAO_ID,ITEM_ID,QUANTITY,PRICE_CODE) 
        VALUES ('${req.body.BAO_ID}','${element.quycach}',${element.soluong},'${element.PRICE_CODE}')`
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
sanLuong.post('/insert-qc-dau-vao', (req, res, next) => {
    const datanhan = req.body.dulieu

    datanhan.forEach(element => {
        const query = `INSERT INTO   [prod].[QC_DAU_VAO] (PACKAGE_TEMP_ID,ITEM_ID,QUANTITY) 
        VALUES ('${req.body.PACKAGE_TEMP_ID}','${element.quycach}',${element.soluong})`
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
sanLuong.post('/insert-pallet-nhap-kho', (req, res, next) => {
    const datanhan = req.body.dulieu

    datanhan.forEach(element => {
        const query = `INSERT INTO   [prod].[PALLET_NHAP_KHO_TP] (PACKAGE_TEMP_ID,PALLET_ID,QUANTITY) 
        VALUES ('${req.body.PACKAGE_TEMP_ID}','${element.pallet_id}',${element.soluong})`
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
sanLuong.post('/insert-package-temp', (req, res, next) => {
    try {
      if (req.body.xacnhanqc == true) {

        new mssql.Request()
            .input('code', req.body.PO)
            .input('quantity', req.body.quantity)

           
            .input('DESTINATION_ID', req.body.departmentId)
            .query(
                `INSERT INTO prod.[PACKAGE_TEMP](SOURCE_ID,DESTINATION_ID,TYPE_ID,PO,CREATE_DATE,CREATE_BY,factoryId,ITEM_ID,QUANTITY,pallet_full_top_ID,SL_PALLET,ITEM_FROM_ID,[root],STEP_QC)
            VALUES ('${req.body.departmentId}','${req.body.stepNextId}','${req.body.TYPE_ID}','${req.body.PO}',GETDATE(),'${req.body.createBy}','${req.body.factoryId}'
            ,'${req.body.itemId}','${req.body.quantity}',${req.body.pallet_full_top_id},${req.body.SL_PALLET},${req.body.ITEM_FROM_ID},N'${req.body.root}',100081)
            SELECT * FROM prod.[PACKAGE_TEMP] where PO = '${req.body.PO}'
            order by ID DESC
           `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
              
                    res.api.sendData(record.recordset)
                }
            )
      } else {
        new mssql.Request()
        .input('code', req.body.PO)
        .input('quantity', req.body.quantity)

       
        .input('DESTINATION_ID', req.body.departmentId)
        .query(
            `INSERT INTO prod.[PACKAGE_TEMP](SOURCE_ID,DESTINATION_ID,TYPE_ID,PO,CREATE_DATE,CREATE_BY,factoryId,ITEM_ID,QUANTITY,pallet_full_top_ID,SL_PALLET,ITEM_FROM_ID,[root])
        VALUES ('${req.body.departmentId}','${req.body.stepNextId}','${req.body.TYPE_ID}','${req.body.PO}',GETDATE(),'${req.body.createBy}','${req.body.factoryId}'
        ,'${req.body.itemId}','${req.body.quantity}',${req.body.pallet_full_top_id},${req.body.SL_PALLET},${req.body.ITEM_FROM_ID},N'${req.body.root}')
        SELECT * FROM prod.[PACKAGE_TEMP] where PO = '${req.body.PO}'
        order by ID DESC
       `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                // console.log('unupdated endPO  : ', req.query.number)
                // console.log('unupdated endPO  : ', req.query.week)
                res.api.sendData(record.recordset)
            }
        )
      }
    } catch (error) {
        // console.log('err', error)
    }



})
sanLuong.post('/insert-in-package', (req, res, next) => {

    console.log('', )
    new mssql.Request()
        .input('code', req.body.PO)
        .input('quantity', req.body.quantity)

        .input('GUID', req.body.no)

        .query(
            `INSERT INTO prod.[ITEM_IN_PACKAGE](GUID,PACKAGE_ID,ITEM_ID,QUANTITY)
          VALUES (NEWID(),'${req.body.PACKAGE_ID}','${req.body.itemId}','${req.body.quantity}')
          `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                // console.log('unupdated endPO  : ', req.query.number)
                // console.log('unupdated endPO  : ', req.query.week)
                next()
            }
        )
}, (req, res, next) => {
    new mssql.Request()
        .query(
            `DECLARE 
            @columns int = '';
            SELECT TOP 1 @columns = ID FROM prod.[ITEM_IN_PACKAGE] where PACKAGE_ID = '${req.body.PACKAGE_ID}'
          order by ID DESC
            INSERT INTO prod.[MATERIALS_IN_PACKAGE](GUID,ITEM_IN_PACKAGE_ID,ITEM_ID,QUANTITY)
          VALUES (NEWID(),@columns,'${req.body.itemId}','${req.body.quantity}')
          `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                // console.log('unupdated endPO  : ', req.query.number)
                // console.log('unupdated endPO  : ', req.query.week)
                next()
            }
        )
    // console.log('err', error)
}, (req, res) => {
    return res.api.sendData({
        ok: 'ok'
    })
})
sanLuong.put('/update-dinh-tuyen', (req, res) => {
   const datachuyen = req.body.datachuyen

   datachuyen.forEach(async element => {
    let codeupdate = uuidv4()
    const data = await new mssql.Request()
    .input('stepId', req.body.stepIds)
    .input('number', req.body.number)
    .input('next_stepid', req.body.nextstepId)
    .input('accountId', req.body.accountId)
    .input('conlai', element.conlai)
    .input('itemId', element.itemId)
    .input('keHoach', element.keHoach)
    .input('root', element.root)
    .input('codeupdate', codeupdate)
    .execute('Proc_updatedinhtuyen')
res.status(200).send(data.recordset)
   })
})
sanLuong.post('/san-luong-nhan-nm', (req, res) => {
    try {
        const data = new mssql.Request()
        .input('departmentId', req.body.departmentId)
        .input('fromDate', req.body.fromDate)

        .input('toDate', req.body.toDate)
        .query(
            `
            select P.ID,D.NAME congdoangiao,I.NAME,I.HEIGHT,I.WIDTH,I.LENGTH, IT.QUANTITY,P.CREATE_BY,P.CREATE_DATE,P.SX_VERIFY_BY,P.VERIFY_BY
            ,P.DESTINATION_ID noiden,P.QUANTITYNHAN,'' TONG,P.VERIFY_DATE,P.SX_VERIFY_DATE,P.DESCRIPTION GHICHU, pnp.CODE 
            from prod.PACKAGE P
            left join prod.ITEM_IN_PACKAGE IT on P.ID = IT.PACKAGE_ID
            left join base.ITEM I on I.ID = IT.ITEM_ID
            left join base.DEPARTMENT D on D.ID = P.SOURCE_ID
            left join prod.PHIEU_NHAN_PHOI pnp on p.ID = pnp.PACKAGE_ID
            where P.PO = '100000' and 
            (CASE WHEN P.SOURCE_ID = 102859 and P.factoryId = 102340 then 100004 else P.factoryId end) = @departmentId and 
            P.CREATE_DATE BETWEEN @fromDate and @toDate and P.TYPE_ID = 100026
            ORDER BY CREATE_DATE DESC
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
    } catch (error) {
        // console.log('err', error)
    }
})
sanLuong.post('/san-luong-nhan-mua-ngoai', (req, res) => {
    try {
        const data = new mssql.Request()
        .input('departmentId', req.body.departmentId)
        .input('fromDate', req.body.fromDate)

        .input('toDate', req.body.toDate)
        .query(
            `
            select O.ID,N'nhập ngoài' congdoangiao,I.NAME,I.HEIGHT,I.WIDTH,I.LENGTH,o.QUANTITY ,o.CREATE_BY VERIFY_BY,o.SX_VERIFY_BY
            ,D.ID noiden,o.QUANTITY QUANTITYNHAN,'' TONG,o.createdAt VERIFY_DATE,o.description GHICHU,o.createdAt CREATE_DATE
            ,o.SX_VERIFY_DATE
            from [prod].[OPENING_STOCK] O
            left join base.DEPARTMENT D on o.DESTINATION_ID = D.ID
            left join base.ITEM I on I.ID = o.ITEM_ID
            where DEPARTMENT_ID = 102778 and nguonPhoi = N'Mua ngoài' and o.createdAt
            BETWEEN @fromDate and @toDate
            ORDER BY o.createdAt DESC
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
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
sanLuong.get('/vanity', (req, res) => {
    try {
        const data = new mssql.Request().query(
            `
            select * from(select  d.NAME as department,i.NAME itemName,i.LENGTH,i.WIDTH,i.HEIGHT,
                sum(iip.QUANTITY) as thuchien,
                i1.NAME as TPName from prod.PACKAGE pa
                left join prod.PO po on pa.PO = po.code 
                left join prod.ITEM_IN_PACKAGE iip on pa.ID = iip.PACKAGE_ID
                left join base.ITEM i on iip.ITEM_ID = i.ID
                left join base.DEPARTMENT d on pa.SOURCE_ID = d.ID
                left join base.MARKET mk on po.root = mk.CODE
                LEFT join base.ITEM i1 on mk.PRODUCT_ID = i1.ID
                where po.number like 'PO%' and pa.TYPE_ID = 100026 and pa.SOURCE_ID != 100273 
                and pa.CREATE_DATE >='${req.query.fromDate}' and pa.CREATE_DATE < '${req.query.toDate}'  group by d.NAME,i.NAME,i.LENGTH,i.WIDTH,i.HEIGHT,i1.NAME ) as b
                union all
                select * from(select  d.NAME as department,i.NAME itemName,i.LENGTH,i.WIDTH,i.HEIGHT,
                sum(iip.QUANTITY) as thuchien,
                mk.NAME as TPName from prod.PACKAGE pa
                left join prod.PO po on pa.PO = po.code 
                left join prod.ITEM_IN_PACKAGE iip on pa.ID = iip.PACKAGE_ID
                left join base.ITEM i on iip.ITEM_ID = i.ID
                left join base.DEPARTMENT d on pa.SOURCE_ID = d.ID
                left join base.MARKET mk on po.root = mk.CODE
                where po.number like 'PO%' and pa.TYPE_ID = 100026 and pa.SOURCE_ID = 100273 
                and pa.CREATE_DATE >='${req.query.fromDate}' and pa.CREATE_DATE < '${req.query.toDate}' group by d.NAME,i.NAME,i.LENGTH,i.WIDTH,i.HEIGHT,mk.NAME ) as c
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
    } catch (error) {
        // console.log('err', error)
    }
})

sanLuong.get('/number-in-lsx', (req, res, next) => {
    try {
        new mssql.Request()
            .input('factoryId', req.query.factoryId)
            .input('week', req.query.week)
            .input('year', req.query.year)
            .query(
                `
                SELECT DISTINCT number FROM prod.PO
                WHERE factoryId = @factoryId AND week = @week AND year = @year
                `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

sanLuong.get('/department-in-lsx', (req, res, next) => {
    try {
        new mssql.Request()
            .input('number', req.query.number)
            .query(
                `
                select distinct d.ID, d.NAME, po.endPO from prod.PO
                inner join base.DEPARTMENT d on po.stepId = d.ID
                where number = @number
                `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})
sanLuong.get('/department-lsx-updated', (req, res, next) => {
    try {
        new mssql.Request()
            .input('number', req.query.number)
            .input('stepId', req.query.stepId)
            .query(
                `select PO.root,M.NAME thanhpham,I.NAME,PO.code,PO.stepId,D.NAME congdoan,PO.itemId,PO.keHoach- namhong - th - ys1a -ys1b - tb + hanMucTon+ loiCongDon keHoach
                ,isnull(K.QUANTITY,0) QUANTITY, 
                PO.keHoach - namhong - th - ys1a -ys1b - tb + hanMucTon + loiCongDon- isnull(K.QUANTITY,0) conlai from prod.PO PO
  left join ( select P.PO,IT.ITEM_ID, isnull(sum(IT.QUANTITY),0) QUANTITY from prod.PACKAGE P 
  left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
  GROUP BY P.PO,IT.ITEM_ID
  ) K on K.PO = PO.code and K.ITEM_ID = PO.itemId
  left join base.ITEM I on I.ID = PO.itemId
  left join base.DEPARTMENT D on D.ID = PO.stepId
  left join base.MARKET M on M.CODE = PO.root
  where PO.number = @number and PO.stepId = @stepId
  order by I.NAME
                `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

sanLuong.put('/close-step-in-lsx', (req, res, next) => {
    try {
        const stepIds = req.body.stepIds;
        let query = `
        update prod.PO set endPO = 1
        where number = N'${req.body.number}' and stepId in (
        `
        for (let i = 0; i < stepIds.length; i++) {
            query += stepIds[i] + ", "
        }
        query = query.substring(0, query.length - 2);
        query += ")";

        let query2 = `
        INSERT INTO prod.PO_LOG (NUMBER, DEPARTMENT_ID, STATUS, CREATED_BY, CREATED_AT)
        VALUES
        `
        for (let i = 0; i < stepIds.length; i++) {
            query2 += `(N'${req.body.number}', ${stepIds[i]}, N'Đóng', ${req.body.accountId}, GETDATE()),`
        }
        query2 = query2.substring(0, query2.length-1);

        let query3 = query + " "+ query2;
        new mssql.Request()
            .query(query3,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

sanLuong.put('/open-step-in-lsx', (req, res, next) => {
    try {
        const stepIds = req.body.stepIds;
        let query = `
        update prod.PO set endPO = 0
        where number = N'${req.body.number}' and stepId in (
        `
        for (let i = 0; i < stepIds.length; i++) {
            query += stepIds[i] + ", "
        }
        query = query.substring(0, query.length - 2);
        query += ")";

        let query2 = `
        INSERT INTO prod.PO_LOG (NUMBER, DEPARTMENT_ID, STATUS, CREATED_BY, CREATED_AT)
        VALUES
        `
        for (let i = 0; i < stepIds.length; i++) {
            query2 += `(N'${req.body.number}', ${stepIds[i]}, N'Mở', ${req.body.accountId}, GETDATE()),`
        }
        query2 = query2.substring(0, query2.length-1);
        
        let query3 = query + " "+ query2;
        new mssql.Request()
            .query(query3,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

sanLuong.get('/po-log-by-number', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                SELECT NUMBER, D.NAME DEPARTMENT_NAME, STATUS, A.LAST_NAME, CREATED_AT 
                FROM prod.PO_LOG PL
                INNER JOIN base.DEPARTMENT D ON PL.DEPARTMENT_ID = D.ID
                INNER JOIN base.ACCOUNT A ON PL.CREATED_BY = A.ID
            WHERE NUMBER = N'${req.query.number}'
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})
sanLuong.get('/code-in-market', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                select CODE value, '['+CODE + '] - '+ NAME label, NAME, PRODUCT_ID from base.MARKET
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})
sanLuong.get('/main-prices', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                select mp.ID, m.PRODUCT_ID ITEM_ID, m.CODE, m.NAME, mp.FROM_DATE, mp.TO_DATE, mp.PRICE, mp.CCY from base.MARKET m
                inner join prod.MAIN_PRICES mp on m.CODE = mp.ART_NO
                where CODE = '${req.query.code}'
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})
sanLuong.post('/main-prices', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                insert into prod.MAIN_PRICES (ART_NO, FROM_DATE, PRICE, CCY)
                values ('${req.body.code}','${req.body.fromDate}',${req.body.price},'${req.body.ccy}')
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})
sanLuong.put('/main-prices', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                update prod.MAIN_PRICES
                set
                ART_NO = '${req.body.code}',
                FROM_DATE = '${req.body.fromDate}',
                TO_DATE = '${req.body.toDate}',
                PRICE = ${req.body.price},
                CCY = '${req.body.ccy}'
                where ID = ${req.body.id}
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

sanLuong.delete('/main-prices/:id', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                delete from prod.MAIN_PRICES
                where ID = ${req.params.id}
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

sanLuong.get('/exchange-rate', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                select ID, THANG, NAM, CCY_BEFORE, CCY_AFTER, EXCHANGE_RATE from prod.EXCHANGE_RATE
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})
sanLuong.post('/exchange-rate', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                insert into prod.EXCHANGE_RATE (THANG, NAM, CCY_BEFORE, EXCHANGE_RATE)
                values (${req.body.thang}, ${req.body.nam}, '${req.body.ccyBefore}', ${req.body.exchangeRate})
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

sanLuong.put('/exchange-rate', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                update prod.EXCHANGE_RATE
                set
                THANG = ${req.body.thang},
                NAM = ${req.body.nam},
                CCY_BEFORE = '${req.body.ccyBefore}',
                EXCHANGE_RATE = ${req.body.exchangeRate}
                where ID = ${req.body.id}

            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

sanLuong.delete('/exchange-rate/:id', (req, res, next) => {
    try {
        new mssql.Request()
            .query(
                `
                delete from prod.EXCHANGE_RATE
                where ID = ${req.params.id}
            `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907))
                    res.api.sendData(record.recordset)
                }
            )
    } catch (error) {
    }
})

module.exports = sanLuong