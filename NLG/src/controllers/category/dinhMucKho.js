const express = require('express')
const dinhMucKho = express.Router()
const mssql = require('mssql')

const model = require('../../data/model')

dinhMucKho.get('/klkho', (req, res) => {
    console.log(req.query.nhom)
    new mssql.Request()
        .query(`SELECT  SUM(PLANQTY) as KLTUNGKHO, FIX as fixkho
		FROM nlg.DINH_MUC_KHO 
		WHERE  GROUP_CODE = '${req.query.nhom}' and MAKHO = '${req.query.makho}' AND DATEPART(MONTH,CREATED_AT)='${req.query.thang}' and DATEPART(YEAR,CREATED_AT) = '${req.query.nam}'
        GROUP BY FIX`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/klkhoqc', (req, res) => {
    console.log(req.query.nhom)
    new mssql.Request()
        .query(`SELECT  SUM(PLANQTY) as KLTUNGKHO
		FROM nlg.DINH_MUC_KHO 
		WHERE  GROUP_CODE = '${req.query.nhom}'  AND DATEPART(MONTH,CREATED_AT)=DATEPART(MONTH, GETDATE()) and DATEPART(YEAR,CREATED_AT) = DATEPART(YEAR, GETDATE())`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/klkhoqcfix', (req, res) => {
    console.log(req.query.nhom)
    new mssql.Request()
        .query(`SELECT  SUM(PLANQTY) as KLTUNGKHO
		FROM nlg.DINH_MUC_KHO 
		WHERE  FIX is null and GROUP_CODE = '${req.query.nhom}'  AND DATEPART(MONTH,CREATED_AT)=DATEPART(MONTH, GETDATE()) and DATEPART(YEAR,CREATED_AT) = DATEPART(YEAR, GETDATE())`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/klkhoqc1', (req, res) => {
    console.log(req.query.nhom)
    new mssql.Request()
        .query(`SELECT  ID,MAKHO
		FROM nlg.DINH_MUC_KHO 
		WHERE  GROUP_CODE = '${req.query.nhom}'  AND DATEPART(MONTH,CREATED_AT)=DATEPART(MONTH, GETDATE()) and DATEPART(YEAR,CREATED_AT) = DATEPART(YEAR, GETDATE())`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/', (req, res) => {
    console.log(req.query.nhom)
    new mssql.Request()
        .query(`SELECT   D.ID,D.MAKHO,G.NAME,D.CREATED_AT,D.PLANQTY,D.FIX
        FROM nlg.DINH_MUC_KHO  D
        JOIN nlg.GROUP_CODE G ON G.ID = D.GROUP_CODE
		WHERE  DATEPART(MONTH,CREATED_AT)=${req.query.thang} and DATEPART(YEAR,CREATED_AT) = ${req.query.nam}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/hscg', (req, res) => {

    new mssql.Request()
        .query(`  SELECT DISTINCT B.paren,case when B.paren_id is null then D.ITEM_ID
        else B.paren_id end as paren_id, D.ID, D.GROUP_CODE,D.HESO,G.NAME,D.APPLY_DATE, CASE when D.APPLY_DATE is null then N'Chưa phê duyệt'
        when D.APPLY_DATE is not null then N'Đã phê duyệt' END AS trangthai,I.ID ITEM_ID, CONCAT(I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') tensp,(P.keHoach - P.th - ys1a - ys1b-tb +hanMucTon)*I.VOLUMN keHoach,
        (P.keHoach - P.th - ys1a - ys1b- tb +hanMucTon) keHoachT, '' MALOGO
        ,(P.keHoach - P.th - ys1a - ys1b- tb +hanMucTon)*I.VOLUMN * D.HESO as klc,0 as TH,0 as YS,0 as TB, '' as GHICHU,'' as BX,'phoitho' as PHOI
        --,TH.TON TONTH,ROUND(TH.TONKL,2) TONTHKL 
        --,isnull(YS.TONTYS,0) TONTYS,ROUND(YS.TONKYS,2) TONKYS,isnull(TB.TONTTB,0) TONTTB,ROUND(TB.TONKTB,2) TONKTB,
		-- YSLD.TONLTYS  TONLTYS,ROUND(YSLD.TONLKYS,2) TONLKYS,TBLD.TONLTTB,ROUND(TBLD.TONLKTB,2) TONLKTB 
         FROM nlg.HE_SO  D
        LEFT JOIN base.ITEM I ON D.ITEM_ID = I.ID
        left join (SELECT DISTINCT ITEM_ID,paren,paren_id,factoryId from [prod].[STEP_ITEM_SP]) B ON B.ITEM_ID = D.ITEM_ID and B.factoryId = '${req.query.factoryId}'
	--	left join (SELECT DISTINCT ITEM_ID,paren from [prod].[STEP_ITEM_SP] where STEP_ID = 100274 or STEP_ID = 100264 or STEP_ID = 102339) C ON C.paren = B.paren
		--LEFT JOIN base.ITEM I1 ON C.ITEM_ID = I1.ID
		left join prod.PO P on P.itemId = D.ITEM_ID and P.number = N'${req.query.number}' 
        and P.stepId in (102855,102374,102353,102804,102358,102789,102788,102787,102798,102797,102796,102790,102354,100265,100266,100267,100268,100280,100281,100278,100264,100274,102347,102352,102355,102345,102378,102370,102373,102380,102438,102356,102357,102530)
        left JOIN nlg.GROUP_CODE G ON G.ID = D.GROUP_CODE
     			
	left join
	(select K.GROUP_QC,sum(TON) TON,case when sum(TONKL)<0 then 0 else SUM(TONKL) end TONKL from
	(select B.NHOM GROUP_QC, B.DAY,B.RONG,B.DAI, isnull(PH.SLRALO1,0)+isnull(K.TondkT,0)+isnull(N1.nhapTH1T,0)-isnull(X1.xuatTH1T,0) TON
    ,isnull(PH.NhapGoRALO1,0)+isnull(K.Tondk,0)+isnull(N1.nhapTH1,0)-isnull(X1.xuatTH1,0) TONKL  from  nlg.BOM B
          left join (SELECT I.LENGTH length, I.HEIGHT height, I.WIDTH width,
          SUM(IIP.QUANTITY) SLRALO1,ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)  NhapGoRALO1,
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
          WHERE KB.STATUS = 'finish'  and KB.EXPORT_DATE >='20210602'
          AND K.FACTORY_ID = 100000 and PL.MODIFY_BY is not null
          GROUP BY I.LENGTH,I.WIDTH,I.HEIGHT,I.VOLUMN,
          KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG
       left join (select I.LENGTH,I.WIDTH,I.HEIGHT,OP.ITEM_ID ,SUM(OP.QUANTITY) TondkT,SUM(OP.QUANTITY*I.VOLUMN) Tondk from [prod].[OPENING_STOCK] OP 
       left join base.ITEM I on I.ID = OP.ITEM_ID
       where OP.createdAt >='20210606' and DEPARTMENT_ID = 102484
       group by I.LENGTH,I.WIDTH,I.HEIGHT,OP.ITEM_ID) K on K.LENGTH = B.DAI and K.WIDTH = B.RONG and K.HEIGHT = B.DAY                       
         left join (select DAY,RONG,DAI,SUM(KLC_TH) xuatTH1,SUM(SL_TH) xuatTH1T from prod.XUAT_GO 
         where  createdby = 102050 and XUATNHAP != 'nhap'
         Group by DAY,RONG,DAI ) X1 ON X1.DAY = B.DAY and X1.DAI = B.DAI and X1.RONG = B.RONG
         left join (select DAY,RONG,DAI,SUM(KLC_TH) nhapTH1,SUM(SL_TH) nhapTH1T from prod.XUAT_GO 
         where createdby = 102050 and XUATNHAP = 'nhap'
         Group by DAY,RONG,DAI ) N1 ON N1.DAY = B.DAY and N1.DAI = B.DAI and N1.RONG = B.RONG
         --where N1.nhapTH1T is not null or X1.xuatTH1T is not null or K.Tondk is not null or PH.SLRALO1 is not null
        )K GROUP BY GROUP_QC )TH on TH.GROUP_QC = D.GROUP_CODE
        left join
	(select K.GROUP_QC,sum(TONTYS) TONTYS, case when sum(TONKYS)<0 then 0 else SUM(TONKYS) end TONKYS  from
	( select B.NHOM GROUP_QC, B.DAY,B.RONG,B.DAI,isnull(T.QUANTITY,0) - isnull(XT.XUAT,0)+isnull(PH.SLRALO1,0)-XGT.SL_TH-XGBT.SL_TH TONTYS,
 isnull(T.QUANTITYK,0) - isnull(XT.XUATK,0) + isnull(PH.NhapGoRALO1,0)- isnull(XGT.KLC_TH,0) - isnull(XGBT.KLC_TH,0) TONKYS
 from nlg.BOM B
  left join
  ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY,SUM(P.QUANTITY*I.VOLUMN) QUANTITYK from prod.OPENING_STOCK P
   left join base.ITEM I on I.ID = P.ITEM_ID
   where DEPARTMENT_ID = 102493 and QUANTITY>=0 and P.createdAt > '20220606'
   GROUP BY 
   I.LENGTH,
   I.WIDTH,
   I.HEIGHT,I.VOLUMN) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY
   left join
   (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(XUAT) XUAT,SUM(XUAT*K.VOLUMN) XUATK from
   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt,I.VOLUMN FROM prod.PACKAGE P
   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
   left join base.ITEM I on I.ID = IIP.ITEM_ID
   WHERE P.SOURCE_ID = 102493 AND P.CREATE_DATE >'20220606'   ) K
   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.VOLUMN) XT
   on  XT.LENGTH = B.DAI and XT.WIDTH = B.RONG and XT.HEIGHT = B.DAY 
           left join (SELECT I.LENGTH length, I.HEIGHT height, I.WIDTH width,         
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
           WHERE KB.STATUS = 'finish' and KB.EXPORT_DATE >='20220606'
           AND K.FACTORY_ID = 100003 and PL.MODIFY_BY is not null
           GROUP BY 
           I.LENGTH,
           I.WIDTH,
           I.HEIGHT,
           I.VOLUMN,
           KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG   
      left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH,SUM(KLC_TH) KLC_TH from prod.XUAT_GO where SOURCE_ID= 102493 and DESTINATION_ID <>102380  and createdAt > '20220606'
         GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY   
      left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH,SUM(KLC_TH) KLC_TH from prod.XUAT_GO_BAO where SOURCE_ID= 102493   and createdAt > '20220606'
         GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY) K GROUP BY GROUP_QC) YS on YS.GROUP_QC = D.GROUP_CODE
		 --TB
		 	left join
	(select K.GROUP_QC,sum(TONTYS) TONTTB, case when sum(TONKYS)<0 then 0 else SUM(TONKYS) end TONKTB  from
	( select B.NHOM GROUP_QC, B.DAY,B.RONG,B.DAI,isnull(T.QUANTITY,0) - isnull(XT.XUAT,0)+isnull(PH.SLRALO1,0)-XGT.SL_TH-XGBT.SL_TH TONTYS,
 isnull(T.QUANTITYK,0) - isnull(XT.XUATK,0) + isnull(PH.NhapGoRALO1,0)- isnull(XGT.KLC_TH,0) - isnull(XGBT.KLC_TH,0) TONKYS
 from nlg.BOM B
  left join
  ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY,SUM(P.QUANTITY*I.VOLUMN) QUANTITYK from prod.OPENING_STOCK P
   left join base.ITEM I on I.ID = P.ITEM_ID
   where DEPARTMENT_ID = 102494 and QUANTITY>=0 and P.createdAt > '20220608'
   GROUP BY 
   I.LENGTH,
   I.WIDTH,
   I.HEIGHT,I.VOLUMN) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY
   left join
   (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(XUAT) XUAT,SUM(XUAT*K.VOLUMN) XUATK from
   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt,I.VOLUMN FROM prod.PACKAGE P
   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
   left join base.ITEM I on I.ID = IIP.ITEM_ID
   WHERE P.SOURCE_ID = 102494 AND P.CREATE_DATE >'20220609'   ) K
   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.VOLUMN) XT
   on  XT.LENGTH = B.DAI and XT.WIDTH = B.RONG and XT.HEIGHT = B.DAY 
           left join (SELECT I.LENGTH length, I.HEIGHT height, I.WIDTH width,         
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
           WHERE KB.STATUS = 'finish' and KB.EXPORT_DATE >='20220609'
           AND K.FACTORY_ID = 100005 and PL.MODIFY_BY is not null
           GROUP BY 
           I.LENGTH,
           I.WIDTH,
           I.HEIGHT,
           I.VOLUMN,
           KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG   
      left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH,SUM(KLC_TH) KLC_TH from prod.XUAT_GO where SOURCE_ID= 102494 and DESTINATION_ID <>102380  and createdAt > '20220609'
         GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY   
      left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH,SUM(KLC_TH) KLC_TH from prod.XUAT_GO_BAO where SOURCE_ID= 102494   and createdAt > '20220609'
         GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY) K GROUP BY GROUP_QC) TB on CAST(G.ID as varchar) =TB.GROUP_QC 
		 --lua YS
		 left join 		 
(select GROUP_QC,SUM(TON_DAU_KY) TONLTYS,sum(TON_DAU_KYKL) TONLKYS from
(select  GROUP_QC ,LENGTH,WIDTH,HEIGHT,VOLUMN,SUM(TON_DAU_KY) TON_DAU_KY,SUM(TON_DAU_KY*VOLUMN) TON_DAU_KYKL from
            (select B.NHOM GROUP_QC,B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,
            isnull(T.QUANTITY,0) - isnull(XGT.SL_TH,0)+ isnull(XGBT.SL_TH,0) as TON_DAU_KY
           from nlg.BOM B 
            left join
            ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY from prod.OPENING_STOCK P
             left join base.ITEM I on I.ID = P.ITEM_ID
             where DEPARTMENT_ID = 102487 and QUANTITY>=0
             GROUP BY 
             I.LENGTH,
             I.WIDTH,
             I.HEIGHT) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY                             
                left join
                   (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= 102487   and createdAt >'2022-06-09 11:30:00'
                   GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
                
                left join
                   (select DAY,RONG,DAI,SUM(ABS(SL_TH)) SL_TH from prod.XUAT_GO_BAO where DESTINATION_ID= 102487  and  createdAt >'2022-06-09 11:30:00' and approvedByAccount is not null
                   GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY                           
                   union all
                   (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(NHAP) TON_DAU_KY from
                   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                   left join base.ITEM I on I.ID = IIP.ITEM_ID
                   WHERE P.DESTINATION_ID = 102487 AND P.CREATE_DATE >'2022-06-09 11:30:00'  and P.VERIFY_BY is not null) K
                   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)                              
                  union all
                   (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(XUAT) TON_DAU_KY from
                   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, -QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                   left join base.ITEM I on I.ID = IIP.ITEM_ID
                   WHERE P.SOURCE_ID = 102487 AND P.CREATE_DATE >'2022-06-09 11:30:00' ) K
                   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)) H
				   GROUP BY GROUP_QC,LENGTH,WIDTH,HEIGHT,VOLUMN) KH
				   GROUP BY GROUP_QC) YSLD on YSLD.GROUP_QC = D.GROUP_CODE
                -- lua TB
		 left join 		 
(select GROUP_QC,SUM(TON_DAU_KY) TONLTTB,sum(TON_DAU_KYKL) TONLKTB from
(select  GROUP_QC ,LENGTH,WIDTH,HEIGHT,VOLUMN,SUM(TON_DAU_KY) TON_DAU_KY,SUM(TON_DAU_KY*VOLUMN) TON_DAU_KYKL from
            (select B.NHOM GROUP_QC,B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,
            isnull(T.QUANTITY,0) - isnull(XGT.SL_TH,0)+ isnull(XGBT.SL_TH,0) as TON_DAU_KY
           from nlg.BOM B 
            left join
            ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY from prod.OPENING_STOCK P
             left join base.ITEM I on I.ID = P.ITEM_ID
             where DEPARTMENT_ID = 102495 and QUANTITY>=0
             GROUP BY 
             I.LENGTH,
             I.WIDTH,
             I.HEIGHT) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY                             
                left join
                   (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= 102495   and createdAt >'20220609'
                   GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
                
                left join
                   (select DAY,RONG,DAI,SUM(ABS(SL_TH)) SL_TH from prod.XUAT_GO_BAO where DESTINATION_ID= 102495  and  createdAt >'20220609' and approvedByAccount is not null
                   GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY                           
                   union all
                   (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(NHAP) TON_DAU_KY from
                   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                   left join base.ITEM I on I.ID = IIP.ITEM_ID
                   WHERE P.DESTINATION_ID = 102495 AND P.CREATE_DATE >'20220609'  and P.VERIFY_BY is not null) K
                   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)                              
                  union all
                   (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(XUAT) TON_DAU_KY from
                   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, -QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                   left join base.ITEM I on I.ID = IIP.ITEM_ID
                   WHERE P.SOURCE_ID = 102495 AND P.CREATE_DATE >'20220609' ) K
                   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)) H
				   GROUP BY GROUP_QC,LENGTH,WIDTH,HEIGHT,VOLUMN) KH
				   GROUP BY GROUP_QC) TBLD on TBLD.GROUP_QC = D.GROUP_CODE
	where P.keHoach - ys1a - ys1b- tb +hanMucTon >0
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/hscgthanh', (req, res) => {

    new mssql.Request()
        .query(`  SELECT DISTINCT B.paren,case when B.paren_id is null then 120049
        else B.paren_id end as paren_id, D.ID, D.GROUP_CODE,D.HESO,G.NAME,D.APPLY_DATE, CASE when D.APPLY_DATE is null then N'Chưa phê duyệt'
        when D.APPLY_DATE is not null then N'Đã phê duyệt' END AS trangthai,I.ID ITEM_ID,CONCAT(I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') tensp,(P.keHoach - P.th - ys1a - ys1b-tb +hanMucTon)*I.VOLUMN keHoach,
        (P.keHoach - P.th - ys1a - ys1b- tb +hanMucTon) keHoachT, '' MALOGO
        ,(P.keHoach - P.th - ys1a - ys1b- tb +hanMucTon)*I.VOLUMN * D.HESO as klc,I.VOLUMN,0 as TH,0 as YS,0 as TB, '' as GHICHU,'' as BX,'phoitho' as PHOI 
        ,TH.TON TONTH,ROUND(TH.TONKL,2) TONTHKL 
        ,isnull(YS.TONTYS,0) TONTYS,ROUND(YS.TONKYS,2) TONKYS,isnull(TB.TONTTB,0) TONTTB,ROUND(TB.TONKTB,2) TONKTB,
		 YSLD.TONLTYS  TONLTYS,ROUND(YSLD.TONLKYS,2) TONLKYS,TBLD.TONLTTB,ROUND(TBLD.TONLKTB,2) TONLKTB       FROM nlg.HE_SO_THANH  D
        LEFT JOIN base.ITEM I ON D.ITEM_ID = I.ID
        left join (SELECT DISTINCT ITEM_ID,paren,paren_id,factoryId from [prod].[STEP_ITEM_SP]
		 ) B ON B.ITEM_ID = D.ITEM_ID 
	--	left join (SELECT DISTINCT ITEM_ID,paren from [prod].[STEP_ITEM_SP] where STEP_ID = 100274 or STEP_ID = 100264 or STEP_ID = 102339) C ON C.paren = B.paren
		--LEFT JOIN base.ITEM I1 ON C.ITEM_ID = I1.ID
		left join prod.PO P on P.itemId = B.ITEM_ID and P.number = N'${req.query.number}' and P.stepId in (102353,102358,102789,102788,102787,102798,102797,102796,102790,102354,100265,100266,100267,100268,100280,100281,100278,100264,100274,102347,102352,102355,102345,102378,102370,102373,102380,102438,102356,102357,102530)
        JOIN nlg.GROUP_CODE G ON G.ID = D.GROUP_CODE
        left join
        (select K.GROUP_QC,sum(TON) TON,case when sum(TONKL)<0 then 0 else SUM(TONKL) end TONKL from
        (select B.NHOM GROUP_QC, B.DAY,B.RONG,B.DAI, isnull(PH.SLRALO1,0)+isnull(K.TondkT,0)+isnull(N1.nhapTH1T,0)-isnull(X1.xuatTH1T,0) TON
        ,isnull(PH.NhapGoRALO1,0)+isnull(K.Tondk,0)+isnull(N1.nhapTH1,0)-isnull(X1.xuatTH1,0) TONKL  from  nlg.BOM B
              left join (SELECT I.LENGTH length, I.HEIGHT height, I.WIDTH width,
              SUM(IIP.QUANTITY) SLRALO1,ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)  NhapGoRALO1,
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
              WHERE KB.STATUS = 'finish'  and KB.EXPORT_DATE >='20210602'
              AND K.FACTORY_ID = 100000
              GROUP BY I.LENGTH,I.WIDTH,I.HEIGHT,I.VOLUMN,
              KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG
           left join (select I.LENGTH,I.WIDTH,I.HEIGHT,OP.ITEM_ID ,SUM(OP.QUANTITY) TondkT,SUM(OP.QUANTITY*I.VOLUMN) Tondk from [prod].[OPENING_STOCK] OP 
           left join base.ITEM I on I.ID = OP.ITEM_ID
           where OP.createdAt >='20210606' and DEPARTMENT_ID = 102484
           group by I.LENGTH,I.WIDTH,I.HEIGHT,OP.ITEM_ID) K on K.LENGTH = B.DAI and K.WIDTH = B.RONG and K.HEIGHT = B.DAY                       
             left join (select DAY,RONG,DAI,SUM(KLC_TH) xuatTH1,SUM(SL_TH) xuatTH1T from prod.XUAT_GO 
             where  createdby = 102050 and XUATNHAP != 'nhap'
             Group by DAY,RONG,DAI ) X1 ON X1.DAY = B.DAY and X1.DAI = B.DAI and X1.RONG = B.RONG
             left join (select DAY,RONG,DAI,SUM(KLC_TH) nhapTH1,SUM(SL_TH) nhapTH1T from prod.XUAT_GO 
             where createdby = 102050 and XUATNHAP = 'nhap'
             Group by DAY,RONG,DAI ) N1 ON N1.DAY = B.DAY and N1.DAI = B.DAI and N1.RONG = B.RONG
             --where N1.nhapTH1T is not null or X1.xuatTH1T is not null or K.Tondk is not null or PH.SLRALO1 is not null
            )K GROUP BY GROUP_QC )TH on TH.GROUP_QC = D.GROUP_CODE
            left join
        (select K.GROUP_QC,sum(TONTYS) TONTYS, case when sum(TONKYS)<0 then 0 else SUM(TONKYS) end TONKYS  from
        ( select B.NHOM GROUP_QC, B.DAY,B.RONG,B.DAI,isnull(T.QUANTITY,0) - isnull(XT.XUAT,0)+isnull(PH.SLRALO1,0)-isnull(XGT.SL_TH,0)-isnull(XGBT.SL_TH,0) TONTYS,
     isnull(T.QUANTITYK,0) - isnull(XT.XUATK,0) + isnull(PH.NhapGoRALO1,0)- isnull(XGT.KLC_TH,0) - isnull(XGBT.KLC_TH,0) TONKYS
     from nlg.BOM B
      left join
      ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY,SUM(P.QUANTITY*I.VOLUMN) QUANTITYK from prod.OPENING_STOCK P
       left join base.ITEM I on I.ID = P.ITEM_ID
       where DEPARTMENT_ID = 102493 and QUANTITY>=0 and P.createdAt > '20220321'
       GROUP BY 
       I.LENGTH,
       I.WIDTH,
       I.HEIGHT,I.VOLUMN) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY
       left join
       (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(XUAT) XUAT,SUM(XUAT*K.VOLUMN) XUATK from
       (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt,I.VOLUMN FROM prod.PACKAGE P
       INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
       left join base.ITEM I on I.ID = IIP.ITEM_ID
       WHERE P.SOURCE_ID = 102493 AND P.CREATE_DATE >'20220321'   ) K
       GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.VOLUMN) XT
       on  XT.LENGTH = B.DAI and XT.WIDTH = B.RONG and XT.HEIGHT = B.DAY 
               left join (SELECT I.LENGTH length, I.HEIGHT height, I.WIDTH width,         
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
               WHERE KB.STATUS = 'finish' and KB.EXPORT_DATE >='20220321'
               AND K.FACTORY_ID = 100003
               GROUP BY 
               I.LENGTH,
               I.WIDTH,
               I.HEIGHT,
               I.VOLUMN,
               KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG   
          left join
             (select DAY,RONG,DAI,SUM(SL_TH) SL_TH,SUM(KLC_TH) KLC_TH from prod.XUAT_GO where SOURCE_ID= 102493 and DESTINATION_ID <>102380  and createdAt > '20220321'
             GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY   
          left join
             (select DAY,RONG,DAI,SUM(SL_TH) SL_TH,SUM(KLC_TH) KLC_TH from prod.XUAT_GO_BAO where SOURCE_ID= 102493   and createdAt > '20220321'
             GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY) K GROUP BY GROUP_QC) YS on YS.GROUP_QC = D.GROUP_CODE
             --TB
                 left join
        (select K.GROUP_QC,sum(TONTYS) TONTTB, case when sum(TONKYS)<0 then 0 else SUM(TONKYS) end TONKTB  from
        ( select B.NHOM GROUP_QC, B.DAY,B.RONG,B.DAI,isnull(T.QUANTITY,0) - isnull(XT.XUAT,0)+isnull(PH.SLRALO1,0)-isnull(XGT.SL_TH,0)-isnull(XGBT.SL_TH,0) TONTYS,
     isnull(T.QUANTITYK,0) - isnull(XT.XUATK,0) + isnull(PH.NhapGoRALO1,0)- isnull(XGT.KLC_TH,0) - isnull(XGBT.KLC_TH,0) TONKYS
     from nlg.BOM B
      left join
      ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY,SUM(P.QUANTITY*I.VOLUMN) QUANTITYK from prod.OPENING_STOCK P
       left join base.ITEM I on I.ID = P.ITEM_ID
       where DEPARTMENT_ID = 102494 and QUANTITY>=0 and P.createdAt > '20220309'
       GROUP BY 
       I.LENGTH,
       I.WIDTH,
       I.HEIGHT,I.VOLUMN) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY
       left join
       (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(XUAT) XUAT,SUM(XUAT*K.VOLUMN) XUATK from
       (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt,I.VOLUMN FROM prod.PACKAGE P
       INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
       left join base.ITEM I on I.ID = IIP.ITEM_ID
       WHERE P.SOURCE_ID = 102494 AND P.CREATE_DATE >'20220309'   ) K
       GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.VOLUMN) XT
       on  XT.LENGTH = B.DAI and XT.WIDTH = B.RONG and XT.HEIGHT = B.DAY 
               left join (SELECT I.LENGTH length, I.HEIGHT height, I.WIDTH width,         
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
               WHERE KB.STATUS = 'finish' and KB.EXPORT_DATE >='20220309'
               AND K.FACTORY_ID = 100005
               GROUP BY 
               I.LENGTH,
               I.WIDTH,
               I.HEIGHT,
               I.VOLUMN,
               KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG   
          left join
             (select DAY,RONG,DAI,SUM(SL_TH) SL_TH,SUM(KLC_TH) KLC_TH from prod.XUAT_GO where SOURCE_ID= 102494 and DESTINATION_ID <>102380  and createdAt > '20220309'
             GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY   
          left join
             (select DAY,RONG,DAI,SUM(SL_TH) SL_TH,SUM(KLC_TH) KLC_TH from prod.XUAT_GO_BAO where SOURCE_ID= 102494   and createdAt > '20220309'
             GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY) K GROUP BY GROUP_QC) TB on TB.GROUP_QC = D.GROUP_CODE
             --lua YS
             left join 		 
    (select GROUP_QC,SUM(TON_DAU_KY) TONLTYS,sum(TON_DAU_KYKL) TONLKYS from
    (select  GROUP_QC ,LENGTH,WIDTH,HEIGHT,VOLUMN,SUM(TON_DAU_KY) TON_DAU_KY,SUM(TON_DAU_KY*VOLUMN) TON_DAU_KYKL from
                (select B.NHOM GROUP_QC,B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,
                isnull(T.QUANTITY,0) - isnull(XGT.SL_TH,0)+ isnull(XGBT.SL_TH,0) as TON_DAU_KY
               from nlg.BOM B 
                left join
                ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY from prod.OPENING_STOCK P
                 left join base.ITEM I on I.ID = P.ITEM_ID
                 where DEPARTMENT_ID = 102487 and QUANTITY>=0
                 GROUP BY 
                 I.LENGTH,
                 I.WIDTH,
                 I.HEIGHT) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY                             
                    left join
                       (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= 102487   and createdAt >'20220313'
                       GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
                    
                    left join
                       (select DAY,RONG,DAI,SUM(ABS(SL_TH)) SL_TH from prod.XUAT_GO_BAO where DESTINATION_ID= 102487  and  createdAt >'20220313' and approvedByAccount is not null
                       GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY                           
                       union all
                       (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(NHAP) TON_DAU_KY from
                       (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                       INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                       left join base.ITEM I on I.ID = IIP.ITEM_ID
                       WHERE P.DESTINATION_ID = 102487 AND P.CREATE_DATE >'20220313'  and P.VERIFY_BY is not null) K
                       GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)                              
                      union all
                       (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(XUAT) TON_DAU_KY from
                       (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, -QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                       INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                       left join base.ITEM I on I.ID = IIP.ITEM_ID
                       WHERE P.SOURCE_ID = 102487 AND P.CREATE_DATE >'20220313' ) K
                       GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)) H
                       GROUP BY GROUP_QC,LENGTH,WIDTH,HEIGHT,VOLUMN) KH
                       GROUP BY GROUP_QC) YSLD on YSLD.GROUP_QC = D.GROUP_CODE
                    -- lua TB
             left join 		 
    (select GROUP_QC,SUM(TON_DAU_KY) TONLTTB,sum(TON_DAU_KYKL) TONLKTB from
    (select  GROUP_QC ,LENGTH,WIDTH,HEIGHT,VOLUMN,SUM(TON_DAU_KY) TON_DAU_KY,SUM(TON_DAU_KY*VOLUMN) TON_DAU_KYKL from
                (select B.NHOM GROUP_QC,B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,
                isnull(T.QUANTITY,0) - isnull(XGT.SL_TH,0)+ isnull(XGBT.SL_TH,0) as TON_DAU_KY
               from nlg.BOM B 
                left join
                ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY from prod.OPENING_STOCK P
                 left join base.ITEM I on I.ID = P.ITEM_ID
                 where DEPARTMENT_ID = 102495 and QUANTITY>=0
                 GROUP BY 
                 I.LENGTH,
                 I.WIDTH,
                 I.HEIGHT) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY                             
                    left join
                       (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= 102495   and createdAt >'20220309'
                       GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
                    
                    left join
                       (select DAY,RONG,DAI,SUM(ABS(SL_TH)) SL_TH from prod.XUAT_GO_BAO where DESTINATION_ID= 102495  and  createdAt >'20220309' and approvedByAccount is not null
                       GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY                           
                       union all
                       (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(NHAP) TON_DAU_KY from
                       (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                       INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                       left join base.ITEM I on I.ID = IIP.ITEM_ID
                       WHERE P.DESTINATION_ID = 102495 AND P.CREATE_DATE >'20220309'  and P.VERIFY_BY is not null) K
                       GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)                              
                      union all
                       (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(XUAT) TON_DAU_KY from
                       (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, -QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                       INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                       left join base.ITEM I on I.ID = IIP.ITEM_ID
                       WHERE P.SOURCE_ID = 102495 AND P.CREATE_DATE >'20220309' ) K
                       GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)) H
                       GROUP BY GROUP_QC,LENGTH,WIDTH,HEIGHT,VOLUMN) KH
                       GROUP BY GROUP_QC) TBLD on TBLD.GROUP_QC = D.GROUP_CODE
	where P.keHoach - ys1a - ys1b- tb +hanMucTon >0
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/hscgtp', (req, res) => {

    new mssql.Request()
        .query(`  select '' NAME,(P.keHoach - P.th - ys1a - ys1b- tb +hanMucTon) keHoachT,I.LENGTH,0 GROUP_CODE,
        I.WIDTH,I.HEIGHT,I.ID paren_id,(P.keHoach - P.th - ys1a - ys1b-tb +hanMucTon)*I.VOLUMN keHoach,
        0 as TH,0 as YS,0 as TB, '' as GHICHU,'' as BX,'phoi4M' as PHOI,I.NAME tensp,'' as MALOGO,I.ID ITEM_ID
         from
		 prod.PO P 
         left join base.ITEM I on P.itemId = I.ID
	where P.keHoach - ys1a - ys1b- tb +hanMucTon >0
    and P.number = N'${req.query.number}' and P.stepId in (100266,100267,100280,100281)
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/hscg1', (req, res) => {

    new mssql.Request()
        .query(`  SELECT DISTINCT B.paren,B.paren_id, D.ID, D.GROUP_CODE,D.HESO,G.NAME,D.APPLY_DATE, CASE when D.APPLY_DATE is null then N'Chưa phê duyệt'
        when D.APPLY_DATE is not null then N'Đã phê duyệt' END AS trangthai,I.ID ITEM_ID, I.NAME tensp
       
        FROM (select * from nlg.HE_SO)  D
        LEFT JOIN base.ITEM I ON D.ITEM_ID = I.ID
        left join (SELECT DISTINCT ITEM_ID,paren,paren_id from [prod].[STEP_ITEM_SP]) B ON B.ITEM_ID = D.ITEM_ID
	
	
        JOIN nlg.GROUP_CODE G ON G.ID = D.GROUP_CODE


       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/pcd', (req, res) => {
    let query = "";
    if(req.query.bx == 0){
        query = `
        SELECT PH.id ID,AC.LAST_NAME nguoitao, AC.ID idNguoiTao, IT1.NAME sp,CONCAT(IT.NAME,' - ','QC:','(',IT.HEIGHT,'x',IT.WIDTH,'x',IT.LENGTH,')') tensp,
        CASE WHEN PH.GROUP_CODE = 0 THEN CONCAT(IT.HEIGHT,'x',IT.WIDTH,'x',IT.LENGTH) ELSE
        G.NAME END tenqc,PH.heso HESO,MALOGO,
        case when PH.DVT = 'T' then ROUND(keHoach/IT.VOLUMN,0) 
        else keHoach end as keHoach,Tonys1,TonTH,Tontb,capgo,PH.DVT, PH.week, PH.factoryId
        ,approvedAt,approvedByAccount,PH.GHICHU,PH.BX,PH.PHOI from [prod].[PHIEU_CHI_DINH] PH
        left join nlg.GROUP_CODE G on G.ID = PH.GROUP_CODE
        left join base.ITEM IT ON IT.ID = PH.itemId
        left join base.ITEM IT1 ON IT1.ID = PH.parentId
        left join base.ACCOUNT AC ON AC.ID = PH.createdby
	where PH.number = N'${req.query.number}' and BX  =''
    order by PH.ID   desc
        `
    }else{
        query = `
        SELECT PH.id ID,AC.LAST_NAME nguoitao, AC.ID idNguoiTao, IT1.NAME sp,CONCAT(IT.NAME,' - ','QC:','(',IT.HEIGHT,'x',IT.WIDTH,'x',IT.LENGTH,')') tensp,
        CASE WHEN PH.GROUP_CODE = 0 THEN CONCAT(IT.HEIGHT,'x',IT.WIDTH,'x',IT.LENGTH) ELSE
        G.NAME END tenqc,PH.heso HESO,MALOGO,
        case when PH.DVT = 'T' then ROUND(keHoach/IT.VOLUMN,0) 
        else keHoach end as keHoach,Tonys1,TonTH,Tontb,capgo,PH.DVT, PH.week, PH.factoryId
        ,approvedAt,approvedByAccount,PH.GHICHU,PH.BX,PH.PHOI from [prod].[PHIEU_CHI_DINH] PH
        left join nlg.GROUP_CODE G on G.ID = PH.GROUP_CODE
        left join base.ITEM IT ON IT.ID = PH.itemId
        left join base.ITEM IT1 ON IT1.ID = PH.parentId
        left join base.ACCOUNT AC ON AC.ID = PH.createdby
	where PH.number = N'${req.query.number}' and BX = '${req.query.bx}'
    order by PH.ID   desc
        `
    }


    new mssql.Request()
        .query( query, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/pcd-chan', (req, res) => {

    new mssql.Request()
        .query(`  SELECT PH.id ID,AC.LAST_NAME nguoitao, AC.ID idNguoiTao, IT1.NAME sp,CONCAT(IT.NAME,' - ','QC:','(',IT.HEIGHT,'x',IT.WIDTH,'x',IT.LENGTH,')') tensp,
        CASE WHEN PH.GROUP_CODE = 0 THEN CONCAT(IT.HEIGHT,'x',IT.WIDTH,'x',IT.LENGTH) ELSE
        G.NAME END tenqc,PH.heso HESO,MALOGO,
        case when PH.DVT = 'T' then ROUND(keHoach/IT.VOLUMN,0) 
        else keHoach end as keHoach,Tonys1,TonTH,Tontb,capgo,PH.DVT, PH.week, PH.factoryId
        ,approvedAt,approvedByAccount,PH.GHICHU,PH.BX,PH.PHOI from [prod].[PHIEU_CHI_DINH] PH
        left join nlg.GROUP_CODE G on G.ID = PH.GROUP_CODE
        left join base.ITEM IT ON IT.ID = PH.itemId
        left join base.ITEM IT1 ON IT1.ID = PH.parentId
        left join base.ACCOUNT AC ON AC.ID = PH.createdby
	where PH.number = N'${req.query.number}' and PH.BX = '${req.query.solan}' and PH.approvedByAccount is not null
    order by PH.ID   desc
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/viewxuatgotheongay', (req, res) => {

    new mssql.Request()
        .query(` SELECT B.NAME NAME, XG.[week], XG.DAI, XG.RONG, XG.DAY, CASE WHEN XG.DAI >0 then 'T' 
        else 'M3' END unit, XG.SL_TH,CASE WHEN XG.DAI >0 then XG.KLC_TH 
        else XG.SL_TH END KLC_TH, XG.number,CASE WHEN XG.luadat = 'daluadat' then N'đã lựa đạt'
        WHEN XG.luadat = 'daluakodat' then N'đã lựa không đạt'
        WHEN XG.luadat = 'dalua' then N'đã lựa'
        else N'chưa lựa' END luadat,XG.GHICHU,
        (select top 1 I.ACCOUNTING_CODE from [prod].PO PO
            left join base.MARKET M on M.CODE = PO.[root]
            left join base.ITEM I on I.ID = M.PRODUCT_ID
            where itemId = XG.itemId and PO.number = N'${req.query.number}') makt,
        D.NAME DESTINATION_NAME FROM prod.XUAT_GO XG
        INNER JOIN nlg.BOM B ON B.DAY = XG.DAY and B.RONG = XG.RONG and B.DAI = XG.DAI
      
        INNER JOIN base.DEPARTMENT D ON XG.DESTINATION_ID = D.ID
        WHERE XG.createdAt BETWEEN '${req.query.start}' AND '${req.query.end}' 
        AND XG.number = N'${req.query.number}' AND XG.DESTINATION_ID = ${req.query.destinationId}
        order by B.NAME
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/viewxuatgotheongay2m', (req, res) => {

    new mssql.Request()
        .query(` SELECT B.NAME NAME, XG.[week],XG.ID, XG.DAI, XG.RONG, XG.DAY, CASE WHEN XG.DAI >0 then 'T' 
        else 'M3' END unit, XG.SL_TH, XG.KLC_TH, XG.number
       FROM prod.XUAT_GO_BAO XG
        INNER JOIN nlg.BOM B ON B.DAY = XG.DAY and B.RONG = XG.RONG and B.DAI = XG.DAI
      
   
        WHERE XG.createdAt BETWEEN '${req.query.start}' AND '${req.query.end}'
        AND XG.number = N'${req.query.number}'  and XG.XUATNHAP = 'xuatbao2M'
        order by B.NAME
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/getLSXxuatgotheongay', (req, res) => {

    new mssql.Request()
        .query(` SELECT DISTINCT XG.number, D.[NAME] DESTINATION_NAME, D.ID,XG.factoryId
        FROM prod.XUAT_GO XG
        INNER JOIN base.DEPARTMENT D ON XG.DESTINATION_ID = D.ID
        WHERE XG.createdAt BETWEEN '${req.query.start}' AND '${req.query.end}'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/getLSXxuatgotheongay2m', (req, res) => {

    new mssql.Request()
        .query(` SELECT DISTINCT XG.number,createdAt
        FROM prod.XUAT_GO_BAO XG 
        
        WHERE XG.createdAt BETWEEN '${req.query.start}' AND '${req.query.end}' and XG.XUATNHAP = 'xuatbao2M'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/pcd-bs', (req, res) => {
    new mssql.Request()
        .query(`  SELECT PH.id ID,IT1.NAME sp,IT.NAME tensp,G.NAME tenqc,PH.heso HESO,
        case when PH.DVT = 'T' then ROUND(keHoach/IT.VOLUMN,0) 
        else keHoach end as keHoach,Tonys1,TonTH,Tontb,capgo,PH.PHOI
        ,approvedAt,approvedByAccount,PH.GHICHU,PH.BX,PH.DVT,PH.MALOGO from [prod].[PHIEU_CHI_DINH] PH
        left join nlg.GROUP_CODE G on G.ID = PH.GROUP_CODE
        left join base.ITEM IT ON IT.ID = PH.itemId
        left join base.ITEM IT1 ON IT1.ID = PH.parentId
	where PH.number = N'${req.query.number}' and PH.BX is not null and PH.BX != ''
    order by PH.ID   desc
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/xuatgonm', (req, res) => {

    new mssql.Request()
        .query(` SELECT DISTINCT  NAME,0 THANH, 0 TonTH,null noiden,null luadat,'' GHICHU,
       CODE,DAI,DAY,RONG,USEFLAG from 
		nlg.BOM      
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/nhan-go', (req, res) => {

    new mssql.Request()
        .query(` select id 
        from prod.XUAT_GO
        where DESTINATION_ID = ${req.query.stepId} 
        and DAY = ${req.query.height} 
        and RONG = ${req.query.width} 
        and DAI = ${req.query.length} and id = ${req.query.ID} 
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/go-lua-phoi', (req, res) => {

    new mssql.Request()
        .query(` SELECT B.ID bomId,I.NAME spcap,
        B.CODE bomCode,XG.id,
        B.NAME bomName,
        B.DAI bomLength,
        B.RONG bomWidth,
        B.DAY bomHeight,
        XG.number,
        ROUND(XG.SL_TH,4) QUANTITY, XG.createdby, A.LAST_NAME
        FROM prod.XUAT_GO XG
    INNER JOIN nlg.BOM B ON XG.DAY = B.DAY AND XG.RONG = B.RONG AND XG.DAI = B.DAI
    INNER JOIN base.ACCOUNT A ON XG.createdby = A.ID
    left JOIN base.ITEM I ON XG.itemId = I.ID
    WHERE XG.DESTINATION_ID = ${req.query.stepId} AND XG.approvedByAccount IS NULL AND XUATNHAP in ('xuat', 'xuatam') and xg.createdAt >= '2022-1-27'
   -- GROUP BY B.ID, B.CODE, B.NAME, B.DAI, B.RONG, B.DAY, XG.createdby, A.LAST_NAME,I.NAME,XG.number
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/go-lua-phoi-bao', (req, res) => {

    new mssql.Request()
        .query(` SELECT B.ID bomId,
        B.CODE bomCode,
        B.NAME bomName,
        B.DAI bomLength,
        B.RONG bomWidth,
        B.DAY bomHeight,
        SUM(XG.SL_TH) QUANTITY, XG.createdby, A.LAST_NAME
        FROM prod.XUAT_GO_BAO XG
    INNER JOIN nlg.BOM B ON XG.DAY = B.DAY AND XG.RONG = B.RONG AND XG.DAI = B.DAI
    INNER JOIN base.ACCOUNT A ON XG.createdby = A.ID
    WHERE XG.DESTINATION_ID = ${req.query.stepId} AND XG.approvedByAccount IS NULL and XG.XUATNHAP = 'xuatluaphoi'
    GROUP BY B.ID, B.CODE, B.NAME, B.DAI, B.RONG, B.DAY, XG.createdby, A.LAST_NAME
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.put('/go-lua-phoi', (req, res) => {

    new mssql.Request()
        .query(` UPDATE prod.XUAT_GO 
		SET approvedByAccount = ${req.body.accountId}, 
		approvedAt = GETDATE() 
		WHERE id = ${req.body.xuatGoId}
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.put('/go-lua-phoi-bao', (req, res) => {

    new mssql.Request()
        .query(` UPDATE prod.XUAT_GO_BAO 
		SET approvedByAccount = ${req.body.accountId}, 
		approvedAt = GETDATE() 
		WHERE DAI = ${req.body.length} and RONG = ${req.body.width} and DAY = ${req.body.height} and DESTINATION_ID = ${req.body.stepId}
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/xuatgo', (req, res) => {

    new mssql.Request()
        .query(` SELECT DISTINCT IT.NAME tensp,IT.ID ITEM_ID,G.NAME tenqc,PH.heso HESO,keHoach,capgo,TonTH,PH.GROUP_CODE,null noiden,0 THANH
        ,null luadat,B.CODE,B.DAI,B.DAY,B.RONG,K.KL,PH.GHICHU,PH.BX,PH.PHOI,PH.DVT,isnull(ld.TON_DAU_KY,0) TON_DAU_KYYS,isnull(s.TON_DAU_KY,0) TON_DAU_KY_SAY_YS
        ,isnull(ldtb.TON_DAU_KY,0) TON_DAU_KYTB,isnull(stb.TON_DAU_KY,0) TON_DAU_KY_SAY_TB from [prod].[PHIEU_CHI_DINH] PH
        left join nlg.GROUP_CODE G on G.ID = PH.GROUP_CODE
		left join nlg.BOM B on B.NHOM = CAST(PH.GROUP_CODE AS nvarchar)
		left join (select SUM(TON_DAU_KYKL) TON_DAU_KY,LENGTH,WIDTH,HEIGHT from View_kholuadat_YS
		GROUP BY LENGTH,WIDTH,HEIGHT) ld on ld.HEIGHT = B.DAY and ld.WIDTH = B.RONG and ld.LENGTH = B.DAI and PH.factoryId = 100004
        left join (select SUM(TON_DAU_KYKL) TON_DAU_KY,LENGTH,WIDTH,HEIGHT from View_khosausay_YS
		GROUP BY LENGTH,WIDTH,HEIGHT) s on s.HEIGHT = B.DAY and s.WIDTH = B.RONG and s.LENGTH = B.DAI and PH.factoryId = 100004
			left join (select SUM(TON_DAU_KYKL) TON_DAU_KY,LENGTH,WIDTH,HEIGHT from View_kholuadat_TB
		GROUP BY LENGTH,WIDTH,HEIGHT) Ldtb on ldtb.HEIGHT = B.DAY and ldtb.WIDTH = B.RONG and ldtb.LENGTH = B.DAI and PH.factoryId = 100005
        left join (select SUM(TON_DAU_KYKL) TON_DAU_KY,LENGTH,WIDTH,HEIGHT from View_khosausay_TB
		GROUP BY LENGTH,WIDTH,HEIGHT) stb on stb.HEIGHT = B.DAY and stb.WIDTH = B.RONG and stb.LENGTH = B.DAI and PH.factoryId = 100005
        left join base.ITEM IT ON IT.ID = PH.itemId
        left join ( select heso,itemId,DAY,RONG,DAI, ROUND(SUM(KLC_TH),4) as KL from [prod].[XUAT_GO]
        where number = N'${req.query.number}' and (BX = 'null' or BX = '')
        GROUP BY DAY,RONG,DAI,itemId,heso) K ON K.DAY = B.DAY and K.RONG = B.RONG and K.DAI = B.DAI and K.itemId = PH.itemId and K.heso = PH.heso

	where PH.number = N'${req.query.number}'  and PH.approvedByAccount is not null
    order by G.NAME
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/xuatgobtp', (req, res) => {

    new mssql.Request()
        .query(` SELECT DISTINCT IT.NAME tensp,IT.ID ITEM_ID,G.NAME tenqc,PH.heso HESO,keHoach,capgo,TonTH,PH.GROUP_CODE,null noiden,0 THANH
        ,null luadat, B.CODE,IT.LENGTH DAI,IT.HEIGHT DAY,IT.WIDTH RONG,K.KL,PH.GHICHU,PH.BX,PH.PHOI from [prod].[PHIEU_CHI_DINH] PH
        left join nlg.GROUP_CODE G on G.ID = PH.GROUP_CODE
		left join nlg.BOM B on B.NHOM = CAST(PH.GROUP_CODE AS nvarchar)
        left join base.ITEM IT ON IT.ID = PH.itemId
        left join ( select itemId,DAY,RONG,DAI, ROUND(SUM(KLC_TH),4) as KL from [prod].[XUAT_GO]
        where number = N'${req.query.number}' and (BX = 'null' or BX = '')
        GROUP BY DAY,RONG,DAI,itemId) K ON K.DAY = B.DAY and K.RONG = B.RONG and K.DAI = B.DAI and K.itemId = PH.itemId

	where PH.number = N'${req.query.number}'  and PH.approvedByAccount is not null
    order by G.NAME
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/xuatgobs', (req, res) => {

    new mssql.Request()
        .query(` SELECT DISTINCT IT.NAME tensp,IT.ID ITEM_ID,G.NAME tenqc,PH.heso HESO,keHoach,capgo,TonTH,PH.GROUP_CODE,null noiden,0 THANH
        ,null luadat,B.CODE,B.DAI,B.DAY,B.RONG,K.KL,PH.GHICHU,PH.BX,PH.DVT from [prod].[PHIEU_CHI_DINH] PH
        left join nlg.GROUP_CODE G on G.ID = PH.GROUP_CODE
		left join nlg.BOM B on B.NHOM = CAST(PH.GROUP_CODE AS nvarchar)
        left join base.ITEM IT ON IT.ID = PH.itemId
        left join ( select itemId,DAY,RONG,DAI, ROUND(SUM(KLC_TH),4) as KL,BX from [prod].[XUAT_GO]
        where number = N'${req.query.number}'
        GROUP BY DAY,RONG,DAI,itemId,BX) K ON K.DAY = B.DAY and K.RONG = B.RONG and K.DAI = B.DAI and K.itemId = PH.itemId and K.BX = PH.BX

	where PH.number = N'${req.query.number}' and PH.BX is not null and PH.BX !=''
    order by G.NAME
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.post('/viewxuatgo', (req, res) => {
    let numbers = req.body.number;
    console.log("numbers", numbers);
    let strNumber = "";
    numbers.forEach(el => {
        strNumber += `N'${el}',`;
    });
    strNumber = strNumber.substring(0, strNumber.length - 1);

    new mssql.Request()
        .query(` SELECT IT.NAME tensp,IT.ID ITEM_ID,PH.heso HESO,PH.keHoach,PH.capgo,SUM(KLC_TH) KLC_TH,PH.DESTINATION_ID,PH.number
        ,PH.DAI,PH.DAY,PH.RONG,SUM(PH.SL_TH) SL_TH,PH.luadat,PCD.DVT from [prod].[XUAT_GO] PH
		
        left join base.ITEM IT ON IT.ID = PH.itemId
      
        left join (select DISTINCT keHoach,capgo,number,itemId,DVT from [prod].[PHIEU_CHI_DINH]) PCD on PCD.itemId = PH.itemId and PCD.number = PH.number and PCD.keHoach = PH.keHoach and PH.capgo = PCD.capgo
   
	where PH.number in (${strNumber})
    GROUP BY IT.NAME,IT.ID,PH.heso,PH.keHoach,PH.capgo,PH.DESTINATION_ID,PH.number,PH.DAI,PH.DAY,PH.RONG,PH.luadat,PCD.DVT
    order by IT.NAME
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.post('/delete-xuat-go-theo-lsx', (req, res) => {

    new mssql.Request()
        .query(`
        delete from prod.XUAT_GO where id = ${req.body.id}
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/updatexuatgo', (req, res, next) => {
    const id = req.query.id

    new mssql.Request()
        .query(`
update  prod.XUAT_GO
set luadat = '${req.query.luadat}',SL_TH = '${req.query.SL_TH}',KLC_TH = '${req.query.KLC_TH}'
,GHICHU = N'${req.query.GHICHU}',DESTINATION_ID = ${req.query.IDCONGDOAN}
WHERE id = ${id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/deletexuatgo', (req, res, next) => {
    const id = req.query.id

    new mssql.Request()
        .query(`
delete from  prod.XUAT_GO
WHERE id = ${id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/delete', (req, res, next) => {
    const id = req.query.id

    new mssql.Request()
        .query(`
DELETE FROM nlg.DINH_MUC_KHO
WHERE ID = ${id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/deletepcd', (req, res, next) => {
    const id = req.query.id

    new mssql.Request()
        .query(`
DELETE FROM prod.PHIEU_CHI_DINH
WHERE id = ${id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/deletepb2m', (req, res, next) => {
    const id = req.query.id

    new mssql.Request()
        .query(`
DELETE FROM prod.XUAT_GO_BAO
WHERE id = ${id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/ncpd', (req, res) => {

    new mssql.Request()
        .query(`  select distinct number, BX, createdAt from (
            SELECT number, BX, convert(nvarchar, createdAt, 23) as createdAt FROM prod.PHIEU_CHI_DINH WHERE approvedAt IS NULL
            ) as temp order by createdAt desc
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/heso', (req, res, next) => {
    new mssql.Request()
        .query(`
INSERT INTO   nlg.HE_SO  ([GROUP_CODE],[HESO],[CREATED_AT],[CREATED_BY],[ITEM_ID]) 
VALUES ('${req.query.nhom}','${req.query.heso}',GETDATE(),'${req.query.createBy}','${req.query.ITEM_ID}')
`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.get('/hesothanh', (req, res, next) => {
    new mssql.Request()
        .query(`
INSERT INTO   nlg.HE_SO_THANH  ([GROUP_CODE],[HESO],[CREATED_AT],[CREATED_BY],[ITEM_ID]) 
VALUES ('${req.query.nhom}','${req.query.heso}',GETDATE(),'${req.query.createBy}','${req.query.ITEM_ID}')
`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
dinhMucKho.post('/', model.dinhMucKho.insert)
dinhMucKho.put('/:id', model.dinhMucKho.updateById)

dinhMucKho.delete('/:id', model.dinhMucKho.deleteById)

dinhMucKho.get('/code-in-xuat-go', (req, res) => {

    new mssql.Request()
        .query(`
            select top 1 number from prod.XUAT_GO
            where (SOURCE_ID in (102628, 102629) or DESTINATION_ID in (102628, 102629)) and number like 'NK%'
            order by createdAt desc   
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/item-in-xgbtp', (req, res) => {

    new mssql.Request()
        .query(`
        select distinct i.ID
        ,i.NAME, i.LENGTH, i.WIDTH, i.HEIGHT, i.VOLUMN, 0 QUANTITY from prod.ROUTING r
       inner join base.ITEM i on r.ITEM_ID = i.ID
       where (STEP_ID in  (
	   select id from base.DEPARTMENT where NAME like '%(TH)' and id not in (100282, 100273, 100270, 100012, 100274, 100276)
	   ) and i.CODE not like 'VA%') or i.CODE like 'NK-%'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/item-in-xgnk', (req, res) => {

    new mssql.Request()
        .query(`
        select i.ID
        ,i.NAME, i.LENGTH, i.WIDTH, i.HEIGHT, i.VOLUMN, 0 QUANTITY from prod.ROUTING r
       right join base.ITEM i on r.ITEM_ID = i.ID
       where i.CODE like 'NK-%'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.post('/xuat-go-nhap-khau', (req, res) => {

    const xuatGos = req.body.xuatGos;
    let query = `
    INSERT INTO prod.XUAT_GO (itemId, DAY, RONG, DAI, week, year, number, createdAt, createdby, factoryId, KLC_TH, DESTINATION_ID, SOURCE_ID, SL_TH, XUATNHAP, bienSoXe, maPhieu)
    VALUES
    `
    for (let i = 0; i < xuatGos.length; i++) {
        if(req.body.xuatNhap === 'xuat'){
        query += `(${xuatGos[i].itemId}, ${xuatGos[i].height}, ${xuatGos[i].width}, ${xuatGos[i].length}, ${req.body.week}, ${req.body.year}, '${req.body.number}', GETDATE(),  ${req.body.accountId}, ${req.body.factoryId}, ${xuatGos[i].volumn}, ${xuatGos[i].destinationId}, ${req.body.sourceId}, ${xuatGos[i].quantity}, '${req.body.xuatNhap}', N'${req.body.licensePlates}', N'${req.body.formCode}'),`;
        }else{
        query += `(${xuatGos[i].itemId}, ${xuatGos[i].height}, ${xuatGos[i].width}, ${xuatGos[i].length}, ${req.body.week}, ${req.body.year}, '${req.body.number}', GETDATE(),  ${req.body.accountId}, ${req.body.factoryId}, ${xuatGos[i].volumn}, ${req.body.sourceId}, ${xuatGos[i].destinationId}, ${xuatGos[i].quantity}, '${req.body.xuatNhap}', N'${req.body.licensePlates}', N'${req.body.formCode}'),`;
        }
    }
    query = query.substring(0, query.length - 1);
    new mssql.Request()
        .query(query, (err, record) => {
            if (err)
                return res.api.sendFail(query)
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/xuat-go-nhap-khau/number', (req, res) => {

    new mssql.Request()
    .input('from', req.query.from)
    .input('to', req.query.to)
        .query(`
        select distinct number, CONVERT(varchar, xg.createdAt, 23) createdAt, d.NAME sourceName, xg.week, 
        case 
        when xg.DESTINATION_ID = 102427 then N'NM CBG Quang Minh'
        when xg.DESTINATION_ID = 100000 then N'NM CBG Thuận Hưng'
        when xg.DESTINATION_ID = 100003 then N'NM CBG Yên Sơn 1A'
        when xg.DESTINATION_ID = 100004 then N'NM CBG Yên Sơn 1B'
        when xg.DESTINATION_ID = 100005 then N'NM CBG Thái Bình'
        when xg.DESTINATION_ID = 199999 then N'Khác'
        else d2.NAME end destinationName
        , xg.createdby, a.LAST_NAME, xg.bienSoXe, xg.maPhieu, xg.XUATNHAP  from prod.XUAT_GO xg
        left join base.DEPARTMENT d on xg.SOURCE_ID = d.ID
        left join base.DEPARTMENT d2 on xg.DESTINATION_ID = d2.ID
        inner join base.ACCOUNT a on xg.createdby = a.ID
        where (SOURCE_ID in (102628, 102629) or xg.DESTINATION_ID in (102628, 102629) ) and xg.createdAt between @from and @to 
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

dinhMucKho.get('/get-xuatgonk-by-number', (req, res) => {

    new mssql.Request()
    .input('number', req.query.number)
        .query(`
        select i.NAME itemName, i.HEIGHT, i.WIDTH, i.LENGTH, u.NAME unitName, xg.SL_TH, xg.KLC_TH from prod.XUAT_GO xg
        inner join base.ITEM i on xg.itemId = i.ID
        inner join base.UNIT u on i.UNIT_ID = u.ID
        where xg.number = @number
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

module.exports = dinhMucKho