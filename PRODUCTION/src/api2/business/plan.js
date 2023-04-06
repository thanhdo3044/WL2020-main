const express = require('express')
const plan = express.Router()
const mssql = require('mssql')

Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

plan.post('/', (req,res,next)=>{
    if(req.body.plan){
        if(Array.isArray(req.body.plan)){
            req.body.plan.forEach(e=>{
                new mssql.Request()
                .input('CODE',e.code)
                .input('YEAR',e.year)
                .input('WEEK',e.week)
                .input('STEP_ID',e.stepId)
                .input('ITEM_ID',e.itemId)
                .input('QUANTITY',e.quantity)
                .input('CREATE_BY',req.token.accountId)
                .query(`INSERT INTO prod.[PLAN] (GUID,CODE,[YEAR],WEEK,STEP_ID,ITEM_ID,QUANTITY,CREATE_BY,CREATE_DATE)
                VALUES (NEWID(),@CODE,@YEAR,@WEEK,@STEP_ID,@ITEM_ID,@QUANTITY,@CREATE_BY,GETDATE())`, (err,record)=>{})
            })
        }
    }
    res.api.sendData([])
})

plan.get('/', (req, res, next) => {

})

module.exports = plan