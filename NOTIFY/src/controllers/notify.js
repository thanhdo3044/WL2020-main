const {mssqlExcutedQuery} = require('../config/database')
const express = require('express')
const notify = express.Router()
const mssql = require('mssql')
const fs = require('fs');
const {
    errorMessage,
    getErrorMessage
} = require('../core/config')


notify.post('/insert-information', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
        .input('subDescription', req.body.subDescription)
        .input('description', req.body.description)
        .input('imageUrl', req.body.imageUrl)
        .input('accountId', req.body.accountId)
        .input('permission', req.body.permission)
        .input('confirm', req.body.confirm)
        .input('code', req.body.code)
        .input('date', req.body.date)
        .input('veViec', req.body.veViec)
        .input('sendManager', req.body.sendManager)
            .query(`
            INSERT INTO notify.INFORMATION( subDescription, description, imageUrl, CREATED_BY, CREATED_AT, permission, confirm, CODE, ngayBanHanh, veViec, sendManager)
            VALUES ( @subDescription, @description, N'${req.body.imageUrl}', @accountId, GETDATE(), @permission, @confirm, @code, @date, @veViec, @sendManager)
            `, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
notify.post('/insert-request', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
        .input('subDescription', req.body.subDescription)
        .input('description', req.body.description)
        .input('imageUrl', req.body.imageUrl)
        .input('accountId', req.body.accountId)
        .input('permission', req.body.permission)
        .input('veViec', req.body.veViec)
        .input('nhomcongviec', req.body.nhomcongviec)
        .input('loaiTicket',req.body.loaiTicket)
        .input('doQuanTrong',req.body.doQuanTrong)
        .input('phongban',req.body.phongBan)
        .input('pheDuyet',req.body.pheDuyet)
        .input('nguoiDung',req.body.nguoiDung)
        .input('idPhongBan',req.body.idPhongBan)
        .input('idNguoiDung',req.body.idNguoiDung)
        .input('nhaMay',req.body.nhaMay)
            .query(`
            INSERT INTO notify.CREATE_REQUEST( subDescription, description, imageUrl, CREATED_BY, CREATED_AT, permission,veViec,nhomcongviec,loaiTicket,doQuanTrong,phongban,pheDuyet,nguoiDung,idPhongBan,idNguoiDung,nhaMay)
            VALUES ( @subDescription, @description, N'${req.body.imageUrl}', @accountId, GETDATE(), @permission,@veViec,@nhomcongviec,@loaiTicket,@doQuanTrong,@phongBan,@pheDuyet,@nguoiDung,@idPhongBan,@idNguoiDung,@nhaMay)
            `, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
notify.put('/update-information/:id', (req, res, next) => {
    if (req.body.payload) { next() } else {
        new mssql.Request()
        .input('veViec', req.body.veViec)
        .input('subDescription', req.body.subDescription)
        .input('description', req.body.description)
        .input('imageUrl', req.body.imageUrl)
        .input('accountId', req.body.accountId)
        .input('id', req.params.id)
            .query(`
                UPDATE notify.INFORMATION
                SET
                veViec = @veViec,
                subDescription = @subDescription,
                description = @description,
                imageUrl = @imageUrl,
                UPDATED_BY = @accountId,
                UPDATED_AT = GETDATE()
                WHERE ID = @id
            `, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
//phân loại ticket
notify.put('/update-ticket/:id',(req,res,next)=>{

    if (req.body.payload) { next() } else {
        new mssql.Request()
        .input('pheDuyet', req.body.pheDuyet)
        .input('thoiGianHoanThanh', req.body.thoiGianHoanThanh)
        .input('id', req.params.id)
            .query(`
                UPDATE notify.CREATE_REQUEST
                SET
                pheDuyet = @pheDuyet,
                thoiGianHoanThanh= @thoiGianHoanThanh,
                UPDATED_AT = GETDATE()
                WHERE ID = @id
            `, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

//hoan thanh ticket
notify.put('/success-ticket/:id',(req,res,next)=>{

    if (req.body.payload) { next() } else {
        new mssql.Request()
        .input('hoanThanh', req.body.hoanThanh)
        .input('thoiGianHoanThanh', req.body.thoiGianHoanThanh)
        .input('id', req.params.id)
            .query(`
                UPDATE notify.CREATE_REQUEST
                SET
                hoanThanh = @hoanThanh,
                thoiGianHoanThanh= @thoiGianHoanThanh,
                UPDATED_AT = GETDATE()
                WHERE ID = @id
            `, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

//phân loại ticket
notify.put('/edit-user-ticket/:id',(req,res,next)=>{

    if (req.body.payload) { next() } else {
        new mssql.Request()
        .input('nguoiDung', req.body.nguoiDung)
        .input('idNguoiDung', req.body.idNguoiDung)
        .input('thoiGianHoanThanh', req.body.thoiGianHoanThanh)
        .input('id', req.params.id)
            .query(`
                UPDATE notify.CREATE_REQUEST
                SET
                nguoiDung = @nguoiDung,
                idNguoiDung= @idNguoiDung,
                thoiGianHoanThanh=@thoiGianHoanThanh,
                UPDATED_AT = GETDATE()
                WHERE ID = @id
            `, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})

notify.put('/delete-information/:id', (req, res, next) => {
    
    if (req.body.payload) { next() } else {
        new mssql.Request()
        .input('id', req.params.id)
            .query(`
            DELETE notify.INFORMATION WHERE ID = @id
            DELETE notify.INFO_FORMS WHERE infoId = @id 
            `, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData([])
            })
    }
})
notify.get('/informations', (req, res) => {

    new mssql.Request()
        .query(`
            SELECT I.ID, veViec, subDescription, description, imageUrl, A.LAST_NAME , CREATED_AT 
            FROM notify.INFORMATION I
            INNER JOIN base.ACCOUNT A ON I.CREATED_BY = A.ID 
            WHERE CREATED_AT BETWEEN '${req.query.start}' AND '${req.query.end}'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/requests', (req, res) => {
    // where accountId = ${req.query.accountId})

    // WHERE I.CREATED_AT BETWEEN '${req.query.start}' AND '${req.query.end}'
    //         and A1.ID is not null and I.nhomcongviec in (select nhom from [notify].[PHAN_QUYEN_REQUEST]
    
    new mssql.Request()
        .query(`
            SELECT I.ID, veViec, subDescription, description, imageUrl, A.LAST_NAME , I.CREATED_AT,D.NAME phongban, loaiTicket,doQuanTrong,phongBan,pheDuyet,nguoiDung,idNguoiDung,idPhongBan,nhaMay,hoanThanh
            FROM notify.CREATE_REQUEST I
            INNER JOIN base.ACCOUNT A ON I.CREATED_BY = A.ID 
            left join base.DEPARTMENT D on D.ID = I.permission
            left join base.ACCOUNT A1 on  A1.departmentId = I.permission and A1.ID = '${req.query.accountId}'
           
           `
       , (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

// hien thi ticket theo id
notify.get('/get-ticket-id/:id', (req, res) => {
    // console.log("hien thi",req.params.id);
    
    new mssql.Request()
        .query(`
            SELECT ID, veViec, subDescription, description, imageUrl,phongban, loaiTicket,doQuanTrong,phongBan,pheDuyet,nguoiDung,idNguoiDung,idPhongBan,nhaMay,hoanThanh
            FROM notify.CREATE_REQUEST
            where ID = '${req.params.id}' 
           `
       , (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


notify.get('/department-by-infoId', (req, res) => {
    // SELECT i.ID ,D.NAME FROM notify.INFORMATION I

    new mssql.Request()
        .query(`
        SELECT i.ID ,D.NAME FROM notify.INFORMATION I
        INNER JOIN base.DEPARTMENT D ON I.permission LIKE '%'+CONVERT(varchar, D.ID)+'%'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/viewtintuc', (req, res) => {

    new mssql.Request()
        .query(` 
        select  I.ID
        ,[veViec] veViec
        ,[subDescription] SUMMARY
        ,[description] CONTENT
        ,[imageUrl]
        ,[sendManager]
        ,[CREATED_BY], permission from notify.INFORMATION i
       -- inner join (select distinct [infoId],[accountId] from notify.INFO_FORMS) inf on i.id = inf.infoId
        where  i.CREATED_AT between '${req.query.start} 00:00' AND '${req.query.end} 23:59'
        order by I.ID desc
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/department-notify', (req, res) => {

    new mssql.Request()
        .query(`
        WITH
            temp(id, parentId, code, name, type, type2, accountId, accountId1, accountId2, factoryId, [order], thuTu, GROUP_ID)
            as
            (
                            Select id, null as parentId, code, name, type, type2, accountId, accountId1, accountId2, factoryId, [ORDER], 
							case 
							when ID = 102627 then 1
							when ID = 102298 then 2
							when ID = 102497 then 3
							when ID = 102299 then 4
							when ID = 102395 then 5
							when ID = 102422 then 6
							end as thuTu, GROUP_ID
                    From base.DEPARTMENT
                    Where ID in (102627, 102298, 102299, 102395, 102422, 102497) and (TYPE2 is null or TYPE2 != 'close')
                Union All
                    Select b.id, b.PARENT_ID as parentId, b.code, b.name, b.type, b.type2, b.accountId, b.accountId1, b.accountId2, b.factoryId, b.[ORDER], 7 thuTu, b.GROUP_ID
                    From temp as a, base.DEPARTMENT as b
                    Where a.id = b.parent_id and b.ID not in (102627, 102298, 102299, 102395, 102422, 102497) and (b.TYPE2 is null or b.TYPE2 != 'close')
            )
        Select *
        From temp order by thuTu, name
        option (maxrecursion 0)
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/viewphongban', (req, res) => {

    new mssql.Request()
        .query(`
        select * from notify.INFORMATION 
        where ID = ${req.query.infoId} and permission like '%${req.query.id}%'
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
    })
})
notify.get('/viewtintuctb', (req, res) => {

    new mssql.Request()
        .query(` 
        select top 1  i.ID, [veViec] veViec
        ,[subDescription] SUMMARY
        ,[description] CONTENT
        ,[imageUrl]
        ,[CREATED_BY]
        ,[sendManager]
        ,CREATED_AT, inf.updatedAt, temp.VALUE departmentId from notify.INFORMATION i
		left join 
		(select * from notify.INFO_FORMS where accountId = ${req.query.accountId})
		inf on i.ID = inf.infoId
		inner join 
		(
			select distinct VALUE from base.ACCOUNT a
			inner join base.ROLE_VALUE rv on a.id = rv.ROLE_ID
			where a.id = ${req.query.accountId}
		) temp on i.permission like '%'+temp.VALUE+'%'
		where i.confirm = 1 and inf.infoId is null AND sendManager = 0
        order by i.ID desc
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/viewtintuctbManager', (req, res) => {

    new mssql.Request()
        .query(` 
        select top 1  i.ID, [veViec] veViec
        ,[subDescription] SUMMARY
        ,[description] CONTENT
        ,[imageUrl]
        ,[CREATED_BY]
        ,[sendManager]
        ,CREATED_AT, inf.updatedAt, temp.VALUE departmentId from notify.INFORMATION i
		left join 
		(select * from notify.INFO_FORMS where accountId = ${req.query.accountId})
		inf on i.ID = inf.infoId
		inner join 
		(
			select distinct VALUE from base.ACCOUNT a
			inner join base.ROLE_VALUE rv on a.id = rv.ROLE_ID
			where a.id = ${req.query.accountId}
		) temp on i.permission like '%'+temp.VALUE+'%'
        inner join base.DEPARTMENT D on temp.VALUE = D.ID
		where i.confirm = 1 and inf.infoId is null AND sendManager = 1
        AND (D.accountId = ${req.query.accountId} OR D.accountId1 = ${req.query.accountId} OR D.accountId2 = ${req.query.accountId}) 
        order by i.ID desc
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/viewformid', (req, res) => {

    new mssql.Request()
        .query(`select * from [notify].[INFO_FORMS] where
        infoId = ${req.query.infoId} and accountId = ${req.query.accountId}
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/formid', (req, res) => {

    new mssql.Request()
        .query(`insert into [notify].[INFO_FORMS] (infoId,accountId, confirm)
        VALUES (${req.query.infoId},${req.query.accountId}, 0)
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/confirm-formid', (req, res) => {

    new mssql.Request()
        .query(`insert into [notify].[INFO_FORMS] (infoId,accountId, confirm)
        VALUES (${req.query.infoId},${req.query.accountId}, 1)
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
notify.get('/confirm-information', (req, res) => {

    new mssql.Request()
        .query(`
        SELECT 
        veViec, ngayBanHanh, i.CODE, D.NAME DEPARTMENT_NAME, A.ACCOUNT, A.LAST_NAME, INF.createdAt 
        FROM notify.INFORMATION I 
        INNER JOIN notify.INFO_FORMS INF ON I.ID = INF.infoId
        INNER JOIN base.ACCOUNT A ON INF.accountId = A.ID
        INNER JOIN base.DEPARTMENT D ON A.departmentId = D.ID
        WHERE INF.createdAt BETWEEN '${req.query.from}' AND '${req.query.to}' and INF.confirm = 1
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

notify.get('/count-confirm-information', (req, res) => {

    new mssql.Request()
        .query(`
        select CODE, ngayBanHanh, veViec, DEPARTMENT_NAME, numberConfirm, count(*) sumNumberConfirm from (
            select distinct i.CODE, ngayBanHanh, veViec,
                        CASE 
                        WHEN D.NAME = 'TH' THEN N'Kế toán TH'
                        WHEN D.NAME = N'Phòng Kế toán(YS1A-YS1B-YS2)' or d.NAME = N'Phòng kế toán YS4' THEN N'Phòng kế toán TQ'
                        else d.NAME
                    END DEPARTMENT_NAME,
                    (
                        select COUNT(inf2.ID)
                        from notify.INFO_FORMS inf2 
                        INNER JOIN base.ACCOUNT A ON inf2.accountId = A.ID
						INNER JOIN base.ROLE_VALUE RV2 ON A.ID = RV2.ROLE_ID
                        WHERE inf2.infoId = I.ID AND inf2.confirm = 1 AND RV2.VALUE = CONVERT(varchar, D.ID)
                    ) as numberConfirm, a.LAST_NAME
                    from notify.INFORMATION i 
                    inner join base.ROLE_VALUE rv on i.permission like '%'+rv.VALUE+'%'
                    inner join base.ACCOUNT a on rv.ROLE_ID = a.ID and a.unActive = 1
                    left join notify.INFO_FORMS inf on rv.ROLE_ID = inf.accountId and inf.confirm = 1
                    inner join base.DEPARTMENT d on d.id = rv.VALUE
                    where i.confirm = 1 AND i.CREATED_AT BETWEEN '${req.query.from}' AND '${req.query.to}' and rv.ROLE_TYPE_ID = 100001 and a.ID not in (100400,  102089)
                    
                    ) temp
                    group by CODE, ngayBanHanh, veViec, DEPARTMENT_NAME, numberConfirm
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        } )
})

notify.get('/code-in-notify', (req, res) => {

    new mssql.Request()
        .query(`
        SELECT TOP 1 CODE FROM notify.INFORMATION ORDER BY CODE DESC
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})



module.exports = notify