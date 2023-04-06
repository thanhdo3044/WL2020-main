const mssql = require('mssql')

const express = require('express')
const router = express.Router()
const {
    getErrorMessage
} = require('./../../core/config')
const  {getBaoCaoSoSanhTyLeDatQCvaLuaPhoi} = require('./../../core/query/index')

router.get('/', (req,res,next)=>{
    new mssql.Request()
    .input('FROM', req.query.from || '2019-01-01')
    .input('TO',req.query.to || require('./../../core/config').date.now())
    .query(getBaoCaoSoSanhTyLeDatQCvaLuaPhoi, (err,record)=>{
        if(err)
            return res.api.sendFail(getErrorMessage(4907))
        let data = record.recordset
            data.forEach((e,i)=>{
                let total = 0
                data.filter(x => x['Tổ'] == e['Tổ'] && x['id vào'] == e['id vào']).forEach(y => {
                    total = total + y['Số lượng vào']
                })
                data[i]['Tỷ lệ hạ cấp lựa phôi'] = (e['Số lượng vào']/total).toFixed(2)
            })
        res.api.sendData(data)
    })
})

module.exports = router