const express = require('express')
const mssql = require('mssql')
const { mssqlExcutedQuery, PROCEDUCES, VIEWS } = require('../../../config/database')
const khodt = express.Router()
const model = require('../../../data/model')
const uuidv4 = require('uuid/v4');

khodt.get('/', (req, res) => {
    console.log(req.query.guid)
    new mssql.Request()
        .query(` SELECT PT.ID id, PT.SOPHIEUNHAP SOPHIEUNHAP, PT.DAY DAY,B.CREATED_AT as ngaynhap,
    PT.RONG RONG, PT.CAO CAO, PT.SOBO sobo, PT.SOTHANH_BO sothanh_bo, PT.NOTE NOTE,PT.MALOGONHAP,
    PT.PALLET
     
    FROM nlg.PHIEUNHAPKHO_DT PT  
    JOIN nlg.PHIEUNHAPKHO B ON B.SOPHIEU = PT.SOPHIEUNHAP
    where DELAI = 'N' and PT.DEL_FLAG = 'N' and SOPHIEUNHAP = '${req.query.guid.replace('-','/')}'
    order by PT.ID
    
             
             `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
khodt.get('/ngay', (req, res) => {
    console.log(req.query.guid)
    new mssql.Request()
        .query(` SELECT CREATED_AT ngaynhap
    
     
    FROM nlg.PHIEUNHAPKHO 
    
    where  SOPHIEU = '${req.query.guid.replace('-','/')}'
    
    
             
             `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
khodt.get('/nhap-lai', (req, res) => {
        console.log(req.query.guid)
        new mssql.Request()
            .query(`SELECT
            A.ID id,
            A.SOPHIEUTRAVE sophieu,
           A.FROMSL makho ,
           A.ALLOWTINHTIEN tinhtien,
       
           A.MANCC 'mancc',
           B.NAME name,
        
           A.CREATED_AT ngaynhapht,
       
           C.TENKHO tenkho,
           B.ADDRESS NCC_ADDRESS
          
          


            FROM nlg.PHIEUTRAVE A JOIN nlg.PROVIDERS B ON B.CODE = A.MANCC JOIN nlg.MAKHO C on A.FROMSL = C.MAKHO 
             where A.NHAPLAI = 'Y'
             ORDER BY A.CREATED_AT DESC,A.SOPHIEUTRAVE DESC
    
    
             
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