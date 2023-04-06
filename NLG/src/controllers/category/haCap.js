const express = require('express')
const haCap = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
const { PROCEDUCES } = require('../../config/database')
    //haCap.get('/', model.haCap.select)
haCap.get('/', (req, res) => {
        new mssql.Request()
            .query(`SELECT 
    A.ID id,
    A.ID_DT ID_DT,
   A.DAY DAY ,
   A.RONG RONG,
   A.CAO CAO,
   A.GAPDOI gapDoi,
   A.NOTE NOTE,
   A.SOTHANH sothanh,
   A.MANVL manvl,
   A.CODE quicach,
   B.TYPENAME TYPE,
   CAST((CAST(A.SOTHANH AS float)/(P.SAMPLEQTY*P.SOTHANH_BO)) AS float) AS tyle,
   
 
  
   A.GAPDOI GAPDOI
 
   


    FROM nlg.HACAP A JOIN nlg.TYPE_HACAP B ON B.ID = A.TYPE 
    JOIN nlg.PHIEUNHAPKHO_DT P ON P.ID = A.ID_DT 
   where A.DEL_FLAG = 'N' and A.ID_DT = '${req.query.detailId}'`, (err, data) => {
                if (err) {
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                }
                return res.api.sendData(data.recordset)
            })
    })
    // haCap.post('/', (req, res, next) => {
    //     new mssql.Request()
    //     .query(`INSERT INTO nlg.HACAP(ID_DT,SOTHANH,DEL_FLAG,TYPE,CODE) VALUES (${req.body.id_dt},'${req.body.sothanh}','${req.body.delFlag}','${req.body.type}','${req.body.quicach}')
    //     `, (err, record) => {
    //         if (err)
    //             return res.api.sendFail(getErrorMessage(4907))
    //         res.api.sendData(record.recordset)
    //     })
    //     })
haCap.post('/', model.haCap.insert)
haCap.put('/:id', model.haCap.updateById)

haCap.delete('/:id', model.haCap.deleteById)

module.exports = haCap