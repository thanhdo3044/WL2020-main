const express = require("express");
const router = express.Router();
const mssql = require("mssql");
const { Po, Op, VItemInPackage, Item, Package, sequelize } = require("../../../models");
const {
    Proc_verifyPackage,
    getPackageById,
} = require("./../../core/query/index");
const { getErrorMessage } = require("./../../core/config");


router.get("/san-luong-say-theo-thang", async (req, res) => {
    const { year, departmentId } = req.query;
    let query = "";
    if(departmentId == 102299){
        query = `
        select *
        from
        (
        SELECT        I.ID itemId, I.NAME itemName, D .ID departmentId, D .NAME departmentName, '[' + D .CODE + '] ' + D .NAME departmentName2, GD.code, GD.[ORDER], CONVERT(nvarchar, GD.[ORDER]) + ' ' + UPPER(GD.NAME) groupName, 
                         GD.NAME groupDepartment, I.HEIGHT, I.WIDTH, I.LENGTH, 
						  'thang'+ CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  thang, S.sl QUANTITY, S.VOLUMN*s.sl VOLUMN
FROM            View_sanLuong_say2 S INNER JOIN
                         base.DEPARTMENT D ON S.DESTINATION_ID = D .ID INNER JOIN
                         prod.GROUP_DEPARTMENT GD ON D .ID = GD.DEPARTMENT_ID INNER JOIN
                         base.ITEM I ON S.ITEM_ID = I.ID
						 where DATEPART(YEAR, EXPORT_DATE) = 2022
union all
SELECT        I.ID itemId, I.NAME itemName, D .ID departmentId, D .NAME departmentName, '[' + D .CODE + '] ' + D .NAME departmentName2, GD.code, GD.[ORDER], N'2 SẤY LẠI' groupName, 
GD.NAME groupDepartment, I.HEIGHT, I.WIDTH, I.LENGTH, 
 'thang'+ CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  thang, S.sl QUANTITY, S.VOLUMN*s.sl VOLUMN
FROM            View_sanLuong_saylai S INNER JOIN
base.DEPARTMENT D ON S.DESTINATION_ID = D .ID INNER JOIN
prod.GROUP_DEPARTMENT GD ON D .ID = GD.DEPARTMENT_ID INNER JOIN
base.ITEM I ON S.ITEM_ID = I.ID
where DATEPART(YEAR, EXPORT_DATE) = 2022
        ) AS BangNguon
        PIVOT
        (
        SUM(VOLUMN)
        FOR thang IN ([thang1],[thang2],[thang3],[thang4],[thang5],[thang6],[thang7],[thang8],[thang9],[thang10],[thang11],[thang12])
        ) AS BangChuyen;

        
        `
    }else{
        query = `
        select *
        from
        (
        SELECT        I.ID itemId, I.NAME itemName, D .ID departmentId, D .NAME departmentName, '[' + D .CODE + '] ' + D .NAME departmentName2, GD.code, GD.[ORDER], CONVERT(nvarchar, GD.[ORDER]) + ' ' + UPPER(GD.NAME) groupName, 
                         GD.NAME groupDepartment, I.HEIGHT, I.WIDTH, I.LENGTH, 
						  'thang'+ CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  thang, S.sl QUANTITY, S.VOLUMN*s.sl VOLUMN
FROM            View_sanLuong_say2 S INNER JOIN
                         base.DEPARTMENT D ON S.DESTINATION_ID = D .ID INNER JOIN
                         prod.GROUP_DEPARTMENT GD ON D .ID = GD.DEPARTMENT_ID INNER JOIN
                         base.ITEM I ON S.ITEM_ID = I.ID
						 where DATEPART(YEAR, EXPORT_DATE) = ${year} and d.factoryId = ${departmentId}
union all
SELECT        I.ID itemId, I.NAME itemName, D .ID departmentId, D .NAME departmentName, '[' + D .CODE + '] ' + D .NAME departmentName2, GD.code, GD.[ORDER], N'2 SẤY LẠI' groupName, 
GD.NAME groupDepartment, I.HEIGHT, I.WIDTH, I.LENGTH, 
 'thang'+ CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  thang, S.sl QUANTITY, S.VOLUMN*s.sl VOLUMN
FROM           View_sanLuong_saylai S INNER JOIN
base.DEPARTMENT D ON S.DESTINATION_ID = D .ID INNER JOIN
prod.GROUP_DEPARTMENT GD ON D .ID = GD.DEPARTMENT_ID INNER JOIN
base.ITEM I ON S.ITEM_ID = I.ID
where DATEPART(YEAR, EXPORT_DATE) = ${year} and d.factoryId = ${departmentId}
        ) AS BangNguon
        PIVOT
        (
        SUM(VOLUMN)
        FOR thang IN ([thang1],[thang2],[thang3],[thang4],[thang5],[thang6],[thang7],[thang8],[thang9],[thang10],[thang11],[thang12])
        ) AS BangChuyen;
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.get("/chart-san-luong-say-theo-thang-say-lai", async (req, res) => {
    const { year, departmentId } = req.query;
    let query = "";
    if(departmentId == 102299){
        query = `
        select 
case 
when temp1.thang is null 
then s2.thang 
else temp1.thang end thang , yearNew yearNewsl, yearOld yearOldsl
from 
(
    select DISTINCT  case when MONTH < 10
    then 'Tháng 0' + MONTH
    else  'Tháng ' + MONTH  end thang   from [base].[GLOBAL_DATE] where YEAR = 2021
     group by MONTH
    ) temp1 full outer join 
(
select thang, SUM(tongkl) yearNew from (
select case when DATEPART(MONTH, EXPORT_DATE) < 10 
then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))
else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  end thang, tongkl
from View_sanLuong_saylai s
inner join base.DEPARTMENT d on s.DESTINATION_ID = d.ID
where DATEPART(YEAR, EXPORT_DATE) = ${year} 
) S group by thang
) temp2 on temp1.thang = temp2.thang
full outer join 
(
	select thang, SUM(tongkl) yearOld from (
select case when DATEPART(MONTH, EXPORT_DATE) < 10 
then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))
else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  end thang, tongkl
from View_sanLuong_saylai s
inner join base.DEPARTMENT d on s.DESTINATION_ID = d.ID
where DATEPART(YEAR, EXPORT_DATE) = ${year-1} 
) S group by thang
) s2 on temp1.thang = s2.thang
order by thang
        `
    }else{
        query = `
        select 
case 
when temp1.thang is null 
then s2.thang 
else temp1.thang end thang , yearNew yearNewsl, yearOld yearOldsl
from 
(
select DISTINCT  case when MONTH < 10
then 'Tháng 0' + MONTH
else  'Tháng ' + MONTH  end thang   from [base].[GLOBAL_DATE] where YEAR = 2021
 group by MONTH
) temp1 full outer join 
(
    select thang, SUM(tongkl) yearNew from (
    select case when DATEPART(MONTH, EXPORT_DATE) < 10 
    then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))
    else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  end thang, tongkl
    from View_sanLuong_saylai s
    inner join base.DEPARTMENT d on s.DESTINATION_ID = d.ID
    where DATEPART(YEAR, EXPORT_DATE) = ${year} and d.factoryId = ${departmentId}
    ) S group by thang
    ) temp2 on temp2.thang = temp1.thang
     full outer join 
(
	select thang, SUM(tongkl) yearOld from (
select case when DATEPART(MONTH, EXPORT_DATE) < 10 
then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))
else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  end thang, tongkl
from View_sanLuong_saylai s
inner join base.DEPARTMENT d on s.DESTINATION_ID = d.ID
where DATEPART(YEAR, EXPORT_DATE) = ${year-1} and d.factoryId = ${departmentId}
) S group by thang
) s2 on temp1.thang = s2.thang
order by thang
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.get("/chart-san-luong-say-theo-thang", async (req, res) => {
    const { year, departmentId } = req.query;
    let query = "";
    if(departmentId == 102299){
        query = `
        select 
case 
when temp1.thang is null 
then s2.thang 
else temp1.thang end thang , yearNew, yearOld
from 
(
select thang, SUM(tongkl) yearNew from (
select case when DATEPART(MONTH, EXPORT_DATE) < 10 
then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))
else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  end thang, tongkl
from View_sanLuong_say2 s
inner join base.DEPARTMENT d on s.DESTINATION_ID = d.ID
where DATEPART(YEAR, EXPORT_DATE) = ${year} 
) S group by thang
) temp1 full outer join 
(
	select thang, SUM(tongkl) yearOld from (
select case when DATEPART(MONTH, EXPORT_DATE) < 10 
then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))
else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  end thang, tongkl
from View_sanLuong_say2 s
inner join base.DEPARTMENT d on s.DESTINATION_ID = d.ID
where DATEPART(YEAR, EXPORT_DATE) = ${year-1} 
) S group by thang
) s2 on temp1.thang = s2.thang
order by thang
        `
    }else{
        query = `
        select 
case 
when temp1.thang is null 
then s2.thang 
else temp1.thang end thang , yearNew, yearOld
from 
(
select thang, SUM(tongkl) yearNew from (
select case when DATEPART(MONTH, EXPORT_DATE) < 10 
then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))
else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  end thang, tongkl
from View_sanLuong_say2 s
inner join base.DEPARTMENT d on s.DESTINATION_ID = d.ID
where DATEPART(YEAR, EXPORT_DATE) = ${year} and d.factoryId = ${departmentId}
) S group by thang
) temp1 full outer join 
(
	select thang, SUM(tongkl) yearOld from (
select case when DATEPART(MONTH, EXPORT_DATE) < 10 
then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))
else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, EXPORT_DATE))  end thang, tongkl
from View_sanLuong_say2 s
inner join base.DEPARTMENT d on s.DESTINATION_ID = d.ID
where DATEPART(YEAR, EXPORT_DATE) = ${year-1} and d.factoryId = ${departmentId}
) S group by thang
) s2 on temp1.thang = s2.thang
order by thang
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})

router.post("/chart-san-luong-theo-tuan-sl-ss", async (req, res) => {
    const { year, departmentId, stepId } = req.body;
    let query = "";
    if(departmentId == 102299){
        query = `
        select 
case 
when temp1.tuan is null 
then s2.tuan 
else temp1.tuan end tuan , yearNew, yearOld
from 
(
select tuan, SUM(tongkl) yearNew from (
select CASE WHEN DATEPART(YEAR,createDate) <2023 then
case when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate)-1 < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-2) 
		when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate)-1 >= 10 
		then 'w'+CONVERT(varchar, DATEPART(week, createDate)-2)
		when DATEPART(WEEKDAY,createDate) != 1 and DATEPART(WEEK, createDate)-1 < 10 
		then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1)
		else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		end 
        else 
        case when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate) < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1) 
		when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate) >= 10 
		then 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		when DATEPART(WEEKDAY,createDate) != 1 and DATEPART(WEEK, createDate) < 10 
		then 'w0'+CONVERT(varchar, DATEPART(week, createDate))
		else 'w'+CONVERT(varchar, DATEPART(week, createDate))
		end end tuan, tongkl
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR, v1.createDate) = ${year} and groupDepartment = N'${stepId}'
		union all
        select case when DATEPART(WEEK, createDate)-1 < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1) 
		else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		end tuan, tongkl
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR, v1.createDate) = ${year} and groupDepartment = N'${stepId}'
union all
			select DISTINCT case when WEEK < 10
    then N'w0' + WEEK
    else  N'w' + WEEK  end tuan, null  from [base].[GLOBAL_DATE] where YEAR = 2022
) S group by tuan
) temp1 full outer join 
(
	select tuan, SUM(tongkl) yearOld from (
	select case when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate)-1 < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-2) 
		when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate)-1 > 10 
		then 'w'+CONVERT(varchar, DATEPART(week, createDate)-2)
		when DATEPART(WEEKDAY,createDate) != 1 and DATEPART(WEEK, createDate)-1 < 10 
		then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1)
		else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		end tuan, tongkl
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR, v1.createDate) = ${year-1} and groupDepartment = N'${stepId}'
		union all
        select case when DATEPART(WEEK, createDate)-1 < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1) 
		else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		end tuan, tongkl
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR, v1.createDate) = ${year-1} and groupDepartment = N'${stepId}'
) S where tuan !='w00'
group by tuan
) s2 on temp1.tuan = s2.tuan
order by tuan
        `
    }else{
        query = `
select 
case 
when temp1.tuan is null 
then s2.tuan 
else temp1.tuan end tuan , yearNew, yearOld
from 
(
select tuan, SUM(tongkl) yearNew from (
select CASE WHEN DATEPART(YEAR,createDate) <2023 then
case when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate)-1 < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-2) 
		when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate)-1 >= 10 
		then 'w'+CONVERT(varchar, DATEPART(week, createDate)-2)
		when DATEPART(WEEKDAY,createDate) != 1 and DATEPART(WEEK, createDate)-1 < 10 
		then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1)
		else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		end 
        else 
        case when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate) < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1) 
		when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate) >= 10 
		then 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		when DATEPART(WEEKDAY,createDate) != 1 and DATEPART(WEEK, createDate) < 10 
		then 'w0'+CONVERT(varchar, DATEPART(week, createDate))
		else 'w'+CONVERT(varchar, DATEPART(week, createDate))
		end end tuan, tongkl
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${stepId})
		union all
        select case when DATEPART(WEEK, createDate)-1 < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1) 
		else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		end tuan, tongkl
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${stepId})
union all
			select DISTINCT case when WEEK < 10
            then N'w0' + WEEK
            else  N'w' + WEEK  end tuan, null  from [base].[GLOBAL_DATE] where YEAR = ${year}
) S group by tuan
) temp1 full outer join 
(
	select tuan, SUM(tongkl) yearOld from (
	select case when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate)-1 < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-2) 
		when DATEPART(WEEKDAY,createDate) = 1 and DATEPART(WEEK, createDate)-1 > 10 
		then 'w'+CONVERT(varchar, DATEPART(week, createDate)-2)
		when DATEPART(WEEKDAY,createDate) != 1 and DATEPART(WEEK, createDate)-1 < 10 
		then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1)
		else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		end tuan, tongkl
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR, v1.createDate) = ${year-1} and v1.departmentId in (${stepId})
		union all
        select case when DATEPART(WEEK, createDate)-1 < 10
        then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1) 
		else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1)
		end tuan, tongkl
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR, v1.createDate) = ${year-1} and v1.departmentId in (${stepId})
) S where tuan !='w00'
group by tuan
) s2 on temp1.tuan = s2.tuan
order by tuan

        `
    }
        
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/insert-ton-cong-doan", async (req, res,next) => {
    const hesoquidoi = req.body.hesoquidoi

    hesoquidoi.forEach(element => {
        if (element.market_code){
        const query = ` INSERT INTO prod.GhiNhanTonThucTe (DEPARTMENT_ID,IDSanPham,TonThucTe,Created_By,Created_At,market_code)
        VALUES (${element.stepId}, N'${element.ITEM_ID}', N'${element.QUANTITY}', ${req.body.createdBy}, GETDATE(),N'${element.market_code}')`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    }
    else {
        const query = ` INSERT INTO prod.GhiNhanTonThucTe (DEPARTMENT_ID,IDSanPham,TonThucTe,Created_By,Created_At)
        VALUES (N'${element.stepId}', N'${element.ITEM_ID}', N'${element.QUANTITY}', N'${req.body.createdBy}', GETDATE())`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        }) 
    }
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.post("/insert-them-ton-cong-doan", async (req, res,next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        if (element.market_code) {
        const query = ` INSERT INTO prod.OPENING_STOCK (DEPARTMENT_ID, ITEM_ID, QUANTITY,CREATE_BY,createdAt,color)
        VALUES (${element.stepId}, ${element.itemId}, ${element.chenhlechSL}, ${req.body.createdBy}, GETDATE(),N'${element.market_code}')
        delete from [prod].[GhiNhanTonThucTe] where DEPARTMENT_ID = ${element.stepId} and IDSanPham =  ${element.itemId}`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    }
    else {
        const query = ` INSERT INTO prod.OPENING_STOCK (DEPARTMENT_ID, ITEM_ID, QUANTITY,CREATE_BY,createdAt)
        VALUES (${element.stepId}, ${element.itemId}, ${element.chenhlechSL}, ${req.body.createdBy}, GETDATE())
        delete from [prod].[GhiNhanTonThucTe] where DEPARTMENT_ID = ${element.stepId} and IDSanPham =  ${element.itemId}`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })  
    }
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.post("/xoa-nhap-ton-cong-doan", async (req, res,next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `
        delete from [prod].[GhiNhanTonThucTe] where DEPARTMENT_ID = ${element.stepId} and IDSanPham =  ${element.itemId}`
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
router.post("/chart-san-luong-theo-thang-sl-ss", async (req, res) => {
    const { year, departmentId, stepId } = req.body;
    let query = "";
    if(departmentId == 102299){
        query = `
        select 
        case 
        when temp1.thang is null 
        then s2.thang 
        else temp1.thang end thang , yearNew, yearOld
        from 
        (
        select thang, SUM(tongkl) yearNew from (
        select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, tongkl
                from View_SanLuong_tuan_thang v1
                where DATEPART(YEAR, v1.createDate) = ${year} and groupDepartment = N'${stepId}'
                union all
                select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, tongkl
                from View_SanLuong_LuaPhoi v1
                where DATEPART(YEAR, v1.createDate) = ${year} and groupDepartment = N'${stepId}'
                union all
                select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, 0 total
                from View_SanLuong_All v1
                where DATEPART(YEAR, createDate) = ${year} and groupDepartment = N'${stepId}'
        union all
        select DISTINCT  case when MONTH < 10
            then 'Tháng 0' + MONTH
            else  'Tháng ' + MONTH  end thang , null yearNew 
            from [base].[GLOBAL_DATE] where YEAR = ${year}
        ) S group by thang
        ) temp1 full outer join 
        (
            select thang, SUM(tongkl) yearOld from (
        select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, tongkl
                from View_SanLuong_tuan_thang v1
                where DATEPART(YEAR, v1.createDate) = ${year - 1} and groupDepartment = N'${stepId}'
                union all
                select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, tongkl
                from View_SanLuong_LuaPhoi v1
                where DATEPART(YEAR, v1.createDate) = ${year - 1} and groupDepartment = N'${stepId}'
                union all
                select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, 0 total
                from View_SanLuong_All v1
                where DATEPART(YEAR, createDate) = ${year - 1} and groupDepartment = N'${stepId}'
        ) S group by thang
        ) s2 on temp1.thang = s2.thang
        order by thang`
    } 
    else {
        query = `
        select 
        case 
        when temp1.thang is null 
        then s2.thang 
        else temp1.thang end thang , yearNew, yearOld
        from 
        (
        select thang, SUM(tongkl) yearNew from (
        select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, tongkl
                from View_SanLuong_tuan_thang v1
                where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${stepId})
                union all
                select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, tongkl
                from View_SanLuong_LuaPhoi v1
                where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${stepId})
                union all
                select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, 0 total
                from View_SanLuong_All v1
                where DATEPART(YEAR, createDate) = ${year} and departmentId in (${stepId})
        union all
        select DISTINCT  case when MONTH < 10
            then 'Tháng 0' + MONTH
            else  'Tháng ' + MONTH  end thang , null yearNew 
            from [base].[GLOBAL_DATE] where YEAR = ${year}
        ) S group by thang
        ) temp1 full outer join 
        (
            select thang, SUM(tongkl) yearOld from (
        select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, tongkl
                from View_SanLuong_tuan_thang v1
                where DATEPART(YEAR, v1.createDate) = ${year - 1} and departmentId in (${stepId})
                union all
                select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, tongkl
                from View_SanLuong_LuaPhoi v1
                where DATEPART(YEAR, v1.createDate) = ${year - 1} and departmentId in (${stepId})
                union all
                select case when DATEPART(MONTH, createDate) < 10 
        then 'Tháng 0' + CONVERT(varchar, DATEPART(MONTH, createDate))
        else  'Tháng ' + CONVERT(varchar, DATEPART(MONTH, createDate))  end thang, 0 total
                from View_SanLuong_All v1
                where DATEPART(YEAR, createDate) = ${year - 1} and departmentId in (${stepId})
        ) S group by thang
        ) s2 on temp1.thang = s2.thang
        order by thang
        `
            }
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})

router.get("/department-cong-suat", async (req, res) => {
    let data = await new mssql.Request().query(`
    SELECT CONVERT(varchar, gd.[ORDER]) + ' ' + GD.NAME GROUP_NAME, D.ID, D.NAME, CONG_SUAT_TUAN, GHI_CHU
    FROM base.DEPARTMENT D INNER JOIN
    prod.GROUP_DEPARTMENT GD ON D.ID = GD.DEPARTMENT_ID
    where d.factoryId = ${req.query.factoryId}
    order by gd.[ORDER]
    `)

    res.status(200).send(data.recordset)
})
router.post("/so-cong-doan", async (req, res) => {
    const {arrDepartment } = req.body;
    let data = await new mssql.Request().query(`
    SELECT DISTINCT
      [ORDER],[code]
  FROM [prod].[GROUP_DEPARTMENT] where DEPARTMENT_ID in (${arrDepartment})
    
    `)

    res.status(200).send(data.recordset)
})
router.get("/cong-doan-in-department", async (req, res) => {
    let data = await new mssql.Request().query(`
    select CONG_SUAT_TUAN from base.DEPARTMENT where ID = ${req.query.departmentId}
    `)

    res.status(200).send(data.recordset)
})

router.post("/cong-suat-tuan", async (req, res) => {
    let ghiChu = null;
    if(req.body.ghiChu){
        ghiChu = req.body.ghiChu
    }else{
        ghiChu = "";
    }
    await new mssql.Request().query(`
    UPDATE base.DEPARTMENT 
    SET 
    CONG_SUAT_TUAN = ${req.body.congSuatTuan},
    GHI_CHU = N'${ghiChu}'
    WHERE ID = ${req.body.departmentId}
    `,(err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})

router.get("/he-so-lua-phoi-all", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `
            select * from prod.HSLP
where [YEAR] = ${req.query.year} and FACTORY_ID = ${req.query.factoryId}
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/ty-gia-USD", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `
            select * from  prod.TY_GIA_USD

            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/insert-ty-gia-usd", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `
            INSERT INTO prod.TY_GIA_USD ([TY_GIA_USD]
                ,[CREATED_BY]
                ,[CREATED_AT])
                VALUES (${req.body.TY_GIA_USD},${req.body.CREATED_BY},'${req.body.CREATED_AT}')
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/chon-lenh", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `
    select DISTINCT number from prod.PO where itemId in (${req.body.ITEM_ID},(select MATERIALS_ID from 
        prod.BOM where ITEM_ID = ${req.body.ITEM_ID})) and number like '%BTP%' and factoryId = ${req.body.factoryId}
        and year >=2023 and endPO = 0
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
})
router.post("/tru-loi", (req, res) => {
    let data = req.body;
     new mssql.Request()
        .input("FROM_ID", data.FROM_ID)
      
        .input("ITEM_ID", data.ITEM_ID)
        .input("QUANTITY", data.QUANTITY)
        .input("factoryId", data.factoryId)
        .input("number", data.number)
     
        .output("ERROR")
        .execute("Proc_createPackage_2", async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            if (record.output.ERROR > 0 && record.output.ERROR != null) {
                console.log("err2", getErrorMessage(record.output.ERROR));
                return req.api.sendFail(getErrorMessage(record.output.ERROR));
            }
            res.api.sendData(record.recordset);

            if (data.typeId === 100004 && req.body.number) {

                // const poCode = req.body.po.slice(2)
                //kiểm tra poCode
                // const po = await Po.findOne({
                //     where: {
                //         code: poCode
                //     }
                // });

                // if (po === null) return;
                // Phân tích định mức của sản phẩm
                let dinhMuc = await new mssql.Request().query(`
                WITH temp0(id, rate)
                as(
                  select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${data.ITEM_ID})
                  Union All
                  select b.MATERIALS_ID as id, b.RATE as rate
                  from temp0 as a, prod.BOM as b
                  where a.id = b.ITEM_ID 
                )
                select distinct * from temp0
              GO;
                
                `);

                //Trừ các công đoạn ở dưới

                const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from [prod].[ROUTING] where STEP_ID = ${data.FROM_ID}
                        and ITEM_ID = ${data.ITEM_ID} 
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from [prod].[ROUTING] as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.factoryId = ${data.factoryId}
                    )
                select distinct * from temp0
                `);
                //Nếu có công đoạn ở dưới thì thực hiện trừ sản lượng nhé!
                if (congDoanDuois.recordset.length > 0) {
                    const congDonBiTrus = congDoanDuois.recordset.filter(c => c.stepId != data.FROM_ID).map(s => s.stepId)
                    console.log("Cac cong doan bi tru la:", congDonBiTrus);
                    const pos = await Po.findAll({
                        where: {
                            number: data.number,
                            itemId: data.ITEM_ID
                        }
                    });

                    pos.forEach(async p => {
                        console.log(p.stepId)
                        let foundStep = congDonBiTrus.find(s => s == p.stepId)
                        if (foundStep) {
                            await p.increment({
                                loiCongDon: req.body.QUANTITY
                            })
                        } else {
                            console.log("Khong bao gom")
                        }
                    })
                }

                // Trừ các tiếp chi tiết con nếu có nhé!

                if (dinhMuc.recordset.length > 0) {
                    //
                    const chiTiets = dinhMuc.recordset.filter(d => d.id != data.ITEM_ID).map(i => i.id)
                    console.log("Chi tiết:", chiTiets)
                    const lsx = await Po.findAll({
                        where: {
                            number: data.number,
                            itemId: {
                                [Op.in]: chiTiets
                            }
                        }
                    });
                    lsx.forEach(async p => {
                        let foundDinhMuc = await dinhMuc.recordset.find(d => d.id == p.itemId)
                        await p.increment({
                            loiCongDon: foundDinhMuc ? foundDinhMuc.rate * req.body.quantity : req.body.quantity
                        })
                    })
                }
            }
        });
});
router.post("/chon-cd-nhan-loi", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `update [prod].[PACKAGE]
            set DESTINATION_ID = ${req.body.condoan} where ID = ${req.body.ID}
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/insert-don-gia-say", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `
            INSERT INTO prod.GIA_TINH_LUONG (itemId
                ,dongia,createdAt,createdby,factoryId,stepId,ngayapdung)
                VALUES ('001',${req.body.dongia},GETDATE(),${req.body.CREATED_BY},${req.body.factoryId},'001','${req.body.ngayapdung}')
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

module.exports = router;