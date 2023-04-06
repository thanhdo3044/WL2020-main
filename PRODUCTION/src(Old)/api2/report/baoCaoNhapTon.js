const mssql = require('mssql')

const express = require('express')
const router = express.Router()

const {
    getErrorMessage
} = require('./../../core/config')

Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

router.get('/', (req, res, next) => {
    // res.api.sendData([])
    new mssql.Request()
        .input('FACTORY_ID', req.query.factoryId)
        .input('FROM', req.query.from || '2019-01-01')
        .input('TO', req.query.to || require('./../../core/config').date.now())
        .query(`WITH temp(id)
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
    	LEFT JOIN View_raw_nhap_ton V ON V.DEPARTMENT_ID = D.ID
    	WHERE [Ngày giờ nhập] BETWEEN @FROM AND @TO`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

module.exports = router