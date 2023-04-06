const express = require('express')
const tondk = express.Router()
const mssql = require('mssql')
const models = require('../../../../models')
const {
    getErrorMessage
} = require('./../../../core/config')
tondk.get('/stockAfterDrying', async(req, res) => {
    try {
        const data = await new mssql.Request().query(`
   
        select DISTINCT  B.NAME ,B.DAY ,B.DAI, B.RONG,isnull(K.TondkT,0) + ISNULL(PH.SLRALO1,0) - ISNULL(X1.xuatTH1T,0)+isnull(N1.nhapTH1T,0) TondkT,isnull(C.nhap2MTQT,0) nhap2MTQT,isnull(C.xuatTQT,0) +isnull(X.xuatYST,0)  xuatTQT,isnull(C.nhapTQT,0)+ isnull(N.nhapYST,0) nhapTQT, isnull(C.nhapTHT,0) nhapTHT,
        isnull(K.Tondk,0) + ISNULL(PH.NhapGoRALO1,0) Tondk, isnull(C.nhap2MTQ,0) nhap2MTQ,isnull(C.xuatTQ,0) + isnull(X.xuatYS,0) xuatTQ,isnull(C.nhapTQ,0) +isnull(N.nhapYS,0)nhapTQ, isnull(C.nhapTH,0) nhapTH,isnull(C.xuatQMT,0) + isnull(X.xuatQMT,0) xuatQMT,isnull(X.xuatluaxepsayT,0) xuatluaxepsayT,
        isnull(X.xuatTHX3,0)+  isnull(C.xuatX3K,0)  xuatTHX3,isnull(X.xuatTHX1,0)+isnull(C.xuatX1K,0) xuatTHX1,(ISNULL(B.NhapGoRALO,0) + isnull(C.nhapTH,0)) NhapGoRALO,ISNULL(B.nhapam,0) nhapam, isnull(C.xuatQM,0) + isnull(X.xuatQM,0) xuatQM,isnull(X.xuatluaxepsayK,0) xuatluaxepsayK,ISNULL(N.nhapkhacT,0) nhapkhacT,ISNULL(N.nhapkhac,0) nhapkhac,
        isnull(X.xuatTHX3T,0)+  isnull(C.xuatX3T,0) xuatTHX3T,isnull(X.xuatTHX1T,0)+isnull(C.xuatX1T,0) xuatTHX1T,(ISNULL(B.SLRALO,0) + isnull(C.nhapTHT,0)) NhapGoRALOT,ISNULL(B.nhapamT,0) nhapamT 
        ,isnull(K.Tondk,0) + ISNULL(PH.NhapGoRALO1,0)  + ISNULL(B.nhapam,0)+ISNULL(B.NhapGoRALO,0) + isnull(C.nhapTQ,0)+ isnull(C.nhap2MTQ,0) + isnull(C.nhapTH,0) - isnull(X.xuatTHX1,0) -isnull(X.xuatTHX3,0) - isnull(C.xuatTQ,0)  as TonCuoi
        ,ROUND(isnull(K.TondkT,0) + ISNULL(PH.SLRALO1,0) - ISNULL(X1.xuatTH1T,0)+ ISNULL(B.nhapamT,0)+ISNULL(B.SLRALO,0) + isnull(C.nhapTQT,0)+ isnull(C.nhap2MTQT,0) + isnull(C.nhapTHT,0) - isnull(X.xuatTHX1T,0) - isnull(C.xuatX3T,0) - isnull(C.xuatX1T,0)- isnull(X.xuatluaxepsayT,0)-isnull(C.xuatQMT,0) -isnull(X.xuatTHX3T,0) 
        - isnull(C.xuatTQT,0) - isnull(X.xuatYST,0) + isnull(N.nhapYST,0)+isnull(N.nhapkhacT,0)+ isnull(N1.nhapTH1T,0)-isnull(X.xuatQMT,0) - ISNULL(XKH.xuatkhacT,0) - ISNULL(XA.xuatbuamT,0),4) as TonCuoiT,ISNULL(XA.xuatbuamK,0) xuatbuamK,ISNULL(XA.xuatbuamT,0) xuatbuamT,ISNULL(XKH.xuatkhacT,0) xuatkhacT,ISNULL(XKH.xuatkhacK,0) xuatkhacK from 
       (select  C.DAY,C.DAI , C.RONG, H.NhapGoRALO,H.nhapam ,H.nhapamT, C.NAME  NAME,H.SLRALO from  nlg.BOM C
          left join (select DISTINCT R.length, R.height, R.width,SUM(R.SLRALO) SLRALO,SUM(R.NhapGoRALO) NhapGoRALO, SUM(R.nhapamT) nhapamT,SUM(R.nhapam) nhapam from (SELECT 
          
        
          I.LENGTH length, I.HEIGHT height, I.WIDTH width, 
        
          case when KB.TYPE = N'SẤY LẠI INDOOR' then ROUND(SUM(IIP.QUANTITY),4) end nhapamT,
          case when KB.TYPE != N'SẤY LẠI INDOOR' then 
          SUM(IIP.QUANTITY) end SLRALO,
        
          case when KB.TYPE = N'SẤY LẠI INDOOR' then ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4) end nhapam,
          case when KB.TYPE != N'SẤY LẠI INDOOR' then 
          ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4) end NhapGoRALO,
          CASE
          WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
          WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
          WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
          ELSE KB.[STATUS]
          END AS N'Trạng thái'
          FROM prod.KILN_BATCH KB
          LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
          LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
          LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
          LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
          LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
          WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59' and KB.EXPORT_DATE >='20210602'
          AND K.FACTORY_ID = 100000
          GROUP BY 
          I.LENGTH,
          I.WIDTH,
          I.HEIGHT,
      
         KB.TYPE,
        
          I.VOLUMN,
          KB.STATUS) R group by R.length, R.height, R.width) H on H.height = C.DAY and H.length = C.DAI and H.width = C.RONG) B
          left join (SELECT 
          
        
          I.LENGTH length, I.HEIGHT height, I.WIDTH width,
        
          SUM(IIP.QUANTITY) SLRALO1,
          
          ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)  NhapGoRALO1,
          CASE
          WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
          WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
          WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
          ELSE KB.[STATUS]
          END AS N'Trạng thái'
          FROM prod.KILN_BATCH KB
          LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
          LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
          LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
          LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
          LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
          WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE <'${req.query.start} 00:00:00' and KB.EXPORT_DATE >='20210602'
          AND K.FACTORY_ID = 100000
          GROUP BY 
          I.LENGTH,
          I.WIDTH,
          I.HEIGHT,
         
        
          
          I.VOLUMN,
          KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG
        
       left join (select I.LENGTH,I.WIDTH,I.HEIGHT,OP.ITEM_ID ,SUM(OP.QUANTITY) TondkT,SUM(OP.QUANTITY*I.VOLUMN) Tondk from [prod].[OPENING_STOCK] OP 
       left join base.ITEM I on I.ID = OP.ITEM_ID
       where OP.createdAt >='20210606' and OP.createdAt <'${req.query.start} 00:00:00' and DEPARTMENT_ID = 102484
       group by I.LENGTH,I.WIDTH,I.HEIGHT,OP.ITEM_ID) K on K.LENGTH = B.DAI and K.WIDTH = B.RONG and K.HEIGHT = B.DAY
       left join
       (select a.ITEM_ID,a.LENGTH,a.WIDTH,a.HEIGHT, SUM(a.nhap2MTQ) nhap2MTQ,SUM(a.nhap2MTQT) nhap2MTQT,SUM(a.xuatQMT) xuatQMT,SUM(a.xuatsaylaiT) xuatsaylaiT,
       SUM(a.xuatTQ) xuatTQ,SUM(a.xuatTQT) xuatTQT,SUM(xuatX1T) xuatX1T,SUM(xuatX3T) xuatX3T,SUM(xuatX1K) xuatX1K,SUM(xuatX3K) xuatX3K,SUM(a.nhapTQ) nhapTQ,SUM(a.nhapTH) nhapTH,SUM(a.xuatQM) xuatQM,SUM(a.xuatsaylai) xuatsaylai,
       SUM(a.nhapTQT) nhapTQT,SUM(a.nhapTHT) nhapTHT from
        (select OP.ITEM_ID,CASE when  QUANTITY >0 and  nguonPhoi != 'Yen Son' then QUANTITY*I.VOLUMN end nhapTH,CASE when  QUANTITY >0 and description = '2M' and nguonPhoi = 'Yen Son' then QUANTITY*I.VOLUMN end nhap2MTQ, 
        case when (QUANTITY >0 and DESTINATION_ID in (102340,102366) and description is null)  then -QUANTITY*I.VOLUMN end nhapTQ,
        case when (QUANTITY <0 and DESTINATION_ID in (102340,102366) and description is null)  then -QUANTITY*I.VOLUMN end xuatTQ,I.LENGTH,I.WIDTH,I.HEIGHT,
        CASE when  QUANTITY >0  and nguonPhoi != 'Yen Son' then QUANTITY end nhapTHT,CASE when  QUANTITY >0 and description = '2M' and nguonPhoi = 'Yen Son' then QUANTITY end nhap2MTQT, 
        case when (QUANTITY >0 and DESTINATION_ID in (102340,102366) and description is null)  then -QUANTITY end nhapTQT,
        case when (QUANTITY <0 and DESTINATION_ID in (102340,102366) )  then -QUANTITY end xuatTQT,
        case when (QUANTITY <0 and DESTINATION_ID in (100264,100265) )  then -QUANTITY end xuatX1T,
        case when (QUANTITY <0 and DESTINATION_ID in (100264,100265) )  then -QUANTITY*I.VOLUMN end xuatX1K,
        case when (QUANTITY <0 and DESTINATION_ID in (100274,100276) )  then -QUANTITY end xuatX3T,
        case when (QUANTITY <0 and DESTINATION_ID in (100274,100276) )  then -QUANTITY*I.VOLUMN  end xuatX3K,
        case when (QUANTITY <0 and DESTINATION_ID = 102427)  then -QUANTITY end xuatQMT,
        case when (QUANTITY <0 and DESTINATION_ID = 102427)  then -QUANTITY*I.VOLUMN end xuatQM,
        case when (QUANTITY <0 and DESTINATION_ID = 100073)  then -QUANTITY*I.VOLUMN end xuatsaylai,
        case when (QUANTITY <0 and DESTINATION_ID = 100073)  then -QUANTITY end xuatsaylaiT
             from [prod].[OPENING_STOCK] OP
             left join base.ITEM I on I.ID = OP.ITEM_ID
        where createdAt BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59' and DEPARTMENT_ID = 102484 and OP.createdAt >='20210606' ) a
         group by a.ITEM_ID,a.LENGTH,a.WIDTH,a.HEIGHT) C on C.HEIGHT = B.DAY and C.WIDTH = B.RONG and C.LENGTH = B.DAI
         
         left join (   select DAY,RONG,DAI,isnull(SUM(xuatTHX3),0) xuatTHX3,isnull(SUM(xuatTHX3T),0) xuatTHX3T,isnull(SUM(xuatTHX1T),0) xuatTHX1T,isnull(SUM(xuatTHX1),0) xuatTHX1 ,
         isnull(SUM(xuatYS),0) xuatYS,isnull(SUM(xuatYST),0) xuatYST,isnull(SUM(xuatQM),0) xuatQM,isnull(SUM(xuatQMT),0) xuatQMT ,isnull(SUM(xuatluaxepsayK),0) xuatluaxepsayK,isnull(SUM(xuatluaxepsayT),0) xuatluaxepsayT
         from
         ( select DAY,RONG,DAI,case when DESTINATION_ID = '100274'  then KLC_TH end xuatTHX3,case when DESTINATION_ID = '100264'  then KLC_TH end xuatTHX1,
            case when DESTINATION_ID = '100274'  then SL_TH end xuatTHX3T,case when DESTINATION_ID = '100264'  then SL_TH end xuatTHX1T,
            case when DESTINATION_ID in ('102340','102366')  then SL_TH end xuatYST,case when DESTINATION_ID in ('102340','102366')  then KLC_TH end xuatYS,
            case when DESTINATION_ID = '102427'  then SL_TH end xuatQMT,case when DESTINATION_ID = '102427'  then KLC_TH end xuatQM,
            case when DESTINATION_ID = '100073'  then SL_TH end xuatluaxepsayT,case when DESTINATION_ID = '100073'  then KLC_TH end xuatluaxepsayK
          from prod.XUAT_GO 
          where createdAt  BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59' and createdby = 102050 and XUATNHAP = 'xuat') M
          Group by DAY,RONG,DAI ) X ON X.DAY = B.DAY and X.DAI = B.DAI and X.RONG = B.RONG
          left join (   select DAY,RONG,DAI,isnull(SUM(xuatbuamT),0) xuatbuamT,isnull(SUM(xuatbuamK),0) xuatbuamK
          from
          ( select DAY,RONG,DAI,SL_TH xuatbuamT,KLC_TH xuatbuamK
           from prod.XUAT_GO 
           where createdAt  BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59' and createdby = 102050 and XUATNHAP = 'xuatam') M
           Group by DAY,RONG,DAI ) XA ON XA.DAY = B.DAY and XA.DAI = B.DAI and XA.RONG = B.RONG
           left join (   select DAY,RONG,DAI,isnull(SUM(xuatkhacT),0) xuatkhacT,isnull(SUM(xuatkhacK),0) xuatkhacK
           from
           ( select DAY,RONG,DAI,SL_TH xuatkhacT,KLC_TH xuatkhacK
            from prod.XUAT_GO 
            where createdAt  BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59' and createdby = 102050 and XUATNHAP = 'xuatkhac') M
            Group by DAY,RONG,DAI ) XKH ON XKH.DAY = B.DAY and XKH.DAI = B.DAI and XKH.RONG = B.RONG
          left join (   select DAY,RONG,DAI,isnull(SUM(nhapTHX3),0) nhapTHX3,isnull(SUM(nhapTHX3T),0) nhapTHX3T,isnull(SUM(nhapTHX1T),0) xuatTHX1T,isnull(SUM(nhapTHX1),0) nhapTHX1 ,
          isnull(SUM(nhapYS),0) nhapYS,isnull(SUM(nhapYST),0) nhapYST,isnull(SUM(nhapkhacT),0) nhapkhacT,isnull(SUM(nhapkhac),0) nhapkhac
          from
          ( select DAY,RONG,DAI,case when DESTINATION_ID = '100274'  then KLC_TH end nhapTHX3,case when DESTINATION_ID = '100264'  then KLC_TH end nhapTHX1,
             case when DESTINATION_ID = '100274'  then SL_TH end nhapTHX3T,case when DESTINATION_ID = '100264'  then SL_TH end nhapTHX1T,
             case when DESTINATION_ID in ('102340','102366')  then SL_TH end nhapYST,case when DESTINATION_ID in ('102340','102366')  then KLC_TH end nhapYS,
             case when DESTINATION_ID not in ('102340','102366')  then SL_TH end nhapkhacT,case when DESTINATION_ID not in ('102340','102366')  then KLC_TH end nhapkhac
           from prod.XUAT_GO 
           where createdAt  BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59' and createdby = 102050 and XUATNHAP = 'nhap') M
           Group by DAY,RONG,DAI ) N ON N.DAY = B.DAY and N.DAI = B.DAI and N.RONG = B.RONG
         left join (select DAY,RONG,DAI,SUM(KLC_TH) xuatTH1,SUM(SL_TH) xuatTH1T from prod.XUAT_GO 
         where createdAt  <'${req.query.start} 00:00:00' and createdby = 102050 and XUATNHAP != 'nhap'
         Group by DAY,RONG,DAI ) X1 ON X1.DAY = B.DAY and X1.DAI = B.DAI and X1.RONG = B.RONG
         left join (select DAY,RONG,DAI,SUM(KLC_TH) nhapTH1,SUM(SL_TH) nhapTH1T from prod.XUAT_GO 
         where createdAt  <'${req.query.start} 00:00:00' and createdby = 102050 and XUATNHAP = 'nhap'
         Group by DAY,RONG,DAI ) N1 ON N1.DAY = B.DAY and N1.DAI = B.DAI and N1.RONG = B.RONG
          where C.nhap2MTQ is not null or C.xuatTQ is not null or C.nhapTH is not null  or K.Tondk is not null or B.NhapGoRALO is not null or N.nhapYST is not null or X1.xuatTH1T is not null
          or C.nhapTQ is not null or B.nhapam is not null or PH.NhapGoRALO1 is not null or C.nhapTH is not null or XA.xuatbuamT is not null or XKH.xuatkhacT is not null or N1.nhapTH1T is not null
         order by B.DAY
    `)
        return res.status(200).json({ success: true, data: data.recordset })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "server err", err })
    }

})
tondk.get('/stockAfterDryingchoose', async(req, res) => {
    try {
        const data = await new mssql.Request().query(`
   
       

		  select DISTINCT C.NAME,C.DAI,C.RONG,C.DAY, isnull(PH.SLRALO_DK,0) - isnull(X.SL_chualua_DK,0) + isnull(OPS.nhap_chualua_DK,0) - isnull(OPS.xuat_chualua_DK,0) + isnull(N.SL_chualua_DK,0) as chualuaDK,0 chualuaDKK,
          -isnull(X.SL_dalua_DK,0) + isnull(OPS.nhap_dalua_dat_DK,0) - isnull(OPS.xuat_dalua_dat_DK,0) + isnull(N.SL_dalua_DK,0)  as  daluaDK,0 daluaDKK,
          -isnull(X.SL_daluakodat_DK,0) + isnull(OPS.nhap_dalua_kodat_DK,0) - isnull(OPS.xuat_dalua_kodat_DK,0) + isnull(N.SL_daluakodat_DK,0) as daluakodatDK, 5 daluakodatDKK,
          isnull(PH1.SLRALO_CK,0)+ isnull(OPS1.nhap_chualua_CK,0) + isnull(N1.SL_chualua_CK,0)  nhapchulua, isnull(X1.SL_chualua_CK,0)+isnull(OPS1.xuat_chualua_CK,0) xuatchualua,

         isnull(PH.SLRALO_DK,0) - isnull(X.SL_chualua_DK,0) + isnull(PH1.SLRALO_CK,0) + isnull(OPS.nhap_chualua_DK,0) - isnull(OPS.xuat_chualua_DK,0) - isnull(X1.SL_chualua_CK,0) + isnull(OPS1.nhap_chualua_CK,0) - isnull(OPS1.xuat_chualua_CK,0)
         + isnull(N1.SL_chualua_CK,0) + isnull(N.SL_chualua_DK,0) as chualuaCK,0 chualuaCKK,
         isnull(OPS1.nhap_dalua_dat_CK,0)+ isnull(N1.SL_dalua_CK,0) nhapdalua_dat,
        isnull(OPS1.nhap_dalua_kodat_CK,0)+ isnull(N1.SL_daluakodat_CK,0) nhapdalua_kodat,
        isnull(OPS1.xuat_dalua_dat_CK,0)+isnull(X1.SL_dalua_CK,0) xuadalua_dat,isnull(OPS1.xuat_dalua_kodat_CK,0)+ isnull(X1.SL_daluakodat_CK,0) xuatdalua_kodat,
           -isnull(X.SL_dalua_DK,0) + isnull(OPS.nhap_dalua_dat_DK,0) - isnull(OPS.xuat_dalua_dat_DK,0)    +  isnull(N.SL_dalua_DK,0) + isnull(N1.SL_dalua_CK,0)
         - isnull(X1.SL_dalua_CK,0)+ isnull(OPS1.nhap_dalua_dat_CK,0)  - isnull(OPS1.xuat_dalua_dat_CK,0)  daluaCK,0 daluaCKK,
         isnull(OPS.nhap_dalua_kodat_DK,0)  - isnull(OPS.xuat_dalua_kodat_DK,0) - isnull(X1.SL_daluakodat_CK,0) + isnull(OPS1.nhap_dalua_kodat_CK,0) 
         - isnull(OPS1.xuat_dalua_kodat_CK,0)+ isnull(N1.SL_daluakodat_CK,0) + isnull(N.SL_daluakodat_DK,0) -isnull(X.SL_daluakodat_DK,0) daluakodatCK,0 daluakodatCKK
         from nlg.BOM C
         left join (select DAY,RONG,DAI,SUM(B.SL_chualua_DK)as SL_chualua_DK,SUM(SL_dalua_DK) SL_dalua_DK,SUM(B.KL_chualua_DK)as KL_chualua_DK,
         SUM(KL_dalua_DK) KL_dalua_DK,SUM(KL_daluakodat_DK) KL_daluakodat_DK,SUM(SL_daluakodat_DK) SL_daluakodat_DK
         from (select CASE when luadat = 'chualua' then SL_TH  end as SL_chualua_DK,
          CASE when luadat = 'chualua' then KLC_TH  end as KL_chualua_DK,CASE when luadat = 'dalua' then KLC_TH  end as KL_dalua_DK,
         CASE when (luadat = 'dalua' or luadat = 'daluadat') then SL_TH  end as SL_dalua_DK,CASE when luadat = 'daluakodat' then KLC_TH  end as KL_daluakodat_DK,
         CASE when luadat = 'daluakodat' then SL_TH  end as SL_daluakodat_DK,DAY,RONG,DAI
         from prod.XUAT_GO where createdAt < '${req.query.start} 00:00:00'  AND SOURCE_ID = 102484 AND XUATNHAP != 'nhap'
        ) B  group by DAY,RONG,DAI) X on X.DAI = C.DAI and X.RONG = C.RONG and X.DAY = C.DAY
          left join (select DAY,RONG,DAI,SUM(B.SL_chualua_CK)as SL_chualua_CK,SUM(SL_dalua_CK) SL_dalua_CK,SUM(B.KL_chualua_CK)as KL_chualua_CK,
          SUM(KL_dalua_CK) KL_dalua_CK,SUM(KL_daluakodat_CK) KL_daluakodat_CK,SUM(SL_daluakodat_CK) SL_daluakodat_CK
          from (select CASE when luadat = 'chualua' then SL_TH  end as SL_chualua_CK,
          CASE when luadat = 'chualua' then KLC_TH  end as KL_chualua_CK,CASE when luadat = 'dalua' or luadat = 'daluadat' then KLC_TH  end as KL_dalua_CK,
         CASE when (luadat = 'dalua' or luadat = 'daluadat') then SL_TH  end as SL_dalua_CK,CASE when luadat = 'daluakodat' then KLC_TH  end as KL_daluakodat_CK,
         CASE when luadat = 'daluakodat' then SL_TH  end as SL_daluakodat_CK,DAY,RONG,DAI
         from prod.XUAT_GO where  createdAt BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59' AND SOURCE_ID = 102484 AND XUATNHAP != 'nhap'
        ) B  group by DAY,RONG,DAI) X1 on X1.DAI = C.DAI and X1.RONG = C.RONG and X1.DAY = C.DAY
        left join (select DAY,RONG,DAI,SUM(B.SL_chualua_DK)as SL_chualua_DK,SUM(SL_dalua_DK) SL_dalua_DK,SUM(B.KL_chualua_DK)as KL_chualua_DK,
        SUM(KL_dalua_DK) KL_dalua_DK,SUM(KL_daluakodat_DK) KL_daluakodat_DK,SUM(SL_daluakodat_DK) SL_daluakodat_DK
        from (select CASE when luadat = 'chualua' then SL_TH  end as SL_chualua_DK,
         CASE when luadat = 'chualua' then KLC_TH  end as KL_chualua_DK,CASE when luadat = 'dalua' then KLC_TH  end as KL_dalua_DK,
        CASE when (luadat = 'dalua' or luadat = 'daluadat') then SL_TH  end as SL_dalua_DK,CASE when luadat = 'daluakodat' then KLC_TH  end as KL_daluakodat_DK,
        CASE when luadat = 'daluakodat' then SL_TH  end as SL_daluakodat_DK,DAY,RONG,DAI
        from prod.XUAT_GO where createdAt < '${req.query.start} 00:00:00'  AND SOURCE_ID = 102484 AND XUATNHAP = 'nhap'
       ) B  group by DAY,RONG,DAI) N on N.DAI = C.DAI and N.RONG = C.RONG and N.DAY = C.DAY
         left join (select DAY,RONG,DAI,SUM(B.SL_chualua_CK) as SL_chualua_CK,SUM(SL_dalua_CK) SL_dalua_CK,SUM(B.KL_chualua_CK)as KL_chualua_CK,
         SUM(KL_dalua_CK) KL_dalua_CK,SUM(KL_daluakodat_CK) KL_daluakodat_CK,SUM(SL_daluakodat_CK) SL_daluakodat_CK
         from (select CASE when luadat = 'chualua' then SL_TH  end as SL_chualua_CK,
         CASE when luadat = 'chualua' then KLC_TH  end as KL_chualua_CK,CASE when luadat = 'dalua' or luadat = 'daluadat' then KLC_TH  end as KL_dalua_CK,
        CASE when (luadat = 'dalua' or luadat = 'daluadat') then SL_TH  end as SL_dalua_CK,CASE when luadat = 'daluakodat' then KLC_TH  end as KL_daluakodat_CK,
        CASE when luadat = 'daluakodat' then SL_TH  end as SL_daluakodat_CK,DAY,RONG,DAI
        from prod.XUAT_GO where  createdAt BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59' AND SOURCE_ID = 102484 AND XUATNHAP = 'nhap'
       ) B  group by DAY,RONG,DAI) N1 on N1.DAI = C.DAI and N1.RONG = C.RONG and N1.DAY = C.DAY
         left join 
        ( SELECT         
         I.LENGTH length, I.HEIGHT height, I.WIDTH width, 
         SUM(IIP.QUANTITY) SLRALO_DK,       
         CASE
         WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
         WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
         WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
         ELSE KB.[STATUS]
         END AS N'Trạng thái'
         FROM prod.KILN_BATCH KB
         LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
         LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
         LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
         LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
         LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
         WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE <'${req.query.start} 00:00:00' and KB.EXPORT_DATE >='20210602'
         AND K.FACTORY_ID = 100000
         GROUP BY 
         I.LENGTH,
         I.WIDTH,
         I.HEIGHT,
   
         I.VOLUMN,
         KB.STATUS) PH on PH.height = C.DAY and PH.length = C.DAI and PH.width= C.RONG
                   left join 
        ( SELECT 
         
       
         I.LENGTH length, I.HEIGHT height, I.WIDTH width, 
       
         SUM(IIP.QUANTITY) SLRALO_CK,          
         CASE
         WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
         WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
         WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
         ELSE KB.[STATUS]
         END AS N'Trạng thái'
         FROM prod.KILN_BATCH KB
         LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
         LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
         LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
         LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
         LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
         WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59'  and KB.EXPORT_DATE >='20210602'
         AND K.FACTORY_ID = 100000
         GROUP BY 
         I.LENGTH,
         I.WIDTH,
         I.HEIGHT,
   
         I.VOLUMN,
         KB.STATUS) PH1 on PH1.height = C.DAY and PH1.length = C.DAI and PH1.width= C.RONG
         left join (select LENGTH,HEIGHT,WIDTH,sum(xuat_chualua_DK) xuat_chualua_DK,sum(nhap_chualua_DK) nhap_chualua_DK,SUM(xuat_dalua_dat_DK) xuat_dalua_dat_DK,SUM(nhap_dalua_dat_DK) nhap_dalua_dat_DK, SUM(xuat_dalua_kodat_DK) xuat_dalua_kodat_DK
         ,SUM(nhap_dalua_kodat_DK) nhap_dalua_kodat_DK from
         (select I.LENGTH,I.HEIGHT,I.WIDTH,CASE WHEN (OP.SELECTION = 0 or OP.SELECTION  is null) and QUANTITY <0 then -OP.QUANTITY END xuat_chualua_DK,
         CASE WHEN (OP.SELECTION = 0 or OP.SELECTION  is null) and QUANTITY >0 then OP.QUANTITY END nhap_chualua_DK,
       CASE  when OP.SELECTION = 1 and QUANTITY >0 then OP.QUANTITY END nhap_dalua_dat_DK,
           CASE  when OP.SELECTION = 1 and QUANTITY <0 then -OP.QUANTITY END xuat_dalua_dat_DK,
       CASE  when OP.SELECTION = 2 and QUANTITY <0 then -OP.QUANTITY END xuat_dalua_kodat_DK,
           CASE  when OP.SELECTION = 2 and QUANTITY >0 then OP.QUANTITY END nhap_dalua_kodat_DK
         from prod.OPENING_STOCK  OP
         left join base.ITEM I on I.ID = OP.ITEM_ID
         where DEPARTMENT_ID = 102484 and createdAt <'${req.query.start} 00:00:00'  and createdAt >='20210606'
       ) P
         group by LENGTH,HEIGHT,WIDTH) OPS ON OPS.HEIGHT = C.DAY and OPS.WIDTH = C.RONG and OPS.LENGTH = C.DAI
          left join (select LENGTH,HEIGHT,WIDTH,sum(xuat_chualua_CK) xuat_chualua_CK,sum(nhap_chualua_CK) nhap_chualua_CK,SUM(xuat_dalua_dat_CK) xuat_dalua_dat_CK,SUM(nhap_dalua_dat_CK) nhap_dalua_dat_CK, 
          SUM(xuat_dalua_kodat_CK) xuat_dalua_kodat_CK
         ,SUM(nhap_dalua_kodat_CK) nhap_dalua_kodat_CK from
         (select I.LENGTH,I.HEIGHT,I.WIDTH,CASE WHEN OP.SELECTION = 0 and QUANTITY <0 then -OP.QUANTITY END xuat_chualua_CK,
         CASE WHEN OP.SELECTION = 0 and QUANTITY >0 then OP.QUANTITY END nhap_chualua_CK,
       CASE  when OP.SELECTION = 1 and QUANTITY >0 then OP.QUANTITY END nhap_dalua_dat_CK,
           CASE  when OP.SELECTION = 1 and QUANTITY <0 then -OP.QUANTITY END xuat_dalua_dat_CK,
       CASE  when OP.SELECTION = 2 and QUANTITY <0 then -OP.QUANTITY END xuat_dalua_kodat_CK,
           CASE  when OP.SELECTION = 2 and QUANTITY >0 then OP.QUANTITY END nhap_dalua_kodat_CK
         from prod.OPENING_STOCK  OP
         left join base.ITEM I on I.ID = OP.ITEM_ID
         where DEPARTMENT_ID = 102484 and createdAt BETWEEN '${req.query.start} 00:00:00'  AND '${req.query.end} 23:59:59'  and createdAt >='20210606'
       ) P
         group by LENGTH,HEIGHT,WIDTH) OPS1 ON OPS1.HEIGHT = C.DAY and OPS1.WIDTH = C.RONG and OPS1.LENGTH = C.DAI
         order by C.DAY
         
    `)
        return res.status(200).json({ success: true, data: data.recordset })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "server err", err })
    }

})
tondk.get('/', (req, res) => {
    const query = `SELECT        ST.ID, ST.ITEM_ID, ST.DEPARTMENT_ID, ST.nguonPhoi, ST.CREATE_BY, ST.createdAt, '[ ' + IT.CODE + ' ] ' + IT.NAME + ' (' + CONVERT(VARCHAR(30), IT.HEIGHT) + '*' + CONVERT(VARCHAR(30), IT.WIDTH) 
  + '*' + CONVERT(VARCHAR(30), IT.LENGTH) + ' )' AS ITEM_NAME, ST.QUANTITY AS STOC_QTY, ST.daXuat
FROM            prod.OPENING_STOCK AS ST LEFT OUTER JOIN
  base.ITEM AS IT ON IT.ID = ST.ITEM_ID
WHERE        (ST.QUANTITY - ST.daXuat > 0)
     `
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})
tondk.get('/stockdepartment', (req, res) => {
    const query = `select TON.*,TTC1X1*VOLUMN TTC1X1M3,TTC2X1*VOLUMN TTC2X1M3,TTC1X3*VOLUMN TTC1X3M3,TTC2X3*VOLUMN TTC2X3M3,
    THTM1X1*VOLUMN THTM1X1M3,THTM2X1*VOLUMN THTM2X1M3,THTMX3*VOLUMN THTMX3M3,THTMDX3*VOLUMN THTMDX3M3,
    TSON1X2*VOLUMN TSON1X2M3,TSON2X2*VOLUMN TSON2X2M3,TSONX3*VOLUMN TSONX3M3,
    TDG1X2*VOLUMN TDG1X2M3,TDG2X2*VOLUMN TDG2X2M3,TDGX3*VOLUMN TDGX3M3,
    (TTC1X1+TTC2X1+TTC1X3+TTC2X3
    + THTM1X1+THTM2X1+THTMX3+THTMDX3+TSON1X2+TSON2X2+TSONX3
        +TDG1X2+TDG2X2+TDGX3)/heso TONGCONG from
     (
    select B.heso,paren sp,paren_id,I.VOLUMN,I.NAME,I.HEIGHT DAY,I.WIDTH RONG,I.LENGTH DAI, isnull(NTC1X1,0) + isnull(NTTC1X1,0)-isnull(XTC1X1,0) TTC1X1,isnull(NTTC2X1,0)+isnull(NTC2X1,0)-isnull(XTC2X1,0) TTC2X1,isnull(NTTC1X3,0)+isnull(NTC1X3,0)-isnull(XTC1X3,0) TTC1X3,isnull(NTTC2X3,0)+isnull(NTC2X3,0)-isnull(XTC2X3,0) TTC2X3
    ,isnull(NTHTM1X1,0)+isnull(NHTM1X1,0)-isnull(XHTM1X1,0) THTM1X1,isnull(NTHTM2X1,0)+isnull(NHTM2X1,0)-isnull(XHTM2X1,0) THTM2X1,isnull(NTHTMX3,0)+isnull(NHTMX3,0)-isnull(XHTMX3,0) THTMX3,isnull(NTHTMDX3,0)+isnull(NHTMDX3,0)-isnull(XHTMDX3,0) THTMDX3
    ,isnull(NTSON1X2,0)+isnull(NSON1X2,0)-isnull(XSON1X2,0) TSON1X2,isnull(NTSON2X2,0)+isnull(NSON2X2,0)-isnull(XSON2X2,0) TSON2X2,isnull(NTSONX3,0)+isnull(NSONX3,0)-isnull(XSONX3,0) TSONX3
    ,isnull(NTDG1X2,0)+isnull(NDG1X2,0)-isnull(XDG1X2,0) TDG1X2,isnull(NTDG2X2,0)+isnull(NDG2X2,0)-isnull(XDG2X2,0) TDG2X2,isnull(NTDGX3,0)+isnull(NDGX3,0)-isnull(XDGX3,0) TDGX3 from
    (select DISTINCT C.*,dm.RATE heso from
        (select DISTINCT ITEM_ID,NAME, paren_id,paren from [prod].[STEP_ITEM_SP] where STEP_ID in(100266,100267,100280,100281,100268,100271,100275,100277,100269,100272,100279,100270,100273,100282)) C
        inner join (select DISTINCT * from prod.BOM)   dm on C.ITEM_ID = dm.MATERIALS_ID
        ) B
    left join base.ITEM I on B.ITEM_ID = I.ID
    left join
    (SELECT ITEM_ID,SUM(isnull(XTC1X1,0)) XTC1X1,SUM(isnull(XTC2X1,0)) XTC2X1,SUM(isnull(XTC1X3,0)) XTC1X3,SUM(isnull(XTC2X3,0)) XTC2X3
     ,SUM(isnull(XHTM1X1,0)) XHTM1X1,SUM(isnull(XHTM2X1,0)) XHTM2X1,SUM(isnull(XHTMX3,0)) XHTMX3,SUM(isnull(XHTMDX3,0)) XHTMDX3,SUM(isnull(XSON1X2,0)) XSON1X2,
           SUM(isnull(XSON2X2,0)) XSON2X2, SUM(isnull(XSONX3,0)) XSONX3,SUM(isnull(XDG1X2,0)) XDG1X2,SUM(isnull(XDG2X2,0)) XDG2X2 ,SUM(isnull(XDGX3,0)) XDGX3        FROM (
                      SELECT P.SOURCE_ID  DEPARTMENT_ID,MIP.ITEM_ID,
                      CASE WHEN P.SOURCE_ID = 100266 then MIP.QUANTITY end as XTC1X1,
                      CASE WHEN P.SOURCE_ID = 100267 then MIP.QUANTITY end as XTC2X1,
                      CASE WHEN P.SOURCE_ID = 100280 then MIP.QUANTITY end as XTC1X3,
                      CASE WHEN P.SOURCE_ID = 100281 then MIP.QUANTITY end as XTC2X3,
                      CASE WHEN P.SOURCE_ID = 100268 then MIP.QUANTITY end as XHTM1X1,
                      CASE WHEN P.SOURCE_ID = 100271 then MIP.QUANTITY end as XHTM2X1,
                      CASE WHEN P.SOURCE_ID = 100275 then MIP.QUANTITY end as XHTMX3,
                      CASE WHEN P.SOURCE_ID = 100277 then MIP.QUANTITY end as XHTMDX3,
                      CASE WHEN P.SOURCE_ID = 100269 then MIP.QUANTITY end as XSON1X2,
                      CASE WHEN P.SOURCE_ID = 100272 then MIP.QUANTITY end as XSON2X2,
                      CASE WHEN P.SOURCE_ID = 100279 then MIP.QUANTITY end as XSONX3,
                      CASE WHEN P.SOURCE_ID = 100270 then MIP.QUANTITY end as XDG1X2,
                      CASE WHEN P.SOURCE_ID = 100273 then MIP.QUANTITY end as XDG2X2,
                      CASE WHEN P.SOURCE_ID = 100282 then MIP.QUANTITY end as XDGX3
                      FROM prod.PACKAGE P
                      LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                      LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
                      WHERE P.CREATE_DATE >= '2021-05-06 18:00:45.1033333 +00:00'   AND P.TYPE_ID in (100004,100026) AND  P.REMEDIES_ID IS NULL 
                      and P.SOURCE_ID in(100266,100267,100280,100281,100268,100271,100275,100277,100269,100272,100279,100270,100273,100282)
                  ) L0
                  GROUP BY  L0.ITEM_ID) X on X.ITEM_ID = B.ITEM_ID
  left join
          (SELECT ITEM_ID,SUM(isnull(NTC1X1,0)) NTC1X1,SUM(isnull(NTC2X1,0)) NTC2X1,SUM(isnull(NTC1X3,0)) NTC1X3,SUM(isnull(NTC2X3,0)) NTC2X3
     ,SUM(isnull(NHTM1X1,0)) NHTM1X1,SUM(isnull(NHTM2X1,0)) NHTM2X1,SUM(isnull(NHTMX3,0)) NHTMX3,SUM(isnull(NHTMDX3,0)) NHTMDX3,SUM(isnull(NSON1X2,0)) NSON1X2,
           SUM(isnull(NSON2X2,0)) NSON2X2, SUM(isnull(NSONX3,0)) NSONX3,SUM(isnull(NDG1X2,0)) NDG1X2,SUM(isnull(NDG2X2,0)) NDG2X2 ,SUM(isnull(NDGX3,0)) NDGX3        FROM (
                      SELECT P.DESTINATION_ID  DEPARTMENT_ID,IIP.ITEM_ID,
                      CASE WHEN P.DESTINATION_ID = 100266 then IIP.QUANTITY end as NTC1X1,
                      CASE WHEN P.DESTINATION_ID = 100267 then IIP.QUANTITY end as NTC2X1,
                      CASE WHEN P.DESTINATION_ID = 100280 then IIP.QUANTITY end as NTC1X3,
                      CASE WHEN P.DESTINATION_ID = 100281 then IIP.QUANTITY end as NTC2X3,
                      CASE WHEN P.DESTINATION_ID = 100268 then IIP.QUANTITY end as NHTM1X1,
                      CASE WHEN P.DESTINATION_ID = 100271 then IIP.QUANTITY end as NHTM2X1,
                      CASE WHEN P.DESTINATION_ID = 100275 then IIP.QUANTITY end as NHTMX3,
                      CASE WHEN P.DESTINATION_ID = 100277 then IIP.QUANTITY end as NHTMDX3,
                      CASE WHEN P.DESTINATION_ID = 100269 then IIP.QUANTITY end as NSON1X2,
                      CASE WHEN P.DESTINATION_ID = 100272 then IIP.QUANTITY end as NSON2X2,
                      CASE WHEN P.DESTINATION_ID = 100279 then IIP.QUANTITY end as NSONX3,
                      CASE WHEN P.DESTINATION_ID = 100270 then IIP.QUANTITY end as NDG1X2,
                      CASE WHEN P.DESTINATION_ID = 100273 then IIP.QUANTITY end as NDG2X2,
                      CASE WHEN P.DESTINATION_ID = 100282 then IIP.QUANTITY end as NDGX3
                      FROM prod.PACKAGE P
                      LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                    
                      WHERE P.CREATE_DATE >= '2021-05-06 18:00:45.1033333 +00:00'   AND P.TYPE_ID = 100026 AND P.KH_VERIFY_BY IS NULL
                      and P.DESTINATION_ID in(100266,100267,100280,100281,100268,100271,100275,100277,100269,100272,100279,100270,100273,100282)
                  ) L0
                  GROUP BY  L0.ITEM_ID) N on B.ITEM_ID = N.ITEM_ID
      left join
      (select ITEM_ID,SUM(isnull(NTTC1X1,0)) NTTC1X1,SUM(isnull(NTTC2X1,0)) NTTC2X1,SUM(isnull(NTTC1X3,0)) NTTC1X3,SUM(isnull(NTTC2X3,0)) NTTC2X3
     ,SUM(isnull(NTHTM1X1,0)) NTHTM1X1,SUM(isnull(NTHTM2X1,0)) NTHTM2X1,SUM(isnull(NTHTMX3,0)) NTHTMX3,SUM(isnull(NTHTMDX3,0)) NTHTMDX3,SUM(isnull(NTSON1X2,0)) NTSON1X2,
           SUM(isnull(NTSON2X2,0)) NTSON2X2, SUM(isnull(NTSONX3,0)) NTSONX3,SUM(isnull(NTDG1X2,0)) NTDG1X2,SUM(isnull(NTDG2X2,0)) NTDG2X2 ,SUM(isnull(NTDGX3,0)) NTDGX3  from
      (SELECT  DEPARTMENT_ID,ITEM_ID,
                      CASE WHEN DEPARTMENT_ID = 100266 then QUANTITY end as NTTC1X1,
                      CASE WHEN DEPARTMENT_ID = 100267 then QUANTITY end as NTTC2X1,
                      CASE WHEN DEPARTMENT_ID = 100280 then QUANTITY end as NTTC1X3,
                      CASE WHEN DEPARTMENT_ID = 100281 then QUANTITY end as NTTC2X3,
                      CASE WHEN DEPARTMENT_ID = 100268 then QUANTITY end as NTHTM1X1,
                      CASE WHEN DEPARTMENT_ID = 100271 then QUANTITY end as NTHTM2X1,
                      CASE WHEN DEPARTMENT_ID = 100275 then QUANTITY end as NTHTMX3,
                      CASE WHEN DEPARTMENT_ID = 100277 then QUANTITY end as NTHTMDX3,
                      CASE WHEN DEPARTMENT_ID = 100269 then QUANTITY end as NTSON1X2,
                      CASE WHEN DEPARTMENT_ID = 100272 then QUANTITY end as NTSON2X2,
                      CASE WHEN DEPARTMENT_ID = 100279 then QUANTITY end as NTSONX3,
                      CASE WHEN DEPARTMENT_ID = 100270 then QUANTITY end as NTDG1X2,
                      CASE WHEN DEPARTMENT_ID = 100273 then QUANTITY end as NTDG2X2,
                      CASE WHEN DEPARTMENT_ID = 100282 then QUANTITY end as NTDGX3
  
                  from prod.OPENING_STOCK 
                  where createdAt >='2021-05-06 05:00:45.1033333 +00:00' and QUANTITY>0 and daXuat = 0
                  and DEPARTMENT_ID in(100266,100267,100280,100281,100268,100271,100275,100277,100269,100272,100279,100270,100273,100282)) OS
                  GROUP BY ITEM_ID ) NT on NT.ITEM_ID = B.ITEM_ID
                  where X.XDG1X2 is not null or X.XDG2X2 is not null or X.XDGX3 is not null or X.XHTM1X1 is not null
                  or X.XHTM2X1 is not null or X.XHTMX3 is not null or X.XSON1X2 is not null or X.XSON2X2 is not null or X.XSONX3 is not null
                  or X.XTC1X1 is not null or X.XTC1X3 is not null or X.XTC2X1 is not null or X.XTC2X3 is not null or X.XHTMDX3 is not null or
                  N.NDG1X2 is not null or N.NDG2X2 is not null or N.NDGX3 is not null or N.NHTM1X1 is not null
                  or N.NHTM2X1 is not null or N.NHTMX3 is not null or N.NSON1X2 is not null or N.NSON2X2 is not null or N.NSONX3 is not null
                  or N.NTC1X1 is not null or N.NTC1X3 is not null or N.NTC2X1 is not null or N.NTC2X3 is not null or N.NHTMDX3 is not null or
                  NT.NTDG1X2 is not null or NT.NTDG2X2 is not null or NT.NTDGX3 is not null or NT.NTHTM1X1 is not null
                  or NT.NTHTM2X1 is not null or NT.NTHTMX3 is not null or NT.NTSON1X2 is not null or NT.NTSON2X2 is not null or NT.NTSONX3 is not null
                  or NT.NTTC1X1 is not null or NT.NTTC1X3 is not null or NT.NTTC2X1 is not null or NT.NTTC2X3 is not null or NT.NTHTMDX3 is not null
                  ) TON
  where TDG1X2>0 or TDG2X2>0 or TDGX3>0
     `
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})
tondk.get('/ton', (req, res) => {
    let condition = ``
    if (req.query.departmentId == 102495 || req.query.departmentId == 102487)
    {
         condition = `  select NAME,LENGTH,WIDTH,VOLUMN,SUM(tonkho) tonkho from
         (select DISTINCT B.NAME,B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,
         isnull(T.QUANTITY,0) - isnull(XGT.SL_TH,0)+ isnull(XGBT.SL_TH,0) as tonkho
         from nlg.BOM B
         left join
         ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY from prod.OPENING_STOCK P
          left join base.ITEM I on I.ID = P.ITEM_ID
          where DEPARTMENT_ID = '${req.query.departmentId}' and QUANTITY>=0
          GROUP BY 
          I.LENGTH,
          I.WIDTH,
          I.HEIGHT) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY
             
            
             left join
                (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= '${req.query.departmentId}' and createdAt >'${req.query.ngay}'
                GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
             
             left join
                (select DAY,RONG,DAI,SUM(ABS(SL_TH)) SL_TH from prod.XUAT_GO_BAO where DESTINATION_ID= '${req.query.departmentId}'  and createdAt >'${req.query.ngay}'
                GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY
                where (XGBT.SL_TH is not null  or XGT.SL_TH is not null
             
                or T.QUANTITY is not null)
               union all
               (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(NHAP) tonkho from
          (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
          INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
          left join base.ITEM I on I.ID = IIP.ITEM_ID
          WHERE P.DESTINATION_ID = '${req.query.departmentId}' AND P.CREATE_DATE >'${req.query.ngay}'  ) K
          GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)
          union all
          (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(XUAT) tonkho from
     (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, -QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
     INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
     left join base.ITEM I on I.ID = IIP.ITEM_ID
     WHERE P.SOURCE_ID = '${req.query.departmentId}' AND P.CREATE_DATE >'${req.query.ngay}'  ) K
     GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)) X
          where   LENGTH = '${req.query.dai}'
          and WIDTH = '${req.query.rong}' and HEIGHT = '${req.query.day}'
          group by NAME,LENGTH,WIDTH,HEIGHT,VOLUMN
         `
    } else    if (req.query.departmentId == 102493 || req.query.departmentId == 102494)
    {
         condition = `  select LENGTH,WIDTH,VOLUMN,SUM(tonkho) tonkho from
         (select DISTINCT B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,
         isnull(T.QUANTITY,0) - isnull(XGT.SL_TH,0) - isnull(XGBT.SL_TH,0)-isnull(X.XUAT,0) + isnull(PH.SLRALO1,0) as tonkho
         from nlg.BOM B
         left join
         ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY from prod.OPENING_STOCK P
          left join base.ITEM I on I.ID = P.ITEM_ID
          where DEPARTMENT_ID = '${req.query.departmentId}' and QUANTITY>=0 and  P.createdAt >'20210925'
          GROUP BY 
          I.LENGTH,
          I.WIDTH,
          I.HEIGHT) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY
          left join
          (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(XUAT) XUAT from
          (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
          INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
          left join base.ITEM I on I.ID = IIP.ITEM_ID
          WHERE P.SOURCE_ID = '${req.query.departmentId}' AND P.CREATE_DATE >'${req.query.ngay}'  ) K
          GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT) X
          on  X.LENGTH = B.DAI and X.WIDTH = B.RONG and X.HEIGHT = B.DAY 
          left join (SELECT 
           
         
            I.LENGTH length, I.HEIGHT height, I.WIDTH width,
          
            SUM(IIP.QUANTITY) SLRALO1,
            
            ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)  NhapGoRALO1,
            CASE
            WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
            WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
            WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
            ELSE KB.[STATUS]
            END AS N'Trạng thái'
            FROM prod.KILN_BATCH KB
            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
            WHERE KB.STATUS = 'finish'  and KB.EXPORT_DATE >='${req.query.ngay}'
            AND K.FACTORY_ID = 100005
            GROUP BY 
            I.LENGTH,
            I.WIDTH,
            I.HEIGHT,
            I.VOLUMN,
            KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG
            
             left join
                (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= '${req.query.departmentId}' and createdAt >'${req.query.ngay}'
                GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
             
             left join
                (select DAY,RONG,DAI,SUM(ABS(SL_TH)) SL_TH from prod.XUAT_GO_BAO where SOURCE_ID= '${req.query.departmentId}'  and createdAt >'${req.query.ngay}'
                GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY
                where (XGBT.SL_TH is not null  or XGT.SL_TH is not null
             
                or T.QUANTITY is not null or PH.SLRALO1 is not null)
             ) H 
          where   LENGTH = '${req.query.dai}'
          and WIDTH = '${req.query.rong}' and HEIGHT = '${req.query.day}'
          group by LENGTH,WIDTH,HEIGHT,VOLUMN
         `
    }
    else {
      condition = `
    select DEPARTMENT_ID,ITEM_ID,SUM(tonkho) tonkho  from
    (SELECT  DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) tonkho
       FROM prod.OPENING_STOCK 
      where createdAt >= '${req.query.ngay}'
       GROUP BY DEPARTMENT_ID,ITEM_ID
       
       union all 
       select P.DESTINATION_ID DEPARTMENT_ID,CASE WHEN IT.ITEM_ID in (129233,129552,129694) then 129235 else IT.ITEM_ID end as ITEM_ID
       ,SUM(IT.QUANTITY) tonkho from prod.PACKAGE P 
       left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
       where IT.ITEM_ID is not null and P.TYPE_ID = 100026 and CREATE_DATE >='${req.query.ngay}' and VERIFY_BY is not null
       GROUP BY IT.ITEM_ID,P.DESTINATION_ID 
       union all 
       select P.SOURCE_ID DEPARTMENT_ID,CASE WHEN IT.ITEM_ID in (129233,129552,129694) then 129235 else IT.ITEM_ID end as ITEM_ID
       ,-SUM(IT.QUANTITY) tonkho from prod.PACKAGE P 
       left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
       where IT.ITEM_ID is not null and P.TYPE_ID = 100026 and CREATE_DATE >='${req.query.ngay}' 
       GROUP BY IT.ITEM_ID,P.SOURCE_ID ) K 
    WHERE   DEPARTMENT_ID = '${req.query.departmentId}' and ITEM_ID = '${req.query.itemId}'
    GROUP BY DEPARTMENT_ID,ITEM_ID
     `
    }
    const query = `${condition}`
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})
tondk.get('/toncong', (req, res) => {
    const query = `
    select (case when A.KL IS null then 0 else A.KL end +  B.ton) KL from
      
    (select SUM(QUANTITY) ton,market_code,M.NAME ten1 from
    
    prod.OPENING_STOCK OP 
    left join base.MARKET M ON M.CODE = OP.market_code
    where DEPARTMENT_ID= '100072' and M.NAME = N'${req.query.name}'
    GROUP BY market_code,M.NAME
  
   ) B left join
     (select I.ID,I.NAME,M.CODE cp,M.NAME ten,   SUM(IT.QUANTITY)  KL from [prod].[PO] PO
    left join base.ITEM I on I.ID = PO.itemId
     left join base.MARKET M ON M.CODE = PO.market
    left join prod.PACKAGE PA ON PA.PO = PO.code
    left join prod.ITEM_IN_PACKAGE IT ON IT.PACKAGE_ID = PA.ID
    
    where number like '%PO%' and year = 2021 and stepId = 100273 and IT.QUANTITY is not null
   and PA.CREATE_DATE >='20210501'
    GROUP BY I.ID,I.NAME,M.CODE,M.NAME) A
     ON   A.cp = B.market_code
     `
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})
tondk.get('/tonPackage', (req, res) => {
    const query = `
    SET ANSI_NULLS OFF
    SELECT  DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) tonkho,nguonPhoi,ISNULL(SUM(pallet_full), 0) pallet_full, ISNULL(sum(pallet_top1),0) pallet_top1,ISNULL(sum(pallet_top2),0) pallet_top2
    FROM prod.OPENING_STOCK 
    WHERE   DEPARTMENT_ID = '${req.query.departmentId}' and ITEM_ID = ${req.query.itemId}
    and market_code = ${req.query.marketCode}

    and nguonPhoi = N'${req.query.nguonPhoi}'
    GROUP BY DEPARTMENT_ID,ITEM_ID,nguonPhoi
     `
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})
tondk.post('/', (req, res, next) => {
    const query = `INSERT INTO prod.OPENING_STOCK([DATE],[MONTH],[DEPARTMENT_ID],[ITEM_ID],
    [QUANTITY],[WEEK],[market_code], [nguonPhoi],[color],[CREATE_BY],[PO_ID],[DESTINATION_ID],[SELECTION],[pallet_full],[pallet_top1],[pallet_top2],[description],[product_id],[detailed_id])
     VALUES(GETDATE(),DATEPART(MONTH,GETDATE()),
     @DEPARTMENT_ID,@ITEM_ID,@QUANTITY,DATEPART(WEEK,GETDATE()),@market_code,
      @nguonPhoi, @color,@createBy,@po,@DESTINATION_ID,@selection,@palletFull,@palletTop1,@palletTop2,@description,@product_id,@detailed_id)`
    console.log(req.body.nguonPhoi)
    new mssql.Request()
        .input('DEPARTMENT_ID', req.body.departmentId)
        .input('QUANTITY', req.body.quantity)
        .input('ITEM_ID', req.body.itemId)
        .input('market_code', req.body.marketCode)
        .input('nguonPhoi', req.body.nguonPhoi)
        .input('color', req.body.color)
        .input('createBy', req.token.accountId)
        .input('po', req.body.poNumber)
        .input('DESTINATION_ID', req.body.destinationId)
        .input('selection', req.body.selection)
        .input('palletFull', req.body.palletFull)
        .input('palletTop1', req.body.palletTop1)
        .input('palletTop2', req.body.palletTop2)
        .input('description', req.body.description)
        .input('product_id', req.body.product_id)
        .input('detailed_id', req.body.detailed_id)
        .input('quantity_au', req.body.quantity_au)
        .query(query, (err, record) => {
            if (err) { return res.send(err) }
            res.api.sendData(record.recordset)
        })
})
tondk.put('/', (req, res) => {
    const query = `update prod.OPENING_STOCK set createdAt = @ngay, QUANTITY =@quantity where ID = @ID`
    new mssql.Request()
        .input('quantity', req.body.quantity)
        .input('ngay', req.body.ngay)
        .input('ID', req.body.ID)
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})
tondk.put('/delete', (req, res) => {
    const query = `delete from prod.OPENING_STOCK  where ID = @ID`
    new mssql.Request()

    .input('ID', req.body.ID)
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})
tondk.put('/updateStoragePro', (req, res) => {
    const query = `update prod.OPENING_STOCK set QUANTITY = @quantity, pallet_full =@pallet_full, pallet_top1 = @pallet_top1, pallet_top2 = @pallet_top2  where ID = @ID`
    new mssql.Request()
        .input('quantity', req.body.QUANTITY)
        .input('ID', req.body.ID)
        .input('pallet_full', req.body.palletf)
        .input('pallet_top1', req.body.pallet1)
        .input('pallet_top2', req.body.pallet2)
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.status(200).json({ success: true, record })
        })
})
tondk.post('/importStock', async(req, res, next) => {
    let data = req.body;
    try {
        const result = await models.OpeningStock.bulkCreate(data)
        if (result)
            return res.send({ result });

    } catch (error) {
        return res.status(500).send({ error });
    }
})

tondk.get('/productStorage', async(req, res, next) => {
    // const query = `
    // IF OBJECT_ID('tempdb..#BCTonTP') IS NOT NULL
    // DROP TABLE #BCTonTP
    // create table #BCTonTP(
    // market_code char(20),
    // Total money,palletf float,pallet1 float,pallet2 float 
    // )
    // insert into #BCTonTP (
    // market_code,Total,palletf,pallet1,pallet2
    // )
    // select market_code,sum(COALESCE([0],0) + COALESCE([1],0) + COALESCE([2],0)) AS "Total",
    // --pallet_full,pallet_top1,pallet_top2
    // sum(pallet_full) as palletf,
    // sum(pallet_top1) as pallet1,
    // sum(pallet_top2) as pallet2
    // from 
    // (SELECT ID,market_code,ISNULL(QUANTITY,0) as QUANTITY,pallet_full,pallet_top1,pallet_top2,
    // CASE
    // WHEN description is not null and description like N'Chuyển Yên Sơn%' and QUANTITY < 0 THEN 0 -- chuy?n yên son luu kho
    // WHEN description is not null and QUANTITY < 0 THEN 1 --xu?t cont
    // ELSE 2 -- nh?p trong k?
    // END as type
    // FROM [prod].[OPENING_STOCK] where DEPARTMENT_ID = 100071 and DATE < '${req.query.from}') as c pivot(sum(quantity) for type in([0],[1],[2])) as ca  group by market_code
    // --select * from #BCTonTP
    // IF OBJECT_ID('tempdb..#BCTonTP1') IS NOT NULL
    //     DROP TABLE #BCTonTP1
    // create table #BCTonTP1(
    // market_code char(20),
    // nhapTH money,
    // nhapYS money,
    // nhapTB money,
    // nhapKhac money,
    // cont money,
    // YS money,
    // Kho money,
    // Total1 money,
    // palletf float,
    // pallet1 float,
    // pallet2 float 
    // )
    // insert into #BCTonTP1 (
    // market_code,
    // nhapTH,
    // nhapYS,
    // nhapTB,
    // nhapKhac,
    // cont,
    // YS,
    // Kho,
    // Total1,
    // palletf,
    // pallet1,
    // pallet2
    // )
    // select
    // market_code
    // ,sum(ISNULL([2],0)) as nhapTH
    // ,sum(ISNULL([4],0)) as nhapYS
    // ,sum(ISNULL([5],0)) as nhapTB
    // ,sum(ISNULL([6],0)) as nhapKhac
    // ,sum(ISNULL([1],0)) as cont
    // ,sum(ISNULL([3],0)) as YS
    // ,sum(ISNULL([0],0)) as Kho
    // ,sum(COALESCE([0],0) + COALESCE([1],0) + COALESCE([2],0)+ COALESCE([3],0) + COALESCE([4],0)+ COALESCE([5],0)+ COALESCE([6],0)) AS Total1,
    // --pallet_full,pallet_top1,pallet_top2
    // sum(pallet_full) as palletf,
    // sum(pallet_top1) as pallet1,
    // sum(pallet_top2) as pallet2
    // from 
    // (SELECT ID,market_code,ISNULL(QUANTITY,0) as QUANTITY,pallet_full,pallet_top1,pallet_top2,
    // CASE
    // WHEN description  is not null and description like N'Chuyển Yên Sơn lưu kho%' and QUANTITY < 0THEN 0 -- chuy?n yên son luu kho
    // WHEN description is not null and QUANTITY < 0 and description not like N'Chuyển Yên Sơn%' THEN 1 --xu?t cont
    // WHEN QUANTITY > 0 and (nguonPhoi like '%Thuận Hưng%' or nguonPhoi like '%Thuan Hung%') then 2 
    // WHEN QUANTITY > 0 and (nguonPhoi like '%Yên Sơn%' or nguonPhoi like '%Yen Son%') then 4
    // WHEN QUANTITY > 0 and (nguonPhoi like '%Thái Bình%' or nguonPhoi like '%Thai Binh%') then 5
    // WHEN QUANTITY > 0 and (nguonPhoi like '%Khác%' or nguonPhoi like '%Khac%') then 6
    // ELSE 3 -- 
    // END as type
    // FROM [prod].[OPENING_STOCK] where DEPARTMENT_ID = 100071 and DATE >='${req.query.from}' and DATE < '${req.query.to}') as c pivot(sum(quantity) for type in([0],[1],[2],[3],[4],[5],[6])) as ca  group by market_code


    // --select * from #BCTonTP1

    // select sum(palletf) as palletf
    // ,sum(pallet1) pallet1
    // ,sum(pallet2) pallet2
    // ,sum(Total) Total
    // ,sum(nhapTH) nhapTH
    // ,sum(nhapYS) nhapYS
    // ,sum(nhapTB) nhapTB
    // ,sum(nhapKhac) nhapKhac
    // ,sum(cont) cont
    // ,sum(YS) YS
    // ,sum(Kho) Kho
    // ,sum(Total1) Total1
    // ,sum(palletf1) palletf1
    // ,sum(pallet11) pallet11
    // ,sum(pallet21) pallet21
    // ,sum(TotalSUM) TotalSUM
    // ,NAME
    // ,SUBSTRING(market_code1,1,8) mk
    // from
    // (select distinct
    // ISNULL(tp.palletf,0) as palletf,
    // ISNULL(tp.pallet1,0) as pallet1,
    // ISNULL(tp.pallet2,0) as pallet2,
    // ISNULL(tp.market_code,tp1.market_code) as market_code1,
    // mk.NAME,ISNULL(tp.Total,0) as Total,
    // tp1.market_code,
    // ISNULL(tp1.nhapTH,0) as nhapTH,
    // ISNULL(tp1.nhapYS,0) as nhapYS,
    // ISNULL(tp1.nhapTB,0) as nhapTB,
    // ISNULL(tp1.nhapKhac,0) as nhapKhac,
    // ISNULL(tp1.cont,0) as cont,
    // ISNULL(tp1.YS,0) as YS,ISNULL(tp1.Kho,0) as Kho,
    // ISNULL(tp1.Total1,0) as Total1,
    // ISNULL(tp1.palletf,0) as palletf1,
    // ISNULL(tp1.pallet1,0) as pallet11,
    // ISNULL(tp1.pallet2,0) as pallet21,
    // (COALESCE([Total],0) + COALESCE([Total1],0)) AS TotalSUM from #BCTonTP tp
    // full outer join #BCTonTP1 tp1 on tp.market_code = tp1.market_code 
    // left join base.MARKET mk on SUBSTRING(tp.market_code,1,8) = mk.CODE or SUBSTRING(tp1.market_code,1,8) = mk.CODE
    // where Total > 0 or (COALESCE([Total],0) + COALESCE([Total1],0)) > 0 or nhapTH > 0  or nhapYS > 0 or nhapTB > 0 or nhapKhac > 0 or cont > 0 or YS > 0) as  c group by NAME,SUBSTRING(market_code1,1,8)
    // `
    const query = `
    IF OBJECT_ID('tempdb..#BCTonTP') IS NOT NULL
    DROP TABLE #BCTonTP
    create table #BCTonTP(
    market_code char(20),
    Total money,palletf float,pallet1 float,pallet2 float 
    )
    insert into #BCTonTP (
    market_code,Total,palletf,pallet1,pallet2
    )
    select market_code,sum(COALESCE([0],0) + COALESCE([1],0) + COALESCE([2],0)) AS "Total",
    --pallet_full,pallet_top1,pallet_top2
    sum(pallet_full) as palletf,
    sum(pallet_top1) as pallet1,
    sum(pallet_top2) as pallet2
    from 
    (SELECT ID,market_code,ISNULL(QUANTITY,0) as QUANTITY,pallet_full,pallet_top1,pallet_top2,
    CASE
    WHEN description is not null and description like N'Chuyển Yên Sơn%' and QUANTITY < 0 THEN 0 -- chuy?n yên son luu kho
    WHEN description is not null and QUANTITY < 0 THEN 1 --xu?t cont
    ELSE 2 -- nh?p trong k?
    END as type
    FROM [prod].[OPENING_STOCK] where DEPARTMENT_ID = 100071 and DATE < '${req.query.from}') as c pivot(sum(quantity) for type in([0],[1],[2])) as ca  group by market_code
    --select * from #BCTonTP
    IF OBJECT_ID('tempdb..#BCTonTP1') IS NOT NULL
        DROP TABLE #BCTonTP1
    create table #BCTonTP1(
    market_code char(20),
    nhapTH money,
	nhapYS money,
	nhapTB money,
	nhapKhac money,
	cont money,
	YS money,
	Kho money,
	xuatKhac money,

	Total1 money,
	palletf float,
	pallet1 float,
	pallet2 float 
    )
    insert into #BCTonTP1 (
    market_code,
	nhapTH,
	nhapYS,
	nhapTB,
	nhapKhac,
	cont,
	YS,
	Kho,
	xuatKhac,
	Total1,
	palletf,
	pallet1,
	pallet2
    )
    select
	market_code
	,sum(ISNULL([2],0)) as nhapTH
	,sum(ISNULL([4],0)) as nhapYS
	,sum(ISNULL([5],0)) as nhapTB
	,sum(ISNULL([6],0)) as nhapKhac
	,sum(ISNULL([1],0)) as cont
	,sum(ISNULL([3],0)) as YS
	,sum(ISNULL([0],0)) as Kho
	,sum(ISNULL([7],0)) as xuatKhac
	,sum(COALESCE([0],0) + COALESCE([1],0) + COALESCE([2],0)+ COALESCE([3],0) + COALESCE([4],0)+ COALESCE([5],0)+ COALESCE([6],0) + COALESCE([7],0)) AS Total1,
    --pallet_full,pallet_top1,pallet_top2
    sum(pallet_full) as palletf,
    sum(pallet_top1) as pallet1,
    sum(pallet_top2) as pallet2
    from 
    (SELECT ID,market_code,ISNULL(QUANTITY,0) as QUANTITY,pallet_full,pallet_top1,pallet_top2,
    CASE
    WHEN description  is not null and description like N'Chuyển Yên Sơn lưu kho%' and QUANTITY < 0THEN 0 -- chuy?n yên son luu kho
	WHEN description is not null and QUANTITY < 0 and description like N'Chuyển lên%' THEN 7 --xu?t cont
    WHEN description is not null and QUANTITY < 0 and description not like N'Chuyển Yên Sơn%' THEN 1 --xu?t cont


	WHEN QUANTITY > 0 and (nguonPhoi like '%Thuận Hưng%' or nguonPhoi like '%Thuan Hung%') then 2 
	WHEN QUANTITY > 0 and (nguonPhoi like '%Yên Sơn%' or nguonPhoi like '%Yen Son%') then 4
	WHEN QUANTITY > 0 and (nguonPhoi like '%Thái Bình%' or nguonPhoi like '%Thai Binh%') then 5
	WHEN QUANTITY > 0 and (nguonPhoi like '%Khác%' or nguonPhoi like '%Khac%') then 6
    ELSE 3 -- 
    END as type
    FROM [prod].[OPENING_STOCK] where DEPARTMENT_ID = 100071 and DATE >='${req.query.from}' and DATE < '${req.query.to}') as c pivot(sum(quantity) for type in([0],[1],[2],[3],[4],[5],[6],[7])) as ca  group by market_code


    --select * from #BCTonTP1

    select distinct
    ISNULL(tp.palletf,0) as palletf,
	ISNULL(tp.pallet1,0) as pallet1,
	ISNULL(tp.pallet2,0) as pallet2,
    ISNULL(tp.market_code,tp1.market_code) as market_code1,
	mk.NAME,ISNULL(tp.Total,0) as Total,
	tp1.market_code,
	ISNULL(tp1.nhapTH,0) as nhapTH,
	ISNULL(tp1.nhapYS,0) as nhapYS,
	ISNULL(tp1.nhapTB,0) as nhapTB,
	ISNULL(tp1.nhapKhac,0) as nhapKhac,
	ISNULL(tp1.cont,0) as cont,
	ISNULL(tp1.YS,0) as YS,
	ISNULL(tp1.Kho,0) as Kho,
	ISNULL(tp1.xuatKhac,0) as xuatKhac,
	ISNULL(tp1.Total1,0) as Total1,
	ISNULL(tp1.palletf,0) as palletf,
	ISNULL(tp1.pallet1,0) as pallet1,
	ISNULL(tp1.pallet2,0) as pallet2,
	(COALESCE([Total],0) + COALESCE([Total1],0)) AS TotalSUM from #BCTonTP tp 
	full outer join #BCTonTP1 tp1 on tp.market_code = tp1.market_code 
	left join base.MARKET mk on SUBSTRING(tp.market_code,1,8) = mk.CODE or SUBSTRING(tp1.market_code,1,8) = mk.CODE
	where Total > 0 or (COALESCE([Total],0) + COALESCE([Total1],0)) > 0 or nhapTH > 0  or nhapYS > 0 or nhapTB > 0 or nhapKhac > 0 or cont > 0 or YS > 0 or xuatKhac >0 order by market_code1
    `
    new mssql.Request()
        // .input('DEPARTMENT_ID', req.body.departmentId)
        // .input('QUANTITY', req.body.quantity)
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})

tondk.get('/productStorageDetail', async(req, res, next) => {
    const query = `
    SELECT
        OS.[ID]
      ,OS.[DATE]
      ,OS.[MONTH]
      ,OS.[DEPARTMENT_ID]
      ,OS.[ITEM_ID]
      ,OS.[QUANTITY]
      ,OS.[WEEK]
      ,OS.[PO_ID]
      ,OS.[market_code]
      ,OS.[color]
      ,OS.[CREATE_BY]
      ,OS.[nguonPhoi]
      ,OS.[pallet_full]
      ,OS.[pallet_top1]
      ,OS.[pallet_top2]
      ,OS.[description]
	  ,MK.NAME
  FROM [prod].[OPENING_STOCK] os
  left join base.MARKET mk on SUBSTRING(os.market_code,1,8) = mk.CODE

  where OS.[DEPARTMENT_ID] = 100071 and market_code is not null  
  and DATE >='${req.query.from}' and DATE < '${req.query.to}'
  order by DATE desc
    `
    new mssql.Request()
        // .input('DEPARTMENT_ID', req.body.departmentId)
        // .input('QUANTITY', req.body.quantity)
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})

tondk.get('/view-xuat-go-chi-tiet', async(req, res, next) => {
    const query = `
    select * from (SELECT XG.id,B.NAME, B.DAI, B.RONG, B.DAY, XG.createdAt, 
        A.LAST_NAME, D1.NAME DESTINATION_NAME, xg.luadat,XG.GHICHU,D1.ID IDCONGDOAN,
         XG.SL_TH, XG.XUATNHAP,(select top 1 I.ACCOUNTING_CODE from [prod].PO PO
            left join base.MARKET M on M.CODE = PO.[root]
            left join base.ITEM I on I.ID = M.PRODUCT_ID
            where itemId = XG.itemId 
            order by PO.ID desc) makt,
        CASE 
        WHEN D1.NAME = N'1.Lựa phôi - X3 (TH)' THEN XG.number + '-X3-'+ CONVERT(VARCHAR, XG.createdAt, 23)
        WHEN D1.NAME = N'1.Lựa phôi - X1 (TH)' THEN XG.number + '-X1-'+ CONVERT(VARCHAR, XG.createdAt, 23)
        WHEN D1.NAME = N'Nhà máy CBG Yên Sơn 1' THEN XG.number + '-YS-'+ CONVERT(VARCHAR, XG.createdAt, 23)
        WHEN D1.NAME = N'Nhà máy CBG Quang Minh' THEN XG.number + '-QM-'+ CONVERT(VARCHAR, XG.createdAt, 23)
        ELSE XG.number + '' + CONVERT(VARCHAR, XG.createdAt, 23)
        END soPhieu,XG.approvedAt gionhan
        FROM prod.XUAT_GO XG
        INNER JOIN nlg.BOM B ON XG.DAI = B.DAI AND XG.RONG = B.RONG AND XG.DAY = B.DAY
        INNER JOIN base.ACCOUNT A ON XG.createdby = A.ID
        INNER JOIN base.DEPARTMENT D1 ON XG.DESTINATION_ID = D1.ID
        INNER JOIN base.DEPARTMENT D2 ON XG.SOURCE_ID = D2.ID 
        where  XG.factoryId = '${req.query.factoryId==100003?100004:req.query.factoryId}' and XG.createdAt BETWEEN '${req.query.from} 00:00' AND '${req.query.to} 23:59' ) X
        union all
        select * from
           ( SELECT 
          KB.ID id,
           I.[NAME],
          I.LENGTH DAI,  I.WIDTH RONG,I.HEIGHT DAY,KB.EXPORT_DATE createdAt,
          N'' as LAST_NAME,N'Lò sấy' DESTINATION_NAME,'chualua' luadat,'' GHICHU,'' IDCONGDOAN,
           IIP.QUANTITY SL_TH,'nhap' XUATNHAP,'' makt,
          K.NAME soPhieu,P.MODIFY_DATE gionhan
          FROM prod.KILN_BATCH KB
          LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
          LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
          LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
          LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
          LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
          LEFT JOIN prod.PALLET P ON IIP.PALLET_ID = P.ID
          WHERE KB.STATUS = 'finish'  and K.FACTORY_ID = '${req.query.factoryId}'
          and KB.EXPORT_DATE BETWEEN '${req.query.from} 00:00' AND '${req.query.to} 23:59' 
          GROUP BY 
          P.CODE,
          KB.ID,
          K.NAME,
          I.LENGTH,
          I.WIDTH,
          I.HEIGHT,
          IIP.ITEM_ID,
          KB.NUMBER,
          KB.WEEK,
          KB.[YEAR],
          I.[NAME],
          I.VOLUMN,
          IIP.QUANTITY,
          KB.STATUS,P.MODIFY_DATE,
          KB.EXPORT_DATE) LS
   
  ORDER BY createdAt
    `
    new mssql.Request()
        // .input('DEPARTMENT_ID', req.body.departmentId)
        // .input('QUANTITY', req.body.quantity)
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})
tondk.get('/view-xuat-go-chi-tiet-lua-phoi', async(req, res, next) => {
    const query = `
    SELECT B.NAME, B.DAI, B.RONG, B.DAY, XG.createdAt, I.LENGTH,I.WIDTH,I.HEIGHT,
  A.LAST_NAME, D1.NAME DESTINATION_NAME, D2.NAME SOURCE_NAME,D3.NAME DESTINATION_NAME_HC, 
  XG.SOURCE_ID,CASE WHEN XG.SL_TH <0 then -XG.SL_TH else XG.SL_TH END SL_TH,XG.SL_HC,XG.KLC_HC, XG.XUATNHAP FROM prod.XUAT_GO_BAO XG
  INNER JOIN nlg.BOM B ON XG.DAI = B.DAI AND XG.RONG = B.RONG AND XG.DAY = B.DAY
  INNER JOIN base.ACCOUNT A ON XG.createdby = A.ID
  INNER JOIN base.DEPARTMENT D1 ON XG.DESTINATION_ID = D1.ID
  INNER JOIN base.DEPARTMENT D2 ON XG.SOURCE_ID = D2.ID
  LEFT JOIN base.DEPARTMENT D3 ON XG.DESTINATION_ID_HC = D3.ID
  lEFT JOIN base.ITEM I on I.ID = XG.itemId
  WHERE XG.createdAt BETWEEN '${req.query.from} 00:00' AND '${req.query.to} 23:59' and XG.factoryId = '${req.query.factoryId}' and XG.XUATNHAP in ('xuatluaphoi','xuat-cat-ha-cap')
  ORDER BY XG.createdAt
    `
    new mssql.Request()
        // .input('DEPARTMENT_ID', req.body.departmentId)
        // .input('QUANTITY', req.body.quantity)
        .query(query, (err, record) => {
            if (err) { return res.api.sendFail(getErrorMessage(4907)) }
            res.api.sendData(record.recordset)
        })
})

module.exports = tondk