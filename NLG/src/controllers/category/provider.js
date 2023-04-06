const express = require('express')
const provider = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
provider.get('/nguoidung', (req, res) => {
    new mssql.Request()
        .query(` select M1.sequence, CONCAT(M1.sequence,'.',M1.NAME) menuchinh,M.NAME menucon,AC.LAST_NAME  nguoisudung from base.MENU M
        left join base.MENU M1 on M.PARENT_ID = M1.ID
        left join (select * from base.ROLE_VALUE where ROLE_TYPE_ID = 100006 and ROLE_ID not in (100400,102089,101676,101651)) R on R.[VALUE] = M.ID
        inner join base.ACCOUNT AC on AC.ID = R.ROLE_ID
        where M.PARENT_ID in (select ID from [base].[MENU] where PARENT_ID = 100001 or ID = 100000) 
        order by M1.sequence,M.NAME
       `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

provider.get('/', model.provider.select)

provider.post('/', model.provider.insert)

provider.put('/:id', model.provider.updateById)

provider.delete('/:id', model.provider.deleteById)

module.exports = provider