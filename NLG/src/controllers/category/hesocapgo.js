const express = require('express')
const hesocapgo = express.Router()
const mssql = require('mssql')

const model = require('../../data/model')

hesocapgo.get('/2M', (req, res) => {
    //console.log(req.query.nhom)
    new mssql.Request()
        .query(`SELECT  DISTINCT number
		FROM prod.XUAT_GO_BAO where XUATNHAP = 'xuatbao2M'
		and  factoryId = '${req.query.factoryId}' and week = '${req.query.week}' and year = '${req.query.year}'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
hesocapgo.get('/X2M', (req, res) => {
    console.log(req.query.nhom)
    new mssql.Request()
        .query(`SELECT B.NAME, X.*,0 THANH,isnull(M.SL_TH,0) daxuat from
        ( SELECT DAI,RONG,DAY,SUM(SL_TH) SL_TH,number	FROM prod.XUAT_GO_BAO where XUATNHAP = 'xuatbao2M'
        group by DAI,RONG,DAY,number) X
        left join ( SELECT DAI,RONG,DAY,SUM(SL_TH) SL_TH,number	FROM prod.XUAT_GO_BAO where XUATNHAP = 'xuat'  
         group by DAI,RONG,DAY,number) M on X.DAY = M.DAY and X.RONG = M.RONG and X.DAI = M.DAI and X.number = M.number
         left join nlg.BOM B on X.DAY = B.DAY and X.RONG = B.RONG and X.DAI = B.DAI
		WHERE  X.number = '${req.query.number}' `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
hesocapgo.get('/BX2M', (req, res) => {
  
    new mssql.Request()
        .query(`SELECT B.NAME, X.* from
        ( SELECT DAI,RONG,DAY,SL_TH,KLC_TH,number,DESTINATION_ID,createdAt	FROM prod.XUAT_GO_BAO where XUATNHAP = 'xuat'
       ) X
       
         left join nlg.BOM B on X.DAY = B.DAY and X.RONG = B.RONG and X.DAI = B.DAI
		WHERE  X.number = '${req.query.number}' `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
hesocapgo.post('/xuat-goTQ', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[XUAT_GO_BAO] ([week],[year],[number],[createdAt],[createdby],[factoryId]
            ,KLC_TH,DAY,RONG,DAI,SOURCE_ID,DESTINATION_ID,SL_TH,XUATNHAP) 
        VALUES ('${req.body.week}','${req.body.year}','${req.body.number}', GETDATE(),'${req.body.createBy}','${req.body.factoryId}'
        ,'${element.TonTH}','${element.DAY}','${element.RONG}','${element.DAI}','${req.body.SOURCE_ID}','${element.noiden}','${element.THANH}','${req.body.XUATNHAP}')`
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
// hesocapgo.post('/xuat-goTQ', (req, res) => {
//     const dataDelai = req.body.dataDelai

//     dataDelai.forEach(element => {
//         const query = `INSERT INTO   [prod].[XUAT_GO_BAO] ([week],[year],[number],[createdAt],[createdby],[factoryId]
//             ,KLC_TH,DAY,RONG,DAI,SOURCE_ID,DESTINATION_ID,SL_TH,XUATNHAP) 
//         VALUES ('${req.body.week}','${req.body.year}','${req.body.number}', '${req.body.createdAt}','${req.body.createBy}','${req.body.factoryId}'
//         ,'${element.TonTH}','${element.DAY}','${element.RONG}','${element.DAI}','${req.body.SOURCE_ID}','${element.noiden}','${element.THANH}','${req.body.XUATNHAP}')`
//         new mssql.Request().query(query, (err, record) => {
//             if (err)
//             return res.api.sendFail(getErrorMessage(4907))
//         res.api.sendData(record.recordset)
//     })
hesocapgo.get('/hssd', (req, res) => {
   
    new mssql.Request()
        .query(`select B.*,X.heso,X.KLC_TH,X.number,X.itemId,case when K.QUANTITY is null then 0
        else K.QUANTITY end QUANTITY,X.KLC_TH/K.QUANTITY hesosudung,K.LENGTH,K.WIDTH,K.HEIGHT from
        (select DISTINCT ITEM_ID,paren_id,paren, NAME from ( select DISTINCT * from [prod].[STEP_ITEM_SP]) C where C.STEP_ID in (102787,100264,102382,102378,102370,102347,100274,100276,100278,102374,100265) ) B
        left join (select itemId,sum(KLC_TH) KLC_TH,number,heso from (select itemId,case when heso in (3.78,4.2,3.8,4.6)  then heso/2 else heso end as heso,
		case when heso in (3.78,4.2,3.8,4.6) then KLC_TH/2 else KLC_TH end as KLC_TH,number
		 from prod.XUAT_GO where itemId is not null and factoryId = ${req.query.factoryId}) K
        GROUP BY itemId,number,heso) X on B.ITEM_ID = X.itemId 
      
        left join (select PO.number,IT.ITEM_ID,SUM(IT.QUANTITY)*I.VOLUMN  QUANTITY,I.LENGTH,I.WIDTH,I.HEIGHT from prod.PACKAGE PA 
        left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = PA.ID
        left join prod.PO PO on PO.code = PA.PO 
        left join base.ITEM I on I.ID = IT.ITEM_ID
        where PA.SOURCE_ID in (100264,100265,102370,100274,102347,100278,102378,102382,102374,102787) and PA.TYPE_ID = 100026
        GROUP BY PO.number,IT.ITEM_ID,I.VOLUMN,I.LENGTH,I.WIDTH,I.HEIGHT) K on K.ITEM_ID = X.itemId and K.number = X.number
        
        where X.number is not null and K.QUANTITY>0`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
hesocapgo.get('/hssdthang', (req, res) => {
  
    new mssql.Request()
        .query(`select B.*,X.KLC_TH,X.itemId,case when K.QUANTITY is null then 0
        else K.QUANTITY end QUANTITY,X.KLC_TH/K.QUANTITY hesosudung,K.LENGTH,K.WIDTH,K.HEIGHT from
        (select DISTINCT ITEM_ID,paren, NAME from ( select DISTINCT ITEM_ID,CASE when paren_id in (128390,125774) then 'HOVLIG chId tent' else paren end paren
        , NAME,STEP_ID from [prod].[STEP_ITEM_SP]) C where C.STEP_ID in (100264,102787,102382,102378,102370,102347,100274,100276,100278,102374,100265) ) B
        left join (select itemId,sum(KLC_TH) KLC_TH from (select itemId,case when heso in (3.78,4.2,3.8,4.6) then KLC_TH/2 else KLC_TH end as KLC_TH
		 from prod.XUAT_GO where itemId is not null and factoryId = ${req.query.factoryId}
         and createdAt >='${req.query.fromDate} 00:00:00'and createdAt <'${req.query.toDate} 23:59:59') K
        GROUP BY itemId) X on B.ITEM_ID = X.itemId 
      
        left join (select IT.ITEM_ID,SUM(IT.QUANTITY)*I.VOLUMN  QUANTITY,I.LENGTH,I.WIDTH,I.HEIGHT from prod.PACKAGE PA 
        left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = PA.ID
        
        left join base.ITEM I on I.ID = IT.ITEM_ID
        where PA.SOURCE_ID in (102787,102370,100274,102347,100278,102378,102382,102374,100265) and PA.CREATE_DATE >='${req.query.fromDate} 00:00:00' 
        and PA.CREATE_DATE <'${req.query.toDate} 23:59:59' and PA.factoryId = ${req.query.factoryId} and PA.TYPE_ID = 100026
        GROUP BY IT.ITEM_ID,I.VOLUMN,I.LENGTH,I.WIDTH,I.HEIGHT) K on K.ITEM_ID = X.itemId
        
        where K.QUANTITY>0`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
hesocapgo.get('/hssdoutdoor', (req, res) => {
  
    new mssql.Request()
        .query(`select I.VOLUMN, HS.paren,isnull(soche,0) soche,isnull(donggoi,0) donggoi,isnull(tinhche,0) tinhche,isnull(ton.QUANTITY,0) TONDAUKY,isnull(tonck.QUANTITY,0) TONCUOIKY,
       isnull(KH.SL_TH,0) sausay, (select sum(xuatK)/(sum(xuathcK)+sum(xuatluaphoiK)) as heso from
        (SELECT NAME, DAI, RONG, DAY,isnull([xuat],0) xuat, -isnull([xuatluaphoi],0) AS [xuatluaphoi],isnull([xuat-cat-ha-cap],0) xuathcK,[xuat]/(-isnull([xuatluaphoi],0) + [xuat-cat-ha-cap]) as heso
        ,CAST(DAI as float)*RONG*DAY/1000000000 as VOLUMN,CAST(DAI as float)*RONG*DAY*isnull(xuat,0)/1000000000 as xuatK,
        isnull([xuat-cat-ha-cap],0) as xuathc
        ,CAST(DAI as float)*RONG*DAY*(-isnull([xuatluaphoi],0))/1000000000 as xuatluaphoiK
     FROM
     (
     select B.NAME, XGB.DAI, XGB.RONG, XGB.DAY, XGB.SL_TH, XGB.XUATNHAP from
     (select DAI,RONG,DAY,factoryId,createdAt,
        
     case when X.XUATNHAP = 'xuat-cat-ha-cap' then X.SL_HC*I.VOLUMN else X.SL_TH END SL_TH,X.XUATNHAP
       from prod.XUAT_GO_BAO X
        left join base.ITEM I on I.ID = X.itemId) XGB
     LEFT JOIN NLG.BOM B ON  XGB.DAI = B.DAI AND XGB.RONG = B.RONG AND XGB.DAY = B.DAY
     WHERE createdAt BETWEEN '${req.query.fromDate} 00:00:01' and '${req.query.toDate} 23:59:59'
     and XGB.factoryId = ${req.query.factoryIdsc}
     ) AS BANG_NGUON
     PIVOT
     (
     SUM(SL_TH)
     FOR XUATNHAP IN ([xuat],[xuatluaphoi],[xuat-cat-ha-cap])
     ) AS BANG_CHUYEN) K
     where  xuatluaphoi >0 or xuathc >0) as heso from
        (select paren,paren_id,sum(donggoi) donggoi,sum(tinhche) tinhche,sum(soche) soche from
        (select paren,paren_id,case when STEP_ID = ${req.query.dg} then QUANTITY end as donggoi,
            case when STEP_ID = ${req.query.soche} then QUANTITY end as soche,
         case when STEP_ID in (${req.query.tc}) then QUANTITY end as tinhche  from
        (select DISTINCT P.* from
                (select DISTINCT B.ITEM_ID,paren_id,paren,STEP_ID,K.QUANTITY, NAME from ( select DISTINCT * from  prod.STEP_ITEM_SP) B
             
              
                left join (select PA.SOURCE_ID, IT.ITEM_ID,SUM(IT.QUANTITY)*I.VOLUMN  QUANTITY from prod.PACKAGE PA 
                left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = PA.ID
                
                left join base.ITEM I on I.ID = IT.ITEM_ID
                where PA.factoryId = ${req.query.factoryId} and  PA.TYPE_ID = 100026 and PA.CREATE_DATE BETWEEN '${req.query.fromDate} 00:00:01' and '${req.query.toDate} 23:59:59'
                GROUP BY IT.ITEM_ID,I.VOLUMN,I.LENGTH,I.WIDTH,I.HEIGHT,PA.SOURCE_ID) K on K.ITEM_ID = B.ITEM_ID and K.SOURCE_ID = B.STEP_ID
                
                where K.QUANTITY>0) P) G) GH
                where donggoi >0 or tinhche>0 or soche>0
                GROUP BY paren,paren_id)  HS
                left join
        
            (select * from
                (select DISTINCT sum(QUANTITY) QUANTITY,paren_id from
                (select DEPARTMENT_ID,ITEM_ID,sum(KL) QUANTITY from dbo.View_TON_CONG_DOAN where DEPARTMENT_ID in (${req.query.congdoan})
                and CREATE_DATE < '${req.query.fromDate} 00:00:01'
                            group by ITEM_ID,DEPARTMENT_ID) K 
                left join 
                ( 
                    select DISTINCT ITEM_ID,STEP_ID,paren_id from 
                    ( select DISTINCT * from  prod.STEP_ITEM_SP  ) D where D.factoryId = ${req.query.factoryId}  ) C on C.ITEM_ID = K.ITEM_ID and C.STEP_ID = K.DEPARTMENT_ID
                where paren_id is not null
                group by paren_id) H) 
            ton on ton.paren_id = HS.paren_id
                left join
                (select * from
            (select DISTINCT sum(QUANTITY) QUANTITY,paren_id from
            (select DEPARTMENT_ID,ITEM_ID,sum(KL) QUANTITY from dbo.View_TON_CONG_DOAN where DEPARTMENT_ID in (${req.query.congdoan})
            and CREATE_DATE < '${req.query.toDate} 23:59:59'
                        group by ITEM_ID,DEPARTMENT_ID) K 
            left join 
            ( 
             select DISTINCT ITEM_ID,STEP_ID,paren_id from 
             prod.STEP_ITEM_SP  D where D.factoryId = ${req.query.factoryId}  ) C on C.ITEM_ID = K.ITEM_ID and C.STEP_ID = K.DEPARTMENT_ID
            where paren_id is not null
            group by paren_id) H) 
            tonck on tonck.paren_id = HS.paren_id
            left join 
            (  select I.NAME paren,SUM(KLC_TH) SL_TH from prod.XUAT_GO XG
            left join 
            
                               prod.PO PO on PO.itemId = XG.itemId and PO.number = XG.number
                               left join base.MARKET M on M.CODE = PO.root
                               left join base.ITEM I on I.ID = M.PRODUCT_ID
            where SOURCE_ID= ${req.query.kho2m}  
                             GROUP BY I.NAME) KH on KH.paren = HS.paren
            left join base.ITEM I on I.ID = HS.paren_id
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
hesocapgo.get('/hssdoutdoor-lp', (req, res) => {
  
    new mssql.Request()
        .query(`  select * from
        (SELECT NAME, DAI, RONG, DAY,isnull([xuat],0) xuat, -isnull([xuatluaphoi],0) AS [xuatluaphoi],isnull([xuat-cat-ha-cap],0) xuathcK,[xuat]/(-isnull([xuatluaphoi],0) + [xuat-cat-ha-cap]) as heso
        ,CAST(DAI as float)*RONG*DAY/1000000000 as VOLUMN,CAST(DAI as float)*RONG*DAY*isnull(xuat,0)/1000000000 as xuatK,
        isnull([xuat-cat-ha-cap],0) as xuathc
        ,CAST(DAI as float)*RONG*DAY*(-isnull([xuatluaphoi],0))/1000000000 as xuatluaphoiK
     FROM
     (
     select B.NAME, XGB.DAI, XGB.RONG, XGB.DAY, XGB.SL_TH, XGB.XUATNHAP from
     (select DAI,RONG,DAY,factoryId,createdAt,
        
     case when X.XUATNHAP = 'xuat-cat-ha-cap' then X.SL_HC*I.VOLUMN else X.SL_TH END SL_TH,X.XUATNHAP
       from prod.XUAT_GO_BAO X
        left join base.ITEM I on I.ID = X.itemId) XGB
     LEFT JOIN NLG.BOM B ON  XGB.DAI = B.DAI AND XGB.RONG = B.RONG AND XGB.DAY = B.DAY
     WHERE createdAt BETWEEN '${req.query.fromDate} 00:00:01' and '${req.query.toDate} 23:59:59'
     and XGB.factoryId = ${req.query.factoryId}
     ) AS BANG_NGUON
     PIVOT
     (
     SUM(SL_TH)
     FOR XUATNHAP IN ([xuat],[xuatluaphoi],[xuat-cat-ha-cap])
     ) AS BANG_CHUYEN) K
     where  xuatluaphoi >0 or xuathc >0
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

hesocapgo.post('/', model.hesocapgo.insert)
hesocapgo.put('/:id', model.hesocapgo.updateById)

hesocapgo.get('/', (req, res) => {
    new mssql.Request()
        .input('ID', req.query.id)

    .query(`delete from [nlg].[HE_SO] where ID = @ID`, (err, record) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        res.api.sendData([])
    })
})



module.exports = hesocapgo