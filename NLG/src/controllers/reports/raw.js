const express = require('express')
const reports = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../core/config')

reports.get('/tong-hop-nha-cung-cap', (req, res, next) => {
    // console.log(creq.body.fromDate)
    new mssql.Request()
        .query(`SELECT 
        TT.SOPHIEU SOPHIEUNHAP,
        YEAR(P.CREATED_AT) YEAR,
        MONTH(P.CREATED_AT) MONTH,
        D.MAKHO MAKHO,
        CASE WHEN TT.HOTROKHAC > 0 then 1 
        else 0 end as FSC,
        TT.HOTROPALLET,
        P.CREATED_AT CREATE_AT,
        A.FULLNAME NHANVIEN,
        PV.NAME,
        TT.TYLECHINHPHAM/100 TYLECHINHPHAM,
        TT.KLKHO,
        TT.KLQC,
        (TT.TONGTIENCHUATHUE - TT.HOTROKHAC - TT.HOTROPALLET) as TONGTIENCHUATHUE,
        TT.DONGIATB DONGIATB
        FROM nlg.PHIEUNHAPKHO P
        
        
        LEFT JOIN nlg.MAKHO D ON D.MAKHO = P.MAKHO
        LEFT JOIN nlg.LOGIN A ON A.USERNAME = P.CREATED_BY
        LEFT JOIN nlg.PROVIDERS PV ON PV.CODE = P.MANCC
        LEFT JOIN nlg.TINHTIEN TT ON TT.SOPHIEU = P.SOPHIEU
        WHERE P.CREATED_AT BETWEEN '${req.query.startDate} 00:00:00' AND '${req.query.endDate} 23:59:59'
        GROUP BY YEAR(P.CREATED_AT),
        
        MONTH(P.CREATED_AT),
        D.MAKHO,
        TT.SOPHIEU,
        P.CREATED_AT,
        TT.HOTROPALLET,
        TT.HOTROKHAC,
        A.FULLNAME,
        PV.NAME,
        TT.TYLECHINHPHAM,
        TT.KLKHO,
        TT.KLQC,
        (TT.TONGTIENCHUATHUE - TT.HOTROKHAC),
        TT.DONGIATB`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

reports.get('/tong-hop-nha-cung-cap-NL', (req, res, next) => {
    // console.log(creq.body.fromDate)
    new mssql.Request()
        .query(`SELECT 
        TT.SOPHIEU SOPHIEUNHAP,
        YEAR(P.CREATED_AT) YEAR,
        MONTH(P.CREATED_AT) MONTH,
        D.MAKHO MAKHO,
        
        
        P.CREATED_AT CREATE_AT,
       
        PV.NAME,
        TT.TYLECHINHPHAM TYLECHINHPHAM,
        TT.KLKHO,
        TT.KLQC,
        (TT.TONGTIENCHUATHUE - TT.HOTROKHAC) as TONGTIENCHUATHUE,
        TT.DONGIATB DONGIATB
        FROM nlg.PHIEUTRAVE P
        
        
        LEFT JOIN nlg.MAKHO D ON D.MAKHO = P.FROMSL
    
        LEFT JOIN nlg.PROVIDERS PV ON PV.CODE = P.MANCC
        INNER JOIN nlg.TINHTIEN TT ON TT.SOPHIEU = P.SOPHIEUTRAVE
        WHERE P.CREATED_AT BETWEEN '${req.query.startDate} 00:00:00' AND '${req.query.endDate} 23:59:59'
        GROUP BY YEAR(P.CREATED_AT),
        
        MONTH(P.CREATED_AT),
        D.MAKHO,
        TT.SOPHIEU,
        P.CREATED_AT,
        
        
      
        PV.NAME,
        TT.TYLECHINHPHAM,
        TT.KLKHO,
        TT.KLQC,
        (TT.TONGTIENCHUATHUE - TT.HOTROKHAC),
        TT.DONGIATB`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
reports.get('/thong-ke-ty-le', (req, res, next) => {
    // console.log(creq.body.fromDate)
    new mssql.Request()
        .query(`SELECT 
        TT.SOPHIEU SOPHIEUNHAP,
        YEAR(P.CREATED_AT) YEAR,
        MONTH(P.CREATED_AT) MONTH,
        D.MAKHO MAKHO,
        
        
        P.CREATED_AT CREATE_AT,
        
        PV.NAME,
        TT.TYLECHINHPHAM,
        TT.KLKHO,
        TT.KLQC
        
       
        FROM nlg.PHIEUNHAPKHO P
        
        
        LEFT JOIN nlg.MAKHO D ON D.MAKHO = P.MAKHO
       
        LEFT JOIN nlg.PROVIDERS PV ON PV.CODE = P.MANCC
        LEFT JOIN nlg.TINHTIEN TT ON TT.SOPHIEU = P.SOPHIEU
        WHERE P.CREATED_AT BETWEEN '${req.query.startDate} 00:00:00' AND '${req.query.endDate} 23:59:59'
        GROUP BY YEAR(P.CREATED_AT),
        
        MONTH(P.CREATED_AT),
        D.MAKHO,
        TT.SOPHIEU,
        P.CREATED_AT,
        
        
        
        PV.NAME,
        TT.TYLECHINHPHAM,
        TT.KLKHO,
        TT.KLQC
     
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

reports.get('/thong-ke-kho-nhan', (req, res, next) => {
            new mssql.Request()

            .query(` select dt.CODE,p.MAKHO,dt.DAY,dt.RONG,dt.CAO DAI, 
            CASE WHEN (dt.DAY = 55 and dt.RONG = 55) then 
                    SUM(CAST(dt.SOBO AS float)*dt.SOTHANH_BO*dt.DAY*dt.RONG*dt.CAO*3.14/4000000000)
                    else 
            SUM(CAST(dt.SOBO AS float)*dt.SOTHANH_BO*dt.DAY*dt.RONG*dt.CAO/1000000000) END AS KL,
            sum(dt.SOBO*dt.SOTHANH_BO) TONSOTHANH from nlg.PHIEUNHAPKHO_DT dt
            left join nlg.PHIEUNHAPKHO p on p.SOPHIEU = dt.SOPHIEUNHAP
                     
            where dt.DEL_FLAG = 'N' and dt.DELAI = 'N' and p.CREATED_AT BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
            ${req.query.kho == 'all' ? '' : `AND p.MAKHO = '${req.query.kho}'`}
    group by CODE,MAKHO,DAY,RONG,CAO
           `, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})
reports.get('/thong-ke-bien-ban', (req, res, next) => {
    new mssql.Request()

    .query(` select P.MALOGONHAP,PR.NAME TENNCC, P.CREATED_AT, T.SOPHIEU,KLKHO,(TONGTIENCHUATHUE - HOTROKHAC) TONGTIEN,T.DONGIATB from nlg.TINHTIEN T
    left join nlg.PHIEUNHAPKHO P on P.SOPHIEU = T.SOPHIEU
    left join nlg.PROVIDERS PR ON PR.CODE = P.MANCC
    where P.CREATED_AT BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and PR.MX is not null
    order by P.CREATED_AT
   `, (err, record) => {
if (err)
    return res.api.sendFail(getErrorMessage(4907))
res.api.sendData(record.recordset)
})
})
reports.get('/thong-ke-kho-nhan1', (req, res, next) => {
    new mssql.Request()

    .query(` 
  select DISTINCT KH.* from
    (select DISTINCT B.GROUP_QC nhom,B.NAME,B.DAY,B.RONG,B.DAI CAO,CASE WHEN THT.QUANTITY IS null and TH.TH is null then 0
    WHEN TH.TH is null and THT.QUANTITY IS not null then THT.QUANTITY
    WHEN TH.TH Is not null and THT.QUANTITY IS null then TH.TH
       ELSE TH.TH + THT.QUANTITY - PH.KL END AS TH,CASE WHEN XST.QUANTITY IS null then 0
       ELSE  XST.QUANTITY END AS chualua,CASE WHEN LUA.dalua IS null then 0
       ELSE  LUA.dalua END AS dalua,CASE WHEN YS1.YS1 IS null then 0
    ELSE YS1.YS1 END AS YS1,CASE WHEN YS4.YS4 IS null then 0
    ELSE YS4.YS4 END AS TB,CASE WHEN PH.KL IS null then 0
    ELSE PH.KL END AS xepsay,CASE WHEN K.KL IS null then 0
    ELSE K.KL END AS chosay, CASE WHEN H.KL IS null then 0
    ELSE H.KL END AS DAVAOLO,CASE WHEN PK.KL IS null then 0
    ELSE PK.KL END AS tronglo, CASE WHEN P.KL IS null then 0
    ELSE P.KL END AS ralo,CASE WHEN PH1.KL IS null then 0
    ELSE PH1.KL END AS xepsayYS1,CASE WHEN K1.KL IS null then 0
    ELSE K1.KL END AS chosayYS1, CASE WHEN H1.KL IS null then 0
    ELSE H1.KL END AS DAVAOLOYS1,CASE WHEN PK1.KL IS null then 0
    ELSE PK1.KL END AS trongloYS1, CASE WHEN P1.KL IS null then 0
    ELSE P1.KL END AS raloYS1,CASE WHEN PH4.KL IS null then 0
    ELSE PH4.KL END AS xepsayTB,CASE WHEN K4.KL IS null then 0
    ELSE K4.KL END AS chosayTB, CASE WHEN H4.KL IS null then 0
    ELSE H4.KL END AS DAVAOLOTB,CASE WHEN PK4.KL IS null then 0
    ELSE PK4.KL END AS trongloTB, CASE WHEN P4.KL IS null then 0
    ELSE P4.KL END AS raloTB from
    NLG.BOM B
    LEFT JOIN 
     (select B.GROUP_QC, PD.CODE,B.NAME, PD.DAY,PD.RONG,PD.CAO,SUM((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000)) AS TH
     from nlg.PHIEUNHAPKHO_DT PD
     LEFT JOIN 
     nlg.PHIEUNHAPKHO P On P.SOPHIEU = PD.SOPHIEUNHAP
     FULL JOIN 
     nlg.BOM B ON B.CODE = PD.CODE
     where P.MAKHO = 'TH' and P.CREATED_AT BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and PD.DEL_FLAG = 'N' and PD.DELAI = 'N'
     GROUP BY B.GROUP_QC,PD.DAY,PD.RONG,PD.CAO,B.NAME,PD.CODE) TH ON TH.DAY = B.DAY and TH.RONG = B.RONG and TH.CAO = B.DAI
     	 LEFT JOIN
	 (select I.VOLUMN, I.LENGTH,I.HEIGHT,I.WIDTH,SUM(ST.QUANTITY) as QUANTITY from prod.OPENING_STOCK ST
	 LEFT JOIN
	 base.ITEM I ON ST.ITEM_ID = I.ID
	 where DEPARTMENT_ID = 102485
	 GROUP BY I.VOLUMN, I.LENGTH,I.HEIGHT,I.WIDTH) THT ON B.DAI = THT.LENGTH and B.DAY = THT.HEIGHT and B.RONG = THT.WIDTH
     LEFT JOIN
	 (select I.VOLUMN, I.LENGTH,I.HEIGHT,I.WIDTH, SUM(ST.QUANTITY) as QUANTITY from prod.OPENING_STOCK ST
	 LEFT JOIN
	 base.ITEM I ON ST.ITEM_ID = I.ID
	 where DEPARTMENT_ID = 102484 and ST.createdAt <= '${req.query.to} 23:59:59'
	 GROUP BY I.VOLUMN, I.LENGTH,I.HEIGHT,I.WIDTH) XST ON B.DAI = XST.LENGTH and B.DAY = XST.HEIGHT and B.RONG = XST.WIDTH
	  LEFT JOIN
	 (select I.VOLUMN, I.LENGTH,I.HEIGHT,I.WIDTH,SUM(CASE WHEN ST.QUANTITY <0 THEN -ST.QUANTITY*I.VOLUMN END) as dalua from prod.OPENING_STOCK ST
	 LEFT JOIN
	 base.ITEM I ON ST.ITEM_ID = I.ID
	 where DEPARTMENT_ID = 102484 and ST.createdAt BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
	 GROUP BY I.VOLUMN, I.LENGTH,I.HEIGHT,I.WIDTH) LUA ON B.DAI = LUA.LENGTH and B.DAY = LUA.HEIGHT and B.RONG = LUA.WIDTH
     LEFT JOIN 
      (select PD.CODE,B.NAME, PD.DAY,PD.RONG,PD.CAO,SUM((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000)) AS YS1
     from nlg.PHIEUNHAPKHO_DT PD
     LEFT JOIN 
     nlg.PHIEUNHAPKHO P On P.SOPHIEU = PD.SOPHIEUNHAP
     LEFT JOIN 
     nlg.BOM B ON B.CODE = PD.CODE
     where P.MAKHO = 'YS1' and P.CREATED_AT BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and PD.DEL_FLAG = 'N' and PD.DELAI = 'N'
     GROUP BY PD.DAY,PD.RONG,PD.CAO,B.NAME,PD.CODE) YS1 ON YS1.CODE = B.CODE
     LEFT JOIN 
      (select PD.CODE,B.NAME, PD.DAY,PD.RONG,PD.CAO,SUM((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000)) AS YS4
     from nlg.PHIEUNHAPKHO_DT PD
     LEFT JOIN 
     nlg.PHIEUNHAPKHO P On P.SOPHIEU = PD.SOPHIEUNHAP
     LEFT JOIN 
     nlg.BOM B ON B.CODE = PD.CODE
     where P.MAKHO = 'TB' and P.CREATED_AT BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and PD.DEL_FLAG = 'N' and PD.DELAI = 'N'
     GROUP BY PD.DAY,PD.RONG,PD.CAO,B.NAME,PD.CODE) YS4 ON YS4.CODE = B.CODE
    LEFT JOIN
  
  (SELECT DISTINCT 
                          I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL,   prod.PACKAGE.factoryId AS factoryId,  
                           prod.PACKAGE.VERIFY_BY
  FROM            prod.PALLET LEFT OUTER JOIN
                               (SELECT DISTINCT *
                                 FROM            (SELECT DISTINCT PALLET_ID, ID, ROW_NUMBER() OVER (PARTITION BY PALLET_ID
                                                           ORDER BY ID) num
                                 FROM            prod.STEP_OF_PALLET) s
  WHERE        s.num = 1) AS ST ON ST.PALLET_ID = prod.PALLET.ID LEFT OUTER JOIN
  prod.PACKAGE ON prod.PACKAGE.STEP_OF_PALLET_ID = ST.ID 
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = ST.PALLET_ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where prod.PALLET.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and prod.PACKAGE.factoryId = 100000 and prod.PACKAGE.VERIFY_BY is null and prod.PACKAGE.TYPE_ID <> 100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH,prod.PACKAGE.factoryId, prod.PACKAGE.VERIFY_BY) K ON K.HEIGHT = B.DAY and K.WIDTH = B.RONG and K.LENGTH = B.DAI
  
   LEFT JOIN
   (select I.VOLUMN,I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P LEFT JOIN
  prod.STEP_OF_PALLET ST ON ST.PALLET_ID = P.ID
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  left join prod.PACKAGE PA ON PA.STEP_OF_PALLET_ID = IT.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where ST.KILN_BATCH_ID is not null and P.factoryId = 100000 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014 and PA.VERIFY_BY is not null
  GROUP BY  I.VOLUMN,I.LENGTH,I.HEIGHT,I.WIDTH) P ON P.HEIGHT = B.DAY and P.WIDTH = B.RONG and P.LENGTH = B.DAI
   LEFT JOIN
   (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IIP.QUANTITY*I.VOLUMN) KL  FROM prod.KILN_BATCH KB
   LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
   WHERE KB.CREATE_DATE <='${req.query.to} 23:59:59'
   AND K.FACTORY_ID = 100000 and KB.[STATUS] = 'process' and PL.TYPE_ID <>100014
 GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PK ON PK.HEIGHT = B.DAY and PK.WIDTH = B.RONG and PK.LENGTH = B.DAI
  LEFT JOIN
  (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P LEFT JOIN
  prod.STEP_OF_PALLET ST ON ST.PALLET_ID = P.ID
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where ST.KILN_BATCH_ID is not null and P.factoryId = 100000 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) H ON H.HEIGHT = B.DAY and H.WIDTH = B.RONG and H.LENGTH = B.DAI
  LEFT JOIN
  (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P 
  
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where  P.factoryId = 100000 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PH ON PH.HEIGHT = B.DAY and PH.WIDTH = B.RONG and PH.LENGTH = B.DAI
  LEFT JOIN
  
  (SELECT DISTINCT 
                          I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL,   prod.PACKAGE.factoryId AS factoryId,  
                           prod.PACKAGE.VERIFY_BY
  FROM            prod.PALLET LEFT OUTER JOIN
                               (SELECT DISTINCT *
                                 FROM            (SELECT DISTINCT PALLET_ID, ID, ROW_NUMBER() OVER (PARTITION BY PALLET_ID
                                                           ORDER BY ID) num
                                 FROM            prod.STEP_OF_PALLET) s
  WHERE        s.num = 1) AS ST ON ST.PALLET_ID = prod.PALLET.ID LEFT OUTER JOIN
  prod.PACKAGE ON prod.PACKAGE.STEP_OF_PALLET_ID = ST.ID 
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = ST.PALLET_ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where prod.PALLET.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and prod.PACKAGE.factoryId = 100003 and prod.PACKAGE.VERIFY_BY is null and prod.PACKAGE.TYPE_ID <> 100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH,prod.PACKAGE.factoryId, prod.PACKAGE.VERIFY_BY) K1 ON K1.HEIGHT = B.DAY and K1.WIDTH = B.RONG and K1.LENGTH = B.DAI
  
   LEFT JOIN
   (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P LEFT JOIN
  prod.STEP_OF_PALLET ST ON ST.PALLET_ID = P.ID
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  left join prod.PACKAGE PA ON PA.STEP_OF_PALLET_ID = IT.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where ST.KILN_BATCH_ID is not null and P.factoryId = 100003 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014 and PA.VERIFY_BY is not null
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) P1 ON P1.HEIGHT = B.DAY and P1.WIDTH = B.RONG and P1.LENGTH = B.DAI
   LEFT JOIN
   (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P LEFT JOIN
  prod.STEP_OF_PALLET ST ON ST.PALLET_ID = P.ID
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  left join prod.PACKAGE PA ON PA.STEP_OF_PALLET_ID = IT.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where ST.KILN_BATCH_ID is not null and P.factoryId = 100003 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014 and PA.VERIFY_BY is null
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PK1 ON PK1.HEIGHT = B.DAY and PK1.WIDTH = B.RONG and PK1.LENGTH = B.DAI
  LEFT JOIN
  (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P LEFT JOIN
  prod.STEP_OF_PALLET ST ON ST.PALLET_ID = P.ID
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where ST.KILN_BATCH_ID is not null and P.factoryId = 100003 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) H1 ON H1.HEIGHT = B.DAY and H1.WIDTH = B.RONG and H1.LENGTH = B.DAI
  LEFT JOIN
  (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P 
  
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where  P.factoryId = 100003 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PH1 ON PH1.HEIGHT = B.DAY and PH1.WIDTH = B.RONG and PH1.LENGTH = B.DAI
  LEFT JOIN
  
  (SELECT DISTINCT 
                          I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL,   prod.PACKAGE.factoryId AS factoryId,  
                           prod.PACKAGE.VERIFY_BY
  FROM            prod.PALLET LEFT OUTER JOIN
                               (SELECT DISTINCT *
                                 FROM            (SELECT DISTINCT PALLET_ID, ID, ROW_NUMBER() OVER (PARTITION BY PALLET_ID
                                                           ORDER BY ID) num
                                 FROM            prod.STEP_OF_PALLET) s
  WHERE        s.num = 1) AS ST ON ST.PALLET_ID = prod.PALLET.ID LEFT OUTER JOIN
  prod.PACKAGE ON prod.PACKAGE.STEP_OF_PALLET_ID = ST.ID 
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = ST.PALLET_ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where prod.PALLET.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and prod.PACKAGE.factoryId = 100005 and prod.PACKAGE.VERIFY_BY is null and prod.PACKAGE.TYPE_ID <> 100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH,prod.PACKAGE.factoryId, prod.PACKAGE.VERIFY_BY) K4 ON K4.HEIGHT = B.DAY and K4.WIDTH = B.RONG and K4.LENGTH = B.DAI
  
   LEFT JOIN
   (select DISTINCT I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P LEFT JOIN
  prod.STEP_OF_PALLET ST ON ST.PALLET_ID = P.ID
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  left join prod.PACKAGE PA ON PA.STEP_OF_PALLET_ID = IT.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where ST.KILN_BATCH_ID is not null and P.factoryId = 100005 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014 and PA.VERIFY_BY is not null
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) P4 ON P4.HEIGHT = TH.DAY and P4.WIDTH = TH.RONG and P4.LENGTH = TH.CAO
   LEFT JOIN
   (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P LEFT JOIN
  prod.STEP_OF_PALLET ST ON ST.PALLET_ID = P.ID
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  left join prod.PACKAGE PA ON PA.STEP_OF_PALLET_ID = IT.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where ST.KILN_BATCH_ID is not null and P.factoryId = 100005 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014 and PA.VERIFY_BY is null
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PK4 ON PK4.HEIGHT = B.DAY and PK4.WIDTH = B.RONG and PK4.LENGTH = B.DAI
  LEFT JOIN
  (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P LEFT JOIN
  prod.STEP_OF_PALLET ST ON ST.PALLET_ID = P.ID
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where ST.KILN_BATCH_ID is not null and P.factoryId = 100005 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) H4 ON H4.HEIGHT = B.DAY and H4.WIDTH = B.RONG and H4.LENGTH = B.DAI
  LEFT JOIN
  (select I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY*I.VOLUMN) KL from prod.PALLET P 
  
  LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
  LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
  where  P.factoryId = 100005 and P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.TYPE_ID <>100014
  GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PH4 ON PH4.HEIGHT = B.DAY and PH4.WIDTH = B.RONG and PH4.LENGTH = B.DAI
  where B.GROUP_QC is not null
    ) KH
    order by KH.nhom
  
   `, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})
reports.get('/thong-ke-xep-say-trong-lo', (req, res, next) => {
    new mssql.Request()

    .query(` 
  
select null tong,K.ID, K.NAME, LENGTH DAI,WIDTH RONG,HEIGHT DAY,sum(isnull(XepsayTH,0)) XepsayTH,sum(trongloTH) trongloTH,sum(raloTH) raloTH ,
sum(isnull(XepsayYS,0)) XepsayYS,ROUND(sum(trongloYS),2) trongloYS,sum(raloYS) raloYS,sum(isnull(XepsayTB,0)) XepsayTB,sum(trongloTB) trongloTB,sum(raloTB) raloTB from
(select I.ID,I.NAME,I.HEIGHT,I.WIDTH,I.LENGTH,SUM(IT.QUANTITY*I.VOLUMN) XepsayTH,0 trongloTH,0  raloTH,0 XepsayYS,0 trongloYS,0 raloYS 
,0 XepsayTB,0 trongloTB,0 raloTB  from prod.PALLET P
left join prod.ITEM_IN_PALLET IT on IT.PALLET_ID = P.ID
left join base.ITEM I on I.ID = IT.ITEM_ID
where P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.factoryId = 100000 and P.TYPE_ID <>100014
GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
union all
select I.ID,I.NAME, I.HEIGHT,I.WIDTH,I.LENGTH,0 XepsayTH, SUM(IIP.QUANTITY*I.VOLUMN) trongloTH,0  raloTH,0 XepsayYS,0 trongloYS,0 raloYS 
,0 XepsayTB,0 trongloTB,0 raloTB  FROM prod.KILN_BATCH KB
   LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
   WHERE KB.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
   AND K.FACTORY_ID = 100000  and KB.TYPE not in (N'SẤY LẠI INDOOR',N'SẤY LẠI OUTDOOR') AND KB.[STATUS] !='created'
   GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
 union all
select I.ID,I.NAME, I.HEIGHT,I.WIDTH,I.LENGTH,0 XepsayTH,0 trongloTH, SUM(IIP.QUANTITY*I.VOLUMN) raloTH,0 XepsayYS,0 trongloYS,0 raloYS 
,0 XepsayTB,0 trongloTB,0 raloTB  FROM prod.KILN_BATCH KB
   LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
   WHERE KB.EXPORT_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
   AND K.FACTORY_ID = 100000 and KB.[STATUS] = 'finish' and KB.TYPE not in (N'SẤY LẠI INDOOR',N'SẤY LẠI OUTDOOR')
   GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
 union all
 select I.ID,I.NAME,I.HEIGHT,I.WIDTH,I.LENGTH,0 XepsayTH,0 trongloTH,0 raloTH,SUM(IT.QUANTITY*I.VOLUMN) XepsayYS,0 trongloYS,0  raloYS 
 ,0 XepsayTB,0 trongloTB,0 raloTB  from prod.PALLET P
left join prod.ITEM_IN_PALLET IT on IT.PALLET_ID = P.ID
left join base.ITEM I on I.ID = IT.ITEM_ID
where P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.factoryId = 100003 and P.TYPE_ID <>100014
GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
union all
select I.ID,I.NAME, I.HEIGHT,I.WIDTH,I.LENGTH,0 XepsayTH,0 trongloTH,0 raloTH,0 XepsayYS, SUM(ROUND(IIP.QUANTITY,2)*I.VOLUMN) trongloYS,0  raloYS 
,0 XepsayTB,0 trongloTB,0 raloTB  FROM prod.KILN_BATCH KB
   LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
   WHERE KB.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
   AND K.FACTORY_ID = 100003  and KB.TYPE not in (N'SẤY LẠI INDOOR',N'SẤY LẠI OUTDOOR') AND KB.[STATUS] !='created'
   GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
 union all
select I.ID,I.NAME, I.HEIGHT,I.WIDTH,I.LENGTH,0 XepsayTH,0 trongloTH,0 raloTH,0 XepsayYS,0 trongloYS, SUM(IIP.QUANTITY*I.VOLUMN) raloYS 
,0 XepsayTB,0 trongloTB,0 raloTB  FROM prod.KILN_BATCH KB
   LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
   WHERE KB.EXPORT_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
   AND K.FACTORY_ID = 100003 and KB.[STATUS] = 'finish' and PL.TYPE_ID <>100014
   GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
 union all
 select I.ID,I.NAME,I.HEIGHT,I.WIDTH,I.LENGTH,0 XepsayTH,0 trongloTH,0 raloTH,0 XepsayYS,0 trongloYS,0  raloYS 
 ,SUM(IT.QUANTITY*I.VOLUMN) XepsayTB,0 trongloTB,0 raloTB  from prod.PALLET P
left join prod.ITEM_IN_PALLET IT on IT.PALLET_ID = P.ID
left join base.ITEM I on I.ID = IT.ITEM_ID
where P.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59' and P.factoryId = 100005 and P.TYPE_ID <>100014
GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
union all
select I.ID,I.NAME, I.HEIGHT,I.WIDTH,I.LENGTH,0 XepsayTH,0 trongloTH,0 raloTH,0 XepsayYS,0  trongloYS,0  raloYS 
,0 XepsayTB,SUM(IIP.QUANTITY*I.VOLUMN) trongloTB,0 raloTB FROM prod.KILN_BATCH KB
   LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
   WHERE KB.CREATE_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
   AND K.FACTORY_ID = 100005  and KB.TYPE not in (N'SẤY LẠI INDOOR',N'SẤY LẠI OUTDOOR') AND KB.[STATUS] !='created'
   GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
 union all
select I.ID,I.NAME, I.HEIGHT,I.WIDTH,I.LENGTH,0 XepsayTH,0 trongloTH,0 raloTH,0 XepsayYS,0 trongloYS,0 raloYS 
,0 XepsayTB,0 trongloTB,SUM(IIP.QUANTITY*I.VOLUMN) raloTB FROM prod.KILN_BATCH KB
   LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
   WHERE KB.EXPORT_DATE BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
   AND K.FACTORY_ID = 100005 and KB.[STATUS] = 'finish' and PL.TYPE_ID <>100014
   GROUP BY I.NAME,I.LENGTH,I.HEIGHT,I.WIDTH,I.ID
   )  K
   GROUP BY K.NAME,K.LENGTH,K.HEIGHT,K.WIDTH,K.ID
  
   `, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})
reports.get('/bao-cao-ton-lua', (req, res, next) => {
    console.log(req.query.fromDate)
    new mssql.Request()
        .query(`   
        select  null tongNgang,B.GROUP_QC nhom,B.NAME,B.DAY,B.RONG,B.DAI,isnull(TH.TH,0) TH,isnull(PH.chosay,0) chosay,
      isnull(PK.KLTH,0) tronglo,isnull(YS.YS,0) YS,ROUND(isnull(XSYS.chosayYS,0),2) chosayYS,isnull(TLYS.KLYS,0) trongloYS
      ,isnull(TB.TB,0) TB,isnull(XSTB.chosayTB,0) chosayTB,isnull(TLTB.KLTB,0) trongloTB,isnull(LDTB.TON_DAU_KYKL,0) LTB
      ,isnull(LDYS.TON_DAU_KYKL,0) LYS,isnull(CLTB.TON_DAU_KYKL,0) CLTB,isnull(CLYS.TON_DAU_KYKL,0) CLYS,isnull(SLDTH.KL_chualua_DK,0) CLTH
      ,isnull(SLDTH.KL_dalua_DK,0) LTH
        from NLG.BOM B
left join
        (select  LENGTH,WIDTH,HEIGHT,sum(ton) TH from dbo.View_ton_go_tuoi_TH
        where CREATED_AT < '${req.query.to} 23:59:59'
        GROUP BY LENGTH,WIDTH,HEIGHT) TH ON TH.HEIGHT = B.DAY and TH.WIDTH = B.RONG and TH.LENGTH = B.DAI 
LEFT JOIN
          (select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(QUANTITY*I.VOLUMN) chosay from 
          (select * from
            (select TYPE_ID,factoryId1, ID,CASE when VERIFY_DATE is not null and VERIFY_DATE > '${req.query.to} 23:59:59' then null else VERIFY_BY end as  VERIFY_BY,CREATE_DATE from View_PALLET_XEP_XAY
            where CREATE_DATE >'20210401') k) P
          left join prod.ITEM_IN_PALLET IT on P.ID = IT.PALLET_ID
          left join base.ITEM I on I.ID = IT.ITEM_ID
          where  (P.factoryId1 = 100000 and P.CREATE_DATE < '${req.query.to} 23:59:59' and P.TYPE_ID <>100014)
          and P.VERIFY_BY is null
          GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PH ON PH.HEIGHT = B.DAY and PH.WIDTH = B.RONG and PH.LENGTH = B.DAI
LEFT JOIN
                 (  select HEIGHT,WIDTH,LENGTH,sum(KLTH) KLTH from 
                    (select  I.HEIGHT,I.WIDTH,I.LENGTH,  IIP.QUANTITY*I.VOLUMN KLTH,CASE when  KB.EXPORT_DATE > '${req.query.to} 23:59:59' then 'process'
                 else KB.[STATUS] end as [STATUS]  FROM prod.KILN_BATCH KB
                 LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                 LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                 JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                 LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                 LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                 WHERE PL.CREATE_DATE <'${req.query.to} 23:59:59' AND PL.CREATE_DATE >= '20210401' AND KB.CREATE_DATE < '${req.query.to} 23:59:59'
                 AND K.FACTORY_ID = 100000  and KB.TYPE not in (N'SẤY LẠI OUTDOOR', N'SẤY LẠI INDOOR')) k
                 where [STATUS] = 'process'
               GROUP BY  LENGTH,HEIGHT,WIDTH) PK ON PK.HEIGHT = B.DAY and PK.WIDTH = B.RONG and PK.LENGTH = B.DAI
left join
               (select  LENGTH,WIDTH,HEIGHT,sum(ton) YS from dbo.View_ton_go_tuoi_YS
               where CREATED_AT < '${req.query.to} 23:59:59'
               GROUP BY LENGTH,WIDTH,HEIGHT) YS ON YS.HEIGHT = B.DAY and YS.WIDTH = B.RONG and YS.LENGTH = B.DAI 
LEFT JOIN
                 (select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(QUANTITY*I.VOLUMN) chosayYS from 
                 (select * from
(select TYPE_ID,factoryId1, ID,CASE when VERIFY_DATE is not null and VERIFY_DATE > '${req.query.to} 23:59:59' then null else VERIFY_BY end as  VERIFY_BY,CREATE_DATE from View_PALLET_XEP_XAY
where CREATE_DATE >'20220201') k) P
                 left join prod.ITEM_IN_PALLET IT on P.ID = IT.PALLET_ID
                 left join base.ITEM I on I.ID = IT.ITEM_ID
                 where  P.factoryId1 = 100003  and P.CREATE_DATE < '${req.query.to} 23:59:59' and P.TYPE_ID <>100014
                 and P.VERIFY_BY is null
                 GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) XSYS ON XSYS.HEIGHT = B.DAY and XSYS.WIDTH = B.RONG and XSYS.LENGTH = B.DAI
LEFT JOIN
                        ( select HEIGHT,WIDTH,LENGTH,sum(KLYS) KLYS from 
                            (select  I.HEIGHT,I.WIDTH,I.LENGTH,  IIP.QUANTITY*I.VOLUMN KLYS,CASE when  KB.EXPORT_DATE > '${req.query.to} 23:59:59' then 'process'
                            else KB.[STATUS] end as [STATUS]  FROM prod.KILN_BATCH KB
                        LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                        LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                        JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                        LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                        LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                        WHERE PL.CREATE_DATE <'${req.query.to} 23:59:59' AND PL.CREATE_DATE >= '20220201' AND KB.CREATE_DATE < '${req.query.to} 23:59:59'
                        AND K.FACTORY_ID = 100003  and KB.TYPE not in (N'SẤY LẠI OUTDOOR', N'SẤY LẠI INDOOR')) k
                        where [STATUS] = 'process'
                      GROUP BY  LENGTH,HEIGHT,WIDTH) TLYS ON TLYS.HEIGHT = B.DAY and TLYS.WIDTH = B.RONG and TLYS.LENGTH = B.DAI 
left join
                      (select  LENGTH,WIDTH,HEIGHT,sum(ton) TB from dbo.View_ton_go_tuoi_TB
                      where CREATED_AT < '${req.query.to} 23:59:59'
                      GROUP BY LENGTH,WIDTH,HEIGHT) TB ON TB.HEIGHT = B.DAY and TB.WIDTH = B.RONG and TB.LENGTH = B.DAI 
LEFT JOIN
                        (select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(QUANTITY*I.VOLUMN) chosayTB from 
                        (select * from
                            (select TYPE_ID,factoryId1, ID,CASE when VERIFY_DATE is not null and VERIFY_DATE > '${req.query.to} 23:59:59' then null else VERIFY_BY end as  VERIFY_BY,CREATE_DATE from View_PALLET_XEP_XAY
                            where CREATE_DATE >'20220401') k) P
                        left join prod.ITEM_IN_PALLET IT on P.ID = IT.PALLET_ID
                        left join base.ITEM I on I.ID = IT.ITEM_ID
                        where  P.factoryId1 = 100005 and P.CREATE_DATE < '${req.query.to} 23:59:59' and P.TYPE_ID <>100014
                        and P.VERIFY_BY is null
                        GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) XSTB ON XSTB.HEIGHT = B.DAY and XSTB.WIDTH = B.RONG and XSTB.LENGTH = B.DAI
LEFT JOIN
                               ( select HEIGHT,WIDTH,LENGTH,sum(KLTB) KLTB from 
                                   (select  I.HEIGHT,I.WIDTH,I.LENGTH,IIP.QUANTITY*I.VOLUMN KLTB,CASE when  KB.EXPORT_DATE > '${req.query.to} 23:59:59' then 'process'
                                   else KB.[STATUS] end as [STATUS]  FROM prod.KILN_BATCH KB
                               LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                               LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                               JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                               LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                               LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                               WHERE PL.CREATE_DATE <'${req.query.to} 23:59:59' AND PL.CREATE_DATE >= '20220201' AND KB.CREATE_DATE < '${req.query.to} 23:59:59'
                               AND K.FACTORY_ID = 100005  and KB.TYPE not in (N'SẤY LẠI OUTDOOR', N'SẤY LẠI INDOOR')) h
                               where [STATUS] = 'process'
                             GROUP BY  LENGTH,HEIGHT,WIDTH) TLTB ON TLTB.HEIGHT = B.DAY and TLTB.WIDTH = B.RONG and TLTB.LENGTH = B.DAI    
LEFT JOIN 
                       (select HEIGHT,WIDTH,LENGTH,sum(TON_DAU_KYKL) TON_DAU_KYKL from View_kholuadat_TB
                       where createdAt <'${req.query.to} 23:59:59'
                       GROUP BY  LENGTH,HEIGHT,WIDTH) LDTB on LDTB.HEIGHT = B.DAY and LDTB.WIDTH = B.RONG and LDTB.LENGTH = B.DAI 
                       LEFT JOIN 
                       (select HEIGHT,WIDTH,LENGTH,sum(TON_DAU_KYKL) TON_DAU_KYKL from View_kholuadat_YS
                       where createdAt <'${req.query.to} 23:59:59'
                       GROUP BY  LENGTH,HEIGHT,WIDTH) LDYS on LDYS.HEIGHT = B.DAY and LDYS.WIDTH = B.RONG and LDYS.LENGTH = B.DAI 
LEFT JOIN 
                       (select HEIGHT,WIDTH,LENGTH,sum(TON_DAU_KYKL) TON_DAU_KYKL from View_khosausay_TB
                       where createdAt <'${req.query.to} 23:59:59'
                       GROUP BY  LENGTH,HEIGHT,WIDTH) CLTB on CLTB.HEIGHT = B.DAY and CLTB.WIDTH = B.RONG and CLTB.LENGTH = B.DAI
                       LEFT JOIN 
                       (select HEIGHT,WIDTH,LENGTH,sum(TON_DAU_KYKL) TON_DAU_KYKL from View_khosausay_YS
                       where createdAt <'${req.query.to} 23:59:59'
                       GROUP BY  LENGTH,HEIGHT,WIDTH) CLYS on CLYS.HEIGHT = B.DAY and CLYS.WIDTH = B.RONG and CLYS.LENGTH = B.DAI       
LEFT JOIN 
(
    select DAY,RONG,DAI,ROUND(sum(KL_chualua_DK),4) KL_chualua_DK,ROUND(sum(KL_dalua_DK),4) KL_dalua_DK from
    (select DAY,RONG,DAI,-SUM(isnull(B.KL_chualua_DK,0))as KL_chualua_DK,
             -SUM(isnull(KL_dalua_DK,0)) - SUM(isnull(KL_daluakodat_DK,0)) as KL_dalua_DK
             from (select CASE when luadat = 'chualua' then SL_TH  end as SL_chualua_DK,
              CASE when luadat = 'chualua' then KLC_TH  end as KL_chualua_DK,CASE when luadat = 'dalua' or luadat = 'daluadat' then KLC_TH  end as KL_dalua_DK,
             CASE when (luadat = 'dalua' or luadat = 'daluadat') then SL_TH  end as SL_dalua_DK,CASE when luadat = 'daluakodat' then KLC_TH  end as KL_daluakodat_DK,
             CASE when luadat = 'daluakodat' then SL_TH  end as SL_daluakodat_DK,DAY,RONG,DAI
             from prod.XUAT_GO where createdAt < '${req.query.to} 23:59:59'  AND SOURCE_ID = 102484 AND XUATNHAP != 'nhap') B
             GROUP BY DAY,RONG,DAI
    
    union all
             select DAY,RONG,DAI,SUM(isnull(KL_chualua_DK,0))as KL_chualua_DK,
            SUM(isnull(KL_dalua_DK,0)) +SUM(isnull(KL_daluakodat_DK,0)) as KL_dalua_DK
            from (select CASE when luadat = 'chualua' then SL_TH  end as SL_chualua_DK,
             CASE when luadat = 'chualua' then KLC_TH  end as KL_chualua_DK,CASE when luadat = 'dalua' or luadat = 'daluadat' then KLC_TH  end as KL_dalua_DK,
            CASE when (luadat = 'dalua' or luadat = 'daluadat') then SL_TH  end as SL_dalua_DK,CASE when luadat = 'daluakodat' then KLC_TH  end as KL_daluakodat_DK,
            CASE when luadat = 'daluakodat' then SL_TH  end as SL_daluakodat_DK,DAY,RONG,DAI
            from prod.XUAT_GO where createdAt < '${req.query.to} 23:59:59'  AND SOURCE_ID = 102484 AND XUATNHAP = 'nhap'
           ) B
                    GROUP BY DAY,RONG,DAI
    union all
           SELECT         
             I.HEIGHT DAY, I.WIDTH RONG, I.LENGTH DAI, 
             SUM(IIP.QUANTITY*I.VOLUMN) KL_chualua_DK,0   KL_dalua_DK     
             FROM prod.KILN_BATCH KB
             LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
             LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
             LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
             LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
             LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
             WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE <'${req.query.to} 23:59:59' and KB.EXPORT_DATE >='20210602'
             AND K.FACTORY_ID = 100000 and I.ID is not null
             GROUP BY I.LENGTH,I.WIDTH,I.HEIGHT,I.VOLUMN
         union all
             select HEIGHT DAY,WIDTH RONG,LENGTH DAI,sum(isnull(nhap_chualua_DK,0)*VOLUMN) - sum(isnull(xuat_chualua_DK,0)*VOLUMN)   KL_chualua_DK,
             SUM(isnull(nhap_dalua_dat_DK,0)*VOLUMN) - SUM(isnull(xuat_dalua_dat_DK,0)*VOLUMN) - SUM(isnull(xuat_dalua_kodat_DK,0)*VOLUMN)+SUM(isnull(nhap_dalua_kodat_DK,0)*VOLUMN) KL_dalua_DK from
             (select I.LENGTH,I.HEIGHT,I.WIDTH,I.VOLUMN, CASE WHEN (OP.SELECTION = 0 or OP.SELECTION  is null) and QUANTITY <0 then -OP.QUANTITY END xuat_chualua_DK,
             CASE WHEN (OP.SELECTION = 0 or OP.SELECTION  is null) and QUANTITY >0 then OP.QUANTITY END nhap_chualua_DK,
           CASE  when OP.SELECTION = 1 and QUANTITY >0 then OP.QUANTITY END nhap_dalua_dat_DK,
               CASE  when OP.SELECTION = 1 and QUANTITY <0 then -OP.QUANTITY END xuat_dalua_dat_DK,
           CASE  when OP.SELECTION = 2 and QUANTITY <0 then -OP.QUANTITY END xuat_dalua_kodat_DK,
               CASE  when OP.SELECTION = 2 and QUANTITY >0 then OP.QUANTITY END nhap_dalua_kodat_DK
             from prod.OPENING_STOCK  OP
             left join base.ITEM I on I.ID = OP.ITEM_ID
             where DEPARTMENT_ID = 102484 and createdAt <'${req.query.to} 23:59:59'  and createdAt >='20210606') P
              group by LENGTH,HEIGHT,WIDTH,VOLUMN) K 
              GROUP BY DAY,RONG,DAI) SLDTH on SLDTH.DAY = B.DAY and SLDTH.RONG = B.RONG and SLDTH.DAI = B.DAI                    
        where TH.TH>0 or YS.YS>0 or PH.chosay>0 or  XSYS.chosayYS>0 or PK.KLTH >0 or TLYS.KLYS>0 
        or TB.TB>0 or XSTB.chosayTB>0 or TLTB.KLTB>0 or CLYS.TON_DAU_KYKL is not null or LDYS.TON_DAU_KYKL is not null  or CLTB.TON_DAU_KYKL is not null
        or LDTB.TON_DAU_KYKL is not null or SLDTH.KL_chualua_DK >0 or SLDTH.KL_dalua_DK>0
         `, (err, data) => {
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            }
            return res.api.sendData(data.recordset)
        })
})
reports.get('/tong-hop-xuong-hang', (req, res, next) => {
    console.log(req.query.fromDate)
    new mssql.Request()
        .query(`    select B.*,C.NAME NAME, C.ADDRESS ADDRESS from
        ((SELECT 
                A.ID ID, A.SOPHIEU SOPHIEU, A.MAKHO MAKHO,
                ( select sum(KL) from
                    (select  CASE WHEN (PD.DAY = 55 and PD.RONG = 55) then 
                    ROUND((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO*3.14/4000000000),4)
                    else 
                    CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000 END AS KL,PD.SOPHIEUNHAP from nlg.PHIEUNHAPKHO_DT PD
                where  PD.DEL_FLAG = 'N' and PD.DELAI = 'N') K
                where K.SOPHIEUNHAP = A.SOPHIEU) KLKHO, 
               A.MANCC,
                A.CREATED_AT CREATED_AT, A.BIENSOXE BIENSOXE, A.XUONGXENANG XUONGXENANG
                
                FROM nlg.PHIEUNHAPKHO A )
                union all
        (SELECT 
                A.ID ID, A.SOPHIEUTRAVE SOPHIEU, A.FROMSL MAKHO,
               PD.KLKHO,
               A.MANCC,
                A.CREATED_AT CREATED_AT, K.BIENSOXE BIENSOXE, 'ML-N' XUONGXENANG
                
                FROM nlg.PHIEUTRAVE A 
                left  join (select SUM(CAST(SOBO AS float)*SOTHANH_BO*DAY*RONG*CAO/1000000000) KLKHO,DELAI,SOPHIEUTRAVE,SOPHIEUNHAP from nlg.PHIEUNHAPKHO_DT
                group by DELAI,SOPHIEUTRAVE,SOPHIEUNHAP) PD
                on PD.SOPHIEUTRAVE = A.SOPHIEUTRAVE
                left join nlg.PHIEUNHAPKHO K on K.SOPHIEU = PD.SOPHIEUNHAP 
                where PD.DELAI = 'M') ) B
        
          left  JOIN nlg.PROVIDERS C ON C.CODE = B.MANCC  
        where B.MAKHO = '${req.query.kho}' and B.CREATED_AT BETWEEN '${req.query.fromDate} 00:00:00' 
        and '${req.query.toDate} 23:59:59'
ORDER BY B.CREATED_AT DESC,B.SOPHIEU DESC `, (err, data) => {
            if (err) {
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            }
            return res.api.sendData(data.recordset)
        })
})

reports.get('/dongiatrungbinh', (req, res, next) => {
    let q = `select PD.CODENHOM,PD.MANVL,G.NAME nhom,
    AVG( CAST(PD.DONGIA_TB AS MONEY)) DONGIATB
    
    from nlg.PHIEUNHAPKHO_DT PD
    
    LEFT JOIN nlg.PHIEUNHAPKHO P ON P.SOPHIEU = PD.SOPHIEUNHAP
    left join [nlg].[GROUP_CODE] G on G.ID = PD.CODENHOM
    WHERE P.CREATED_AT BETWEEN '${req.query.fromDate} 00:00:00' AND '${req.query.toDate} 23:59:59' and PD.DEL_FLAG = 'N' and PD.MANVL is not null
    GROUP BY PD.MANVL, PD.CODENHOM,G.NAME
    order by G.NAME`

    new mssql.Request()
        .query(q, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

reports.get('/khoiluongnhacungcap', (req, res, next) => {
    let getKhoiLuongNhaCungCapTheoLoai = `
    select T.SOPHIEU,
    T.CREATED_AT,
    T.NHANVIEN,
    SP.MAKHO,
    SP.NAME,
    T.TYLECHINHPHAM,
    T.KLKHO,
    T.KLQC,
    T.TONGTIENCHUATHUE,
    T.DONGIATB,
    T.COC
    from nlg.TINHTIEN T
    LEFT JOIN (
        SELECT 
        P.SOPHIEU SOPHIEU,
        D.MAKHO MAKHO,
        PV.NAME,
        P.CREATED_AT CREATED_AT
        FROM nlg.PHIEUNHAPKHO P
        LEFT JOIN nlg.PROVIDERS PV ON PV.CODE = P.MANCC
        LEFT JOIN nlg.MAKHO D ON D.MAKHO  = P.MAKHO
    ) SP ON T.SOPHIEU = SP.SOPHIEU
    WHERE SP.CREATED_AT BETWEEN '${req.query.startDate} 00:00:00' AND '${req.query.endDate} 23:59:59'
    AND T.XUATHOADON = '${req.query.cohd}'
`
    new mssql.Request()
        .query(getKhoiLuongNhaCungCapTheoLoai, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})



reports.get('/bctonghop', (req, res, next) => {
    console.log(req.query.fromDate)
    console.log(req.query.toDate)
    new mssql.Request()
        .query(`SELECT 
       
        YEAR(P.CREATED_AT) YEAR,
        MONTH(P.CREATED_AT) MONTH,
        P.MAKHO MAKHO,
        PD.CODE ,
        CASE WHEN (PD.DAY = 55 and PD.RONG = 55) then 
        ROUND((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO*3.14/4000000000),4)
        else 
        (CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000) END AS KLKHO,
        P.CREATED_AT CREATE_AT
        FROM nlg.PHIEUNHAPKHO P
        LEFT JOIN nlg.PHIEUNHAPKHO_DT PD ON PD.SOPHIEUNHAP = P.SOPHIEU
        
        where P.CREATED_AT BETWEEN '${req.query.fromDate} 00:00:00' AND '${req.query.toDate} 23:59:59' 
        AND PD.DEL_FLAG = 'N' and PD.DELAI = 'N'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


reports.get('/bckh2', (req, res, next) => {
            let whereKH = `WHERE 
                   
                    X.CREATED_AT BETWEEN '${req.query.fromDate } 00:00:00' AND '${req.query.toDate} 23:59:59' 
                    ${req.query.staff ? `AND X.STAFF = '${req.query.staff}'`: ''}
                    ${req.query.mancc ? `AND X.MANCC = '${req.query.mancc}'` : ''}
    `

    let whereTH = `WHERE 
                  
                    X.CREATED_AT BETWEEN '${req.query.fromDate} 00:00:00' AND '${req.query.toDate} 23:59:59' 
                    ${req.query.staff ? `AND X.STAFF = '${req.query.staff}'`: ''}
                    ${req.query.mancc ? `AND X.MANCC = '${req.query.mancc}'` : ''}
                    `
    req.queryKH2 = getKH2(whereKH, whereTH)

    next()
}, (req, res, next) => {
    new mssql.Request()
        .query(req.queryKH2, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
reports.get('/bckhtuan', (req, res, next) => {
    let whereKH = ` BETWEEN '${req.query.fromDate } 00:00:00' AND '${req.query.toDate} 23:59:59' 
           
`

let whereTH = `'${req.query.stepId }'
            `
req.queryKH2 = getKHtuan(whereKH, whereTH)

next()
}, (req, res, next) => {
new mssql.Request()
.query(req.queryKH2, (err, record) => {
    if (err)
        return res.api.sendFail(getErrorMessage(4907))
    res.api.sendData(record.recordset)
})
})
reports.get('/bckh1', (req, res, next) => {
    let whereKH = `WHERE 
           
            X.CREATED_AT BETWEEN '${req.query.fromDate } 00:00:00' AND '${req.query.toDate} 23:59:59' 
            ${req.query.staff ? `AND X.STAFF = '${req.query.staff}'`: ''}
            ${req.query.mancc ? `AND X.MANCC = '${req.query.mancc}'` : ''}
`

let whereTH = `WHERE 
          
            X.CREATED_AT BETWEEN '${req.query.fromDate} 00:00:00' AND '${req.query.toDate} 23:59:59' 
            ${req.query.staff ? `AND X.STAFF = '${req.query.staff}'`: ''}
            ${req.query.mancc ? `AND X.MANCC = '${req.query.mancc}'` : ''}
            `
req.queryKH1 = getKH1(whereKH, whereTH)

next()
}, (req, res, next) => {
new mssql.Request()
.query(req.queryKH1, (err, record) => {
    if (err)
        return res.api.sendFail(getErrorMessage(4907))
    res.api.sendData(record.recordset)
})
})


let getTongHopNhaCungCap = `SELECT 
TT.SOPHIEU SOPHIEUNHAP,
YEAR(P.CREATED_AT) YEAR,
MONTH(P.CREATED_AT) MONTH,
D.MAKHO MAKHO,


P.CREATED_AT CREATE_AT,
A.FULLNAME NHANVIEN,
PV.NAME,
TT.TYLECHINHPHAM,
TT.KLKHO,
TT.KLQC,
TT.TONGTIENCHUATHUE,
TT.DONGIATB DONGIATB
FROM nlg.PHIEUNHAPKHO P


LEFT JOIN nlg.MAKHO D ON D.MAKHO = P.MAKHO
LEFT JOIN nlg.LOGIN A ON A.USERNAME = P.CREATED_BY
LEFT JOIN nlg.PROVIDERS PV ON PV.CODE = P.MANCC
LEFT JOIN nlg.TINHTIEN TT ON TT.SOPHIEU = P.SOPHIEU

GROUP BY YEAR(P.CREATED_AT),

MONTH(P.CREATED_AT),
D.MAKHO,
TT.SOPHIEU,
P.CREATED_AT,


A.FULLNAME,
PV.NAME,
TT.TYLECHINHPHAM,
TT.KLKHO,
TT.KLQC,
TT.TONGTIENCHUATHUE,
TT.DONGIATB`



function getThongKeKhoNhan() {
    return `select 
    D.MAKHO MAKHO,
    QC.CODE,
    QC.[DAY],
    QC.RONG,
    QC.DAI,
    SUM (PD.SOBO* PD.SOTHANH_BO) TONSOTHANH,
    SUM(PD.SOBO*PD.SOTHANH_BO) KL
    from nlg.PHIEUNHAPKHO P
    left join nlg.MAKHO D on D.MAKHO = P.MAKHO
    left join nlg.PROVIDERS PV ON PV.CODE = P.MANCC
    left join nlg.PHIEUNHAPKHO_DT PD ON PD.SOPHIEUNHAP = P.SOPHIEU
    left join nlg.BOM QC ON QC.CODE = PD.CODE
    
    GROUP BY 
    D.CODE,
    QC.CODE,
    QC.[DAY],
    QC.RONG,
    QC.DAI`
}






let getBaoCaoTongHop = `SELECT 
P.SOPHIEU SOPHIEUNHAP,
YEAR(P.CREATED_AT) YEAR,
MONTH(P.CREATED_AT) MONTH,
D.MAKHO MAKHO,
QC.CODE ,
CASE WHEN (PD.DAY = 55 and PD.RONG = 55) then 
ROUND((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO*3.14/4000000000),4)
else 
(CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000) END AS KLKHO,
P.CREATED_AT CREATE_AT
FROM nlg.PHIEUNHAPKHO P
LEFT JOIN nlg.PHIEUNHAPKHO_DT PD ON PD.SOPHIEUNHAP = P.SOPHIEU
LEFT JOIN nlg.BOM QC ON QC.CODE = PD.CODE
LEFT JOIN nlg.MAKHO D ON D.MAKHO = P.MAKHO

GROUP BY YEAR(P.CREATED_AT),
MONTH(P.CREATED_AT),
(CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000),
D.MAKHO,
P.SOPHIEU,
P.CREATED_AT,

QC.CODE`


function getKH1(wkh, wth) {
    return `SELECT 
    X.[YEAR],
    X.[MONTH],
    X.WEEK,
    X.MAKHO,
   
   '' MANCC,
    X.CREATED_AT,
    
    X.NAME_VENDOR,
    '' ID,
    '' KH2,
    X.KH KH,
    
    '' THUCHIEN
    FROM (
        SELECT
        YEAR(PL.CREATED_AT) YEAR,
        MONTH(PL.CREATED_AT) MONTH,
        DATEPART(WK,PL.CREATED_AT) -1
         WEEK,
        M.MAKHO MAKHO,
       
        PL.PLANQTY KH,
        PL.CREATED_AT,
         
        GQC.NAME NAME_VENDOR
       
        FROM nlg.DINH_MUC_KHO PL
        JOIN nlg.MAKHO M ON M.MAKHO = PL.MAKHO
        LEFT JOIN base.ACCOUNT A ON A.ACCOUNT = PL.CREATED_BY
        LEFT JOIN nlg.GROUP_CODE GQC ON GQC.ID = PL.GROUP_CODE
        LEFT JOIN nlg.BOM QC ON QC.NHOM = GQC.ID
   ) X
    ${wkh}
    GROUP BY
    X.[YEAR],
    X.[MONTH],
    X.WEEK,
    X.MAKHO,
    
    
    X.CREATED_AT,
   
   
  
    X.NAME_VENDOR,
 
    X.KH
    UNION ALL
    SELECT 
    X.[YEAR],
    X.[MONTH],
    X.WEEK,
    X.MAKHO MAKHO,
   X.MANCC,

   X.CREATED_AT,
    
    X.NAME_VENDOR,
   X.ID,
   '' KH2,
    '' KH,
    
    X.THUCHIEN THUCHIEN
    FROM (
        SELECT 
        YEAR(P.CREATED_AT) YEAR,
        MONTH(P.CREATED_AT) MONTH,
        DATEPART(WK,P.CREATED_AT) - 1
        WEEK,
        M.MAKHO MAKHO,
        P.CREATED_AT,
        P.MANCC,
     
        PD.ID,
       
        GQC.NAME NAME_VENDOR,
      
        CASE WHEN (PD.DAY = 55 and PD.RONG = 55) then 
        ROUND((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO*3.14/4000000000),4)
        else 
        ROUND((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000),4) END AS THUCHIEN
        FROM nlg.PHIEUNHAPKHO_DT PD
        JOIN nlg.PHIEUNHAPKHO P ON P.SOPHIEU = PD.SOPHIEUNHAP
     
        JOIN nlg.MAKHO M ON M.MAKHO = P.MAKHO
       
        JOIN nlg.GROUP_CODE GQC ON GQC.ID = PD.CODENHOM
        LEFT JOIN nlg.BOM QC ON QC.NHOM = GQC.ID
    where PD.DEL_FLAG = 'N' and PD.DELAI = 'N' ) X
     ${wth}
    GROUP BY X.[YEAR],
    X.[MONTH],
    X.WEEK,

   X.MAKHO,
 
   X.MANCC,
  
 
  X.CREATED_AT,
   
    X.NAME_VENDOR,
    X.ID,
    
    
    X.THUCHIEN
    UNION ALL
    SELECT 
    X.[YEAR],
    X.[MONTH],
    X.WEEK,
     '' MAKHO,
     X.MANCC,
   
    X.CREATED_AT,
   
    X.NAME_VENDOR,
    X.ID,
    
    X.KH2 KH2,
    '' KH,
    '' THUCHIEN
    FROM (
        SELECT
        YEAR(PL.CREATED_AT) YEAR,
        MONTH(PL.CREATED_AT) MONTH,
         DATEPART(WK,PL.CREATED_AT) - 1
        WEEK,
      
        PL.MANCC MANCC,
        PL.PLANQTY KH2,
        PL.CREATED_AT,
      PL.ID,
        GQC.NAME NAME_VENDOR
       
        FROM nlg.PLAN_NLG PL
        LEFT JOIN nlg.PROVIDERS PV ON PV.CODE = PL.MANCC
        LEFT JOIN base.ACCOUNT A ON A.ACCOUNT = PL.CREATE_BY
      
        LEFT JOIN nlg.GROUP_CODE GQC ON GQC.ID = PL.GROUP_CODE
        LEFT JOIN nlg.BOM QC ON QC.NHOM = GQC.ID
   ) X
    ${wkh}
    GROUP BY
    X.[YEAR],
    X.[MONTH],
    X.WEEK,
   
    X.MANCC,
    
    X.CREATED_AT,
   
    
  
    X.NAME_VENDOR,
 X.ID,
    X.KH2
    
    `
}




function getKH2(wkh, wth) {
    return `SELECT 
    X.[YEAR],
    X.[MONTH],
    X.WEEK,
    '' MAKHO,
    X.MANCC,
   X.NAME,
    X.CREATED_AT,
    X.CODE_VENDOR,
    X.NAME_VENDOR,
    X.ID,
    X.STAFF,
    X.KH KH,
    '' THUCHIEN
    FROM (
        SELECT
        YEAR(PL.CREATED_AT) YEAR,
        MONTH(PL.CREATED_AT) MONTH,
       DATEPART(WK,PL.CREATED_AT) - 1
         WEEK,
        PL.MANCC MANCC,
        PV.NAME,
        PL.PLANQTY KH,
        PL.ID,
        PL.CREATED_AT,
        PV.CODE CODE_VENDOR,
        GQC.NAME NAME_VENDOR,
        PL.CREATE_BY STAFF
        FROM nlg.PLAN_NLG PL
        LEFT JOIN nlg.PROVIDERS PV ON PV.CODE = PL.MANCC
        LEFT JOIN base.ACCOUNT A ON A.ACCOUNT = PL.CREATE_BY
        LEFT JOIN nlg.GROUP_CODE GQC ON GQC.ID = PL.GROUP_CODE
        LEFT JOIN nlg.BOM QC ON QC.NHOM = GQC.ID
    where PL.DEL_FLAG = 'N') X
    ${wkh}
    GROUP BY
    X.[YEAR],
    X.[MONTH],
    X.WEEK,
    X.MANCC,
    
    X.NAME,
    X.CREATED_AT,
    X.KH,
   
    X.CODE_VENDOR,
    X.NAME_VENDOR,
    X.ID,
    X.STAFF,
    X.KH
    UNION ALL
    SELECT 
    X.[YEAR],
    X.[MONTH],
    X.WEEK,
    X.MAKHO MAKHO,
   X.MANCC,
   X.NAME,
   X.CREATED_AT,
    X.CODE_VENDOR,
    X.NAME_VENDOR,
   X.ID,
    X.STAFF,
    '' KH,
    X.THUCHIEN THUCHIEN
    FROM (
        SELECT 
        YEAR(P.CREATED_AT) YEAR,
        MONTH(P.CREATED_AT) MONTH,
       DATEPART(WK,P.CREATED_AT) - 1
         WEEK,
        P.MAKHO MAKHO,
        P.CREATED_AT,
        P.MANCC MANCC,
        PV.NAME,
        PD.ID,
        PD.CODE CODE_VENDOR,
        GQC.NAME NAME_VENDOR,
        PV.STAFF STAFF,
        CASE WHEN (PD.DAY = 55 and PD.RONG = 55) then 
        ROUND((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO*3.14/4000000000),4)
        else 
        ROUND((CAST(PD.SOBO AS float)*PD.SOTHANH_BO*PD.DAY*PD.RONG*PD.CAO/1000000000),4) END THUCHIEN
        FROM nlg.PHIEUNHAPKHO_DT PD
        JOIN nlg.PHIEUNHAPKHO P ON P.SOPHIEU = PD.SOPHIEUNHAP
        JOIN nlg.PROVIDERS PV ON PV.CODE = P.MANCC
        
       
        JOIN nlg.GROUP_CODE GQC ON GQC.ID = PD.CODENHOM
        LEFT JOIN nlg.BOM QC ON QC.NHOM = GQC.ID
    where PD.DEL_FLAG = 'N' and PD.DELAI = 'N' ) X
     ${wth}
    GROUP BY X.[YEAR],
    X.[MONTH],
    X.WEEK,
    X.MANCC,
   X.MAKHO,
 
  
  
   X.NAME,
  X.CREATED_AT,
    X.CODE_VENDOR,
    X.NAME_VENDOR,
    X.ID,
    X.STAFF,
    
    X.THUCHIEN
    
    `
}
function getKHtuan(wkh, wth) {
    return `select * from (
        select * from	(select paren,ITEM_ID,stepId,sum(QUANTITY) AS xuat,WEEK, 0 loi,tenCT,tenCongDoan from
            (SELECT    B.paren,  iip.ITEM_ID ITEM_ID, p.SOURCE_ID AS stepId, iip.QUANTITY AS QUANTITY, DATEPART(WK,p.CREATE_DATE) - 1
            WEEK,i.NAME tenCT,DA.NAME tenCongDoan
            FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                     prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
                                     LEFT JOIN prod.PO on PO.code = p.PO
                                     left join base.ITEM i on i.ID = iip.ITEM_ID
                                     left join base.DEPARTMENT DA ON DA.ID = p.SOURCE_ID
                                     LEFT JOIN (select DISTINCT * from dbo.View_SP) B on B.ITEM_ID = iip.ITEM_ID and B.STEP_ID = p.SOURCE_ID
            WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL)  and (p.CREATE_DATE ${wkh}) 
            and p.TYPE_ID = 100026) D
            group by  paren, ITEM_ID, stepId,WEEK,tenCT,tenCongDoan
        )  b
        union all
        select * from
        (select B.paren,k.ITEM_ID,k.stepId,xuat,WEEK,loi,i.NAME tenCT,DA.NAME tenCongDoan from
       ( select itemId ITEM_ID,stepId,0 xuat,DATEPART(WK,createdAt) - 1 WEEK,quantity loi from prod.HandleQc where createdAt ${wkh})
        
         k
         LEFT JOIN (select DISTINCT * from dbo.View_SP) B on B.ITEM_ID = k.ITEM_ID and B.STEP_ID = k.stepId 
         left join base.ITEM i on i.ID = k.ITEM_ID
         left join base.DEPARTMENT DA ON DA.ID = k.stepId) n) m
    
        
        where paren is not null  and stepId = ${wth}
    
    `
}

module.exports = reports