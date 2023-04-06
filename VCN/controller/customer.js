const express = require('express')
const VCN = express.Router()
const mssql = require('mssql')
const Sequelize = require('sequelize')
const {
    Op
} = require("sequelize");
const {
    getErrorMessage
} = require('../config/global')

const {
    Department,
    PoVCN,
    Account,
    ItemVCN,
    sequelize,
    Package,
    Customer,
    PRODItemInPackage,
    MaterialsInPackage,
    VItemInPackageVCN,
    ItemType,
    Unit,
    Remedies,
    PackageType,
    Routing,
    Bom,
    Group
} = require('../models')



const moment = require('moment');
moment.locale('vi')
//groups
VCN.get('/groups', async (req, res) => {
    try {
        const data = await Group.findAll()
        return res.status(200).json({
            message: 'OK',
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false

        })
    }
})
//bom
VCN.get('/boms/:itemId', async (req, res) => {
    try {
        const {
            itemId
        } = req.params
        const data = await Bom.findAll({
            where: {
                [Op.and]: [{
                    itemId
                }]
            },
            include: [{model:ItemVCN,as: 'materials', include:[Unit]},Group],
            order: [
                ['id', 'ASC']
            ]
        })
        return res.status(200).json({
            message: 'OK',
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })
    }
})
VCN.get('/boms', async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        IF OBJECT_ID('tempdb..#TempTable') IS NOT NULL DROP TABLE #TempTable
        CREATE TABLE #TempTable
        (
            ID   INT IDENTITY, 
            itemId INT,
            materialsId INT,
            RATE decimal(16, 9),
            parentId INT,factoryId INT,groupId INT
        );
        delete vcn.BOM where materialsId = itemId;
                    
        INSERT INTO #TempTable (itemId, materialsId, RATE, parentId) 
        select ID as itemId, ID as materialsId, null as RATE, 0 as parentId from vcn.ITEM
        SET IDENTITY_INSERT #TempTable ON
        INSERT INTO #TempTable (ID, itemId, materialsId, RATE, parentId,factoryId,groupId) 
        SELECT b.ID, b.itemId, b.materialsId, b.RATE, t.ID as parentId,b.factoryId,b.groupId
        from #TempTable as t, vcn.BOM b
        where t.itemId = b.itemId;
        --select * from #TempTable
      
        SET IDENTITY_INSERT #TempTable OFF;
        
        WITH temp(ID, itemId, materialsId, RATE, parentId,groupId)
                as (
                        Select distinct ID, itemId, materialsId, RATE, parentId,groupId
                        From #TempTable
                        Where itemId = ${req.query.itemId}  and factoryId is null
                        Union All
                        Select b.ID, b.itemId, b.materialsId, b.RATE, b.parentId,b.groupId
                       From temp as a, #TempTable as b
                        Where a.materialsId = b.itemId and b.parentId !=0
                ) select x.*, i.CODE code, i.NAME name, i.LENGTH length, i.WIDTH width, i.HEIGHT height,u.NAME as unit from (select distinct * from temp
                union
                select distinct t0.ID, t0.itemId, t0.materialsId, null as RATE, t0.parentId, t0.groupId from #TempTable as t0, temp as t1
            where  t0.ID = t1.parentId) as x left join vcn.ITEM i on i.ID = x.materialsId left join base.UNIT u on u.ID = i.unitId`)
        return res.status(200).json({
            message: 'OK',
            data: data.recordset
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'serve error',
            success: false,
            error
        })
    }
})
VCN.delete('/boms/:id/:factoryId', async (req, res) => {
    try {
        const {
            id        
        } = req.params
        const data = await Bom.destroy({
            where: {
                [Op.and]: [{
                    id
                }]
            }
        })
        return res.status(200).json({
            message: 'OK',
            success: true,
            data
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })
    }
})
VCN.post('/boms', async (req, res) => {
    let recordset;
  req.body.materials.forEach(async materialsId => {
    recordset = await new mssql.Request().query(`
    insert into vcn.BOM (itemId, materialsId, rate, createdBy, createdAt)
    VALUES (${req.body.itemId}, ${materialsId}, 1, ${req.body.createdBy}, GETDATE())
  `)
  })
  res.status(200).send(recordset)
})
VCN.put('/boms/:id', async (req, res) => {
    try {
        const {
            id
        } = req.params
        const data = await Bom.update({
            rate: req.body.rate,
            groupId: req.body.groupId
        }, {
            where: {
                id
            }
        })
        return res.status(200).json({
            message: 'OK',
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })
    }
})
//department
VCN.get('/departments', async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        select d.ID id, d.TYPE type, d.TYPE2 type2, d.PARENT_ID parentId, d.CODE code, d.NAME name, d.[ORDER] [order], d.caLamViec, d.accountId, d2.accountId gdsx, a.EMAIL email
            from base.DEPARTMENT d 
			inner join base.ACCOUNT a on d.accountId = a.ID 
			inner join base.DEPARTMENT d2 on d.PARENT_ID = d2.ID
			where d.TYPE2 = 'nhaMay' and d.PARENT_ID = 102395
        `)
        return res.status(200).json({
            message: 'OK',
            success: true,
            data: data.recordset
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })

    }
})
VCN.get('/departmentsByFactoryId', async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT ID id, NAME name  FROM base.DEPARTMENT where PARENT_ID = ${req.query.factoryId} AND (TYPE2 = 'to' OR TYPE2 = 'kho')
        `)
        return res.status(200).json({
            message: 'OK',
            success: true,
            data: data.recordset
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })

    }
})
VCN.get('/routingsbom', async (req, res) => {
    console.log('tao:',req.query.selectionBTP)
    try {
        if (req.query.loaisp == 'TP') {
            if (req.query.selectionBTP === 'false') {
                const data = await new mssql.Request().query(`
                SELECT *  FROM [vcn].[ROUTING] where factoryId = ${req.query.factoryId} 
                and itemId = ${req.query.itemId} 
                    order by [order] 
                `)
                return res.status(200).json({
                    message: 'OK',
                    success: true,
                    data: data.recordset
                })       
            }
            else {
        const data = await new mssql.Request().query(`
        SELECT *  FROM [vcn].[ROUTING] where factoryId = ${req.query.factoryId} 
        and itemId = ${req.query.itemId} and stepId not in (102749,102753,102761,102764,102819,102822)
            order by [order] 
        `)
        return res.status(200).json({
            message: 'OK',
            success: true,
            data: data.recordset
        })
    }
    } else {
        const data = await new mssql.Request().query(`
        SELECT *  FROM [vcn].[ROUTING] where factoryId = ${req.query.factoryId} 
        and itemId = ${req.query.itemId} and stepId  in (102749,102753,102761,102764,102819,102822,102757,102767,102825)
            order by [order] 
        `)
        return res.status(200).json({
            message: 'OK',
            success: true,
            data: data.recordset
        }) 
    }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })

    }
})

VCN.get('/xuong-by-factory', async (req, res) => {
    try {
            const data = await new mssql.Request().query(`
            select d.ID id, d.TYPE type, d.TYPE2 type2, d.PARENT_ID parentId, d.CODE code, d.NAME name, d.[ORDER] [order], d.caLamViec, d.accountId, d2.accountId gdsx, a.EMAIL email
                from base.DEPARTMENT d 
                inner join base.ACCOUNT a on d.accountId = a.ID 
                inner join base.DEPARTMENT d2 on d.PARENT_ID = d2.ID
                where d.PARENT_ID = ${req.query.factoryId} and d.TYPE2 = 'xuong'
            `)
            return res.status(200).json({
                message: 'OK',
                success: true,
                data: data.recordset
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })

    }
})

VCN.get('/cong-doan-by-xuong', async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        select ID value, NAME label 
        from base.DEPARTMENT 
        where PARENT_ID = ${req.query.xuongId} and TYPE2 = 'to'
        `)
        return res.status(200).json({
            message: 'OK',
            success: true,
            data: data.recordset
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })

    }
})

VCN.post('/bang-gia-vcn', async (req, res) => {
    try {
        let departments = req.body.departments;
        let strDepartment = "";
        departments.forEach(el => {
            strDepartment += el + ', '
        });
        strDepartment = strDepartment.substring(0, strDepartment.length -2);
        const data = await new mssql.Request().query(`
        SELECT DISTINCT SP.ITEM_ID,I.code, I.name, I.height, I.width, I.length, IT.NAME TYPE, SP.STEP_ID, SP.CONGDOAN,
(SELECT DON_GIA FROM vcn.GIA_TINH_LUONG G WHERE G.ITEM_ID = SP.ITEM_ID AND G.STEP_ID = SP.STEP_ID AND G.FACTORY_ID = SP.FACTORY_ID) DON_GIA,
(SELECT CREATED_AT FROM vcn.GIA_TINH_LUONG G WHERE G.ITEM_ID = SP.ITEM_ID AND G.STEP_ID = SP.STEP_ID AND G.FACTORY_ID = SP.FACTORY_ID) CREATED_AT
FROM vcn.STEP_ITEM_SP SP
INNER JOIN VCN.ITEM I ON SP.ITEM_ID = I.id
INNER JOIN vcn.ITEM_TYPE IT ON I.typeId = IT.ID
WHERE SP.STEP_ID IN (${strDepartment})
        `)
        return res.status(200).json({
            message: 'OK',
            success: true,
            data: data.recordset
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })

    }
})

VCN.post('/nhap-don-gia-vcn', async (req, res) => {
    try {
        const dataDelai = req.body.dataDelai;
        let listQuery = "";
        dataDelai.forEach(element => {
            const query = `INSERT INTO   [vcn].[GIA_TINH_LUONG] (DON_GIA,CREATED_AT,CREATED_BY,FACTORY_ID
                ,STEP_ID,ITEM_ID  )
            VALUES (${element.donGiaNew}, GETDATE(),${req.body.createBy},${req.body.factoryId}
            ,${element.STEP_ID},${element.ITEM_ID})`;
            listQuery += query;
        });
        const data = await new mssql.Request().query(listQuery)
        return res.status(200).json({
            message: 'OK',
            success: true,
            data: data.recordset
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: 'serve error',
            success: false
        })

    }
})

//routings
VCN.get('/routings/:itemId/:factoryId', async (req, res) => {
    try {
        const {
            itemId,
            factoryId
        } = req.params
        const data = await Routing.findAll({
            where: {
                [Op.and]: [{
                    itemId
                }, {
                    factoryId
                }]
            },
            order: [
                ['order', 'ASC']
            ]
        })
        res.status(200).json({
            success: true,
            data,
            message: 'OK'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'serve error',
            error
        })
    }
})
VCN.post('/routings', async (req, res) => {
    try {
        const data = await Routing.create(req.body)
        return res.status(200).json({
            message: 'ok',
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'serve error',
            success: false,
        })
    }
})
VCN.put('/routings/:id', async (req, res) => {
    try {
        const {
            id
        } = req.params
        const data = await Routing.update(req.body, {
            where: {
                id
            }
        })
        return res.status(200).json({
            message: 'ok',
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'serve error',
            success: false,
        })
    }
})
VCN.delete('/routings/:id', async (req, res) => {
    try {
        const {
            id
        } = req.params
        const data = await Routing.destroy({
            where: {
                id
            }
        })
        return res.status(200).json({
            message: 'ok',
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'serve error',
            success: false,
        })
    }
})

VCN.get('/:stepId/ke-hoach-thuc-hien', async (req, res) => {
    try {


        const keHoachThucHien = await new mssql.Request()
            .input('stepId', req.params.stepId)
            .query(`
            select i.CODE as itemCode,
            i.ID as itemId,
            i.NAME as itemName,
            i.LENGTH as itemLength,
            i.WIDTH as itemWidth,
            i.HEIGHT as itemHeight,
            (po.quantity) as keHoach,
            (po.keHoach)-(ISNULL(po.daThucHien,0)) as conThucHien,
            po.number as [root],
            po.[order],
            po.code poCode,
            po.stepId,
            po.type,
            ISNULL(po.daThucHien,0) daThucHien,
            po.loiCongDon,
			(select SUM(iip2.QUANTITY) 
			from vcn.PACKAGE p2 
			inner join vcn.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID 
			where p2.PO = po.code and TYPE_ID != 100026 and TYPE_ID != 100004 and DESTINATION_ID = @stepId and VERIFY_BY is not null ) loiChuyenVe,
            po.strucre,
            po.loiLoai,
			temp.ITEM_ID previousItem,
            temp.name previousName,
            temp.length previousLength,
            temp.width previousWidth,
            temp.height previousHeight,
            temp.quantity previousQuantity
            from vcn.PO po 
            inner join vcn.ITEM i on po.itemId = i.ID 
			left join (
			select  po.number, iip.ITEM_ID, i.name, i.length, i.width, i.height, sum(iip.QUANTITY) quantity from vcn.PACKAGE p 
			inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
            inner join vcn.PO po on po.code = p.PO
            inner join vcn.ITEM i on iip.ITEM_ID = i.id
			where  TYPE_ID = 100026 and p.DESTINATION_ID = @stepId
			group by po.number, iip.ITEM_ID, i.name, i.length, i.width, i.height
			) temp on po.number = temp.number
            where stepId = @stepId
            and po.approvedPKDBy is not null and po.approvedByAccount is not null
            and endPO = 0 
            and status is null and ((po.keHoach)-(ISNULL(po.daThucHien,0)+ po.loiLoai))>0
`)
        res.status(200).send(keHoachThucHien.recordset)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)

    }
})

VCN.get('/customer', async (req, res) => {
    try {
        const data = await Customer.findAll()
        res.status(200).send(data)

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})

VCN.post("/:id/verify", (req, res, next) => {
    let query = `UPDATE vcn.[PACKAGE]
    SET VERIFY_BY = @ACCOUNT_ID, VERIFY_DATE = GETDATE()
    WHERE ID = @PACKAGE_ID`;
    new mssql.Request()
        .input("PACKAGE_ID", req.params.id)
        // .input('QUANITY', req.query.quantity)
        .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
        .query(query, (err, record) => {
            if (err) return res.api.sendFail(getErrorMessage(4907));
            console.log(query);
            res.api.sendData([]);
        });
    // req.input('PACKAGE_ID', req.params.id)
    //     .input('TYPE_ID', req.body.typeId)
    //     .execute(Proc_verifyPackage)
});

VCN.get('/:id/from/:fromId', async (req, res, next) => {
    const data = await new mssql.Request()
        .input('SOURCE_ID', req.params.fromId)
        .input('ITEM_ID', req.query.itemId)

        .query(`select i.height,i.width,i.length,u.NAME as unit ,iip.QUANTITY as quantity
         ,a.LAST_NAME as createName,p.CREATE_DATE createDate from vcn.PACKAGE p 
         left join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
         left join vcn.ITEM i on i.id = iip.ITEM_ID
         left join base.ACCOUNT a on p.CREATE_BY = a.ID
         left join base.UNIT u on i.unitId = u.ID
         where p.TYPE_ID = 100004 and p.SOURCE_ID = @SOURCE_ID and iip.ITEM_ID = @ITEM_ID`)
    res.api.sendData(data.recordset)
})

VCN.get('/ton-cong-doan-vcn', async (req, res, next) => {
    let query = "";
    if(req.query.factoryId == 102531){
        query = `
        SELECT *
FROM
(
select i.name, i.height, i.width, i.length, iip.QUANTITY*i.volumn volumn, p.DESTINATION_ID departmentId from vcn.PACKAGE p 
inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join vcn.ITEM i on iip.ITEM_ID = i.id
where p.factoryId = 102531 and p.DESTINATION_ID != 0 and DESTINATION_ID = 102751 and p.TYPE_ID = 100026
union all
select i.name, i.height, i.width, i.length, -iip.QUANTITY*i2.volumn volumn, p.SOURCE_ID departmentId from vcn.PACKAGE p 
inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join vcn.HE_SO_QUY_DOI hs on iip.ITEM_ID = hs.ITEM_SAU_RONG
inner join vcn.ITEM i on hs.ITEM_TRUOC_RONG = i.id
inner join vcn.ITEM i2 on iip.ITEM_ID = i2.id
where p.factoryId = 102531 and p.SOURCE_ID != 0 and SOURCE_ID = 102751 and p.TYPE_ID = 100026
) AS BangNguon
PIVOT
(
SUM(volumn)
FOR departmentId IN ([102751])
) AS BangChuyen;
        `
    }else{
        query = `
        SELECT t.* , [102755], [102756], [102757], [102758], [102759], [102760]
FROM
(
select i.name, i.height, i.width, i.length, iip.QUANTITY, p.DESTINATION_ID departmentId from vcn.PACKAGE p 
inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join vcn.ITEM i on iip.ITEM_ID = i.id
where p.factoryId = @factoryId and p.DESTINATION_ID != 0 and p.TYPE_ID = 100026
union all
select i.name, i.height, i.width, i.length, -iip.QUANTITY QUANTITY, p.SOURCE_ID departmentId from vcn.PACKAGE p 
inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join vcn.ITEM i on iip.ITEM_ID = i.id
where p.factoryId = @factoryId and p.SOURCE_ID != 0 and SOURCE_ID != 102753 and p.TYPE_ID = 100026
union all
select i.name, i.height, i.width, i.length, -iip.QUANTITY QUANTITY, p.SOURCE_ID departmentId from vcn.PACKAGE p 
inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join vcn.ITEM i on iip.ITEM_ID = i.id
where p.factoryId = @factoryId and p.SOURCE_ID != 0 and SOURCE_ID != 102753 and p.TYPE_ID = 100004
) AS BangNguon
PIVOT
(
SUM(QUANTITY)
FOR departmentId IN ([102755], [102756], [102757], [102758], [102759], [102760])
) AS BangChuyen
inner join 
(
SELECT *
FROM
(
select i.name, i.height, i.width, i.length, iip.QUANTITY*i.volumn QUANTITY, CONVERT(nvarchar, p.DESTINATION_ID) + 'm3' departmentId from vcn.PACKAGE p 
inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join vcn.ITEM i on iip.ITEM_ID = i.id
where p.factoryId = @factoryId and p.DESTINATION_ID != 0 and p.TYPE_ID = 100026
union all
select i.name, i.height, i.width, i.length, -iip.QUANTITY*i.volumn QUANTITY, CONVERT(nvarchar, p.SOURCE_ID) + 'm3' departmentId from vcn.PACKAGE p 
inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join vcn.ITEM i on iip.ITEM_ID = i.id
where p.factoryId = @factoryId and p.SOURCE_ID != 0 and SOURCE_ID != 102753 and p.TYPE_ID = 100026
union all
select i.name, i.height, i.width, i.length, -iip.QUANTITY*i.volumn QUANTITY, CONVERT(nvarchar, p.SOURCE_ID) + 'm3' departmentId from vcn.PACKAGE p 
inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join vcn.ITEM i on iip.ITEM_ID = i.id
where p.factoryId = @factoryId and p.SOURCE_ID != 0 and SOURCE_ID != 102753 and p.TYPE_ID = 100004
) AS BangNguon
PIVOT
(
SUM(QUANTITY)
FOR departmentId IN ([102755m3], [102756m3], [102757m3], [102758m3], [102759m3], [102760m3])
) AS BangChuyen
) t on t.name = BangChuyen.name
        `
    }
    const data = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(query)
    res.api.sendData(data.recordset)
})


VCN.get('/:factoryId/ke-hoach-san-xuat-cong-doan', async (req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
  select x.*, x.keHoach  as canThucHien,x.keHoach as conThucHien, i.NAME itemName, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.LENGTH itemLength, d.NAME stepName from (
    select * from vcn.PO where approvedPKDAt is null and deletedAt is null and endPo = 0 and factoryId = @factoryId
  ) x
  left join vcn.ITEM i on i.ID = x.itemId
  left join base.DEPARTMENT d on d.ID = x.stepId
  `)
    res.status(200).send(data.recordset)
})
VCN.get('/:factoryId/tu-choi-ke-hoach', async (req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
    select distinct number, [description] from vcn.PO where factoryId = @factoryId and endPO = 2
  `)
    res.status(200).send(data.recordset)
})

VCN.get('/confirmPackage-temp-update-vcn', async (req, res) => {
    const data = await new mssql.Request()
    .input("verifyBy", req.query.verifyBy)
    .input("id", req.query.id)
    .query(`
update vcn.PACKAGE_TEMP set status=N'${req.query.status}',VERIFY_BY = @verifyBy
,VERIFY_DATE = GETDATE()  where ID = @id
`)
    res.status(200).send(data.recordset)
})

VCN.get('/listPackageRough-temp-status-vcn', async (req, res) => {
    const data = await new mssql.Request()
    .input("po", req.query.po)
    .query(`
    select pa.ITEM_ID,pa.SOURCE_ID,pa.DESTINATION_ID,D.NAME SOURCE_ID_NAME, pa.id as ID,pa.QUANTITY,i.NAME,i.LENGTH,i.WIDTH,i.HEIGHT,acc.LAST_NAME,convert(nvarchar(30), pa.CREATE_DATE, 103)as ngay,pa.CREATE_DATE 
    ,pa.PO,pa.VERIFY_BY,pa.status, DATEPART(HOUR, pa.CREATE_DATE) AS gio, DATEPART(minute, pa.CREATE_DATE) AS phut, DATEPART(second, pa.CREATE_DATE) AS giay
    from vcn.PACKAGE_TEMP pa 

    left join vcn.ITEM i on pa.ITEM_ID = i.ID
    left join base.DEPARTMENT D on pa.SOURCE_ID = D.ID
    left join base.ACCOUNT acc on pa.CREATE_BY = acc.ID 
    where  pa.PO = @po
    order by pa.VERIFY_DATE
`)
    res.status(200).send(data.recordset)
})
VCN.get('/sl-cho-nhan', async (req, res) => {
    const data = await new mssql.Request()
    .input("code", req.query.code)
    .query(`
    select SUM(QUANTITY) quantity
    from vcn.PACKAGE_TEMP where PO = @code
`)
    res.status(200).send(data.recordset)
})
VCN.get('/listPackageRough-temp-vcn', async (req, res) => {
    const data = await new mssql.Request()
    .input("DESTINATION_ID", req.query.DESTINATION_ID)
    .query(`
    select pa.ITEM_ID,pa.SOURCE_ID,pa.DESTINATION_ID,D.NAME SOURCE_ID_NAME, pa.id as ID,pa.QUANTITY,i.NAME,i.LENGTH,i.WIDTH,i.HEIGHT,acc.LAST_NAME,convert(nvarchar(30), pa.CREATE_DATE, 103)as ngay
        ,pa.CREATE_DATE,pa.CREATE_BY, pa.HE_SO, po.number
        ,pa.PO,DATEPART(HOUR, pa.CREATE_DATE) AS giogiao, DATEPART(minute, pa.CREATE_DATE) AS phutgiao, DATEPART(second, pa.CREATE_DATE) AS giaygiao
        from vcn.PACKAGE_TEMP pa 
		inner join vcn.PO po on pa.PO = po.code
        left join vcn.ITEM i on po.itemId = i.id
        left join base.DEPARTMENT D on pa.SOURCE_ID = D.ID
        left join base.ACCOUNT acc on pa.CREATE_BY = acc.ID  
        where  pa.DESTINATION_ID = @DESTINATION_ID and pa.VERIFY_BY is null
`)
    res.status(200).send(data.recordset)
})

VCN.get('/listPackageRough-temp-del-vcn', async (req, res) => {
    const data = await new mssql.Request()
    .input("id", req.query.id)
        .query(`
        delete from vcn.PACKAGE_TEMP where ID = @id
        `)
    res.status(200).send(data.recordset)
})

VCN.get("/cho-xac-nhan", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId)
        .query(
            `
            select I.ID itemId,

            I.CODE itemCode,
            I.NAME itemName,
            I.LENGTH itemLength,
            I.WIDTH itemWidth,
            I.HEIGHT itemHeight,
			t.* from (
	select PT.ITEM_ID, PT.QUANTITY, PT.CREATE_BY, PT.CREATE_DATE, PT.ID packageId, po.number, A.LAST_NAME 
	from vcn.PACKAGE_TEMP PT
	left join vcn.PO PO ON PT.PO = PO.code
    inner join base.ACCOUNT A ON PT.CREATE_BY = A.ID
	where PT.DESTINATION_ID = @stepId and PT.VERIFY_BY iS null and PO.endPO = 0 and PO.approvedAt is not null
) as t
left join vcn.ITEM I ON I.ID = t.ITEM_ID
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else {
        res.api.sendData([]);
    }
});

VCN.get("/:stepId/:itemId/:CREATE_BY/san-luong-nhan-2", async (req, res) => {
    const {
        recordset
    } = await new mssql.Request()
        .input("stepId", req.params.stepId)
        .input("itemId", req.params.itemId)
        .input("CREATE_BY", req.params.CREATE_BY)
        .query(`
        select p.ID id, iip.QUANTITY quantiy, iip.ITEM_ID itemId, iip.ID x from vcn.PACKAGE p
        left join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
        left join vcn.PO po on po.code = p.PO
        where p.DESTINATION_ID = @stepId and P.VERIFY_BY iS null and iip.ITEM_ID = @itemId and p.CREATE_BY = @CREATE_BY
        and PO in (
            select code
                                                  from vcn.PO
                                                  where deletedAt is null and endPO = 0 and approvedAt is not null
                                                 
            )
            order by po.week
    `)
    res.api.sendData(recordset)
})

VCN.get("/:stepId/xac-nhan-phoi", async (req, res, next) => {
    let data = await VItemInPackageVCN.findAll({
        where: {
            stepId2: req.params.stepId,
            accountId2: {
                [Op.ne]: null
            }
        },
        order: [
            ["updatedAt", "DESC"]
        ],
        include: [{
            model: ItemVCN,
            as: 'Item'
        }]
    });
    res.status(200).send(data)
});

VCN.get("/listPackage", async (req, res) => {
    const {
        recordset
    } = await new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("DESTINATION_ID", req.query.DESTINATION_ID)
        .query(`SELECT *
    FROM (
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
        GD.WEEK N'Tuần',
        GD.[DATE] N'Ngày',
        S.CODE N'Ma_to_QC',
        D.NAME N'Kho_den',
		P.DESTINATION_ID,
        PT.NAME N'Loai_loi',
        RM.NAME N'BP_xu_ly',
        I.NAME N'Chi_tiet_cum',
        IIP.QUANTITY N'So_luong',
        CB.LAST_NAME N'Nguoi_tao',
        P.CREATE_DATE N'Ngay_tao',
        VB.LAST_NAME N'Nguoi_nhan',
        P.VERIFY_DATE,
        P.ID,
		PO.number
        FROM vcn.PACKAGE P
        LEFT JOIN vcn.PO ON P.PO = PO.code
        LEFT JOIN vcn.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
        LEFT JOIN vcn.REMEDIES RM ON RM.ID = P.REMEDIES_ID
        LEFT JOIN vcn.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.DEPARTMENT S ON S.ID = P.SOURCE_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.DESTINATION_ID
        LEFT JOIN vcn.ITEM I ON I.ID = IIP.ITEM_ID
        LEFT JOIN base.GLOBAL_DATE GD ON GD.[DATE] = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN base.ACCOUNT CB ON CB.ID = P.CREATE_BY
        LEFT JOIN base.ACCOUNT VB ON VB.ID = P.VERIFY_BY
            LEFT JOIN base.DEPARTMENT L0 ON L0.ID = S.ID
        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
        WHERE S.[TYPE] = 'QC'
        and P.CREATE_DATE >='2021-03-01 00:00'
		and DESTINATION_ID = @DESTINATION_ID and P.VERIFY_BY is null and VERIFY_DATE is null
        ) X 
    `)
    res.api.sendData(recordset)
});
VCN.get('/inventory-qc', (req, res, next) => {
    let query = 'SELECT * FROM dbo.View_TON_QC_VCN'
    if (req.query.stepId !== undefined && req.query.stepId > 10)
        query = query + ` WHERE  factoryId = @STEP_ID`
    new mssql.Request()
        .input('STEP_ID', req.query.stepId)
        .query(query, (err, record) => {
            if (err) return console.log(err)
            req.result = []
            console.log(record.recordsets)
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    fromId: e.FROM,
                    step: {
                        departmentId: e.ID
                    },
                    from: {
                        departmentId: e.FROM
                    },
                    item: {
                        itemIdVCN: e.ITEM_ID
                    },
                    remain: e.REMAIN
                })
                console.log(req.result)

            })
            console.log(req.result)

            next()
        })
}, (req, res) => {
    // console.log(req.result)

    res.api.sendData(req.result)

})
VCN.get('/:factoryId/so-ke-hoach-san-xuat-cong-doan-2', async (req, res) => {
    const data = await new mssql.Request().input('factoryId', req.params.factoryId).query(`
  select distinct number,type, ngayDongGoi  from vcn.PO where approvedPKDAt is not null and deletedAt is null and endPo = 0 and factoryId = @factoryId and (daThucHien + loiLoai) < keHoach
  `)
    res.status(200).send(data.recordset)
})

VCN.get("/historyPackage", async (req, res) => {
    const {
        recordset
    } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("DESTINATION_ID", req.query.DESTINATION_ID)
        .query(`SELECT *
    FROM (
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
    END AS 'To',
    CASE
        WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
        WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
        WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
        WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
        ELSE '-'
    END AS 'Nhóm',
        GD.WEEK N'Tuần',
        GD.[DATE] N'Ngày',
        S.CODE N'Ma_to_QC',
        D.NAME N'Kho_den',
		P.DESTINATION_ID,
        PT.NAME N'Loai_loi',
        RM.NAME N'BP_xu_ly',
        I.NAME N'Chi_tiet_cum',
        IIP.QUANTITY N'So_luong',
        CB.LAST_NAME N'Nguoi_tao',
        P.CREATE_DATE N'Ngay_tao',
        P.CREATE_BY,
        VB.LAST_NAME N'Nguoi_nhan',
        P.VERIFY_BY,
        P.VERIFY_DATE,
        P.ID
        FROM vcn.PACKAGE P
        LEFT JOIN vcn.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
        LEFT JOIN vcn.REMEDIES RM ON RM.ID = P.REMEDIES_ID
        LEFT JOIN vcn.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.DEPARTMENT S ON S.ID = P.SOURCE_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.DESTINATION_ID
        LEFT JOIN vcn.ITEM I ON I.ID = IIP.ITEM_ID
        LEFT JOIN base.GLOBAL_DATE GD ON GD.[DATE] = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN base.ACCOUNT CB ON CB.ID = P.CREATE_BY
        LEFT JOIN base.ACCOUNT VB ON VB.ID = P.VERIFY_BY
            LEFT JOIN base.DEPARTMENT L0 ON L0.ID = S.ID
        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
        WHERE S.[TYPE] = 'QC'
        and P.CREATE_DATE >='2021-03-01 00:00'
		and DESTINATION_ID = @DESTINATION_ID and P.VERIFY_BY = @verifyBy
        ) X 
    `)
    res.api.sendData(recordset)
});
VCN.get("/:stepId/ghi-nhan-phoi1", async (req, res, next) => {
    let data = await VItemInPackageVCN.findAll({
        where: {
            stepId1: req.params.stepId,
            createdAt2: {
                [Op.and]: {
                    [Op.gte]: req.query.from,
                    [Op.lt]: req.query.to
                }
            }
        },
        order: [
            ["createdAt2", "DESC"]
        ],
        include: [{
            model: ItemVCN,
            as: 'Item'
        }]
    });
    res.status(200).send(data)
})

VCN.put('/:accountId/approved', async (req, res) => {
    const {
        accountId
    } = req.params
    let data = null
    const {
        poIds
    } = req.body

    try {
        data = await PoVCN.update({
            approvedByAccount: accountId,
            approvedAt: new Date()
        }, {
            where: {
                number: {
                    [Op.in]: [poIds]
                }
            }
        })
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.put('/:accountId/approvedPKD', async (req, res) => {
    const {
        accountId
    } = req.params
    let data = null
    const {
        poIds
    } = req.body

    try {
        data = await PoVCN.update({
            approvedPKDBy: accountId,
            approvedPKDAt: new Date()
        }, {
            where: {
                number: {
                    [Op.in]: [poIds]
                }
            }
        })
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})



VCN.get('/getPOBYNumberVCN', async (req, res) => {
    console.log("hien hti ",req.query.number);
    const {
        number
    } = req.query
    try {
        const data = await PoVCN.findAll({
            include: [Department,
                {
                    model: ItemVCN,
                    as: 'ItemVCN'
                },
                {
                    model: ItemVCN,
                    as: 'ItemDong'
                },
                {
                    model: ItemVCN,
                    as: 'ItemDong2'
                },
                {
                    model: ItemVCN,
                    as: 'ItemDong3'
                },
                Customer,
                {
                    model: Account,
                    as: 'acc1'
                },
                {
                    model: Account,
                    as: 'acc2'
                },
                {
                    model: Account,
                    as: 'acc3'
                }
            ],
            where: {
                number
            }
        })
        if (!data){
            return res.status(400).json({
                message: 'Cõ lỗi xảy ra',
                success: false
            })
        }
        
        
        return res.status(200).json({
            message: 'Lấy kế hoạch thành công',
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'serve error',
            error
        })
    }
})

VCN.post('/create-PO', async (req, res) => {
    try {
        console.log(req.body);
        const data = await PoVCN.create(req.body)
        if (!data)
            return res.status(400).json({
                message: 'Có lỗi xảy ra',
                success: false,
            })
        return res.status(200).json({
            message: 'Tạo kế hoạch thành công',
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'serve error',
            error
        })
    }

})

VCN.get('/:order/:number/:itemId/stepNext', async (req, res) => {

    const {
        order,
        number,
        itemId
    } = req.params
    try {

        const data = await PoVCN.findOne({
            include: Department,
            where: {
                order,
                number,
                itemId
            }
        })
        res.status(200).json({
            message: "OK",
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'server error',
            success: false,
            error
        })
    }

})
VCN.get("/getTONKHOVCN", async (req, res) => {
    const {
        recordset
    } = await new mssql.Request()
    .input("itemID", req.query.itemID)
        .input("khovan", req.query.khovan)
        .query(` select sum(tonkho) tonkho from
       ( select keHoach - daThucHien as tonkho from vcn.PO 
        where stepId = @khovan and itemId = @itemID and endPO = 0 and approvedPKDBy is not null) po
       
    `)

    res.api.sendData(recordset)
})
VCN.get("/PO/stepChuyenDoi", async (req, res) => {
    const {
        recordset
    } = await new mssql.Request()
        .input("number", req.query.number)
        .input("stepId", req.query.stepId)
        .query(`
        select i.id, i.name, i.length, i.width, i.height, po.heSo from vcn.PO 
        inner join vcn.ITEM i on po.itemId = i.id
        where number = @number and stepId = @stepId and [order] = 1
    `)

    res.api.sendData(recordset)
})
VCN.post('/ghi-nhan-bt', async (req, res) => {
    let result = []
    const t = await sequelize.transaction()
    try {
        if (req.body.quantity > 0) {
            if(req.body.itemSauRong){
                const itemId = req.body.itemId;
                const quantity = req.body.quantity;
                req.body.itemId = req.body.itemSauRong;
                req.body.quantity = req.body.quantitySauRong;
                const data = await Package.create(req.body, {
                    transaction: t
                })
                result.push(data.dataValues)
                req.body.PACKAGE_ID = data.dataValues.ID
                const dataIIP = await PRODItemInPackage.create(req.body, {
                    transaction: t
                })
                const material = {
                    ITEM_IN_PACKAGE_ID: dataIIP.dataValues.ID,
                    itemId: itemId,
                    quantity: quantity,
                    factoryId: req.body.factoryId
                }
                const dataMIP = await MaterialsInPackage.create(material, {
                    transaction: t
                })
            }else{
                const data = await Package.create(req.body, {
                    transaction: t
                })
                result.push(data.dataValues)
                req.body.PACKAGE_ID = data.dataValues.ID
                const dataIIP = await PRODItemInPackage.create(req.body, {
                    transaction: t
                })
            }
            
        }
        if (req.body.defectQty > 0) {
            let packageError = {
                ...req.body
            }
            packageError.quantity = req.body.defectQty
            packageError.DESTINATION_ID = 102528
            packageError.ITEM_FROM_ID = req.body.SOURCE_ID
            packageError.SOURCE_ID = req.body.nguonPhoi
            packageError.TYPE_ID = 100004
            const data1 = await Package.create(packageError, {
                transaction: t
            })
            result.push(data1.dataValues)
            packageError.PACKAGE_ID = data1.dataValues.ID
            const dataIIP1 = await PRODItemInPackage.create(packageError, {
                transaction: t
            })
        }
        const updatePo = await PoVCN.update({
            daThucHien: req.body.daThucHien,
            loiCongDon: req.body.loiCongDon + req.body.defectQty
        }, {
            where: {
                code: req.body.PO
            }
        }, {
            transaction: t
        })

        await t.commit();
        res.status(200).json({
            message: "OK",
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error)
        await t.rollback();
        res.status(500).json({
            message: 'Có lỗi xảy ra',
            success: false,
            error
        })
    }

})
VCN.post('/ghi-nhan-temp', async (req, res) => {
    const {
        recordset
    } = await new mssql.Request()
        .input("SOURCE_ID", req.body.SOURCE_ID)
        .input("PO", req.body.PO)
        .input("TYPE_ID", req.body.TYPE_ID)
        .input("daThucHien", req.body.daThucHien)
        .input("factoryId", req.body.factoryId)
        .input("itemId", req.body.itemId)
        .input("nguonPhoi", req.body.nguonPhoi)
        .input("number", req.body.number)
        .input("order", req.body.order)
        .input("quantity", req.body.quantity)
        .input("heSo", req.body.heSo)
        .input("CREATE_BY", req.body.CREATE_BY)
        .query(`
        INSERT INTO VCN.PACKAGE_TEMP (SOURCE_ID, DESTINATION_ID, TYPE_ID, CREATE_BY, CREATE_DATE, PO, factoryId, ITEM_ID, QUANTITY, HE_SO)
        VALUES(@SOURCE_ID, ${req.body.DESTINATION_ID}, @TYPE_ID, @CREATE_BY, GETDATE(), @PO, @factoryId, @itemId, @quantity, @heSo)
    `)

    res.api.sendData(recordset)
})
VCN.post('/ghi-nhan', async (req, res) => {
    let data = req.body;
    const {
        recordset
    } = await new mssql.Request()
    .input("ITEM_ID", data.itemId)
    .input("QUANTITY", data.quantity)
    .input("HE_SO", data.heSo)
    .input("TYPE_ID", data.typeId)
    .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
    .input("ID", data.ID)
    .input("PO", req.body.po ? req.body.po.replace("PO", "") : "")
    .output("ERROR")
    .execute("Proc_createPackageVCN_1", async (err, record) => {
        if (err) {
            console.log("err", err);
            return res.api.sendFail(err);
        }
    res.api.sendData(record)
    });
})

VCN.post('/ghi-nhan-loi', async (req, res) => {
    let result = []
    const t = await sequelize.transaction()
    try {
            let packageError = {
                ...req.body
            }
            packageError.quantity = req.body.defectQty
            packageError.DESTINATION_ID = 102528
            packageError.ITEM_FROM_ID = req.body.SOURCE_ID 
            packageError.SOURCE_ID = req.body.nguonPhoi
            packageError.TYPE_ID = 100004
            const data1 = await Package.create(packageError, {
                transaction: t
            })
            result.push(data1.dataValues)
            packageError.PACKAGE_ID = data1.dataValues.ID
            const dataIIP1 = await PRODItemInPackage.create(packageError, {
                transaction: t
            })
            const updatePo = await PoVCN.update({
                loiCongDon: req.body.loiCongDon + req.body.defectQty
            }, {
                where: {
                    code: req.body.PO
                }
            }, {
                transaction: t
            })
        
        await t.commit();
        res.status(200).json({
            message: "OK",
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error)
        await t.rollback();
        res.status(500).json({
            message: 'Có lỗi xảy ra',
            success: false,
            error
        })
    }

})

VCN.post("/createPackageErr", async (req, res) => {
    let data = req.body;
    const {
        recordset
    } = await new mssql.Request()
    .input("sourceId", data.sourceId)
    .input("destinationId", data.destinationId)
    .input("itemId", data.itemId)
    .input("quantity", data.quantity)
    .input("typeId", data.typeId)
    .input("remediesId", data.remediesId)
    .input("description", data.description)
    .input("itemFromId", data.itemFromId)
    .input("PO", data.PO)
    .input("number", data.number)
    .input("factoryId", data.factoryId)
    .input("createBy", data.createBy)
    .input("heSo", data.heSo)
    .input("itemChild", data.itemChild)
    .output("ERROR")
    .execute("VCN_createPackageErrorVCN", async (err, record) => {
        if (err) {
            console.log("err", err);
            return res.api.sendFail(err);
        }
    res.api.sendData(record)
    });

});
VCN.put("/confirmPackageErr", async (req, res) => {
    const {
        recordset
    } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("id", req.query.id)
        .query(`
update vcn.PACKAGE set VERIFY_BY = @verifyBy , VERIFY_DATE = SYSDATETIMEOFFSET() where ID = @id
    `)

    res.api.sendData(recordset)
})




//item

VCN.post('/importItemsVCN', async (req, res) => {
    try {
        const data = await ItemVCN.bulkCreate(req.body)

        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.get('/itemsByFactory', async (req, res) => {
    try {
        const data = await ItemVCN.findAll({
            include: [{
                model: Unit
            }, {
                model: ItemType
            }]
        })

        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.get('/itemsVCN', async (req, res) => {
    try {
        const data = await ItemVCN.findAll({
            include: [{
                model: Unit
            }, {
                model: ItemType
            }]
        })

        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.post('/itemsVCN', async (req, res) => {
    try {
        const data = await ItemVCN.create(req.body)

        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.put('/itemsVCN', async (req, res) => {
    try {
        const data = await ItemVCN.update(req.body.data, {
            where: {
                id: req.body.id
            }
        })

        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.get('/remedies', async (req, res) => {
    try {
        const data = await Remedies.findAll(req.body.data)
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)

    }
})
VCN.get('/package-type', async (req, res) => {
    try {
        const data = await PackageType.findAll(req.body.data)
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)

    }
})
VCN.get('/allNumberPo', async (req, res) => {
    try {
        const data = await PoVCN.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('number')), 'number'], 'number'
            ]
        })
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.get('/allNumberPOByFactory', async (req, res) => {
    try {
        const {
            factoryId,
            week,
            year
        } = req.query
        const data = await PoVCN.findAll({
            attributes: ['number', 'endPO'],
            group: ['number', 'endPO'],
            where: {
                factoryId,
                week,
                year

            }
        })
        res.api.sendData(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.put('/reject', async (req, res) => {
    try {
        const {
            number,
            description
        } = req.body
        const data = await PoVCN.update({
            description: description,
            approvedByAccount: null,
            approvedAt: null,
            endPO: 2
        }, {
            where: {
                number
            }

        })
        res.api.sendData(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.put('/endPO', async (req, res) => {
    try {
        const {
            number
        } = req.body
        const data = await PoVCN.update({
            endPO: 1
        }, {
            where: {
                number
            }

        })
        res.api.sendData(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.put('/reOpenPO', async (req, res) => {
    try {
        const {
            number
        } = req.body
        const data = await PoVCN.update({
            endPO: 0
        }, {
            where: {
                number
            }

        })
        res.api.sendData(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.put('/deleteDataPO', async (req, res) => {
    try {
        const {
            number
        } = req.body
        const data = new mssql.Request().query(`
        delete vcn.ITEM_IN_PACKAGE where PACKAGE_ID in
            (select id from vcn.PACKAGE where PO in(select code from vcn.PO where number = N'${number}'))

        delete vcn.PACKAGE where PO in(select code from vcn.PO where number = N'${number}')

        delete vcn.PO where number = N'${number}'
        `)
        res.api.sendData(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.delete('/po/:number/:factoryId', async (req, res) => {
    try {
        const {
            number,
            factoryId
        } = req.params
        const data = PoVCN.destroy({
            where: {
                number,
                factoryId
            }
        })
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
VCN.put('/po/:numbers/:factoryId', async (req, res)=>{
    try {
        const { factoryId,numbers } = req.params
        const data = await PoVCN.update(req.body,{where:{
            [Op.and]:[{factoryId},{number : numbers}]
        }})
        return res.status(200).json({message:'OK',success: true, data})

    } catch (error) {
        console.log(error)
        res.status(500).json({error,success: false, message: 'serve error'})
    }
})
VCN.get('/qc', (req, res, next) => {
    let query = `
    SELECT t.*, '['+d.CODE+'] '+ d.NAME NAME, I.length, I.width, I.height, U.NAME UNIT_NAME, I.name ITEM_NAME FROM dbo.View_TON_QC_VCN t
    INNER JOIN base.DEPARTMENT d on t.[FROM] = d.ID
    INNER JOIN VCN.ITEM I ON T.ITEM_ID = I.ID
    INNER JOIN base.UNIT U ON I.unitId = U.ID
    `
    if (req.query.stepId !== undefined && req.query.stepId > 10)
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) return console.log(err)
            req.result = []
            console.log(record.recordsets)
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    fromId: e.FROM,
                    step: {
                        departmentId: e.ID
                    },
                    from: {
                        id: e.FROM,
                        name: e.NAME
                    },
                    item: {
                        itemIdVCN: e.ITEM_ID,
                        length: e.length,
                        width: e.width,
                        height: e.height,
                        unit: e.UNIT_NAME,
                        name: e.ITEM_NAME
                    },
                    remain: e.REMAIN,
                    number: e.number,
                    PO: e.PO
                })

            })

            next()
        })
}, (req, res) => {
    // console.log(req.result)

    res.api.sendData(req.result)

})

VCN.get('/code-by-lsx', async(req, res) => {
    const code = await new mssql.Request()
        .input('number', req.query.number)
        .input('order', req.query.order)
        .query(`
        select code from vcn.PO where number = @number and [order] = @order
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/code-by-lsx', async(req, res) => {
    const code = await new mssql.Request()
        .input('number', req.query.number)
        .input('order', req.query.order)
        .query(`
        select code from vcn.PO where number = @number and [order] = @order
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/bc-san-luong-by-day-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(`
        select d.NAME departmentName, i.name itemName, i.height, i.width, i.length, 
		CASE WHEN PO.itemId = IIP.ITEM_ID THEN iip.QUANTITY ELSE MIP.QUANTITY END QUANTITY, 
		CASE WHEN PO.itemId = IIP.ITEM_ID THEN iip.QUANTITY*i.volumn ELSE MIP.QUANTITY*i.volumn END volumn, p.CREATE_DATE  from vcn.PACKAGE p
        inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
        inner join base.DEPARTMENT d on p.SOURCE_ID = d.ID
		INNER JOIN VCN.PO ON P.PO = PO.code
		LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = MIP.ITEM_IN_PACKAGE_ID
        inner join vcn.ITEM i on PO.itemId = i.id
        where p.TYPE_ID = 100026 and p.CREATE_DATE BETWEEN @from AND @to and d.PARENT_ID = @factoryId
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/bc-vcn-theo-ngay', async(req, res) => {
    const code = await new mssql.Request()
    .input('factoryId', req.query.factoryId)
    .input('from', req.query.from)
    .input('to', req.query.to)
    .query(`
    SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME, 
    CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY,
    CASE WHEN PO.itemId = IIP.ITEM_ID THEN iip.QUANTITY*i.volumn ELSE MIP.QUANTITY*i.volumn END volumnM3
    ,CONCAT ('',  RIGHT(STUFF(DATEPART(DAY, p.CREATE_DATE),1,0,'0'),2),'/', RIGHT(STUFF(DATEPART(MONTH, p.CREATE_DATE),1,0,'0'),2)) CREATED_AT,
    d.ID departmentId FROM VCN.PO PO
    INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
    INNER JOIN vcn.ITEM I ON PO.itemId = I.id
    INNER JOIN base.UNIT U ON I.unitId = U.ID
    LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
    INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
    LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
    where p.CREATE_DATE BETWEEN @from AND @to and d.PARENT_ID = @factoryId
`)
res.status(200).send(code.recordset)
})
VCN.get('/bc-san-luong-vcn-ngay', async(req, res) => {
    const code = await new mssql.Request()
    .input('factoryId', req.query.factoryId)
    .input('from', req.query.from)
    .input('to', req.query.to)
    .query(`
    SELECT T.NAME as NAME,CREATED_AT,SUM(volumnM3) as volumnM3 FROM (
        SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME, 
          CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY,
          CASE WHEN PO.itemId = IIP.ITEM_ID THEN iip.QUANTITY*i.volumn ELSE MIP.QUANTITY*i.volumn END volumnM3
          ,CONCAT ('',  RIGHT(STUFF(DATEPART(DAY, p.CREATE_DATE),1,0,'0'),2),'/', RIGHT(STUFF(DATEPART(MONTH, p.CREATE_DATE),1,0,'0'),2)) CREATED_AT,
          d.ID departmentId FROM VCN.PO PO
          INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
          INNER JOIN vcn.ITEM I ON PO.itemId = I.id
          INNER JOIN base.UNIT U ON I.unitId = U.ID
          LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
          INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
          LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
          where p.CREATE_DATE BETWEEN @from AND @to and d.PARENT_ID = @factoryId
       ) as T
       GROUP BY T.[NAME],T.[CREATED_AT]
`)
    res.status(200).send(code.recordset)
})
VCN.get('/bc-san-luong-vcn-tuan', async(req, res) => {
    const code = await new mssql.Request()
    .input('factoryId', req.query.factoryId)
    .input('from', req.query.from)
    .input('to', req.query.to)
    .query(`
    select T.NAME,T.[WEEK] ,SUM(QUANTITY) as [SUM],SUM(volumnM3) as [SUMM3]
	from 
	(
	SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME,
    CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY,
	CASE WHEN PO.itemId = IIP.ITEM_ID THEN iip.QUANTITY*i.volumn ELSE MIP.QUANTITY*i.volumn END volumnM3
	,CONCAT ('T-', DATEPART(MONTH, p.CREATE_DATE),'/',DATEPART(YEAR, p.CREATE_DATE)) as [MONTH]
	,CONCAT ('', RIGHT(STUFF(DATEPART(WEEK, p.CREATE_DATE),1,0,'0'),2)) as [WEEK]
	,CONCAT (DATEPART(day, p.CREATE_DATE) ,
	'/', DATEPART(MONTH, p.CREATE_DATE)) as [dayOfmonth]
	, p.CREATE_DATE as [DATE]
	, d.ID departmentId FROM VCN.PO PO
    INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
    INNER JOIN vcn.ITEM I ON PO.itemId = I.id
    INNER JOIN base.UNIT U ON I.unitId = U.ID
    LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
    INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
    LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
    where p.CREATE_DATE BETWEEN @from AND @to and d.PARENT_ID = @factoryId
   ) T 
	GROUP BY T.NAME,T.[WEEK]
`)
    res.status(200).send(code.recordset)
})
VCN.get('/bc-san-luong-vcn-thang', async(req, res) => {
    const code = await new mssql.Request()
    .input('factoryId', req.query.factoryId)
    .input('from', req.query.from)
    .input('to', req.query.to)
    .query(`
    select T.NAME,T.[MONTH],SUM(QUANTITY) as [SUM],SUM(volumnM3) as [SUMM3]
	from 
	(
	SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME,
    CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY,
    CASE WHEN PO.itemId = IIP.ITEM_ID THEN iip.QUANTITY*i.volumn ELSE MIP.QUANTITY*i.volumn END volumnM3
    ,CONCAT ('Tháng ',RIGHT(STUFF(DATEPART(MONTH, p.CREATE_DATE),1,0,'0'),2)) as [MONTH]
	,CONCAT ('W-', DATEPART(WEEK, p.CREATE_DATE)) as [WEEK]
	,CONCAT (DATEPART(day, p.CREATE_DATE) ,
	'/', DATEPART(MONTH, p.CREATE_DATE)) as [dayOfmonth]
	, p.CREATE_DATE as [DATE]
	, d.ID departmentId FROM VCN.PO PO
    INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
    INNER JOIN vcn.ITEM I ON PO.itemId = I.id
    INNER JOIN base.UNIT U ON I.unitId = U.ID
    LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
    INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
    LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
    where p.CREATE_DATE BETWEEN @from AND @to and d.PARENT_ID = @factoryId
   ) T 
	GROUP BY T.NAME,T.[MONTH]
 
`)
    res.status(200).send(code.recordset)
})
VCN.get('/thuc-hien-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('fromWeek', req.query.fromWeek)
        .input('toWeek', req.query.toWeek)
        .input('year', req.query.year)
        .query(`
        SELECT number, week, d.NAME DEPARTMENT_NAME, I.name ITEM_NAME, I.height, I.width, I.length, keHoach, daThucHien, loiCongDon, loiLoai, case when keHoach = 0 then 0 else daThucHien/keHoach end TY_LE  FROM vcn.PO 
        INNER JOIN VCN.ITEM I ON PO.itemId = I.id 
        INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
        WHERE PO.factoryId = @factoryId AND week BETWEEN @fromWeek AND @toWeek AND year = @year and keHoach != 0 and endPO = 0

    `)
    res.status(200).send(code.recordset)
})
VCN.post('/he-so-quy-doi', async(req, res) => {
    new mssql.Request()
        .input('itemTruocRong', req.body.itemTruocRong)
        .input('heSo', req.body.heSo)
        .input('itemSauRong', req.body.itemSauRong)
        .input('accountId', req.body.accountId)
        .query(`
        insert into vcn.HE_SO_QUY_DOI(ITEM_TRUOC_RONG, HE_SO, ITEM_SAU_RONG, CREATED_BY, CREATED_AT)
        values (@itemTruocRong, @heSo, @itemSauRong, @accountId,GETDATE())
    `, (err, record) => {
        if (err) return res.api.sendFail(query);
        res.api.sendData(record.recordset);
    })
})
VCN.put('/he-so-quy-doi', async(req, res) => {
    new mssql.Request()
        .input('id', req.body.id)
        .input('itemTruocRong', req.body.itemTruocRong)
        .input('heSo', req.body.heSo)
        .input('itemSauRong', req.body.itemSauRong)
        .input('accountId', req.body.accountId)
        .query(`
        UPDATE VCN.HE_SO_QUY_DOI
        SET
        ITEM_TRUOC_RONG = @itemTruocRong,
        HE_SO = @heSo,
        ITEM_SAU_RONG = @itemSauRong,
        UPDATED_BY = @accountId,
        UPDATED_AT = GETDATE()
        WHERE ID = @id
    `, (err, record) => {
        if (err) return res.api.sendFail(query);
        res.api.sendData(record.recordset);
    })
})
VCN.delete('/he-so-quy-doi/:id', async(req, res) => {
    const code = await new mssql.Request()
        .input('id', req.params.id)
        .query(`
        DELETE FROM VCN.HE_SO_QUY_DOI
        WHERE ID = @id
    `, (err, record) => {
        if (err) return res.api.sendFail(query);
        res.api.sendData(record.recordset);
    })
})
VCN.get('/he-so-quy-doi', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        select ID, ITEM_TRUOC_RONG, HE_SO, ITEM_SAU_RONG from vcn.HE_SO_QUY_DOI
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/he-so-quy-doi-by-sp', async(req, res) => {
    const code = await new mssql.Request()
    .input('spTruocRong', req.query.spTruocRong)
    .input('spSauRong', req.query.spSauRong)
        .query(`
        select ID, ITEM_TRUOC_RONG, HE_SO, ITEM_SAU_RONG from vcn.HE_SO_QUY_DOI WHERE ITEM_TRUOC_RONG = @spTruocRong AND ITEM_SAU_RONG = @spSauRong
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/all-departments-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        SELECT ID, PARENT_ID, CODE, NAME, TYPE2, accountId, factoryId 
FROM base.DEPARTMENT WHERE PARENT_ID in ( 102744, 102745, 102498, 102531, 102817, 102818)

    `)
    res.status(200).send(code.recordset)
})
VCN.get('/item-child-in-lsx-vcn', async(req, res) => {
    const code = await new mssql.Request()
    .input("itemId", req.query.itemId)
    .input("number", req.query.number)
        .query(`
        select distinct i.id, '['+i.code+'] '+i.name name, i.length, i.width, i.height from vcn.PO po
        inner join vcn.ITEM i on po.itemId = i.id 
        where number = @number and itemId != @itemId
    `)
    res.status(200).send(code.recordset)
})
VCN.put('/nhan-phoi-loi-vcn', async(req, res) => {
    const code = await new mssql.Request()
    .input("id", req.body.id)
    .input("accountId", req.body.accountId)
        .query(`
        update vcn.PACKAGE set VERIFY_BY = @accountId, VERIFY_DATE = GETDATE() where ID = @id
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/item-type', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        select ID id, NAME name from vcn.ITEM_TYPE
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/bb-san-pham-loi-vcn', async(req, res) => {
    const code = await new mssql.Request()
    .input("start", req.query.start)
    .input("end", req.query.end)
    .input("factoryId", req.query.factoryId)
        .query(`
        select * from
            (SELECT  A.LAST_NAME, P.ID, D2.NAME ITEM_FROM_NAME, D.NAME DEPARTMENT_NAME, I.ID ITEM_ID,  CONCAT(I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') ITEM_NAME, PT.NAME TYPE_NAME, 
            CONCAT(R.NAME,' ',I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') REMEDIES_NAME, I.HEIGHT height, I.WIDTH width, 
            I.LENGTH length, IIP.QUANTITY, IIP.QUANTITY*I.VOLUMN AS KL, P.CREATE_DATE createDate, P.DESCRIPTION,
            D2.PARENT_ID factoryId
            FROM vcn.[PACKAGE] P
            INNER JOIN vcn.PACKAGE_TYPE PT ON P.TYPE_ID = PT.ID
            INNER JOIN vcn.REMEDIES R ON P.REMEDIES_ID = R.ID
            INNER JOIN vcn.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN vcn.ITEM I ON IIP.ITEM_ID = I.ID
            INNER JOIN base.DEPARTMENT D ON P.DESTINATION_ID = D.ID
            INNER JOIN base.DEPARTMENT D2 ON P.ITEM_FROM_ID = D2.ID
            INNER JOIN base.ACCOUNT A ON P.CREATE_BY = A.ID
            LEFT JOIN prod.QC_ITEM_ERROR IE ON P.ID = IE.PACKAGE_ID
            LEFT JOIN base.ACCOUNT AC on AC.ID = P.CREATE_BY
            WHERE SOURCE_ID = 102528
            AND P.CREATE_DATE BETWEEN @start AND @end AND P.VERIFY_BY IS NULL AND IE.PACKAGE_ID IS NULL) K
			where k.factoryId = @factoryId
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/qc-item-error-by-code', async(req, res) => {
    const code = await new mssql.Request()
    .input("code", req.query.code)
        .query(`
        SELECT A.LAST_NAME, P.ID, D2.NAME ITEM_FROM_NAME, D.NAME DEPARTMENT_NAME, I.ID ITEM_ID, CONCAT(I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') ITEM_NAME, PT.NAME TYPE_NAME, 
        CONCAT(R.NAME,' ',I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') REMEDIES_NAME, I.HEIGHT height, I.WIDTH width, 
        I.LENGTH length, IIP.QUANTITY, IIP.QUANTITY*I.VOLUMN AS KL, P.CREATE_DATE createDate, P.DESCRIPTION, IE.PACKAGE_ID, IE.VERIFY_BY, A2.LAST_NAME VERIFY_NAME, IE.QC_VERIFY_BY, A3.LAST_NAME QC_VERIFY_NAME
        FROM prod.QC_ITEM_ERROR IE
        INNER JOIN vcn.PACKAGE P ON IE.PACKAGE_ID = P.ID
        INNER JOIN vcn.PACKAGE_TYPE PT ON P.TYPE_ID = PT.ID
        INNER JOIN vcn.REMEDIES R ON P.REMEDIES_ID = R.ID
        INNER JOIN vcn.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
        INNER JOIN vcn.ITEM I ON IIP.ITEM_ID = I.ID
        INNER JOIN base.DEPARTMENT D ON P.DESTINATION_ID = D.ID
        INNER JOIN base.DEPARTMENT D2 ON P.ITEM_FROM_ID = D2.ID
        INNER JOIN base.ACCOUNT A ON IE.CREATED_BY = A.ID
        LEFT JOIN base.ACCOUNT A2 ON IE.VERIFY_BY = A2.ID
        LEFT JOIN base.ACCOUNT A3 ON IE.QC_VERIFY_BY = A3.ID
        WHERE IE.CODE = @code
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/qc-xu-ly-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('departmentId', req.query.departmentId)
        .input('FROM', req.query.from)
        .input('TO', req.query.to)
        .query(`
        WITH temp(id,NAME)
    as (
            Select id,NAME
            From base.DEPARTMENT
            Where ID = @departmentId
            Union All
            Select d.ID,d.NAME
            From temp as a, base.DEPARTMENT as d
            Where a.id = d.PARENT_ID
    )
    SELECT null tong,*
    FROM (
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
        GD.WEEK N'Tuần',
        GD.[DATE] N'Ngày',
        S.CODE N'Mã tổ QC',
        D.NAME N'Kho đến',
        PT.NAME N'Loại lỗi',
        RM.NAME N'Biện pháp xử lý',
        I.NAME N'Chi tiết/cụm',
        IIP.QUANTITY N'Số lượng',
        CB.LAST_NAME N'Người tạo',
        P.CREATE_DATE N'Ngày tạo',
        VB.LAST_NAME N'Người nhận',
        P.VERIFY_DATE N'Ngày nhận',
        D.ID,
        CB.factoryId hqc
      
        FROM vcn.PACKAGE P
        LEFT JOIN vcn.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
        LEFT JOIN vcn.REMEDIES RM ON RM.ID = P.REMEDIES_ID
        LEFT JOIN vcn.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.DEPARTMENT S ON S.ID = P.SOURCE_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.DESTINATION_ID
        LEFT JOIN vcn.ITEM I ON I.ID = IIP.ITEM_ID
        LEFT JOIN base.GLOBAL_DATE GD ON GD.[DATE] = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN base.ACCOUNT CB ON CB.ID = P.CREATE_BY
        LEFT JOIN base.ACCOUNT VB ON VB.ID = P.VERIFY_BY
            LEFT JOIN base.DEPARTMENT L0 ON L0.ID = S.ID
        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
       
        WHERE S.ID = 102528
        AND P.CREATE_DATE BETWEEN @FROM AND @TO
        ) X WHERE X.ID in (select ID
            From temp t)
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/sl-co-the-nhan', async(req, res) => {
    const code = await new mssql.Request()
        .input('number', req.query.number)
        .input('code', req.query.code)
        .input('stepId', req.query.stepId)
        .input('heSo', req.query.heSo)
        .query(`
        SELECT SUM(QUANTITY) as quantity FROM
        (
            select iip.QUANTITY*@heSo QUANTITY
            from vcn.PACKAGE p 
            inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
			inner join vcn.PO po on p.PO = po.code
            where number = @number and DESTINATION_ID = @stepId AND TYPE_ID = 100026 AND VERIFY_BY IS NOT NULL
			union all
			select iip.QUANTITY QUANTITY
            from vcn.PACKAGE p 
            inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
			inner join vcn.PO po on p.PO = po.code
            where number = @number and DESTINATION_ID = @stepId AND TYPE_ID != 100026 AND VERIFY_BY IS NOT NULL
            union all
            select CASE WHEN MIP.ID is not null THEN -MIP.QUANTITY ELSE -iip.QUANTITY  END as QUANTITY
            from vcn.PACKAGE p 
            inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
			INNER JOIN VCN.PO ON PO.code = P.PO
			LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = MIP.ITEM_IN_PACKAGE_ID
            where SOURCE_ID = @stepId AND po.number = @number
            union all
			select -QUANTITY QUANTITY from vcn.PACKAGE_TEMP where PO = @code
        ) AS T
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/sl-co-the-xuat', async(req, res) => {
    const code = await new mssql.Request()
        .input('code', req.query.code)
        .input('itemId', req.query.itemId)
        .query(`
        select SUM(QUANTITY) quantity from vcn.PACKAGE p
        inner join vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
        where PO = @code and ITEM_ID = @itemId
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/bc-lsx-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(`
        SELECT PO.number, D.NAME DEPARTMENT_NAME, SUM(IIP.QUANTITY) daThucHien
FROM VCN.PO PO 
INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
INNER JOIN VCN.PACKAGE P ON PO.code = P.PO
INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
WHERE PO.factoryId = @factoryId AND P.CREATE_DATE BETWEEN @from AND @to
GROUP BY PO.number, D.NAME
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/bc-vcn-theo-tuan', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(`
        SELECT NAME, ITEM_NAME, length, width, height, volumn, UNIT_NAME, [Monday], [Tuesday], [Wednesday], [Thursday], [Friday], [Saturday], [Sunday], departmentId FROM (
            SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME, 
			CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY, DATENAME(DW, P.CREATE_DATE) CREATED_AT, d.ID departmentId FROM VCN.PO PO
            INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
            INNER JOIN vcn.ITEM I ON PO.itemId = I.id
            INNER JOIN base.UNIT U ON I.unitId = U.ID
			LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
			INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
			LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
            WHERE PO.factoryId = @factoryId AND P.CREATE_DATE BETWEEN @from AND @to
            ) T 
            PIVOT
            (
            SUM(QUANTITY)
            FOR CREATED_AT IN ([Monday], [Tuesday], [Wednesday], [Thursday], [Friday], [Saturday], [Sunday])
            ) AS PIVOT_TABLE order by departmentId
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/bc-vcn-theo-tuancuanam', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(`
        SELECT NAME, ITEM_NAME, length, width, height, volumn, UNIT_NAME,
		CASE WHEN [w1] is NULL THEN '00.00' ELSE [w1] END AS [w1],
		CASE WHEN [w2] is NULL THEN '00.00' ELSE [w2] END AS [w2],
		CASE WHEN [w3] is NULL THEN '00.00' ELSE [w3] END AS [w3],
		CASE WHEN [w4] is NULL THEN '00.00' ELSE [w4] END AS [w4],
		CASE WHEN [w5] is NULL THEN '00.00' ELSE [w5] END AS [w5],
		CASE WHEN [w6] is NULL THEN '00.00' ELSE [w6] END AS [w6],
		CASE WHEN [w7] is NULL THEN '00.00' ELSE [w7] END AS [w7],
		CASE WHEN [w8] is NULL THEN '00.00' ELSE [w8] END AS [w8],
		CASE WHEN [w9] is NULL THEN '00.00' ELSE [w9] END AS [w9],
		CASE WHEN [w10] is NULL THEN '00.00' ELSE [w10] END AS [w10],
		CASE WHEN [w11] is NULL THEN '00.00' ELSE [w11] END AS [w11],
		CASE WHEN [w12] is NULL THEN '00.00' ELSE [w12] END AS [w12],
		CASE WHEN [w13] is NULL THEN '00.00' ELSE [w13] END AS [w13],
		CASE WHEN [w14] is NULL THEN '00.00' ELSE [w14] END AS [w14],
		CASE WHEN [w15] is NULL THEN '00.00' ELSE [w15] END AS [w15],
		CASE WHEN [w16] is NULL THEN '00.00' ELSE [w16] END AS [w16],
		CASE WHEN [w17] is NULL THEN '00.00' ELSE [w17] END AS [w17],
		CASE WHEN [w18] is NULL THEN '00.00' ELSE [w18] END AS [w18],
		CASE WHEN [w19] is NULL THEN '00.00' ELSE [w19] END AS [w19],
		CASE WHEN [w20] is NULL THEN '00.00' ELSE [w20] END AS [w20],
		CASE WHEN [w21] is NULL THEN '00.00' ELSE [w21] END AS [w21],
		CASE WHEN [w22] is NULL THEN '00.00' ELSE [w22] END AS [w22],
		CASE WHEN [w23] is NULL THEN '00.00' ELSE [w23] END AS [w23],
		CASE WHEN [w24] is NULL THEN '00.00' ELSE [w24] END AS [w24],
		CASE WHEN [w25] is NULL THEN '00.00' ELSE [w25] END AS [w25],
		CASE WHEN [w26] is NULL THEN '00.00' ELSE [w26] END AS [w26],
		CASE WHEN [w27] is NULL THEN '00.00' ELSE [w27] END AS [w27],
		CASE WHEN [w28] is NULL THEN '00.00' ELSE [w28] END AS [w28],
		CASE WHEN [w29] is NULL THEN '00.00' ELSE [w29] END AS [w29],
		CASE WHEN [w30] is NULL THEN '00.00' ELSE [w30] END AS [w30],
		CASE WHEN [w31] is NULL THEN '00.00' ELSE [w31] END AS [w31],
		CASE WHEN [w32] is NULL THEN '00.00' ELSE [w32] END AS [w32],
		CASE WHEN [w33] is NULL THEN '00.00' ELSE [w33] END AS [w33],
		CASE WHEN [w34] is NULL THEN '00.00' ELSE [w34] END AS [w34],
		CASE WHEN [w35] is NULL THEN '00.00' ELSE [w35] END AS [w35],
		CASE WHEN [w36] is NULL THEN '00.00' ELSE [w36] END AS [w36],
		CASE WHEN [w37] is NULL THEN '00.00' ELSE [w37] END AS [w37],
		CASE WHEN [w38] is NULL THEN '00.00' ELSE [w38] END AS [w38],
		CASE WHEN [w39] is NULL THEN '00.00' ELSE [w39] END AS [w39],
		CASE WHEN [w40] is NULL THEN '00.00' ELSE [w40] END AS [w40],
		CASE WHEN [w41] is NULL THEN '00.00' ELSE [w41] END AS [w41],
		CASE WHEN [w42] is NULL THEN '00.00' ELSE [w42] END AS [w42],
		CASE WHEN [w43] is NULL THEN '00.00' ELSE [w43] END AS [w43],
		CASE WHEN [w44] is NULL THEN '00.00' ELSE [w44] END AS [w44],
		CASE WHEN [w45] is NULL THEN '00.00' ELSE [w45] END AS [w45],
		CASE WHEN [w46] is NULL THEN '00.00' ELSE [w46] END AS [w46],
		CASE WHEN [w47] is NULL THEN '00.00' ELSE [w47] END AS [w47],
		CASE WHEN [w48] is NULL THEN '00.00' ELSE [w48] END AS [w48],
		CASE WHEN [w49] is NULL THEN '00.00' ELSE [w49] END AS [w49],
		CASE WHEN [w50] is NULL THEN '00.00' ELSE [w50] END AS [w50],
		CASE WHEN [w51] is NULL THEN '00.00' ELSE [w51] END AS [w51],
		CASE WHEN [w52] is NULL THEN '00.00' ELSE [w52] END AS [w52],
		CASE WHEN [w53] is NULL THEN '00.00' ELSE [w53] END AS [w53]
       , departmentId 
       FROM (
           SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME, 
           CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY
           ,CONCAT (N'w', DATENAME(week, P.CREATE_DATE)) CREATED_AT,
           d.ID departmentId FROM VCN.PO PO
           INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
           INNER JOIN vcn.ITEM I ON PO.itemId = I.id
           INNER JOIN base.UNIT U ON I.unitId = U.ID
           LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
           INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
           LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
           WHERE PO.factoryId = @factoryId AND P.CREATE_DATE BETWEEN @from AND @to
           ) T 
          PIVOT
           (
           SUM(QUANTITY)
           FOR CREATED_AT IN ([w1], [w2],[w3],[w4],[w5],[w6],[w7],[w8],[w9],[w10],[w11], [w12],[w13],[w14],[w15],[w16],[w17]
           ,[w18],[w19],[w20],[w21], [w22],[w23],[w24],[w25],[w26],[w27],[w28],[w29],[w30],[w31], [w32],[w33],[w34],[w35],
           [w36],[w37],[w38],[w39],[w40],[w41], [w42],[w43],[w44],[w45],[w46],[w47],[w48],[w49],[w50],[w51],[w52],[w53])
           ) AS PIVOT_TABLE order by departmentId
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/bc-vcn-theo-tuancuanamM3', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(`
        SELECT NAME, ITEM_NAME, length, width, height, volumn, UNIT_NAME,
		CASE WHEN [w1] is NULL THEN '00.00' ELSE [w1] END AS [w1],
		CASE WHEN [w2] is NULL THEN '00.00' ELSE [w2] END AS [w2],
		CASE WHEN [w3] is NULL THEN '00.00' ELSE [w3] END AS [w3],
		CASE WHEN [w4] is NULL THEN '00.00' ELSE [w4] END AS [w4],
		CASE WHEN [w5] is NULL THEN '00.00' ELSE [w5] END AS [w5],
		CASE WHEN [w6] is NULL THEN '00.00' ELSE [w6] END AS [w6],
		CASE WHEN [w7] is NULL THEN '00.00' ELSE [w7] END AS [w7],
		CASE WHEN [w8] is NULL THEN '00.00' ELSE [w8] END AS [w8],
		CASE WHEN [w9] is NULL THEN '00.00' ELSE [w9] END AS [w9],
		CASE WHEN [w10] is NULL THEN '00.00' ELSE [w10] END AS [w10],
		CASE WHEN [w11] is NULL THEN '00.00' ELSE [w11] END AS [w11],
		CASE WHEN [w12] is NULL THEN '00.00' ELSE [w12] END AS [w12],
		CASE WHEN [w13] is NULL THEN '00.00' ELSE [w13] END AS [w13],
		CASE WHEN [w14] is NULL THEN '00.00' ELSE [w14] END AS [w14],
		CASE WHEN [w15] is NULL THEN '00.00' ELSE [w15] END AS [w15],
		CASE WHEN [w16] is NULL THEN '00.00' ELSE [w16] END AS [w16],
		CASE WHEN [w17] is NULL THEN '00.00' ELSE [w17] END AS [w17],
		CASE WHEN [w18] is NULL THEN '00.00' ELSE [w18] END AS [w18],
		CASE WHEN [w19] is NULL THEN '00.00' ELSE [w19] END AS [w19],
		CASE WHEN [w20] is NULL THEN '00.00' ELSE [w20] END AS [w20],
		CASE WHEN [w21] is NULL THEN '00.00' ELSE [w21] END AS [w21],
		CASE WHEN [w22] is NULL THEN '00.00' ELSE [w22] END AS [w22],
		CASE WHEN [w23] is NULL THEN '00.00' ELSE [w23] END AS [w23],
		CASE WHEN [w24] is NULL THEN '00.00' ELSE [w24] END AS [w24],
		CASE WHEN [w25] is NULL THEN '00.00' ELSE [w25] END AS [w25],
		CASE WHEN [w26] is NULL THEN '00.00' ELSE [w26] END AS [w26],
		CASE WHEN [w27] is NULL THEN '00.00' ELSE [w27] END AS [w27],
		CASE WHEN [w28] is NULL THEN '00.00' ELSE [w28] END AS [w28],
		CASE WHEN [w29] is NULL THEN '00.00' ELSE [w29] END AS [w29],
		CASE WHEN [w30] is NULL THEN '00.00' ELSE [w30] END AS [w30],
		CASE WHEN [w31] is NULL THEN '00.00' ELSE [w31] END AS [w31],
		CASE WHEN [w32] is NULL THEN '00.00' ELSE [w32] END AS [w32],
		CASE WHEN [w33] is NULL THEN '00.00' ELSE [w33] END AS [w33],
		CASE WHEN [w34] is NULL THEN '00.00' ELSE [w34] END AS [w34],
		CASE WHEN [w35] is NULL THEN '00.00' ELSE [w35] END AS [w35],
		CASE WHEN [w36] is NULL THEN '00.00' ELSE [w36] END AS [w36],
		CASE WHEN [w37] is NULL THEN '00.00' ELSE [w37] END AS [w37],
		CASE WHEN [w38] is NULL THEN '00.00' ELSE [w38] END AS [w38],
		CASE WHEN [w39] is NULL THEN '00.00' ELSE [w39] END AS [w39],
		CASE WHEN [w40] is NULL THEN '00.00' ELSE [w40] END AS [w40],
		CASE WHEN [w41] is NULL THEN '00.00' ELSE [w41] END AS [w41],
		CASE WHEN [w42] is NULL THEN '00.00' ELSE [w42] END AS [w42],
		CASE WHEN [w43] is NULL THEN '00.00' ELSE [w43] END AS [w43],
		CASE WHEN [w44] is NULL THEN '00.00' ELSE [w44] END AS [w44],
		CASE WHEN [w45] is NULL THEN '00.00' ELSE [w45] END AS [w45],
		CASE WHEN [w46] is NULL THEN '00.00' ELSE [w46] END AS [w46],
		CASE WHEN [w47] is NULL THEN '00.00' ELSE [w47] END AS [w47],
		CASE WHEN [w48] is NULL THEN '00.00' ELSE [w48] END AS [w48],
		CASE WHEN [w49] is NULL THEN '00.00' ELSE [w49] END AS [w49],
		CASE WHEN [w50] is NULL THEN '00.00' ELSE [w50] END AS [w50],
		CASE WHEN [w51] is NULL THEN '00.00' ELSE [w51] END AS [w51],
		CASE WHEN [w52] is NULL THEN '00.00' ELSE [w52] END AS [w52],
		CASE WHEN [w53] is NULL THEN '00.00' ELSE [w53] END AS [w53]
       , departmentId 
       FROM (
           SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME, 
           CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY,
		   CASE WHEN PO.itemId = IIP.ITEM_ID THEN iip.QUANTITY*i.volumn ELSE MIP.QUANTITY*i.volumn END volumnM3
           ,CONCAT (N'w', DATENAME(week, P.CREATE_DATE)) CREATED_AT,
           d.ID departmentId FROM VCN.PO PO
           INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
           INNER JOIN vcn.ITEM I ON PO.itemId = I.id
           INNER JOIN base.UNIT U ON I.unitId = U.ID
           LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
           INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
           LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
           WHERE PO.factoryId = @factoryId AND P.CREATE_DATE BETWEEN @from AND @to
           ) T 
          PIVOT
           (
           SUM(volumnM3)
           FOR CREATED_AT IN ([w1], [w2],[w3],[w4],[w5],[w6],[w7],[w8],[w9],[w10],[w11], [w12],[w13],[w14],[w15],[w16],[w17]
           ,[w18],[w19],[w20],[w21], [w22],[w23],[w24],[w25],[w26],[w27],[w28],[w29],[w30],[w31], [w32],[w33],[w34],[w35],
           [w36],[w37],[w38],[w39],[w40],[w41], [w42],[w43],[w44],[w45],[w46],[w47],[w48],[w49],[w50],[w51],[w52],[w53])
           ) AS PIVOT_TABLE order by departmentId
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/bc-vcn-theo-thangcuanam', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(`
        SELECT NAME, ITEM_NAME, length, width, height, volumn, UNIT_NAME,
		CASE WHEN January is NULL THEN '00.00' ELSE January END AS January,
		CASE WHEN February is NULL THEN '00.00' ELSE February END AS February,
		CASE WHEN March is NULL THEN '00.00' ELSE March END AS March,
		CASE WHEN April is NULL THEN '00.00' ELSE April END AS April,
		CASE WHEN May is NULL THEN '00.00' ELSE May END AS May,
		CASE WHEN June is NULL THEN '00.00' ELSE June END AS June,
		CASE WHEN July is NULL THEN '00.00' ELSE July END AS July,
		CASE WHEN August is NULL THEN '00.00' ELSE August END AS August,
		CASE WHEN September is NULL THEN '00.00' ELSE September END AS September,
		CASE WHEN October is NULL THEN '00.00' ELSE October END AS October,
		CASE WHEN November is NULL THEN '00.00' ELSE November END AS November,
		CASE WHEN December is NULL THEN '00.00' ELSE December END AS December
       , departmentId 
       FROM (
           SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME, 
           CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY
           ,DATENAME(MONTH, P.CREATE_DATE) CREATED_AT,
           d.ID departmentId FROM VCN.PO PO
           INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
           INNER JOIN vcn.ITEM I ON PO.itemId = I.id
           INNER JOIN base.UNIT U ON I.unitId = U.ID
           LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
           INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
           LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
           WHERE PO.factoryId = @factoryId AND P.CREATE_DATE BETWEEN @from AND @to
           ) T 
          PIVOT
           (
           SUM(QUANTITY)
           FOR CREATED_AT IN (January, February,March,April,May,June,July,August,September,October,November, December)
           ) AS PIVOT_TABLE order by departmentId
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/bc-vcn-theo-thangcuanamM3', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .input('from', req.query.from)
        .input('to', req.query.to)
        .query(`
        SELECT NAME, ITEM_NAME, length, width, height, volumn, UNIT_NAME,
		CASE WHEN January is NULL THEN '00.00' ELSE January END AS January,
		CASE WHEN February is NULL THEN '00.00' ELSE February END AS February,
		CASE WHEN March is NULL THEN '00.00' ELSE March END AS March,
		CASE WHEN April is NULL THEN '00.00' ELSE April END AS April,
		CASE WHEN May is NULL THEN '00.00' ELSE May END AS May,
		CASE WHEN June is NULL THEN '00.00' ELSE June END AS June,
		CASE WHEN July is NULL THEN '00.00' ELSE July END AS July,
		CASE WHEN August is NULL THEN '00.00' ELSE August END AS August,
		CASE WHEN September is NULL THEN '00.00' ELSE September END AS September,
		CASE WHEN October is NULL THEN '00.00' ELSE October END AS October,
		CASE WHEN November is NULL THEN '00.00' ELSE November END AS November,
		CASE WHEN December is NULL THEN '00.00' ELSE December END AS December
       , departmentId 
       FROM (
           SELECT D.NAME, I.name ITEM_NAME, I.length, I.width, I.height, I.volumn, U.NAME UNIT_NAME, 
           CASE WHEN PO.itemId = IIP.ITEM_ID THEN IIP.QUANTITY ELSE MIP.QUANTITY END QUANTITY,
           CASE WHEN PO.itemId = IIP.ITEM_ID THEN iip.QUANTITY*i.volumn ELSE MIP.QUANTITY*i.volumn END volumnM3
           ,DATENAME(MONTH, P.CREATE_DATE) CREATED_AT,
           d.ID departmentId FROM VCN.PO PO
           INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
           INNER JOIN vcn.ITEM I ON PO.itemId = I.id
           INNER JOIN base.UNIT U ON I.unitId = U.ID
           LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO
           INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
           LEFT JOIN VCN.MATERIALS_IN_PACKAGE MIP ON IIP.ID = mip.ITEM_IN_PACKAGE_ID
           WHERE PO.factoryId = @factoryId AND P.CREATE_DATE BETWEEN @from AND @to
           ) T 
          PIVOT
           (
           SUM(volumnM3)
           FOR CREATED_AT IN (January, February,March,April,May,June,July,August,September,October,November, December)
           ) AS PIVOT_TABLE order by departmentId
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/department-by-factory', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(`
        select ID, NAME from base.DEPARTMENT where PARENT_ID = @factoryId
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/xuat-nhap-ton-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('from', req.query.from)
        .input('to', req.query.to)
        .input('factoryId', req.query.factoryId)
        .query(`
        WITH CTE AS
        (	
			select NULL ID, OS.ITEM_ID, I.height, I.width, I.length, I.name, OS.DEPARTMENT_ID STEP_ID,
			OS.QUANTITY, OS.CREATED_AT CREATE_DATE, 100026 TYPE_ID, I.volumn
			from vcn.OPENING_STOCK OS LEFT JOIN
			vcn.ITEM I ON OS.ITEM_ID = I.id LEFT JOIN
            base.DEPARTMENT d on OS.DEPARTMENT_ID = d.ID
			where CREATED_AT <= @to AND OS.CLOSED = 1 and d.PARENT_ID = @factoryId
			union all
			SELECT NULL ID, PO.itemId, I.height, I.width, I.length, I.name, PO.stepId, PO.daThucHien, PO.approvedPKDAt, 100026, I.volumn 
			FROM vcn.PO LEFT JOIN VCN.ITEM I ON PO.itemId = I.id 
			WHERE PO.[order] = 1 AND PO.approvedPKDAt <= @to AND PO.factoryId = @factoryId
			union all
            SELECT P.ID, I.id ITEM_ID, I.height, I.width, I.length, I.name, DESTINATION_ID STEP_ID, 
			IIP.QUANTITY, CREATE_DATE, TYPE_ID, i.volumn  FROM VCN.PACKAGE P 
            INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.DEPARTMENT D ON P.DESTINATION_ID = D.ID
			INNER JOIN VCN.PO ON P.PO = PO.code
			INNER JOIN VCN.ITEM I ON PO.itemId = I.id
            WHERE D.PARENT_ID = @factoryId and KH_VERIFY_BY is null and p.TYPE_ID = 100026 
			AND PO.itemId = PO.itemId and p.DESTINATION_ID not in (102760, 102770, 102763, 102752)
            UNION ALL
            SELECT P.ID, I.id ITEM_ID, I.height, I.width, I.length, I.name, SOURCE_ID STEP_ID, 
			-IIP.QUANTITY QUANTITY, CREATE_DATE, TYPE_ID, i.volumn  FROM VCN.PACKAGE P 
            INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.DEPARTMENT D ON P.SOURCE_ID = D.ID
            INNER JOIN VCN.PO ON P.PO = PO.CODE
			INNER JOIN VCN.ITEM I ON PO.itemId = I.id
            WHERE D.PARENT_ID = @factoryId and KH_VERIFY_BY is null and p.TYPE_ID in (100026, 100004) 
			AND PO.itemId = PO.itemId
        )

        SELECT distinct STEP_ID, name, height, width, length, TON_DAU_KY , TON_DAU_KY*volumn TON_DAU_KY_M3,
		NHAP, NHAP*volumn NHAP_M3, XUAT, XUAT*volumn XUAT_M3, LOI, LOI*volumn LOI_M3
        FROM 
        (
        SELECT CTE.STEP_ID , CTE.name , volumn,height, width, length,
        TON_DAU_KY, 
        (
		SELECT SUM(QUANTITY) FROM CTE cte2 
		WHERE QUANTITY > 0 AND CREATE_DATE BETWEEN @from AND @to
		and cte2.ITEM_ID = CTE.ITEM_ID and cte2.STEP_ID = CTE.STEP_ID
		) NHAP, 
        (
		SELECT SUM(-QUANTITY) FROM CTE cte3 
		WHERE QUANTITY < 0 AND CREATE_DATE BETWEEN @from AND @to
		and cte3.ITEM_ID = CTE.ITEM_ID and cte3.STEP_ID = CTE.STEP_ID) XUAT,
        (
        SELECT SUM(-QUANTITY) FROM CTE cte3 
		WHERE QUANTITY < 0 AND CREATE_DATE BETWEEN @from AND @to
		and cte3.TYPE_ID = 100004 and cte3.ITEM_ID = CTE.ITEM_ID and cte3.STEP_ID = CTE.STEP_ID) LOI
        FROM CTE 
        LEFT JOIN (SELECT STEP_ID,ITEM_ID, SUM(QUANTITY) TON_DAU_KY FROM CTE 	
		WHERE CREATE_DATE < @from GROUP BY ITEM_ID, STEP_ID) TDK 
		ON CTE.ITEM_ID = TDK.ITEM_ID AND CTE.STEP_ID = TDK.STEP_ID
        ) T
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/lvl-xuat-nhap-ton-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('from', req.query.from)
        .input('to', req.query.to)
        .input('factoryId', req.query.factoryId)
        .query(`
        WITH CTE AS
        (
            SELECT P.ID, I.id ITEN_ID, I.height, I.width, I.length, I.name, DESTINATION_ID STEP_ID, 
			IIP.QUANTITY*i.volumn volumn, CREATE_DATE, TYPE_ID FROM VCN.PACKAGE P 
            INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.DEPARTMENT D ON P.DESTINATION_ID = D.ID
			INNER JOIN VCN.PO ON P.PO = PO.code
			INNER JOIN VCN.ITEM I ON PO.itemId = I.id
            WHERE D.PARENT_ID = @factoryId and p.TYPE_ID = 100026 AND PO.itemId = PO.itemId 
			and p.DESTINATION_ID not in (102760, 102770, 102763, 102752)
            UNION ALL
            SELECT P.ID, I2.id ITEN_ID, I2.height, I2.width, I2.length, I2.name, SOURCE_ID STEP_ID, 
			-IIP.QUANTITY*i.volumn volumn, CREATE_DATE, TYPE_ID   FROM VCN.PACKAGE P 
            INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.DEPARTMENT D ON P.SOURCE_ID = D.ID
            INNER JOIN VCN.PO ON P.PO = PO.CODE
			INNER JOIN VCN.ITEM I ON PO.itemId = I.id
			inner join vcn.HE_SO_QUY_DOI hs on i.id = hs.ITEM_SAU_RONG
			inner join vcn.ITEM i2 on hs.ITEM_TRUOC_RONG = i2.id
            WHERE D.PARENT_ID = @factoryId and p.TYPE_ID = 100026 AND PO.itemId = PO.itemId 
			and p.SOURCE_ID not in (102753, 102749,102761,102764)	
        )

        SELECT null tong,STEP_ID , name, height, width, length, TON_DAU_KY_M3, 
        SUM(NHAP) NHAP_M3, SUM(XUAT) XUAT_M3, LOI LOI_M3
        FROM 
        (
        SELECT CTE.STEP_ID , CTE.name,height, width, length,
        TON_DAU_KY_M3, 
        CASE WHEN volumn > 0 THEN volumn ELSE 0 END NHAP, 
        CASE WHEN volumn < 0 THEN -volumn ELSE 0 END XUAT,
			(
			SELECT SUM(QUANTITY*I2.volumn) LOI FROM VCN.PACKAGE P2
			INNER JOIN VCN.ITEM_IN_PACKAGE IIP2  ON P2.ID = IIP2.PACKAGE_ID
			INNER JOIN VCN.ITEM I2 ON IIP2.ITEM_ID = I2.id
			WHERE  CREATE_DATE BETWEEN @from AND @to AND P2.TYPE_ID = 100004 
            AND IIP2.ITEM_ID = CTE.ITEN_ID AND P2.ITEM_FROM_ID = CTE.STEP_ID 
			) AS LOI
        FROM CTE 
        LEFT JOIN (
		SELECT STEP_ID,name, SUM(volumn) TON_DAU_KY_M3 FROM CTE 
		WHERE CREATE_DATE < @from GROUP BY name, STEP_ID) 
		TDK ON CTE.name = TDK.name AND CTE.STEP_ID = TDK.STEP_ID
        LEFT JOIN (SELECT STEP_ID,name, SUM(-volumn) LOI FROM CTE 
		WHERE CREATE_DATE BETWEEN @from AND @to
		AND TYPE_ID != 100026 GROUP BY name, STEP_ID ) 
		L ON CTE.name = L.name AND CTE.STEP_ID = L.STEP_ID
        WHERE CREATE_DATE BETWEEN @from AND @to
        ) T
        GROUP BY STEP_ID ,name, TON_DAU_KY_M3, LOI, height, width, length
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/lsx-theo-cong-doan', async(req, res) => {
    const factoryId = req.query.factoryId;
    let query = null;
    if(factoryId == 102531){
        query = `
        select *, a.[102751]/keHoach TY_LE, (a.[102751]+loiLoai)/keHoach TY_LE_HOAN_THANH from 
(
SELECT *
FROM
(
select PO.number, i.name, i.height, i.width, i.length, 'm3' UNIT_NAME, keHoach*i.volumn keHoach, 
po.stepId DEPARTMENT_NAME, iip.QUANTITY*i.volumn volumn,  t2.loiLoai from vcn.PO inner join
vcn.ITEM i on PO.itemId = i.id inner join 
vcn.PACKAGE p on po.code = p.PO inner join
vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID inner join
(
    select po2.number, po2.loiLoai*i2.volumn loiLoai from vcn.PO po2 inner join vcn.ITEM i2 on po2.itemId = i2.id
    where [order] = 2 and quantity != 0
    ) t2 on t2.number = PO.number
where po.[order] = 1 and po.factoryId = 102531 and p.TYPE_ID = 100026 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
union all
select PO.number, t.name, t.height, t.width, t.length, t.UNIT_NAME, t.keHoach,
po.stepId DEPARTMENT_NAME, sum(iip.QUANTITY*i.volumn) volumn, loiLoai*i.volumn loiLoai from vcn.PO inner join
vcn.ITEM i on PO.itemId = i.id inner join 
base.UNIT u on i.unitId = u.ID inner join
vcn.PACKAGE p on po.code = p.PO inner join
vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join (
select number,i.name, i.height, i.width, i.length, 'm3' UNIT_NAME, keHoach*i.volumn keHoach from vcn.PO 
inner join vcn.ITEM i on po.itemId = i.id
where [order] = 1 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
) as t on po.number = t.number
where po.[order] = 2 and po.factoryId = 102531 and p.TYPE_ID = 100026 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
group by PO.number, po.stepId, t.name, t.height, t.width, t.length, t.UNIT_NAME, t.keHoach, loiLoai,i.volumn 
) AS BangNguon
PIVOT
(
SUM(volumn)
FOR DEPARTMENT_NAME IN ([102749], [102751])
) AS BangChuyen
) a

        `
    }else if(factoryId == 102744){
        query = `
        select *, a.[102762]/keHoach TY_LE, (a.[102762]+loiLoai)/keHoach TY_LE_HOAN_THANH from 
(
SELECT *
FROM
(
select PO.number, i.name, i.height, i.width, i.length, 'm3' UNIT_NAME, keHoach*i.volumn keHoach, 
po.stepId DEPARTMENT_NAME, iip.QUANTITY*i.volumn volumn, t2.loiLoai
from vcn.PO inner join
vcn.ITEM i on PO.itemId = i.id inner join 
vcn.PACKAGE p on po.code = p.PO inner join
vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID inner join
(
select po2.number, po2.loiLoai*i2.volumn loiLoai from vcn.PO po2 inner join vcn.ITEM i2 on po2.itemId = i2.id
where [order] = 2 and quantity != 0
) t2 on t2.number = PO.number
where po.[order] = 1 and po.factoryId = 102744 and p.TYPE_ID = 100026 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
union all
select PO.number, t.name, t.height, t.width, t.length, t.UNIT_NAME, t.keHoach,
po.stepId DEPARTMENT_NAME, sum(iip.QUANTITY*i.volumn) volumn, loiLoai*i.volumn loiLoai from vcn.PO inner join
vcn.ITEM i on PO.itemId = i.id inner join 
base.UNIT u on i.unitId = u.ID inner join
vcn.PACKAGE p on po.code = p.PO inner join
vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join (
select number,i.name, i.height, i.width, i.length, 'm3' UNIT_NAME, keHoach*i.volumn keHoach from vcn.PO 
inner join vcn.ITEM i on po.itemId = i.id
where [order] = 1 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
) as t on po.number = t.number
where po.[order] = 2 and po.factoryId = 102744 and p.TYPE_ID = 100026 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
group by PO.number, po.stepId, t.name, t.height, t.width, t.length, t.UNIT_NAME, t.keHoach, loiLoai,i.volumn 
) AS BangNguon
PIVOT
(
SUM(volumn)
FOR DEPARTMENT_NAME IN ([102761], [102762])
) AS BangChuyen
) a
        `
    } else if(factoryId == 102818){
        query = `
        select *, a.[102820]/keHoach TY_LE, (a.[102820]+loiLoai)/keHoach TY_LE_HOAN_THANH from 
(
SELECT *
FROM
(
select PO.number, i.name, i.height, i.width, i.length, 'm3' UNIT_NAME, keHoach*i.volumn keHoach, 
po.stepId DEPARTMENT_NAME, iip.QUANTITY*i.volumn volumn, t2.loiLoai
from vcn.PO inner join
vcn.ITEM i on PO.itemId = i.id inner join 
vcn.PACKAGE p on po.code = p.PO inner join
vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID inner join
(
select po2.number, po2.loiLoai*i2.volumn loiLoai from vcn.PO po2 inner join vcn.ITEM i2 on po2.itemId = i2.id
where [order] = 2 and quantity != 0
) t2 on t2.number = PO.number
where po.[order] = 1 and po.factoryId = 102818 and p.TYPE_ID = 100026 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
union all
select PO.number, t.name, t.height, t.width, t.length, t.UNIT_NAME, t.keHoach,
po.stepId DEPARTMENT_NAME, sum(iip.QUANTITY*i.volumn) volumn, loiLoai*i.volumn loiLoai from vcn.PO inner join
vcn.ITEM i on PO.itemId = i.id inner join 
base.UNIT u on i.unitId = u.ID inner join
vcn.PACKAGE p on po.code = p.PO inner join
vcn.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
inner join (
select number,i.name, i.height, i.width, i.length, 'm3' UNIT_NAME, keHoach*i.volumn keHoach from vcn.PO 
inner join vcn.ITEM i on po.itemId = i.id
where [order] = 1 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
) as t on po.number = t.number
where po.[order] = 2 and po.factoryId = 102818 and p.TYPE_ID = 100026 and po.approvedPKDAt between '${req.query.from}' and '${req.query.to}'
group by PO.number, po.stepId, t.name, t.height, t.width, t.length, t.UNIT_NAME, t.keHoach, loiLoai,i.volumn 
) AS BangNguon
PIVOT
(
SUM(volumn)
FOR DEPARTMENT_NAME IN ([102819], [102820])
) AS BangChuyen
) a
        `
    }
    else{
        query = `
        DECLARE 
    @columns NVARCHAR(MAX) = '',
	@factoryId INT = ${req.query.factoryId},
	@from datetime = '${req.query.from}',
	@to datetime = '${req.query.to}',
    @sql   NVARCHAR(MAX) = '';

-- select the category names
WITH temp(NAME)
  as (
    SELECT ID FROM base.DEPARTMENT WHERE PARENT_ID = @factoryId AND TYPE != 'QC'
  )
SELECT 
    @columns+=QUOTENAME(NAME) + ','
FROM 
    temp
ORDER BY 
    NAME;

-- remove the last comma
SET @columns = LEFT(@columns, LEN(@columns) - 1);

-- construct dynamic SQL
DECLARE @ParamDefinition NVARCHAR(MAX)
SELECT  @ParamDefinition= ' @factoryId1 INT, @from1 datetime, @to1 datetime'
SET @sql =N'
 SELECT *
FROM
(SELECT PO.number, I.name, I.height, I.width, I.length, U.NAME UNIT_NAME, PO.keHoach, D.ID DEPARTMENT_NAME, T.loiLoai, T.TY_LE, t.TY_LE_HOAN_THANH, IIP.QUANTITY 
FROM VCN.PO
INNER JOIN VCN.PACKAGE P ON PO.code = P.PO
INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
INNER JOIN VCN.ITEM I ON IIP.ITEM_ID = I.id
INNER JOIN base.UNIT U ON I.unitId = U.ID
INNER JOIN base.DEPARTMENT D ON P.SOURCE_ID = D.ID
INNER JOIN (
SELECT PO.number, loiLoai, 
CASE 
WHEN PO.daThucHien > 0 AND PO.keHoach > 0 THEN PO.daThucHien/PO.keHoach 
ELSE 0 END TY_LE,
CASE 
WHEN (PO.daThucHien > 0 OR po.loiLoai > 0) AND PO.keHoach > 0 THEN (PO.daThucHien+ PO.loiLoai)/PO.keHoach 
ELSE 0 END TY_LE_HOAN_THANH
 FROM VCN.PO INNER JOIN 
(
select number, MAX(po.[order]) [ORDER] from vcn.PO
inner join base.DEPARTMENT d on po.stepId = d.ID
where D.ID NOT IN (102752 ,102757, 102760, 102763, 102767, 102770) and po.factoryId = @factoryId1
group by number
) AS T ON PO.number = T.number AND PO.[order] = T.[ORDER]
) T ON PO.number = T.number
WHERE PO.factoryId = @factoryId1 and p.TYPE_ID = 100026 and po.approvedPKDAt between @from1 and @to1
) AS BangNguon
PIVOT
(
SUM(QUANTITY)
FOR DEPARTMENT_NAME IN ('+ @columns +')
) AS BangChuyen;';

-- execute the dynamic SQL
EXECUTE sp_executesql @sql, @ParamDefinition, @factoryId1 = @factoryId, @from1 = @from, @to1 = @to;
        `
    }

    const code = await new mssql.Request()
        .query(query)
    res.status(200).send(code.recordset)
})
VCN.get('/struct', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        select distinct number, strucre from vcn.PO where [order] = 1 and factoryId = ${req.query.factoryId}
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/raw', async(req, res) => {
    const code = await new mssql.Request()
        .input('FACTORY_ID', req.query.factoryId)
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
        Select *
        From temp D
		LEFT JOIN View_raw_data_vcn V ON V.DEPARTMENT_ID = D.ID
		WHERE [Ngày tạo] BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
        order by [Ngày tạo]
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/report-gop-cong-doan-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('FACTORY_ID', req.query.factoryId)
        .query(`
        SELECT ITEM_NAME, DEPARTMENT_NAME, QUANTITY, DA_THUC_HIEN, LOI_LOAI, (QUANTITY - DA_THUC_HIEN - LOI_LOAI) CON_THUC_HIEN FROM (
            SELECT I.name ITEM_NAME, D.NAME DEPARTMENT_NAME, SUM(quantity) QUANTITY, SUM(daThucHien) DA_THUC_HIEN, SUM(loiLoai) LOI_LOAI 
            FROM vcn.PO
            INNER JOIN VCN.ITEM I ON PO.itemId = I.id
            INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
            WHERE PO.factoryId = @FACTORY_ID AND quantity != 0
            GROUP BY I.name, D.NAME
            ) A
            ORDER BY ITEM_NAME, DEPARTMENT_NAME
    `)
    res.status(200).send(code.recordset)
})
VCN.get("/:stepId/ghi-nhan-SL", async (req, res, next) => {
    new mssql.Request()
        .input("from", req.query.from)
        .input("to", req.query.to)
        .input("stepId", req.params.stepId)
        .query(
            `select itemId,name,HEIGHT,WIDTH,LENGTH,sum(QUANTITY) QUANTITY from [dbo].[View_ItemInPackagesVCN]
        where stepId1 =@stepId and createdAt2 between @from and @to
        group by itemId,name,HEIGHT,WIDTH,LENGTH
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
VCN.get("/week", async (req, res, next) => {
    new mssql.Request()
        .input("year", req.query.year)
        .input("week", req.query.week)
        .input("factoryId", req.query.factoryId)
        .query(
            `
            SELECT DEPARTMENT_NAME, ITEM_NAME, length, width, height, number, keHoach, UNIT_NAME,
[thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn] FROM
(SELECT D.NAME DEPARTMENT_NAME, I.name ITEM_NAME, I.length, I.width, I.height, PO.number, PO.keHoach, 
U.NAME UNIT_NAME, IIP.QUANTITY,
case	
        when DATEPART(WEEKDAY,P.CREATE_DATE) = 2 then 'Thu2'
        when DATEPART(WEEKDAY,P.CREATE_DATE) = 3 then 'Thu3'
        when DATEPART(WEEKDAY,P.CREATE_DATE) = 4 then 'Thu4'
        when DATEPART(WEEKDAY,P.CREATE_DATE) = 5 then 'Thu5'
        when DATEPART(WEEKDAY,P.CREATE_DATE) = 6 then 'Thu6'
        when DATEPART(WEEKDAY,P.CREATE_DATE) = 7 then 'Thu7'
        when DATEPART(WEEKDAY,P.CREATE_DATE) = 1 then 'cn'
		END AS THU
FROM vcn.PO 
LEFT JOIN VCN.PACKAGE P ON PO.code = P.PO AND DATEPART(WEEK, P.CREATE_DATE) <= @week
LEFT JOIN VCN.ITEM I ON PO.itemId = I.id
LEFT JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
LEFT JOIN base.DEPARTMENT D ON PO.stepId = D.ID
LEFT JOIN base.UNIT U ON I.unitId = U.ID
WHERE PO.factoryId = @factoryId and year = @year and po.approvedByAccount is not null and po.approvedPKDBy is not null and po.endPO = 0
) AS BANG_NGUON
PIVOT
(
SUM(QUANTITY)
for thu in ([thu2],[thu3],[thu4],[thu5],[thu6],[thu7],[cn])
) AS BANG_CHUYEN
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
VCN.get('/defect', async(req, res) => {
    const code = await new mssql.Request()
        .input('FACTORY_ID', req.query.factoryId)
        .query(`
        SELECT null tong,DATEPART(WEEK, P.CREATE_DATE) [WEEK], D.NAME DEPARTMENT_NAME, D2.NAME SOURCE_NAME,
I.name ITEM_NAME, IIP.QUANTITY, A.LAST_NAME, P.CREATE_DATE  FROM VCN.PO
INNER JOIN VCN.PACKAGE P ON PO.code = P.PO
INNER JOIN VCN.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
INNER JOIN base.DEPARTMENT D2 ON P.SOURCE_ID = D2.ID
INNER JOIN VCN.ITEM I ON PO.itemId = I.ID
INNER JOIN base.ACCOUNT A ON P.CREATE_BY = A.ID
WHERE P.TYPE_ID = 100004 AND po.factoryId = @FACTORY_ID 
AND p.CREATE_DATE BETWEEN  '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/item-sau-dong', async(req, res) => {
    const code = await new mssql.Request()
        .input('number', req.query.number)
        .query(`
        select distinct i.id, i.name, po.soLuongSauDong quantity from vcn.PO
inner join vcn.ITEM i on po.spSauDong = i.id
where number = @number
union
select distinct i.id, i.name, po.slSauDong2 quantity from vcn.PO
inner join vcn.ITEM i on po.spSauDong2 = i.id
where number = @number
union
select distinct i.id, i.name, po.slSauDong3 quantity from vcn.PO
inner join vcn.ITEM i on po.spSauDong3 = i.id
where number = @number
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/get-department-by-factory-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('factoryId', req.query.factoryId)
        .query(`
        select ID, NAME from base.DEPARTMENT where PARENT_ID = @factoryId
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/item-in-department-name-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('fromDate', req.query.fromDate)
        .input('toDate', req.query.toDate)
        .query(`
        select [Chi tiết/cụm] itemName, SUM([Số lượng]*volumn) m3 ,
        (select SUM([Số lượng]*volumn) from View_raw_data_vcn where [Ngày tạo] between @fromDate and @toDate and Tổ = N'${req.query.departmentName}') as total
        
        from View_raw_data_vcn
        where [Ngày tạo] between @fromDate and @toDate and Tổ = N'${req.query.departmentName}'
        group by [Chi tiết/cụm]
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/item-in-ton-department-name-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('toDate', req.query.toDate)
        .query(`
        select name, SUM(QUANTITY*volumn) KL , 
(
select SUM(QUANTITY*volumn) 
from View_TON_CONG_DOAN_VCN 
where departmentName = N'${req.query.departmentName}' and CREATE_DATE <= @toDate) as total
        from View_TON_CONG_DOAN_VCN 
        where departmentName = N'${req.query.departmentName}' and CREATE_DATE <= @toDate
        group by name
    `)
    res.status(200).send(code.recordset)
})

VCN.post('/chart-san-luong-week-cong-doan-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('fromDate', req.body.fromDate)
        .input('toDate', req.body.toDate)
        .query(`
        SELECT  createdDate, [YS2], [PLYWOOD], [LVL], [VIFOREX] from (
            select 
            case 
            when PARENT_ID = 102451 then 'YS2'
            when PARENT_ID = 102498 then 'PLYWOOD'
            when PARENT_ID = 102531 then 'LVL'
            when PARENT_ID = 102533 then 'VIFOREX'
            end factoryCode, 
            [Số lượng]*volumn m3
            ,
            'W'+RIGHT(YEAR([Ngày tạo]),2)+RIGHT('00' + CONVERT(VARCHAR, Tuần), 2) createdDate
            from View_raw_data_vcn 
            WHERE [Ngày tạo] between @fromDate and @toDate and DEPARTMENT_ID IN (${req.body.listDepartment}))
            AS BANG_NGUON
            PIVOT
            (
            SUM(m3)
            FOR factoryCode IN ([YS2], [PLYWOOD], [LVL], [VIFOREX])
            ) AS BANG_CHUYEN order by createdDate
    `)
    res.status(200).send(code.recordset)
})

VCN.post('/chart-san-luong-cong-doan-week-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .input('fromDate', req.body.fromDate)
        .input('toDate', req.body.toDate)
        .query(`
        DECLARE 
    @columns NVARCHAR(MAX) = '',
	@week NVARCHAR(MAX) = 'W',
	@zero NVARCHAR(MAX) = '00',
	@start NVARCHAR(MAX) = '${req.body.fromDate}',
	@end NVARCHAR(MAX) = '${req.body.toDate}',
    @sql     NVARCHAR(MAX) = '';

-- select the category names
WITH temp(NAME)
  as (
    select distinct Tổ from View_raw_data_vcn where PARENT_ID = ${req.body.factoryId}
  )
SELECT 
    @columns+=QUOTENAME(NAME) + ','
FROM 
    temp
ORDER BY 
    NAME;

-- remove the last comma
SET @columns = LEFT(@columns, LEN(@columns) - 1);

-- construct dynamic SQL
DECLARE @ParamDefinition NVARCHAR(MAX)
SELECT  @ParamDefinition= ' @start1 VARCHAR(100), @end1 VARCHAR(100), @week1 VARCHAR(100), @zero1 VARCHAR(100)'
SET @sql =N'
 SELECT  * from (
                select 
                [Tổ], 
				[Số lượng]*volumn m3,
				@week1 + RIGHT(YEAR([Ngày tạo]),2) + RIGHT(@zero1 + CONVERT(VARCHAR, Tuần), 2) createdDate
                from View_raw_data_vcn where [Ngày tạo] between @start1 and @end1)
				AS BANG_NGUON
PIVOT
(
SUM(m3)
FOR [Tổ] IN ('+ @columns +')
) AS BANG_CHUYEN order by createdDate';

-- execute the dynamic SQL
EXECUTE sp_executesql @sql, @ParamDefinition, @start1 = @start, @end1 = @end, @week1 = @week, @zero1 = @zero;
    `)
    res.status(200).send(code.recordset)
})

VCN.get('/chart-ton-cong-doan-week', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        DECLARE 
        @columns NVARCHAR(MAX) = '',
        @week NVARCHAR(MAX) = 'W',
        @zero NVARCHAR(MAX) = '00',
        @end NVARCHAR(MAX) = '${req.query.end}',
        @sql     NVARCHAR(MAX) = '';
    
    -- select the category names
    WITH temp(NAME)
      as (
        select distinct Tổ from View_raw_data_vcn where PARENT_ID = ${req.query.factoryId}
      )
    SELECT 
        @columns+=QUOTENAME(NAME) + ','
    FROM 
        temp
    ORDER BY 
        NAME;
    
    -- remove the last comma
    SET @columns = LEFT(@columns, LEN(@columns) - 1);
    
    -- construct dynamic SQL
    DECLARE @ParamDefinition NVARCHAR(MAX)
    SELECT  @ParamDefinition= ' @end1 VARCHAR(100), @week1 VARCHAR(100), @zero1 VARCHAR(100)'
    SET @sql =N'
     SELECT  * from (
                    select 
                    departmentName, 
                    QUANTITY*volumn KL,
                     @end1 thoiDiem
                    from View_TON_CONG_DOAN_VCN where CREATE_DATE <=  @end1
                    )
                    AS BANG_NGUON
    PIVOT
    (
    SUM(KL)
    FOR departmentName IN ('+ @columns +')
    ) AS BANG_CHUYEN order by thoiDiem';
    
    -- execute the dynamic SQL
    EXECUTE sp_executesql @sql, @ParamDefinition, @end1 = @end, @week1 = @week, @zero1 = @zero;
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/number-in-po', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        select distinct number lsxOld, null lsxNew from vcn.PO where factoryId = ${req.query.factoryId} and endPO = 0
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/number-in-lsx', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        select distinct number label, number value from vcn.PO
    `)
    res.status(200).send(code.recordset)
})
VCN.get('/lsx-by-number', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        select id, stepId, itemId, [order], quantity, daThucHien, keHoach, endPO, loiCongDon, loiLoai 
        from vcn.PO where number = N'${req.query.number}'
    `)
    res.status(200).send(code.recordset)
})
VCN.put('/number-in-po', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        update vcn.PO set number = '${req.body.lsxNew}' where number = '${req.body.lsxOld}'
    `)
    res.api.sendData(code.recordset)
})

VCN.put('/po-by-number', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        update vcn.PO
set
stepId = ${req.body.stepId},
itemId = ${req.body.itemId},
[order] = ${req.body.order},
quantity = ${req.body.quantity},
daThucHien = ${req.body.daThucHien},
keHoach = ${req.body.keHoach},
endPO = ${req.body.endPO},
loiCongDon = ${req.body.loiCongDon},
loiLoai = ${req.body.loiLoai}
where id = ${req.body.id}
    `)
    res.api.sendData(code.recordset)
})

VCN.post('/nhap-ton-dau-ky-vcn', async(req, res) => {
    const code = await new mssql.Request()
        .query(`
        INSERT INTO vcn.OPENING_STOCK ([DATE], [MONTH], DEPARTMENT_ID, ITEM_ID, QUANTITY, [WEEK],[DESCRIPTION] ,CREATED_BY, CREATED_AT)
        VALUES (
            GETDATE(), 
            DATEPART(MONTH, GETDATE()), 
            ${req.body.departmentId}, 
            ${req.body.itemId}, 
            ${req.body.quantity}, 
            DATEPART(WEEK, GETDATE()), 
            N'${req.body.description}', 
            ${req.body.accountId}, 
            GETDATE())
    `)
    res.api.sendData(code.recordset)
})

VCN.post('/khoi-luong-quy-luong-vcn', async(req, res) => {
    const { fromDate, toDate, strWeek } = req.body;
    let departments = req.body.departments;
        let strDepartment = "";
        departments.forEach(el => {
            strDepartment += el + ', '
        });
        strDepartment = strDepartment.substring(0, strDepartment.length -2);
        query = `
        SELECT *, TOTAL*DON_GIA THANH_TIEN FROM (
            SELECT I.id ITEM_ID, I.name ITEM_NAME, D.ID STEP_ID, D.NAME STEP_NAME, I.height, I.width, I.length, IT.NAME CHUNG_LOAI, 
            'WEEK' + CONVERT(nvarchar, DATEPART(WEEK, P.CREATE_DATE)-1) TUAN, IIP.QUANTITY*I.volumn VOLUMN, GTL.DON_GIA,
            (SELECT SUM(IIP2.QUANTITY*I2.volumn) FROM vcn.PACKAGE P2 
            INNER JOIN vcn.ITEM_IN_PACKAGE IIP2 ON P2.ID = IIP2.PACKAGE_ID
            INNER JOIN vcn.ITEM I2 ON IIP2.ITEM_ID = I2.id
            WHERE P2.CREATE_DATE BETWEEN '${fromDate}' AND '${toDate}' and P2.SOURCE_ID in (${strDepartment})
            AND P2.TYPE_ID = 100026 AND P2.SOURCE_ID = P.SOURCE_ID AND I2.id = I.id
            ) TOTAL
            FROM vcn.PACKAGE P 
            INNER JOIN vcn.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.DEPARTMENT D ON P.SOURCE_ID = D.ID
            INNER JOIN vcn.ITEM I ON IIP.ITEM_ID = I.id
            INNER JOIN vcn.ITEM_TYPE IT ON I.typeId = IT.ID
            LEFT JOIN vcn.GIA_TINH_LUONG GTL ON D.ID = GTL.STEP_ID AND I.id = GTL.ITEM_ID
            WHERE P.CREATE_DATE BETWEEN '${fromDate}' AND '${toDate}' AND P.TYPE_ID = 100026 and P.SOURCE_ID in (${strDepartment})
            ) AS BangNguon
            PIVOT
            (
            SUM(VOLUMN)
            FOR TUAN IN (${strWeek})
            ) AS BangChuyen;
        `
        console.log("query", query);
    const code = await new mssql.Request()
        .query(`
        SELECT *, TOTAL*DON_GIA THANH_TIEN FROM (
            SELECT I.id ITEM_ID, I.name ITEM_NAME, D.ID STEP_ID, D.NAME STEP_NAME, I.height, I.width, I.length, IT.NAME CHUNG_LOAI, 
            'WEEK' + CONVERT(nvarchar, DATEPART(WEEK, P.CREATE_DATE)-1) TUAN, IIP.QUANTITY*I.volumn VOLUMN, GTL.DON_GIA,
            (SELECT SUM(IIP2.QUANTITY*I2.volumn) FROM vcn.PACKAGE P2 
            INNER JOIN vcn.ITEM_IN_PACKAGE IIP2 ON P2.ID = IIP2.PACKAGE_ID
            INNER JOIN vcn.ITEM I2 ON IIP2.ITEM_ID = I2.id
            WHERE P2.CREATE_DATE BETWEEN '${fromDate}' AND '${toDate}' and P2.SOURCE_ID in (${strDepartment})
            AND P2.TYPE_ID = 100026 AND P2.SOURCE_ID = P.SOURCE_ID AND I2.id = I.id
            ) TOTAL
            FROM vcn.PACKAGE P 
            INNER JOIN vcn.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.DEPARTMENT D ON P.SOURCE_ID = D.ID
            INNER JOIN vcn.ITEM I ON IIP.ITEM_ID = I.id
            INNER JOIN vcn.ITEM_TYPE IT ON I.typeId = IT.ID
            LEFT JOIN vcn.GIA_TINH_LUONG GTL ON D.ID = GTL.STEP_ID AND I.id = GTL.ITEM_ID
            WHERE P.CREATE_DATE BETWEEN '${fromDate}' AND '${toDate}' AND P.TYPE_ID = 100026 and P.SOURCE_ID in (${strDepartment})
            ) AS BangNguon
            PIVOT
            (
            SUM(VOLUMN)
            FOR TUAN IN (${strWeek})
            ) AS BangChuyen;
    `)
    res.status(200).send(code.recordset)
})
VCN.get("/get-all-department-vcn", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT d.[ID]
        ,[GUID]
        ,[TYPE]
        ,[PARENT_ID]
        ,d.[CODE]
        ,d.[NAME]
        ,[TYPE2]
        ,[ERROR]
        ,[PACKAGE_TYPE_GROUP_ID]
        ,[MODULE_ID]
        ,d.[ORDER]
        ,[caLamViec]
        ,[accountId]
        ,[accountId1]
        ,[accountId2]
        ,d.[factoryId]
        ,[GROUP_ID]
        ,[CONG_SUAT_TUAN]
        ,[GHI_CHU]
    FROM [base].[DEPARTMENT] d
        `)
    res.api.sendData(recordset)
});

module.exports = VCN