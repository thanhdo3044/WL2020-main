const XlsxPopulate = require('xlsx-populate')
const encode_cell = require('xlsx').utils.encode_cell
const mssql = require('mssql')

const express = require('express')
const router = express.Router()
const {
    getView_raw_data
} = require('./../../core/query')
const {
    getErrorMessage
} = require('./../../core/config')

Date.prototype.getWeekNumber = function() {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

router.get('/', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year || new Date().getFullYear())
        .input('WEEK', req.query.week || new Date().getWeekNumber())
        .query(getView_raw_data, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            let table = record.recordset.toTable()
            let header = []
            table.columns.forEach(e => {
                header.push(e.name)
            })
            let data = table.rows
            data.unshift(header)

            XlsxPopulate.fromBlankAsync()
                .then(async(workbook) => {
                    workbook.sheet(0).range(`A1:${encode_cell({
                c: data[0].length + 1,
                r: data.length + 1
            })}`).value(data)
                    const buf = await workbook.outputAsync()
                    res.setHeader('content-disposition', 'attachment; filename="Report.xlsx"')
                    res.setHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    res.attachment("Báo cáo.xlsx");
                    res.send(buf)
                })
        })
})

router.get('/raw', (req, res, next) => {
    new mssql.Request()
        .input('FACTORY_ID', req.query.factoryId)
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .query(`
        WITH temp(id)
        as (
                Select id
                From base.DEPARTMENT
                Where ID = @FACTORY_ID
                Union All
                Select b.id
                From temp as a, base.DEPARTMENT as b
                Where a.id = b.parent_id
        )
        Select v.*, v.Tổ as tonhom, gd.[ORDER], convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, 
		gd.NAME groupDepartment, d2.NAME departmentName, '['+d2.CODE+'] '+ d2.NAME departmentName2
        From temp D
		LEFT JOIN View_raw_data V ON V.DEPARTMENT_ID = D.ID
		INNER JOIN base.DEPARTMENT D2 ON V.DEPARTMENT_ID = D2.id
		INNER JOIN prod.GROUP_DEPARTMENT GD ON D2.id = GD.DEPARTMENT_ID
		WHERE [ngaygiao] BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
        order by [ngaygiao]
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.get('/raw2', (req, res, next) => {
    let query = ""
    if(req.query.type == "daNhan"){
        query = `
        WITH temp(id)
        as (
                Select id
                From base.DEPARTMENT
                Where ID = @FACTORY_ID
                Union All
                Select b.id
                From temp as a, base.DEPARTMENT as b
                Where a.id = b.parent_id
        )
        Select v.*, v.Tổ as tonhom, gd.[ORDER], convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, 
		gd.NAME groupDepartment, d2.NAME departmentName, '['+d2.CODE+'] '+ d2.NAME departmentName2
        From temp D
		LEFT JOIN View_raw_data V ON V.DEPARTMENT_ID = D.ID
		INNER JOIN base.DEPARTMENT D2 ON V.DEPARTMENT_ID = D2.id
		INNER JOIN prod.GROUP_DEPARTMENT GD ON D2.id = GD.DEPARTMENT_ID
		WHERE [ngaygiao] BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
        order by [ngaygiao]
        `
    }else{
        query = `
        WITH temp(id)
        as (
                Select id
                From base.DEPARTMENT
                Where ID = @FACTORY_ID
                Union All
                Select b.id
                From temp as a, base.DEPARTMENT as b
                Where a.id = b.parent_id
        )
        Select v.*, v.Tổ as tonhom, gd.[ORDER], convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, 
		gd.NAME groupDepartment, d2.NAME departmentName, '['+d2.CODE+'] '+ d2.NAME departmentName2
        From temp D
		LEFT JOIN View_raw_data_2 V ON V.DEPARTMENT_ID = D.ID
		INNER JOIN base.DEPARTMENT D2 ON V.DEPARTMENT_ID = D2.id
		INNER JOIN prod.GROUP_DEPARTMENT GD ON D2.id = GD.DEPARTMENT_ID
		WHERE [ngaygiao] BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
        order by [ngaygiao]
        `
    }
    new mssql.Request()
        .input('FACTORY_ID', req.query.factoryId)
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .query(query, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.post('/raw/delete1', (req, res, next) => {
    new mssql.Request()
        .input('packageId', req.body.packageId)
        .query(`
        delete prod.PACKAGE where id = @packageId
        select ID from prod.ITEM_IN_PACKAGE where PACKAGE_ID = @packageId
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.post('/raw/delete2', (req, res, next) => {
    new mssql.Request()
        .input('packageId', req.body.packageId)
        .input('itemInPackageId', req.body.itemInPackageId)
        .query(`
        delete prod.ITEM_IN_PACKAGE where PACKAGE_ID = @packageId
        delete prod.MATERIALS_IN_PACKAGE where ITEM_IN_PACKAGE_ID = @itemInPackageId
        select ID from prod.ITEM_IN_PACKAGE where PACKAGE_ID = @packageId
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


router.get('/week2', (req, res, next) => {
    const {
        week,
        year,
        factoryId
    } = req.query

    new mssql.Request()
        .input('week', week)
        .input('year', year)
        .input('factoryId', factoryId)

    .query(` 
    select DISTINCT po.number, pcd.approvedByAccount from prod.PO 
left join prod.PHIEU_CHI_DINH pcd on po.number = pcd.number
where po.factoryId = @factoryId and po.week = @week
        and po.year = @year and po.approvedByAccount is not null
`).then(async result => {
        console.log('res', result)
        res.api.sendData(result.recordset)
    })
})
router.get('/week2/xuat-go', (req, res, next) => {
    const {
        fromWeek,
        toWeek,
        year,
        factoryId
    } = req.query

    new mssql.Request()
        .input('fromWeek', fromWeek)
        .input('toWeek', toWeek)
        .input('year', year)
        .input('factoryId', factoryId)

    .query(` 
    select DISTINCT po.number, pcd.approvedByAccount from prod.PO 
left join prod.PHIEU_CHI_DINH pcd on po.number = pcd.number
where po.factoryId = @factoryId and po.week between @fromWeek and @toWeek
        and po.year = @year
`).then(async result => {
        console.log('res', result)
        res.api.sendData(result.recordset)
    })
})
router.get('/week22', (req, res, next) => {
    const {
        week,
        year,
        factoryId
    } = req.query

    new mssql.Request()
        .input('week', week)
        .input('year', year)
        .input('factoryId', factoryId)

    .query(` 
    select distinct number + ' ' + CONVERT(nvarchar, BX) label, BX, number, approvedByAccount  
		from prod.PHIEU_CHI_DINH where factoryId = @factoryId and week = @week and year = @year
`).then(async result => {
        console.log('res', result)
        res.api.sendData(result.recordset)
    })
})
router.get('/lsxchuaduyet', (req, res, next) => {
    const {
        week,
        year,
        factoryId
    } = req.query

    new mssql.Request()
       
        .input('year', year)
        .input('factoryId', factoryId)

    .query(` select DISTINCT number,endPO,approvedByAccount,KH_approvedByAccount from prod.PO where factoryId = @factoryId
        and year = @year`).then(async result => {
        console.log('res', result)
        res.api.sendData(result.recordset)
    })
})
router.get('/ton-son', (req, res, next) => {
    const {
        week,
        year,
        factoryId
    } = req.query

    new mssql.Request()
    .input('week', week)
        .input('year', year)
        .input('factoryId', factoryId)

    .query(` select * from [prod].[KHAI_TON_SON] where factoryId = @factoryId
        and DATEPART(YEAR,CREATED_DATE) = @year and DATEPART(WEEK,CREATED_DATE) = @week`).then(async result => {
    
        res.api.sendData(result.recordset)
    })
})
router.get('/WEEKDEPARTMENT', (req, res, next) => {
    const {
        week,
        year,
        factoryId
    } = req.query

    new mssql.Request()
        .input('week', week)
        .input('year', year)
        .input('factoryId', factoryId)

    .query(`  select
    condoan,  [thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn],[WEEK_PO],
        DEPARTMENT_ID
   from 
   (
                   select  case	
       when DATEPART(WEEKDAY,pg.CREATE_DATE) = 2 then 'Thu2'
       when DATEPART(WEEKDAY,pg.CREATE_DATE) = 3 then 'Thu3'
       when DATEPART(WEEKDAY,pg.CREATE_DATE) = 4 then 'Thu4'
       when DATEPART(WEEKDAY,pg.CREATE_DATE) = 5 then 'Thu5'
       when DATEPART(WEEKDAY,pg.CREATE_DATE) = 6 then 'Thu6'
       when DATEPART(WEEKDAY,pg.CREATE_DATE) = 7 then 'Thu7'
       else 'cn' 
   end as [thu], XUAT tong,DEPARTMENT_ID,condoan,
   DATEPART(WEEK,pg.CREATE_DATE) as [WEEK_PO]
   from  (SELECT condoan, DEPARTMENT_ID,ITEM_ID,CREATE_DATE,QUANTITY XUAT,NAME
                   FROM (
                      
                       SELECT P.SOURCE_ID  DEPARTMENT_ID,dp.NAME condoan,  IIP.ITEM_ID
                       
                   AS ITEM_ID,   IIP.QUANTITY*I.VOLUMN
                       AS QUANTITY,case when DATEPART(WEEKDAY,P.CREATE_DATE) = 1
                       then DATEADD(day,-7,P.CREATE_DATE) else
                       P.CREATE_DATE END AS CREATE_DATE,P.ID,dp.NAME
                     FROM prod.PACKAGE P
                     LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                     left join base.ITEM I on I.ID = IIP.ITEM_ID
                      left join base.DEPARTMENT as dp on dp.id = P.SOURCE_ID
                     WHERE  DATEPART(YEAR,P.CREATE_DATE) = @year AND  P.TYPE_ID = 100026 and dp.factoryId = @factoryId
                   ) L0 where DATEPART(WEEK,L0.CREATE_DATE) = @week) pg                                                                                  	                           
                   ) a					
   pivot (
       sum(a.tong) for a.thu in ([thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn])
   ) as b
       order by condoan`).then(async result => {
        console.log('res', result)
        res.api.sendData(result.recordset)
    })
})
router.get('/weekin', (req, res, next) => {
    const {
        week,
        year,
        factoryId,
        number
    } = req.query
    const {
        departmentId
    } = req.query
    new mssql.Request()
        .input('week', week)
        .input('year', year)
        .input('factoryId', factoryId)
        .input('departmentId', departmentId)
        .input('number', number)
        .query(`
        select 
	
        [item_parent],[ten san pham],[HEIGHT],[WIDTH],[LENGTH],[KeHoach],dvt,[thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn],[WEEK_PO],
        [UNIT_ID], volumn,congdoan, 0 as TONGKL
    from 
    (
                    select  C.NAME [ten san pham],case	
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 2 then 'Thu2'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 3 then 'Thu3'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 4 then 'Thu4'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 5 then 'Thu5'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 6 then 'Thu6'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 7 then 'Thu7'
        else 'cn' 
    end as [thu],D.[NAME] congdoan, paren [item_parent],XUAT  tong,P.conThucHien [KeHoach],i.HEIGHT as [HEIGHT],i.WIDTH as [WIDTH],i.LENGTH as [LENGTH],U.NAME as dvt,
    DATEPART(WEEK,pg.CREATE_DATE) as [WEEK_PO],DATEPART(YEAR,pg.CREATE_DATE) as [UNIT_ID],i.volumn
    from ( select DISTINCT NAME,ITEM_ID,paren,paren_id from dbo.View_SP ) C
    left join base.DEPARTMENT D ON  D.ID = @departmentId 
    left join base.ITEM as i on i.id = C.ITEM_ID
    left join base.UNIT U ON U.ID = i.UNIT_ID
                    left join (SELECT DEPARTMENT_ID,ITEM_ID,CREATE_DATE,QUANTITY XUAT,NAME
                    FROM (
                       
                        SELECT P.SOURCE_ID  DEPARTMENT_ID,  IIP.ITEM_ID
                        
                    AS ITEM_ID,   IIP.QUANTITY
                        AS QUANTITY,P.CREATE_DATE,P.ID,dp.NAME
                      FROM prod.PACKAGE P
                      LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                   
                       left join base.DEPARTMENT as dp on dp.id = P.SOURCE_ID
                      WHERE DATEPART(WEEK,P.CREATE_DATE) = @week AND DATEPART(YEAR,P.CREATE_DATE) = @year AND  P.TYPE_ID = 100026
                    ) L0
          
                    ) pg ON pg.DEPARTMENT_ID = @departmentId and pg.ITEM_ID = C.ITEM_ID
                    LEFT JOIN
    
    (select itemId,itemCode,itemName,stepId,itemLength,itemWidth,itemHeight,case when conThucHien <0 then 0 else conThucHien end conThucHien from (
      select
    
                         I.ID itemId,
                         I.CODE itemCode,
                         I.NAME itemName,
                         D.ID stepId,
                         I.LENGTH itemLength,
                         I.WIDTH itemWidth,
                         I.HEIGHT itemHeight,
                         
                        
                        
                         SUM(ROUND(PO.keHoach - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon + PO.loiCongDon -(CASE
                             WHEN SL.quantity IS NULL THEN 0
                             ELSE ROUND(SL.quantity,6)
                         END),6)) conThucHien
                        
                         
                         from prod.PO PO
                         left join base.ITEM I ON I.ID = PO.itemId
                     
                         left join base.DEPARTMENT D ON D.ID  = PO.stepId
                        
                     
                         LEFT JOIN (
                             select P.PO,SUM(IIP.QUANTITY) quantity
                             from prod.PACKAGE P
                             left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                             left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                             WHERE 
                             (PT.TYPE_ID <> 100000 OR PT.TYPE_ID IS NULL)
                             AND (PT.TYPE_ID <> 400000 OR PT.TYPE_ID IS NULL) AND DATEPART(WEEK,P.CREATE_DATE) <@week AND DATEPART(YEAR,P.CREATE_DATE) = @year
                             GROUP BY P.PO
                         ) SL ON SL.PO = PO.code
                   
                 where  approvedAt is not null and deletedAt is null and PO.stepId = @departmentId and PO.year >=2021 and PO.endPO = 0 and PO.number = @number
                 GROUP BY 
               
                 I.ID,
                 I.CODE ,
                 I.NAME ,
                 I.LENGTH ,
                 D.ID,
                 I.WIDTH ,
                 I.HEIGHT 
         
                
     ) as x
   ) P ON P.itemId = C.ITEM_ID and P.stepId = @departmentId
   
                     where  P.conThucHien is not null 
                     
                    ) a
                    
    pivot (
        sum(a.tong) for a.thu in ([thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn])
    ) as b

`).then(async result => {
            console.log('res', result)
            res.api.sendData(result.recordset)
        })

})
router.get('/week3', (req, res, next) => {
    const {
        week,
        year,
        factoryId
    } = req.query
    const {
        departmentId
    } = req.query
    new mssql.Request()
        .input('week', week)
        .input('year', year)
        .input('factoryId', factoryId)
        .input('departmentId', departmentId)
        .query(`
        select 
	
        [item_parent],[ten san pham],[HEIGHT],[WIDTH],[LENGTH],[KeHoach],dvt,[thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn],[WEEK_PO],
        [UNIT_ID], volumn,congdoan, 0 as TONGKL,loi,0 TT,0 KLTT
    from 
    (
                    select  C.NAME [ten san pham],case	
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 2 then 'Thu2'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 3 then 'Thu3'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 4 then 'Thu4'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 5 then 'Thu5'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 6 then 'Thu6'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 7 then 'Thu7'
        else 'cn' 
    end as [thu],D.[NAME] congdoan, CONCAT(paren,'( MKT:',ip.ACCOUNTING_CODE,')') [item_parent],XUAT  tong,P.conThucHien [KeHoach],i.HEIGHT as [HEIGHT],i.WIDTH as [WIDTH],i.LENGTH as [LENGTH],U.NAME as dvt,
    DATEPART(WEEK,pg.CREATE_DATE) as [WEEK_PO],DATEPART(YEAR,pg.CREATE_DATE) as [UNIT_ID],i.volumn,HA.loi
    from ( select DISTINCT NAME,ITEM_ID,paren,paren_id from [prod].[STEP_ITEM_SP]) C
    left join base.DEPARTMENT D ON  D.ID = @departmentId 
    left join base.ITEM as i on i.id = C.ITEM_ID
    left join base.ITEM as ip on ip.id = C.paren_id
    left join base.UNIT U ON U.ID = i.UNIT_ID
                    left join (SELECT DEPARTMENT_ID,ITEM_ID,CREATE_DATE,QUANTITY XUAT,NAME
                    FROM (
                       
                        SELECT P.SOURCE_ID  DEPARTMENT_ID,  IIP.ITEM_ID
                        
                    AS ITEM_ID,   IIP.QUANTITY
                        AS QUANTITY, case when DATEPART(WEEKDAY,P.CREATE_DATE) = 1
                        then DATEADD(day,-7,P.CREATE_DATE) else
                        P.CREATE_DATE END AS CREATE_DATE,P.ID,dp.NAME
                      FROM prod.PACKAGE P
                      LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                   
                       left join base.DEPARTMENT as dp on dp.id = P.SOURCE_ID
                      WHERE  DATEPART(YEAR,P.CREATE_DATE) = @year AND  P.TYPE_ID = 100026
                    ) L0
                      where DATEPART(WEEK,L0.CREATE_DATE) = @week
                    ) pg ON pg.DEPARTMENT_ID = @departmentId and pg.ITEM_ID = C.ITEM_ID
                    LEFT JOIN
    
    (select itemId,itemCode,itemName,stepId,itemLength,itemWidth,itemHeight,case when conThucHien <0 then 0 else conThucHien end conThucHien from (
      select
    
                         I.ID itemId,
                         I.CODE itemCode,
                         I.NAME itemName,
                         D.ID stepId,
                         I.LENGTH itemLength,
                         I.WIDTH itemWidth,
                         I.HEIGHT itemHeight,
                         
                        
                        
                         SUM(ROUND(PO.keHoach - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon + PO.loiCongDon -(CASE
                             WHEN SL.quantity IS NULL THEN 0
                             ELSE ROUND(SL.quantity,6)
                         END),6)) conThucHien
                        
                         
                         from prod.PO PO
                         left join base.ITEM I ON I.ID = PO.itemId
                     
                         left join base.DEPARTMENT D ON D.ID  = PO.stepId
                        
                     
                         LEFT JOIN (
                             select P.PO,SUM(IIP.QUANTITY) quantity
                             from prod.PACKAGE P
                             left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                             left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                             WHERE 
                             P.TYPE_ID = 100026 AND DATEPART(WEEK,P.CREATE_DATE) <@week AND DATEPART(YEAR,P.CREATE_DATE) = @year
                             GROUP BY P.PO
                         ) SL ON SL.PO = PO.code
                   
                 where  approvedAt is not null  and deletedAt is null and PO.stepId = @departmentId and PO.year >=2021 and endPO = 0
                 GROUP BY 
               
                 I.ID,
                 I.CODE ,
                 I.NAME ,
                 I.LENGTH ,
                 D.ID,
                 I.WIDTH ,
                 I.HEIGHT 
         
                
     ) as x
   ) P ON P.itemId = C.ITEM_ID
   left join (select stepId,itemId,SUM(quantity) loi from prod.HandleQc
   where DATEPART(WEEK,createdAt) = @week and DATEPART(YEAR,createdAt) = @year
   group by stepId,itemId ) HA ON HA.stepId = @departmentId and HA.itemId = C.ITEM_ID
   
                     where  P.conThucHien is not null
                     
                    ) a
                    
    pivot (
        sum(a.tong) for a.thu in ([thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn])
    ) as b

`).then(async result => {
            console.log('res', result)
            res.api.sendData(result.recordset)
        })

})
router.get('/week4', (req, res, next) => {
    const {
        week,
        ngay,
        year,
        factoryId
    } = req.query
    const {
        departmentId
    } = req.query
    let hi = [];
    new mssql.Request()
        .input('week', week)
        .input('ngay', ngay)
        .input('year', year)
        .input('factoryId', factoryId)
        .input('departmentId', departmentId)
        .query(`
        select 
	
        [item_parent],[ten san pham],[HEIGHT],[WIDTH],[LENGTH],[KeHoach],dvt,[thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn],[WEEK_PO],
        [UNIT_ID], volumn,congdoan,stepId STEP_ID, 0 as TONGKL,loi,0 TT,0 KLTT,ACCOUNTING_CODE,chungloai
    from 
    (
                    select  case when P.stepId in (100270,100273,100282,102747,102746,102812,102829) 
                    then i.ACCOUNTING_CODE else null end as ACCOUNTING_CODE,
                    P.itemName  [ten san pham],case	
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 2 then 'Thu2'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 3 then 'Thu3'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 4 then 'Thu4'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 5 then 'Thu5'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 6 then 'Thu6'
        when DATEPART(WEEKDAY,pg.CREATE_DATE) = 7 then 'Thu7'
        else 'cn' 
    end as [thu],D.[NAME] congdoan,P.factoryId,P.stepId, P.paren [item_parent],XUAT  tong,P.conThucHien [KeHoach],i.HEIGHT as [HEIGHT],i.WIDTH as [WIDTH],i.LENGTH as [LENGTH],U.NAME as dvt,
    DATEPART(WEEK,pg.CREATE_DATE) as [WEEK_PO],DATEPART(YEAR,pg.CREATE_DATE) as [UNIT_ID],i.volumn,HA.loi,TY.NAME chungloai
    from 
    
    (select factoryId,itemId,itemCode,itemName,stepId,itemLength,itemWidth,itemHeight,paren,case when conThucHien <0 then 0 else conThucHien end conThucHien from (
    select itemId,itemCode,itemName,stepId,itemLength,itemWidth,itemHeight,factoryId,paren,sum(conThucHien) conThucHien from
      (select
    
                         I.ID itemId,
                         I.CODE itemCode,
                         I.NAME itemName,
                         D.ID stepId,
                         I.LENGTH itemLength,
                         I.WIDTH itemWidth,
                         I.HEIGHT itemHeight,
                         PO.factoryId,
                        case when PO.stepId in (100270,100273,100282,102747,102746,102812,102829,102857) then M.NAME else I1.NAME end as paren,
                        
                        ROUND(PO.keHoach - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon + PO.loiCongDon -(CASE
                             WHEN SL.quantity IS NULL THEN 0
                             ELSE ROUND(SL.quantity,6)
                         END),6) conThucHien
                        
                         
                         from prod.PO PO
                         left join base.ITEM I ON I.ID = PO.itemId
                     
                         left join base.DEPARTMENT D ON D.ID  = PO.stepId
                        left join base.MARKET M on M.CODE = PO.[root]
                        left join base.ITEM I1 ON I1.ID = M.PRODUCT_ID
                     
                         LEFT JOIN (
                             select P.PO,SUM(IIP.QUANTITY) quantity
                             from prod.PACKAGE P
                             left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                             left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                             WHERE 
                             P.TYPE_ID = 100026 AND P.CREATE_DATE < @ngay
                             GROUP BY P.PO
                         ) SL ON SL.PO = PO.code
                   
                 where  approvedAt is not null  and deletedAt is null and PO.year >=2021 ) k
                 GROUP BY 
               
itemId,itemCode,itemName,stepId,itemLength,itemWidth,itemHeight,factoryId,paren                 
                
     ) as x
   ) P 
left join (SELECT DEPARTMENT_ID,ITEM_ID,CREATE_DATE,QUANTITY XUAT,NAME,paren
                    FROM (
                       
                        SELECT P.SOURCE_ID  DEPARTMENT_ID,  IIP.ITEM_ID
                        
                    AS ITEM_ID,   IIP.QUANTITY
                        AS QUANTITY, case when DATEPART(WEEKDAY,P.CREATE_DATE) = 1
                        then DATEADD(day,-7,P.CREATE_DATE) else
                        P.CREATE_DATE END AS CREATE_DATE,P.ID,dp.NAME
                        ,  case when PO.stepId in (100270,100273,100282,102747,102746,102812,102829,102857) then M.NAME else I1.NAME end as paren
                      FROM prod.PACKAGE P
                      LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                      left join prod.PO PO on PO.code =  P.PO
                         left join base.MARKET M on M.CODE = PO.[root]
                        left join base.ITEM I1 ON I1.ID = M.PRODUCT_ID
                       left join base.DEPARTMENT as dp on dp.id = P.SOURCE_ID
                      WHERE  DATEPART(YEAR,P.CREATE_DATE) = @year AND  P.TYPE_ID = 100026
                    ) L0
                      where DATEPART(WEEK,L0.CREATE_DATE) = @week
                    ) pg ON pg.DEPARTMENT_ID = P.stepId and pg.ITEM_ID = P.itemId and pg.paren = P.paren
   left join (select stepId,itemId,SUM(quantity) loi from prod.HandleQc
   where DATEPART(WEEK,createdAt) = @week and DATEPART(YEAR,createdAt) = @year
   group by stepId,itemId ) HA ON HA.stepId = P.stepId and HA.itemId = P.itemId
    left join base.DEPARTMENT D ON  D.ID = P.stepId
    left join base.ITEM as i on i.id = P.itemId
    left join base.ITEM_TYPE TY on TY.ID = i.TYPE_ID
   -- left join base.ITEM as ip on ip.id = C.paren_id
    left join base.UNIT U ON U.ID = i.UNIT_ID
                     where  P.conThucHien >=0 and P.paren is not null and P.stepId is not null
                     
                    ) a
                    
    pivot (
        sum(a.tong) for a.thu in ([thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn])
    ) as b

`).then(async result => {
            console.log('res', result)
            res.api.sendData(result.recordset)
        })
})
router.get('/ty-le-dong-bo', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('WEEK', req.query.week)
        .input('DEPARTMENT_ID', req.query.departmentId)
        .query(getTyLeDongBo, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.get('/date', (req, res, next) => {
    new mssql.Request()
        .input('FROM', `${req.query.from} 00:00:00`)
        .input('TO', `${req.query.to} 23:59:59`)
        .query(getReportByDate, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset.filter(i => i.factoryId == req.query.factoryId))
        })
})


router.get('/week', (req, res, next) => {
    const {
        week,
        year,
        factoryId
    } = req.query
// let query = `
// SELECT --Kb.ID,
//         CONCAT(KB.NUMBER,'.',KB.WEEK,'.',KB.[YEAR]) N'Mã mẻ',
//         K.NAME 'NAME',
//         CONCAT(K.NAME,'(',CONVERT(varchar,KB.CREATE_DATE,103),')') lo,
//         KB.HEIGHT N'Chiều dày phôi',
//         KB.[TYPE] N'Loại phôi',
//         L2.ten item,
//         L2.GROUP_QC nhom,
//         CONCAT(L2.tenQC,' : ',L2.DAY,'x',L2.RONG,'x',L2.DAI) tenQC,
//         ROUND(L2.M3,2) N'QUANTITYM3',
//         L2.SL QUANTITY,
//         C.LAST_NAME nguoitao,
//         X.LAST_NAME N'Người ra lò',
//         KB.CREATE_DATE N'Ngày tạo',
//         CAST(KB.CREATE_DATE + KB.TIME_OUT_TARGET AS DATE) N'Dự kiến',
//         CAST(KB.EXPORT_DATE AS DATE) N'Thực tế',
//         CASE
//             WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
//             WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
//             WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
//             ELSE KB.[STATUS]
//             END AS N'Trangthai'
//         FROM prod.KILN_BATCH KB
//         LEFT JOIN prod.KILN K ON K.ID= KB.KILN_ID
//         LEFT JOIN base.ACCOUNT C ON C.ID = KB.CREATE_BY
//         LEFT JOIN base.ACCOUNT X ON X.ID = KB.EXPORT_BY
//         LEFT JOIN (
//             SELECT L1.ID,SUM(L1.M3) M3,L1.NAME ten,L1.tenQC,SUM(L1.SL) SL,L1.GROUP_QC,
//             L1.DAY,L1.DAI,L1.RONG
//             FROM(
//                 SELECT 
//                 KB.ID,
//                 IIP.ITEM_ID,
//                 I.NAME,
//                 B.NAME tenQC,B.DAI,B.RONG,B.DAY,
//                 B.GROUP_QC,
//                 SUM(IIP.QUANTITY) * I.VOLUMN M3,
//                 SUM(IIP.QUANTITY) SL
//                 FROM prod.KILN_BATCH KB
//                 LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
//                 LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
//                 LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
//                 LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
//                 left join nlg.BOM B on B.DAI = I.LENGTH and B.RONG = I.WIDTH and B.DAY = I.HEIGHT
//                 GROUP BY     KB.ID,
//                 IIP.ITEM_ID,I.NAME,B.NAME,B.GROUP_QC,B.DAI,B.RONG,B.DAY,
//                 I.VOLUMN
//             ) L1
//             GROUP BY L1.ID,L1.NAME,L1.tenQC,L1.GROUP_QC,L1.DAY,L1.DAI,L1.RONG
//         ) L2 ON L2.ID = KB.ID
//         WHERE 
//          K.FACTORY_ID =@factoryId and KB.[STATUS] = 'process' and L2.tenQC is not null
// `;
    new mssql.Request()

    .query(`
    DECLARE 
    @columns NVARCHAR(MAX) = '',
       @columns1 NVARCHAR(MAX) = '',
       @factoryId int = ${req.query.factoryId},
       @process NVARCHAR(MAX) = 'process',
       @sql     NVARCHAR(MAX) = '';
   
   
   WITH temp(NAME,NAME1)
     as (
       select concat(k.CODE,5) CODE,k.CODE CODE1
   from prod.KILN_BATCH kb
   inner join prod.KILN k on kb.KILN_ID = k.ID
   where STATUS = 'process' and k.FACTORY_ID = @factoryId
     )
   SELECT 
       @columns+=QUOTENAME(NAME) + ',',
          @columns1+=QUOTENAME(NAME1) + ','
   FROM 
       temp
   ORDER BY 
       NAME;
   
   -- remove the last comma
   SET @columns = LEFT(@columns, LEN(@columns) - 1);
   SET @columns1 = LEFT(@columns1, LEN(@columns1) - 1);
   -- construct dynamic SQL
   DECLARE @ParamDefinition NVARCHAR(MAX)
   SELECT  @ParamDefinition= ' @factoryId1 int, @process1 VARCHAR(100)'
   SET @sql =N'
    SELECT  * from (
     SELECT 
           CONCAT(k.CODE,5) CODE,
           L2.tenQC tenQCKL,
           L2.GROUP_QC nhomKL,
           L2.DAY DAYKL,L2.RONG RONGKL,L2.DAI DAIKL,
           L2.M3 QUANTITY
           FROM prod.KILN_BATCH KB
           LEFT JOIN prod.KILN K ON K.ID= KB.KILN_ID
           LEFT JOIN base.ACCOUNT C ON C.ID = KB.CREATE_BY
           LEFT JOIN base.ACCOUNT X ON X.ID = KB.EXPORT_BY
           LEFT JOIN (
               SELECT L1.ID,SUM(L1.M3) M3,L1.NAME ten,L1.tenQC,SUM(L1.SL) SL,L1.GROUP_QC,
               L1.DAY,L1.DAI,L1.RONG
               FROM(
                   SELECT 
                   KB.ID,
                   IIP.ITEM_ID,
                   I.NAME tenQC,
                   B.NAME,B.DAI,B.RONG,B.DAY,
                   B.GROUP_QC,
                   SUM(IIP.QUANTITY) * I.VOLUMN M3,
                   SUM(IIP.QUANTITY) SL
                   FROM prod.KILN_BATCH KB
                   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                   left join nlg.BOM B on B.DAI = I.LENGTH and B.RONG = I.WIDTH and B.DAY = I.HEIGHT
                   GROUP BY KB.ID,
                   IIP.ITEM_ID,I.NAME,B.NAME,B.GROUP_QC,B.DAI,B.RONG,B.DAY,
                   I.VOLUMN
               ) L1
               GROUP BY L1.ID,L1.NAME,L1.tenQC,L1.GROUP_QC,L1.DAY,L1.DAI,L1.RONG
           ) L2 ON L2.ID = KB.ID
           WHERE 
            K.FACTORY_ID = @factoryId1 and KB.[STATUS] = @process1 and L2.tenQC is not null
                  ) pivot_table
   PIVOT
   (
   SUM(QUANTITY)
   FOR [CODE] IN ('+ @columns +')
   ) AS BANG_CHUYEN
   left join 
    (
     SELECT 
           k.CODE CODE,
           L2.tenQC,
           L2.GROUP_QC nhom,
           L2.DAY,L2.RONG,L2.DAI,
           L2.SL QUANTITY
           FROM prod.KILN_BATCH KB
           LEFT JOIN prod.KILN K ON K.ID= KB.KILN_ID
           LEFT JOIN base.ACCOUNT C ON C.ID = KB.CREATE_BY
           LEFT JOIN base.ACCOUNT X ON X.ID = KB.EXPORT_BY
           LEFT JOIN (
               SELECT L1.ID,SUM(L1.M3) M3,L1.NAME ten,L1.tenQC,SUM(L1.SL) SL,L1.GROUP_QC,
               L1.DAY,L1.DAI,L1.RONG
               FROM(
                   SELECT 
                   KB.ID,
                   IIP.ITEM_ID,
                   I.NAME tenQC,
                   B.NAME ,B.DAI,B.RONG,B.DAY,
                   B.GROUP_QC,
                   SUM(IIP.QUANTITY) * I.VOLUMN M3,
                   SUM(IIP.QUANTITY) SL
                   FROM prod.KILN_BATCH KB
                   LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                   LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                   LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                   LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                   left join nlg.BOM B on B.DAI = I.LENGTH and B.RONG = I.WIDTH and B.DAY = I.HEIGHT
                   GROUP BY KB.ID,
                   IIP.ITEM_ID,I.NAME,B.NAME,B.GROUP_QC,B.DAI,B.RONG,B.DAY,
                   I.VOLUMN
               ) L1
               GROUP BY L1.ID,L1.NAME,L1.tenQC,L1.GROUP_QC,L1.DAY,L1.DAI,L1.RONG
           ) L2 ON L2.ID = KB.ID
           WHERE 
            K.FACTORY_ID = @factoryId1 and KB.[STATUS] = @process1 and L2.tenQC is not null
                  ) pivot_table
   PIVOT
   (
   SUM(QUANTITY)
   FOR [CODE] IN ('+ @columns1 +')
   ) AS BANG_CHUYEN2 on BANG_CHUYEN2.DAY = BANG_CHUYEN.DAYKL and BANG_CHUYEN2.RONG = BANG_CHUYEN.RONGKL and BANG_CHUYEN2.DAI = BANG_CHUYEN.DAIKL
    and BANG_CHUYEN2.tenQC = BANG_CHUYEN.tenQCKL ';
   
   
   -- execute the dynamic SQL
   EXECUTE sp_executesql @sql, @ParamDefinition, @factoryId1 = @factoryId, @process1 = @process;

`).then(async result => {
        console.log('res', result)
        res.api.sendData(result.recordset)
    })

})
router.get('/week/process', (req, res, next) => {
    new mssql.Request()
    .query(`
    select k.ID, k.CODE,CONCAT(k.CODE,5) CODEKL, CONCAT(K.NAME,'(',CONVERT(varchar,KB.CREATE_DATE,103),')') NAME
from prod.KILN_BATCH kb
inner join prod.KILN k on kb.KILN_ID = k.ID
where STATUS = 'process' and k.FACTORY_ID = ${req.query.factoryId}
order by ID
`).then(async result => {
        console.log('res', result)
        res.api.sendData(result.recordset)
    })

})
router.get('/luong', (req, res, next) => {
    const {
        week,
        year,
        stepId
    } = req.query

    new mssql.Request()
        .input('week', week)
        .input('year', year)
        .input('stepId', stepId)

    .query(`select * from (
        select * from	(select paren,ITEM_ID,stepId,sum(QUANTITY) AS xuat,CONCAT(N'Tuần',' ',WEEK) WEEK, 0 loi,tenCT,tenCongDoan,0 loim3,sum(QUANTITY)*VOLUMN AS xuatm3 from
            (SELECT    B.paren,  iip.ITEM_ID ITEM_ID, p.SOURCE_ID AS stepId, iip.QUANTITY AS QUANTITY, DATEPART(WK,p.CREATE_DATE) - 1
            WEEK,i.NAME tenCT,DA.NAME tenCongDoan,i.VOLUMN
            FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                     prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
                                     LEFT JOIN prod.PO on PO.code = p.PO
                                     left join base.ITEM i on i.ID = iip.ITEM_ID
                                     left join base.DEPARTMENT DA ON DA.ID = p.SOURCE_ID
                                     LEFT JOIN (select DISTINCT * from dbo.View_SP) B on B.ITEM_ID = iip.ITEM_ID and B.STEP_ID = p.SOURCE_ID
            WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL)  and (p.CREATE_DATE BETWEEN '${req.query.week } 00:00:00' AND '${req.query.year} 23:59:59' ) 
            and p.TYPE_ID = 100026) D
            group by  paren, ITEM_ID, stepId,WEEK,tenCT,tenCongDoan,VOLUMN
        )  b
        union all
        select * from
        (select B.paren,k.ITEM_ID,k.stepId,xuat,CONCAT(N'Tuần',' ',WEEK) WEEK,loi,i.NAME tenCT,DA.NAME tenCongDoan,loi*i.VOLUMN loim3, 0 xuatm3 from
       ( select itemId ITEM_ID,stepId,0 xuat,DATEPART(WK,createdAt) - 1 WEEK,quantity loi from prod.HandleQc where createdAt BETWEEN '${req.query.week } 00:00:00' AND '${req.query.year} 23:59:59')
        
         k
         LEFT JOIN (select DISTINCT * from dbo.View_SP
            ) B on B.ITEM_ID = k.ITEM_ID and B.STEP_ID = k.stepId 
         left join base.ITEM i on i.ID = k.ITEM_ID
         left join base.DEPARTMENT DA ON DA.ID = k.stepId) n) m
    
        
        where paren is not null  and stepId = @stepId

`).then(async result => {
        console.log('res', result)
        res.api.sendData(result.recordset)
    })

})
router.get('/month', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('MONTH', req.query.month)
        .query(getReportByMonth, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset.filter(i => i.factoryId == req.query.factoryId))
        })
})

router.get('/order', (req, res, next) => {
    new mssql.Request()
        .input('YEAR', req.query.year)
        .input('MONTH', req.query.month)
        .input('FACTORY_ID', req.query.factoryId)
        .input('PRODUCTION_ORDERS_TYPE_ID', req.query.productionOrdersTypeId)
        .query(getReportByOrder, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
let getTon = `    select OS.DEPARTMENT_ID stepId, OS.ITEM_ID itemId, OS.QUANTITY ton
from prod.OPENING_STOCK OS
where YEAR(OS.[DATE]) = @year
and OS.WEEK = @week`

let getPO = `
SELECT 
PO.parent,
PO.code,
PO.stepId stepId,
PO.itemId itemId,
PO.quantity quantity,
PO.number
FROM prod.PO PO
WHERE [year] = @YEAR
and week = @WEEK
`

let getTyLeDongBo = `
SELECT *
FROM 
(
SELECT 
    CASE
        WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
        WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
        WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
        WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
        ELSE '-'
    END AS 'factoryId',
    CASE
        WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
        WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
        WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
        WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
        ELSE '-'
    END AS 'Nhà máy',
    CASE
        WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
        WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
        WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
        WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
        ELSE '-'
    END AS 'Kho/Xưởng',
    CASE
        WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
        WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
        WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
        WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
        ELSE '-'
    END AS 'Tổ',
    CASE
        WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
        WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
        WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
        WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
        ELSE '-'
    END AS 'Nhóm',
    A.departmentId,
    A.departmentCode,
    A.departmentName,
    A.[year],
    A.week,
    A.dayOfWeek,
    A.parentId,
    A.parentName,
    A.itemId,
    A.itemName,
    A.rate,
    A.volumn,
    A.quantity
FROM 
(
SELECT 
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentId
    ELSE DIM.departmentId
END AS departmentId,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentCode
    ELSE DIM.departmentCode
END AS departmentCode,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentName
    ELSE DIM.departmentName
END AS departmentName,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[year]
    ELSE DIM.[year]
END AS [year],
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[week]
    ELSE DIM.[week]
END AS [week],
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[dayOfWeek]
    ELSE DIM.[dayOfWeek]
END AS [dayOfWeek],
DIM.parentId,
DIM.parentName,
CASE 
    WHEN DT.itemId IS NULL THEN M.ID
    ELSE DT.itemId
END AS itemId,
CASE
    WHEN DT.itemId IS NULL THEN M.NAME
    ELSE DT.itemName
END AS itemName,
DIM.RATE rate,
CASE
    WHEN DT.itemId IS NULL THEN 0
    ELSE DT.volumn
END AS volumn,
CASE
    WHEN DT.itemId IS NULL THEN 0
    ELSE DT.quantity
END AS quantity
FROM (
    SELECT *
    FROM (
        SELECT 
        P.SOURCE_ID departmentId,
        D.[CODE] departmentCode,
        D.[NAME] departmentName,
        GD.[YEAR] [year],
        GD.WEEK week,
        IP.ID parentId,
        IP.NAME parentName
        FROM prod.PACKAGE P
        LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
        LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
        LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
        WHERE P.DESTINATION_ID <> 100078
        AND  P.DESTINATION_ID <> 100079
        AND  P.DESTINATION_ID <> 100080
        AND  P.DESTINATION_ID <> 100081
        AND GD.[YEAR] = @YEAR
        AND GD.WEEK = @WEEK
        --AND P.SOURCE_ID = @DEPARTMENT_ID
        AND IP.ID IS NOT NULL
        GROUP BY P.SOURCE_ID ,
        D.CODE,
        D.NAME ,
        GD.[YEAR] ,
        GD.WEEK ,
        IP.ID ,
        IP.NAME
    ) PR
    LEFT JOIN prod.BOM B ON B.ITEM_ID = PR.parentId
    LEFT JOIN (
        SELECT N'Thứ 2' dayOfWeek
        UNION ALL
        SELECT N'Thứ 3' dayOfWeek
        UNION ALL
        SELECT N'Thứ 4' dayOfWeek
        UNION ALL
        SELECT N'Thứ 5' dayOfWeek
        UNION ALL
        SELECT N'Thứ 6' dayOfWeek
        UNION ALL
        SELECT N'Thứ 7' dayOfWeek
    ) T ON 1 = 1
) DIM
FULL OUTER JOIN (
    SELECT 
    P.SOURCE_ID departmentId,
    D.[CODE] departmentCode,
    D.[NAME] departmentName,
    GD.[YEAR] [year],
    GD.WEEK week,
    GD.WEEK_DAY dayOfWeek,
    GD.DATE date,
    IP.ID parentId,
    IP.NAME parentName,
    B.RATE rate,
    IIP.ITEM_ID itemId,   
    I.NAME itemName,
    U.NAME unit,
    I.LENGTH length,
    I.WIDTH width,
    I.HEIGHT height,
    I.VOLUMN * SUM(IIP.QUANTITY) volumn,
    SUM(IIP.QUANTITY) quantity
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE P.DESTINATION_ID <> 100078
    AND  P.DESTINATION_ID <> 100079
    AND  P.DESTINATION_ID <> 100080
    AND  P.DESTINATION_ID <> 100081
    AND GD.[YEAR] = @YEAR
    AND GD.WEEK = @WEEK
    --AND P.SOURCE_ID = @DEPARTMENT_ID
    GROUP BY P.SOURCE_ID ,
    D.CODE,
    D.NAME ,
    GD.[YEAR] ,
    GD.WEEK ,
    GD.WEEK_DAY,
    GD.DATE ,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    U.NAME,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN
) DT ON DT.parentId = DIM.parentId AND DT.itemId = DIM.MATERIALS_ID AND DT.dayOfWeek = DIM.dayOfWeek
LEFT JOIN base.ITEM M ON M.ID = DIM.MATERIALS_ID
) A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.departmentId
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
) X
WHERE X.factoryId = @factoryId
`

let getReportByWeek2 = `SELECT 
P.SOURCE_ID departmentId,
D.[CODE] departmentCode,
D.[NAME] departmentName,
GD.[YEAR] [year],
GD.WEEK week,
GD.WEEK_DAY dayOfWeek,
GD.DATE date,
IP.ID parentId,
IP.NAME parentName,
B.RATE rate,
IIP.ITEM_ID itemId,   
I.NAME itemName,
U.NAME unit,
I.LENGTH length,
I.WIDTH width,
I.HEIGHT height,
I.VOLUMN * SUM(IIP.QUANTITY) volumn,
SUM(IIP.QUANTITY) quantity
FROM prod.PACKAGE P
LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
WHERE P.DESTINATION_ID <> 100078
AND  P.DESTINATION_ID <> 100079
AND  P.DESTINATION_ID <> 100080
AND  P.DESTINATION_ID <> 100081
AND GD.[YEAR] = @YEAR
AND GD.WEEK = @WEEK
AND P.SOURCE_ID = @DEPARTMENT_ID
GROUP BY P.SOURCE_ID ,
D.CODE,
D.NAME ,
GD.[YEAR] ,
GD.WEEK ,
GD.WEEK_DAY,
GD.DATE ,
IP.ID ,
IP.NAME ,
B.RATE ,
IIP.ITEM_ID ,   
I.NAME ,
U.NAME,
I.LENGTH ,
I.WIDTH ,
I.HEIGHT ,
I.VOLUMN`



let getReportByDate = `SELECT 
A.[YEAR] Năm,
A.WEEK Tuần,
A.WEEK_DAY Thứ,
A.[DAY] Ngày,
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
    WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
    WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
    WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
    ELSE '-'
END AS 'Nhóm',
A.ITEM_GROUP_NAME N'Nhóm sản phẩm',
A.RATE N'Tỷ lệ',
A.NAME N'Sản phẩm',
A.LENGTH Dài,
A.WIDTH Rộng,
A.HEIGHT Dày,
A.UNIT ,
A.VOLUMN N'Khối lượng',
CASE
    WHEN A.UNIT = 'M3' THEN 0
    ELSE A.QUANTITY
END AS N'Số lượng',
CASE
    WHEN A.UNIT = 'M3' THEN A.QUANTITY
    ELSE (A.VOLUMN * A.QUANTITY)
END AS N'Tổng khối lượng'
FROM (
    SELECT 
    GD.[YEAR] ,
    GD.WEEK ,
    GD.WEEK_DAY ,
    GD.DAY ,
    D.ID DEPARTMENT_ID,
    D.NAME DEPARTMENT_NAME,
    IP.NAME ITEM_GROUP_NAME,
    B.RATE ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN ,
    U.NAME 'UNIT',
    SUM(IIP.QUANTITY) QUANTITY
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE P.CREATE_DATE BETWEEN @FROM AND @TO
    GROUP BY P.SOURCE_ID ,
    D.ID,
    D.NAME ,
    GD.[YEAR] ,
    GD.WEEK ,
    GD.WEEK_DAY,
    GD.DAY ,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN,
    U.NAME
) AS A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID`


let getReportByWeek = `SELECT 
A.[YEAR] Năm,
A.WEEK Tuần,
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
    WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
    WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
    WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
    ELSE '-'
END AS 'Nhóm',
A.ITEM_GROUP_NAME N'Nhóm sản phẩm',
A.RATE N'Tỷ lệ',
A.NAME N'Sản phẩm',
A.LENGTH Dài,
A.WIDTH Rộng,
A.HEIGHT Dày,
A.VOLUMN N'Khối lượng',
A.UNIT ,
CASE
    WHEN A.UNIT = 'M3' THEN 0
    ELSE A.QUANTITY
END AS N'Số lượng',
CASE
    WHEN A.UNIT = 'M3' THEN A.QUANTITY
    ELSE (A.VOLUMN * A.QUANTITY)
END AS N'Tổng khối lượng'
FROM (
    SELECT 
    GD.[YEAR] ,
    GD.[WEEK],
    D.ID DEPARTMENT_ID,
    D.NAME DEPARTMENT_NAME,
    IP.NAME ITEM_GROUP_NAME,
    B.RATE ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN ,
    U.NAME 'UNIT',
    SUM(IIP.QUANTITY) QUANTITY
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE GD.[YEAR] = @YEAR
    AND GD.WEEK = @WEEK
    GROUP BY P.SOURCE_ID ,
    D.ID,
    D.NAME ,
    GD.[YEAR] ,
    GD.WEEK,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN,
    U.NAME
) AS A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
`

let getReportByMonth = `SELECT 
A.[YEAR] Năm,
A.MONTH Tháng,
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
    WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
    WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
    WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
    ELSE '-'
END AS 'Nhóm',
A.ITEM_GROUP_NAME N'Nhóm sản phẩm',
A.RATE N'Tỷ lệ',
A.NAME N'Sản phẩm',
A.LENGTH Dài,
A.WIDTH Rộng,
A.HEIGHT Dày,
A.VOLUMN N'Khối lượng',
A.UNIT ,
CASE
    WHEN A.UNIT = 'M3' THEN 0
    ELSE A.QUANTITY
END AS N'Số lượng',
CASE
    WHEN A.UNIT = 'M3' THEN A.QUANTITY
    ELSE (A.VOLUMN * A.QUANTITY)
END AS N'Tổng khối lượng'
FROM (
    SELECT 
    GD.[YEAR] ,
    GD.[MONTH],
    D.ID DEPARTMENT_ID,
    D.NAME DEPARTMENT_NAME,
    IP.NAME ITEM_GROUP_NAME,
    B.RATE ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN ,
    U.NAME 'UNIT',
    SUM(IIP.QUANTITY) QUANTITY
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE GD.[YEAR] = @YEAR
    AND GD.[MONTH] = @MONTH
    GROUP BY P.SOURCE_ID ,
    D.ID,
    D.NAME ,
    GD.[YEAR] ,
    GD.MONTH,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN,
    U.NAME
) AS A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID`


let getReportByOrder = `SELECT *
FROM (
SELECT 
A.[YEAR] Năm,
A.MONTH Tháng,
A.PRODUCTION_ORDERS_NAME LSX,
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' AND L0.[ORDER] < 10 THEN CONCAT('0',L0.[ORDER],'.', L0.[NAME])
	WHEN L0.[TYPE] = N'Nhóm' AND L0.[ORDER] > 9 THEN CONCAT(L0.[ORDER],'.', L0.[NAME])
	WHEN L1.[TYPE] = N'Nhóm' AND L1.[ORDER] < 10 THEN CONCAT('0',L1.[ORDER],'.', L1.[NAME])
	WHEN L1.[TYPE] = N'Nhóm' AND L1.[ORDER] > 9 THEN CONCAT(L1.[ORDER],'.', L1.[NAME])
    WHEN L2.[TYPE] = N'Nhóm' AND L2.[ORDER] < 10 THEN CONCAT('0',L2.[ORDER],'.', L2.[NAME])
	WHEN L2.[TYPE] = N'Nhóm' AND L2.[ORDER] > 9 THEN CONCAT(L2.[ORDER],'.', L2.[NAME])
    WHEN L3.[TYPE] = N'Nhóm' AND L3.[ORDER] < 10 THEN CONCAT('0',L3.[ORDER],'.', L3.[NAME])
	WHEN L3.[TYPE] = N'Nhóm' AND L3.[ORDER] > 9 THEN CONCAT(L3.[ORDER],'.', L3.[NAME])
    ELSE '-'
END AS 'Nhóm',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.[ORDER]
    WHEN L1.TYPE = N'Nhóm' THEN L1.[ORDER]
    WHEN L2.TYPE = N'Nhóm' THEN L2.[ORDER]
    WHEN L3.TYPE = N'Nhóm' THEN L3.[ORDER]
    ELSE '-'
END AS 'Order',
A.NAME N'Sản phẩm',
A.LENGTH Dài,
A.WIDTH Rộng,
A.HEIGHT Dày,
A.VOLUMN N'Khối lượng',
A.UNIT ,
A.TARGET N'Số lượng mục tiêu',
CASE
    WHEN A.UNIT = 'M3' THEN 0
    ELSE A.QUANTITY
END AS N'Số lượng',
CASE
    WHEN A.UNIT = 'M3' THEN A.QUANTITY
    ELSE (A.VOLUMN * A.QUANTITY)
END AS N'Tổng khối lượng'
FROM (
    SELECT 
    GD.[YEAR] ,
    GD.[MONTH],
    PO.NAME PRODUCTION_ORDERS_NAME,
    D.ID DEPARTMENT_ID,
    D.NAME DEPARTMENT_NAME,
	D.[ORDER],
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN ,
    U.NAME 'UNIT',
	POO.QUANTITY TARGET,
    SUM(IIP.QUANTITY) QUANTITY
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.ID = P.STEP_OF_PALLET_ID
    LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
    LEFT JOIN prod.PRODUCTION_ORDERS PO ON PO.ID = PL.PRODUCTION_ORDERS_ID
	LEFT JOIN prod.PRODUCT_OF_ORDERS POO ON POO.PRODUCTION_ORDERS_ID = PO.ID
    LEFT JOIN base.ITEM I ON I.ID  = POO.PRODUCT_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    WHERE GD.[YEAR] = @YEAR
    AND GD.[MONTH] = @MONTH
    AND PO.PRODUCTION_ORDERS_TYPE_ID = @PRODUCTION_ORDERS_TYPE_ID
    GROUP BY 
    PO.NAME,
    P.SOURCE_ID ,
    D.ID,
    D.NAME ,
	D.[ORDER],
    GD.[YEAR] ,
    GD.MONTH,
	POO.QUANTITY,
    IIP.ITEM_ID ,   
    I.NAME ,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN,
    U.NAME
) AS A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
WHERE A.PRODUCTION_ORDERS_NAME IS NOT NULL
AND L0.[TYPE] = N'Nhóm'
) X
WHERE X.[Order] > 0
AND X.factoryId = @FACTORY_ID`


const queryWeek3 = `
select
q.[to],q.[itemId],q.[ten san pham],q.[item_parent],q.[root_name],
q.[thu2],q.[thu3],q.[thu4],q.[thu5],q.[thu6],q.[thu7],q.[number],SUM(q.ton) as [sumTon],
	sum(q.[can_thuc_hien]) as [sumCanThucHien],SUM(q.da_thuc_hien) as [sumDaThucHien]
from
(


--- lay ke hoach
select dp.NAME as [to],po.itemId,
'['+i.[code]+'] '+i.[name]+' ('+ CONVERT(varchar(40),i.[height])+'*'+CONVERT(varchar(40),i.[width])+'*'+CONVERT(varchar(40),i.[length])+')' as [ten san pham],
 ib.[name] as [item_parent],ma.[name] as [root_name],po.ton, po.quantity as [can_thuc_hien],0 as [da_thuc_hien],
0 as [thu2],0 as [thu3],0 as [thu4],0 as [thu5],0 as [thu6],0 as [thu7],0 as [cn],po.number
from prod.PO as po
inner join base.DEPARTMENT as dp on dp.id = po.stepId
inner join base.ITEM as i on i.id = po.itemId
full outer join prod.BOM as b on b.MATERIALS_ID = po.itemId
full outer join base.item ib on ib.id = b.ITEM_ID
inner join base.MARKET as ma on ma.CODE = po.[root]
where po.[week] = @week and po.[year] = @year

union all
-- lay ton

-- lay da thuc hien
select dp.[name] as [to] , ipg.ITEM_ID as [itemId],
'['+i.[code]+'] '+i.[name]+' ('+ CONVERT(varchar(40),i.[height])+'*'+CONVERT(varchar(40),i.[width])+'*'+CONVERT(varchar(40),i.[length])+')' as [ten san pham],
ib.[name] as [item_parent],mk.NAME as [root_name],0 as [ton],0 as [can_thuc_hien],ipg.QUANTITY as [da_thuc_hien],
0 as [thu2],0 as [thu3],0 as [thu4],0 as [thu5],0 as [thu6],0 as [thu7],0 as [cn],po.number
from prod.PACKAGE as pg
inner join base.DEPARTMENT as dp on dp.id = pg.SOURCE_ID
inner join prod.ITEM_IN_PACKAGE as ipg on ipg.PACKAGE_ID = pg.ID
inner join base.ITEM as i on i.id = ipg.ITEM_ID
inner join prod.BOM as b on b.MATERIALS_ID = ipg.ITEM_ID
inner join base.item ib on ib.id = b.ITEM_ID
inner join prod.PO as po on po.code = pg.PO
left join base.MARKET as mk on mk.CODE = po.root
where DATEPART(WEEK,pg.CREATE_DATE) = @week and DATEPART(YEAR,pg.CREATE_DATE) = @year

-- lay thuc hien theo thu


) as q

group by q.[to],q.[itemId],q.[ten san pham],q.[item_parent],q.[root_name],
q.[thu2],q.[thu3],q.[thu4],q.[thu5],q.[thu6],q.[thu7],q.number

`

const queryBaoCaoTuan = `
select 
	[to],[itemId],[ten san pham], [item_parent], [KeHoach],[LENGTH],[WIDTH],[HEIGHT],[error],
	[thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn],volumn,[WEEK_PO],[WEEK_PERFORM]
from 
(
select dp.[name] as [to],ib.[name] as [item_parent],p.keHoach as [KeHoach], p.week as[WEEK_PO],DATEPART(WEEK,pg.CREATE_DATE) as [WEEK_PERFORM],ERR.error as[error],
i.HEIGHT as [HEIGHT],i.WIDTH as [WIDTH],i.LENGTH as [LENGTH],
case	
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 2 then 'Thu2'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 3 then 'Thu3'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 4 then 'Thu4'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 5 then 'Thu5'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 6 then 'Thu6'
	when DATEPART(WEEKDAY,pg.CREATE_DATE) = 7 then 'Thu7'
	else 'cn' 
end as [thu],pgi.QUANTITY as [qty],pgi.ITEM_ID as [itemId],i.[NAME] as [ten san pham],i.[name],i.volumn
from prod.PACKAGE as pg
inner join prod.PO p on p.code = pg.PO
LEFT JOIN (
                    select P.PO,SUM(IIP.QUANTITY) error
                    from prod.PACKAGE P
                    left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                    left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                    WHERE (PT.TYPE_ID = 100000 OR PT.TYPE_ID = 400000)
                    GROUP BY P.PO
                ) ERR ON ERR.PO = P.code
inner join prod.ITEM_IN_PACKAGE as pgi on pgi.PACKAGE_ID = pg.ID
inner join base.ITEM as i on i.id = pgi.ITEM_ID
inner join base.DEPARTMENT as dp on dp.id = pg.SOURCE_ID
inner join prod.BOM as b on b.MATERIALS_ID = pgi.ITEM_ID
inner join base.item ib on ib.id = b.ITEM_ID
where DATEPART(WEEK,pg.CREATE_DATE) = @week and DATEPART(YEAR,pg.CREATE_DATE) = @year and  dp.id = @departmentId
) as a

pivot (
	sum(a.qty) for a.thu in ([thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn])
) as b

`
module.exports = router