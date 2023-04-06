const express = require('express')
const mssql = require('mssql')
const { mssqlExcutedQuery, PROCEDUCES, VIEWS } = require('../../../config/database')
const khodt = express.Router()
const model = require('../../../data/model')
const uuidv4 = require('uuid/v4');

khodt.get('/', (req, res) => {
        console.log(req.query.makho)
        new mssql.Request()
            .query(` SELECT PT.ID ID, PT.SOPHIEUNHAP SOPHIEU, PT.DAY DAY,
    PT.RONG RONG, PT.CAO DAI, PT.SOBO SOBO, PT.SOTHANH_BO SOTHANHBO, P.MANCC MANCC
    FROM nlg.PHIEUNHAPKHO_DT PT 
     JOIN nlg.PHIEUNHAPKHO P on PT.SOPHIEUNHAP = P.SOPHIEU
     where P.MAKHO = '${req.query.makho}' and YEAR(PT.CREATED_AT) = DATEPART(year, GETDATE()) and MONTH(PT.CREATED_AT) = DATEPART(MONTH, GETDATE())
    and PT.DELAI = 'Y'
    
             
             `, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            })
    })
    // kho_dt.get('/ds-delai', (req, res) => {
    //         const makho = req.query.makho
    //         let condition = ` AND PN.MAKHO='${req.query.makho}'`
    //         if (req.query.makho === 'null') {
    //             condition = ``
    //         } else {
    //             condition = ` AND PN.MAKHO='${req.query.makho}'`
    //         }
    //         const query = `SELECT PT.ID ID,
    //         PT.SOPHIEUNHAP SOPHIEU,
    //         PT.DAY DAY, PT.RONG RONG, PT.CAO DAI
    //         PT.SOBO SOBO,PT.SOTHANH_BO SOTHANHBO

//     FROM nlg.PHIEUNHAPKHO_DT AS PT



//     WHERE PT.DEL_FLAG='N' AND PT.DELAI='Y'  ${condition}`
//         mssqlExcutedQuery(query, (data, err) => {
//             if (err) {
//                 return res.api.sendFail({
//                     number: 4907,
//                     message: err
//                 })
//             }
//             return res.api.sendData(data.recordset)
//         })
//     })
//     // khodt.post('/', model.khodt.insert)

// khodt.put('/:id', model.khodt.updateById)

// khodt.delete('/:id', model.khodt.deleteById)

module.exports = khodt