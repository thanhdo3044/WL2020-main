const mssql = require('mssql')

const express = require('express')
const router = express.Router()

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
    // res.api.sendData([])
    new mssql.Request()
        .input('departmentId', req.query.departmentId)
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .query(`WITH temp(id)
        as (
                Select id
                From base.DEPARTMENT
                Where ID = @departmentId
                Union All
                Select b.id
                From temp as a, base.DEPARTMENT as b
                Where a.id = b.parent_id
        )
        Select *, v.Tổ as tonhom
        From temp D
    	LEFT JOIN View_raw_nhap_ton V ON V.DEPARTMENT_ID = D.ID
    	WHERE [Ngày giờ nhập] BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'
        order by [Ngày giờ nhập]`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

router.get('/afterDrying', (req, res, next) => {
    // res.api.sendData([])
    new mssql.Request()
        .input('departmentId', req.query.departmentId)
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .query(`WITH temp(id)
        as (
                Select id
                From base.DEPARTMENT
                Where ID = @departmentId
                Union All
                Select b.id
                From temp as a, base.DEPARTMENT as b
                Where a.id = b.parent_id
        )
        Select *
        From temp D
    	LEFT JOIN View_raw_nhap_ton V ON V.DEPARTMENT_ID = D.ID
    	WHERE [DATE] BETWEEN @FROM AND @TO`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
router.get('/nhapxuatct', (req, res, next) => {
    // res.api.sendData([])
    new mssql.Request()
        .input('departmentId', req.query.departmentId)
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .query(`select PH.ITEM_ID,I.NAME,I.LENGTH,I.WIDTH,I.HEIGHT,isnull(nhap,0) nhap,isnull(xuat,0) xuat,D.NAME congdoan,PH.number from
        (select case when K.ITEM_ID is null then K2.ITEM_ID else K.ITEM_ID end as ITEM_ID,nhap,xuat,
         case when K.ITEM_ID is null then K2.number else K.number end as number, case when K.ITEM_ID is null then K2.congdoan else K.congdoan end as congdoan from
        (select  IT.ITEM_ID,sum(IT.QUANTITY) nhap,I.VOLUMN,PO.number,P.DESTINATION_ID congdoan
        
        from prod.PACKAGE P
        left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
        left join base.ITEM I on I.ID = IT.ITEM_ID
        left join prod.PO PO on P.PO = PO.code
        where  P.CREATE_DATE > @FROM and P.CREATE_DATE <@TO
        GROUP BY IT.ITEM_ID,I.VOLUMN,number,P.DESTINATION_ID) K
        
        full join 
        
        (select M.ITEM_ID,sum(M.QUANTITY) xuat,I.VOLUMN,PO.number,P.SOURCE_ID congdoan from prod.PACKAGE P
        left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
        left join prod.MATERIALS_IN_PACKAGE M on M.ITEM_IN_PACKAGE_ID = IT.ID
        left join base.ITEM I on I.ID = M.ITEM_ID
        left join prod.PO PO on P.PO = PO.code
        where  P.CREATE_DATE > @FROM and P.CREATE_DATE <@TO
        GROUP BY M.ITEM_ID,I.VOLUMN,number,P.SOURCE_ID) K2 on K2.ITEM_ID = K.ITEM_ID and K2.congdoan = K.congdoan and K2.number = K.number) PH
        left join base.ITEM I on I.ID = PH.ITEM_ID
        left join base.DEPARTMENT D on D.ID = PH.congdoan
        
        where PH.number is not null and D.TYPE2 = 'to' and D.ID <> 100081 and D.factoryId = @departmentId`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
module.exports = router