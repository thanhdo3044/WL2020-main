const express = require('express')
const planNLG = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../core/config')

planNLG.get('/', (req, res) => {

    new mssql.Request()
        .query(`SELECT DISTINCT
        C.ID id, B.CREATED_AT ngaynhapkho,C.VUOTNCC,
        A.MANCC MANCC, A.KHO KHO,B.MAKHO MAKHO, C.DACBIET dacbiet,B.MALOGONHAP,
        C.CODE code, C.DAI DAI, C.RONG RONG, C.DAY DAY, C.NHOM nhom,G.chankhackho
        
           FROM nlg.PLAN_NLG A JOIN nlg.PHIEUNHAPKHO B ON B.MANCC = A.MANCC 
           JOIN nlg.BOM C on C.NHOM = CAST(A.GROUP_CODE AS nvarchar)
           left join nlg.GROUP_CODE G on C.NHOM = G.ID
         where B.SOPHIEU = '${req.query.guid}' and C.USEFLAG = 'Y' and YEAR(A.CREATED_AT) = '${req.query.nam}' and MONTH(A.CREATED_AT) = '${req.query.thang}' and A.PLANQTY >= 0`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})
planNLG.get('/klqc', (req, res) => {

    new mssql.Request()
        .query(`SELECT 
        SUM(A.PLANQTY) KLNHOM
       
        
           FROM nlg.PLAN_NLG A
           
         where  A.GROUP_CODE = '${req.query.nhom}' and YEAR(A.CREATED_AT) = DATEPART(year, GETDATE()) and MONTH(A.CREATED_AT) = DATEPART(MONTH, GETDATE())`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})

planNLG.post('/chuyen-ke-hoach', (req, res, next) => {
    new mssql.Request()
        .input('year', req.body.year)
        .input('month', req.body.month)
        .input('nccId', req.body.mancc_old)
        .input('groupItemId', req.body.nhomqc)
        .query(getRemainPlan, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            let remain = record.recordset[0].remain || 0
            if (parseFloat(remain) - req.body.quantity > 0) {
                next()
            } else {
                res.api.sendData([])
            }
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('nccOld', req.body.mancc_old)
        .input('nccNew', req.body.mancc_new)
        .input('quantity', req.body.quantity)
        .input('groupItemId', req.body.nhomqc)
        .input('createBy', req.headers['x-gateway-account-id'])
        .query(insertChuyenKeHoach, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData([])
        })
})

planNLG.post('/', (req, res, next) => {
    req.body.createBy = req.headers['x-gateway-account-id']
    next()
}, model.planNLG.insert)

planNLG.put('/:id', model.planNLG.updateById)

planNLG.delete('/:id', model.planNLG.deleteById)



let getRemainPlan = `select X.[YEAR] year,
X.[MONTH] month,
X.MANCC nccId,
X.GROUP_CODE groupItemId,
SUM(X.PLANQTY) - nlg.Func_lay_thu_hien_thang_theo_qui_cach(@nccId, CONCAT(@year,'-',@month,'-01'), @groupItemId) remain
FROM (
    select
    YEAR(CREATED_AT) YEAR,
    MONTH(CREATED_AT) MONTH,
    MANCC,
    GROUP_CODE,
    PLANQTY
    from nlg.PLAN_NLG
) X
WHERE [YEAR] = @year
AND [MONTH] = @month
AND MANCC = @nccId  
AND GROUP_CODE = @groupItemId
GROUP BY X.[YEAR],
X.[MONTH],
X.MANCC,
X.GROUP_CODE`


let insertChuyenKeHoach = `
insert into nlg.PLAN_NLG(MANCC,PLANQTY,DEL_FLAG,CREATE_BY,CREATED_AT,GROUP_CODE,YEAR,MONTH)
values (@nccOld, @quantity * (-1),'N' ,@createBy,getdate(),@groupItemId, year(getdate()), month(getdate())),
(@nccNew, @quantity,'N' ,@createBy,getdate(),@groupItemId, year(getdate()), month(getdate()))
`

module.exports = planNLG