const express = require('express')
const route = express.Router()
const mssql = require("mssql");

const {
    Item,
    Op
} = require('../../../models')

route.get('/', async(req, res) => {
    let {
        factoryId
    } = req.query;
    try {
        let items = await Item.findAll({
            where: {
                [Op.and]: [{
                    factoryId
                }, {
                    typeId: {
                        [Op.in]: [100002, 100003]
                    }
                }]
            }
        })
        res.status(200).send(items)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})
route.post('/import-items',async (req, res)=>{
    try {
        const data = await Item.bulkCreate(req.body)
        res.status(200).json({ success:true, data})
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.get('/vanity', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select i.ID,i.NAME,I.CODE from base.ITEM i inner join prod.ROUTING r on i.ID = r.ITEM_ID where i.NAME like 'VA3%' and r.STEP_ID in (
            100270,
            100273,
            100282,
            102363,
            102365,
            102390)
        
        `)
        res.status(200).send(data)
    } catch (e) {
        return res.send(500).send(e)
    }
})
route.get('/qc-cap-pcd', async(req, res, next) => {
    new mssql.Request()
    .query(`  SELECT DISTINCT I.ID id,
    I.NAME name,I.CODE code,I.HEIGHT height,I.LENGTH length,I.WIDTH width,I.UNIT_ID unit,I.VOLUMN volumn
      FROM [prod].[XUAT_GO] XG
      left join (select * from base.ITEM where STATUS = 1) I on I.LENGTH = XG.DAI and I.HEIGHT = XG.DAY and I.WIDTH = XG.RONG
            where XG.number = '${req.query.number}'
   `, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})
route.get('/items-nhap-ton', async(req, res, next) => {
    new mssql.Request()
    .query(`   select DISTINCT I.ID,I.LENGTH,I.WIDTH,I.HEIGHT,I.CODE,I.NAME,R.STEP_ID,U.NAME unit from
    ( select DISTINCT ITEM_ID,STEP_ID,[ORDER] from [prod].[ROUTING]) R
     left join base.ITEM I on I.ID = R.ITEM_ID
     left join base.UNIT U on U.ID = I.UNIT_ID
   --  where R.STEP_ID = ${req.query.department} and R.[ORDER] <>1
   `, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})
route.get('/palet-full-top', async(req, res, next) => {
    new mssql.Request()
    .query(` SELECT 
    [CODE],P.NAME,P.ID
FROM [prod].[MA_SP_KHO_TP] M
left join prod.PALLET_FULL_TOP P on P.ID = M.PALLET_FULL_TOP_ID
            where M.CODE = '${req.query.maket}'
   `, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})
route.get('/market', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select m.CODE,m.NAME from base.MARKET m
        left join base.ITEM I on I.ID = m.PRODUCT_ID
        where I.TYPE_ID = 100003
        `)
        res.status(200).send(data.recordset)
    } catch (e) {
        return res.send(500).send(e)
    }
})
route.get('/ma-vt', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select ma_vt, ten_vt, dvt from view_VatTuPhuKien_Fast --where kk_yn = ${req.query.type}
        `)
        res.status(200).send(data.recordset)
    } catch (e) {
        return res.send(500).send(e)
    }
})
route.get('/dinh-muc-by-market', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select dm.ID ,dm.MA_VT, v.ten_vt, dm.DM_SP, v.dvt, v.kk_yn from prod.DINH_MUC_VAT_TU dm
        inner join view_VatTuPhuKien_Fast v on dm.MA_VT = v.ma_vt
        where dm.MARKET_CODE = '${req.query.marketCode}'
        `)
        res.status(200).send(data.recordset)
    } catch (e) {
        return res.status(500).send(e)
    }
})

route.post('/insert-dinh-muc-vt', async(req, res, next) => {
    try {
        let query = `INSERT INTO prod.DINH_MUC_VAT_TU (MARKET_CODE, MA_VT, DM_SP, CREATED_BY, CREATED_DATE) VALUES
        ('${req.body.marketCode}', '${req.body.maVT}', 0, ${req.body.accountId}, GETDATE())
        `;
        const data = await new mssql.Request().query(query)
        res.status(200).send(data.recordset)
    } catch (e) {
        return res.status(500).send(e)
    }
})
route.put('/update-dinh-muc-vt', async(req, res, next) => {
    try {
        let query = `UPDATE prod.DINH_MUC_VAT_TU SET DM_SP = ${req.body.dm_sp} WHERE ID = ${req.body.id}`;
        const data = await new mssql.Request().query(query)
        res.status(200).send(data.recordset)
    } catch (e) {
        return res.status(500).send(e)
    }
})
route.delete('/delete-dinh-muc-vt/', async(req, res, next) => {
    try {
        let query = `DELETE FROM prod.DINH_MUC_VAT_TU WHERE ID = ${req.params.id}`;
        const data = await new mssql.Request().query(query)
        res.status(200).send(data.recordset)
    } catch (e) {
        return res.status(500).send(e)
    }
})
route.get('/van', async(req, res, next) => {
    new mssql.Request()
        .query(
            `
            SELECT ID, NAME FROM base.ITEM WHERE [NAME] LIKE N'Ván%' AND UNIT_ID in (100001,100005) AND [NAME] != N'Ván xẻ' AND CREATE_DATE IS NOT NULL
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
route.get('/types', async(req, res, next) => {
    new mssql.Request()
        .query(
            `
            SELECT ID id,NAME name,SORT from [base].[ITEM_TYPE]
            order by SORT
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
route.get('/items-stock', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT po.root,mk.NAME sp,i.ID,i.NAME ct FROM [prod].[PO] po 
        left join base.MARKET mk on po.root = mk.CODE
        left join base.ITEM i on po.itemId = i.ID
        where po.stepId in(100265,
        100278) and po.number = '${req.query.number}'
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
route.put('/:id', async(req, res) => {
    try {
        let result = Item.update(req.body, {
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

route.get('/item-go-tho', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select * from
        (SELECT I.ID id, I.CODE code, I.NAME name, HEIGHT height, WIDTH width, LENGTH length, U.NAME unit , I.volumn
        FROM prod.XUAT_GO_BAO XGB
        left join (select * from base.ITEM where [TYPE_ID] = 100001 ) I on I.LENGTH = XGB.DAI and I.WIDTH = XGB.RONG and I.HEIGHT = XGB.DAY
        INNER JOIN base.UNIT U ON I.UNIT_ID = U.ID
        WHERE DESTINATION_ID = ${req.query.DESTINATION_ID}
        union all
        SELECT I.ID id, I.CODE code, I.NAME name, HEIGHT height, WIDTH width, LENGTH length, U.NAME unit , I.volumn
            FROM prod.OPENING_STOCK OP
            left join (select * from base.ITEM where [TYPE_ID] = 100001 ) I on I.ID = OP.ITEM_ID
            INNER JOIN base.UNIT U ON I.UNIT_ID = U.ID
            WHERE DEPARTMENT_ID = ${req.query.DESTINATION_ID}) H
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.get('/item-loi', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
            select T.ID,T.NAME, T.HEIGHT, T.WIDTH, T.LENGTH, T.VOLUMN, SUM(T.quantity) AS QUANTITY from(
            select distinct i.ID,i.NAME, i.HEIGHT, i.WIDTH, i.LENGTH, i.VOLUMN, -xgb.SL_TH as quantity from prod.XUAT_GO_BAO xgb
            inner join base.ITEM i on xgb.DAY = i.HEIGHT and xgb.RONG = i.WIDTH and xgb.DAI = i.LENGTH
            where xgb.XUATNHAP in ('loi', 'xuat-cat-ha-cap', 'loi-cat-ha-cap') and xgb.SOURCE_ID = ${req.query.stepId}
            union 
            SELECT I.ID,I.NAME,I.HEIGHT,I.WIDTH,I.LENGTH,I.VOLUMN, QUANTITY quantity FROM prod.PACKAGE P
            INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            left join base.ITEM I on I.ID = IIP.ITEM_ID
            WHERE P.DESTINATION_ID = ${req.query.stepId} and P.SOURCE_ID in (102487,102495,100081) and P.VERIFY_BY is not null
            union 
            SELECT I.ID,I.NAME,I.HEIGHT,I.WIDTH,I.LENGTH,I.VOLUMN, QUANTITY quantity FROM prod.OPENING_STOCK OS
           
            left join base.ITEM I on I.ID = OS.ITEM_ID
            WHERE OS.DEPARTMENT_ID = ${req.query.stepId} ) AS T
            GROUP BY T.NAME, T.HEIGHT, T.WIDTH, T.LENGTH, T.VOLUMN,T.ID
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.get('/bc-xuat-cat-ha-cap', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT DAI, RONG, DAY, I.NAME, I.LENGTH, I.WIDTH, I.HEIGHT, D1.NAME DESTINATION_NAME, D2.NAME SOURCE_NAME, D3.NAME DESTINATION_NAME_HC , SL_TH, KLC_TH, SL_HC, KLC_HC FROM prod.XUAT_GO_BAO XGB
        LEFT JOIN base.ITEM I ON XGB.itemId = I.ID
        LEFT JOIN base.DEPARTMENT D1 ON XGB.DESTINATION_ID = D1.ID
        LEFT JOIN base.DEPARTMENT D2 ON XGB.SOURCE_ID = D2.ID
        LEFT JOIN base.DEPARTMENT D3 ON XGB.DESTINATION_ID_HC = D3.ID
        where XUATNHAP = 'xuat-cat-ha-cap' AND XGB.createdAt BETWEEN '${req.query.start} 00:00' AND '${req.query.end} 23:59' and XGB.factoryId = ${req.query.factoryId}
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.get('/item-in-bom', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select CODE, NAME, DAI, RONG, DAY from nlg.BOM
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.get('/all', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select ID, CODE, NAME, LENGTH, WIDTH, HEIGHT from base.ITEM
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.post('/lua-ha-cap', async(req, res, next) => {
    try {
        const data = await new mssql.Request()
        
        .query(`
        INSERT INTO prod.LUA_HA_CAP (CODE_HC, SL_HC, CODE_HCV, SL_HCV, CREATED_BY, CREATED_AT)
        VALUES ( ${req.body.code1}, ${req.body.quantity1}, ${req.body.code2}, ${req.body.quantity2}, ${req.body.accountId}, GETDATE())
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.get('/department-vgt', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select ID, NAME from base.DEPARTMENT where NAME like '%VGT%' and NAME not like '%(TH)'
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
route.get('/customer-all', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        select ID value, NAME label from base.CUSTOMER
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
route.get('/ep-mun-number', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT TOP 1 NUMBER FROM prod.EP_MUN WHERE CODE = '${req.query.code}' ORDER BY NUMBER DESC
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
route.get('/code-in-week-ep-mun', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT CODE+ '-'+ CONVERT(varchar, NUMBER) label, CODE, NUMBER  FROM prod.EP_MUN WHERE DATEPART(WEEK, CREATED_AT) -1 = ${req.query.week}
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
route.get('/ep-mun-detail', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT EM.ID ,NGAY_CAN_TONG, NGAY_CAN_BI, C.NAME BEN_MUA, D.NAME BEN_BAN, EM.BIEN_SO_XE, 
CASE WHEN EM.HANG_HOA = 'cui-dau-mau' THEN N'Củi đầu mẩu'
ELSE N'Mùn cưa ép bánh' end HANG_HOA, TOTAL_VOLUMN, BI_VOLUMN, VOLUMN, A.LAST_NAME, A2.LAST_NAME VERIFY_NAME
FROM prod.EP_MUN EM
LEFT JOIN base.CUSTOMER C ON EM.CUSTOMER_ID = C.ID
LEFT JOIN base.DEPARTMENT D ON EM.FACTORY_ID = D.ID
LEFT JOIN base.ACCOUNT A ON EM.CREATED_BY = A.ID
LEFT JOIN base.ACCOUNT A2 ON EM.VERIFY_BY = A2.ID
WHERE EM.CODE = '${req.query.code}' AND EM.NUMBER = ${req.query.number}
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
route.get('/report-ep-mun', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT CREATED_AT, DATEPART(WEEKDAY, CREATED_AT) THU, 
DATEPART(WEEK, NGAY_CAN_TONG)-1 TUAN, 
DATEPART(MONTH, NGAY_CAN_TONG) THANG, 
DATEPART(YEAR, NGAY_CAN_TONG) NAM,
C.NAME CUSTOMER_NAME, EM.CODE + '-' + CONVERT(varchar, EM.NUMBER) CODE,
CASE WHEN EM.HANG_HOA = 'cui-dau-mau' THEN N'Củi đầu mẩu' else N'Mùn ép đóng bánh' end HANG_HOA
, D.NAME FACTORY_NAME, EM.TOTAL_VOLUMN, EM.BI_VOLUMN, EM.VOLUMN, GIATIEN, GIATIENCB
FROM prod.EP_MUN EM
LEFT JOIN base.CUSTOMER C ON EM.CUSTOMER_ID = C.ID
INNER JOIN base.DEPARTMENT D ON EM.FACTORY_ID = D.ID
WHERE CREATED_AT BETWEEN '${req.query.from} 00:00' AND '${req.query.to} 23:59'
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.post('/ep-mun', async(req, res, next) => {
    try {
        const data = await new mssql.Request()
        .input('code', req.body.code)
        .input('number', req.body.number)
        .input('customerId', req.body.customerId)
        .input('factoryId', req.body.factoryId)
        .input('ngayCanTong', req.body.ngayCanTong)
        .input('ngayCanBi', req.body.ngayCanBi)
        .input('bienSoXe', req.body.bienSoXe)
        .input('hangHoa', req.body.hangHoa)
        .input('nilon', req.body.nilon)
        .input('totalVolumn', req.body.totalVolumn)
        .input('biVolumn', req.body.biVolumn)
        .input('volumn', req.body.volumn)
        .input('createdBy', req.body.createdBy)
        .input('giatien', req.body.giatien)
        .input('giatiencb', req.body.giatiencb)
        .query(`
        INSERT INTO prod.EP_MUN (CODE, NUMBER, CUSTOMER_ID, FACTORY_ID, NGAY_CAN_TONG, NGAY_CAN_BI, BIEN_SO_XE, HANG_HOA, IS_NILON, TOTAL_VOLUMN, BI_VOLUMN, VOLUMN, CREATED_BY, CREATED_AT,GIATIEN,GIATIENCB)
        VALUES (@code, @number, @customerId, @factoryId, @ngayCanTong, @ngayCanBi, @bienSoXe, @hangHoa, @nilon, @totalVolumn, @biVolumn, @volumn, @createdBy, GETDATE(),@giatien,@giatiencb)
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
route.post('/ep-mun-thu-kho', async(req, res, next) => {
    try {
        const data = await new mssql.Request()
        .input('id', req.body.id)
        .input('accountId', req.body.accountId)
        .query(`
        UPDATE prod.EP_MUN
        SET
        VERIFY_BY = @accountId,
        VERIFY_AT = GETDATE()
        WHERE ID = @id
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
route.put('/delete-ep-mun-thu-kho/:id', async(req, res, next) => {
    try {
        const data = await new mssql.Request()
        .query(`
        DELETE FROM prod.EP_MUN
        WHERE ID = ${req.params.id}
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
module.exports = route