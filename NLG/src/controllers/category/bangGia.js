const express = require('express')
const bangGia = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')

bangGia.post('/approval', (req, res, next) => {
    const reqNo = req.body.no
    const approvalType = req.body.approvalType
    const date = req.body.date
    const queryApprovalForRequest = `UPDATE nlg.REQ_COST set CREATED_AT ='${date}',  APPROVAL='${approvalType}',APPROVAL_BY=${req.body.uid}
     WHERE REQNO='${reqNo}'`
    new mssql.Request()
        .query(queryApprovalForRequest, (err, record) => {
            if (err)
                return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                    //return res.api.sendData(record.recordset)

            if (req.body.approvalType === 'Y') {
                next()
            } else {
                return res.api.sendData(record.recordset)
            }
        })
}, (req, res, next) => {
    const query = `
    UPDATE nlg.BANGGIANVL SET APPLY_DATE='${req.body.date}' ,USE_FLAG='Y' WHERE REQNO='${req.body.no}'`
    new mssql.Request()
        .query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            return res.api.sendData(record.recordset)
        })
})
bangGia.get('/gia-sudung', (req, res) => {
    new mssql.Request()
        .query(`SELECT  [ID]
        ,[MASP] maSP
        ,[COST]  cost
        ,[UPDATE_DATE]
        ,[INSERT_BY] createBy
        ,[USE_FLAG] useFLAG
        ,[VUNG]
        ,[REQNO]
        ,[APPLY_DATE] applyDate 
        ,(select TOP 1 APPLY_DATE FROM [Woodsland].[nlg].[BANGGIANVL] C where MASP = '${req.query.maSP}' and C.APPLY_DATE>B.APPLY_DATE)  ngayhethan
    FROM [Woodsland].[nlg].[BANGGIANVL] B where MASP = '${req.query.maSP}' ORDER BY APPLY_DATE DESC`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
bangGia.get('/', (req, res) => {
        new mssql.Request()
            .query(`SELECT  [ID]
        ,[MASP] maSP
        ,[COST]  COST
        ,[UPDATE_DATE]
        ,[INSERT_BY] createBy
        ,[USE_FLAG] useFLAG
        ,[VUNG]
        ,[REQNO]
        ,[APPLY_DATE] applyDate 
        ,(select TOP 1 C.COST FROM [Woodsland].[nlg].[BANGGIANVL] C where C.MASP = B.MASP ORDER BY C.APPLY_DATE DESC)  giacu
    FROM [Woodsland].[nlg].[BANGGIANVL] B where B.REQNO = '${req.query.reqNo}' ORDER BY B.APPLY_DATE DESC`, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            })
    })
    //bangGia.get('/', model.bangGia.select)

bangGia.post('/', model.bangGia.insert)

bangGia.put('/:id', model.bangGia.updateById)

bangGia.delete('/:id', model.bangGia.deleteById)



module.exports = bangGia