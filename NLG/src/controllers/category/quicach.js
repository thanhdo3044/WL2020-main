const express = require('express')
const quicach = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
const uuidv4 = require('uuid/v4');

quicach.post('/create', (req, res, next) => {
    const queryInsertQuiCach = `INSERT INTO nlg.BOM([CODE],[NAME],[DAY],[RONG],[DAI],[KLQC],[NHOM],[USEFLAG],[DACBIET])
    VALUES(@CODE,@NAME,@DAY,@RONG,@DAI,@VOLUMN,@GROUPID,'Y ',@DACBIET)`
    new mssql.Request()
        .input('CODE', req.body.code)
        .input('NAME', req.body.name)
        .input('DAY', req.body.day)
        .input('RONG', req.body.rong)
        .input('DAI', req.body.dai)
        .input('VOLUMN', req.body.volumn)
        .input('GROUPID', req.body.nhom)
        .input('DACBIET', req.body.dacbiet)
        .query(queryInsertQuiCach, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
}, (req, res, next) => {
    if (req.body.dataPrice != req.body.code) {
        req.body.dataPrice.forEach(element => {
            const queryInsertNLG = `INSERT INTO nlg.NLGO([MANVL],[DAY],[RONG],[CAO],MANVLKHO) 
    VALUES('${element.masp}','${req.body.day}','${req.body.rong}','${req.body.dai}','${req.body.code}')`
            new mssql.Request()
                .query(queryInsertNLG, (err, record) => {
                    if (err)
                        return res.api.sendFail({
                            number: 4907,
                            message: err
                        })
                    next()
                })
        });
    } else {
        const queryInsertNLG = `INSERT INTO nlg.NLGO([MANVL],[DAY],[RONG],[CAO],MANVLKHO) 
    VALUES('${req.body.code}','${req.body.day}','${req.body.rong}','${req.body.dai}','${req.body.code}')`
        new mssql.Request()
            .query(queryInsertNLG, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next()
            });
    }
    // }, (req, res, next) => {
    //     req.body.dataPrice.forEach(element => {
    //         const newId = uuidv4()
    //         req.reqNo = newId
    //         const queryInsertReqPrice = `INSERT INTO nlg.REQ_COST([REQNO],[CREATE_BY],[CREATED_AT],[APPROVAL],[REASON],[DEL_FLAG])
    //         VALUES('${req.reqNo}','${req.body.uid}',GETDATE(),'P',N'Thêm qui cách mới !','N') INSERT INTO nlg.BANGGIANVL([MASP],[COST],[USE_FLAG],[INSERT_BY],[UPDATE_DATE],[REQNO])
    //         VALUES('${element.masp}','${element.cost}','P','${req.body.uid}',GETDATE(),'${req.reqNo}')`
    //         new mssql.Request()
    //             .query(queryInsertReqPrice, (err, record) => {
    //                 if (err)
    //                     return res.api.sendFail({
    //                         number: 4907,
    //                         message: err
    //                     })
    //                 next()
    //             })
    //     });
    // }, (req, res, next) => {
    //     req.body.dataPrice.forEach(element => {
    //         const queryAddPrice = `INSERT INTO nlg.BANGGIANVL([MASP],[COST],[USE_FLAG],[INSERT_BY],[UPDATE_DATE],[REQNO])
    //             VALUES('${element.masp}','${element.cost}','P','${req.body.uid}',GETDATE(),'${req.reqNo}')`
    //         new mssql.Request()
    //             .query(queryAddPrice, (err, record) => {
    //                 if (err)
    //                     return res.api.sendFail({
    //                         number: 4907,
    //                         message: err
    //                     })
    //                 next()
    //             })
    //     });

}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
quicach.post('/create-gia', (req, res, next) => {
    const queryInsertQuiCach = `update nlg.BOM
    set DACBIET = 'H' where CODE = @CODE`
    new mssql.Request()
        .input('CODE', req.body.code)
        .input('NAME', req.body.name)
        .input('DAY', req.body.day)
        .input('RONG', req.body.rong)
        .input('DAI', req.body.dai)
      
      
       
        .query(queryInsertQuiCach, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
}, (req, res, next) => {

        req.body.dataPrice.forEach(element => {
            const queryInsertNLG = `INSERT INTO nlg.NLGO([MANVL],[DAY],[RONG],[CAO],MANVLKHO) 
    VALUES('${element.masp}','${req.body.day}','${req.body.rong}','${req.body.dai}','${req.body.code}')`
            new mssql.Request()
                .query(queryInsertNLG, (err, record) => {
                    if (err)
                        return res.api.sendFail({
                            number: 4907,
                            message: err
                        })
                    next()
                })
        });
    
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
quicach.get('/', (req, res, next) => {

    new mssql.Request()
        .query(`
select ID id,CODE code,NAME name,NHOM nhom,DAI dai,RONG rong,DAY day,USEFLAG useFLAG,
DACBIET dacbiet FROM nlg.BOM where DAY <= ${req.query.day}
and RONG <= ${req.query.rong} and DAI <= ${req.query.dai} and USEFLAG = 'Y'
`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
quicach.get('/QC', (req, res, next) => {

    new mssql.Request()
        .query(`
        select ID id,CODE code,NAME name,NHOM nhom,DAI dai,RONG rong,DAY day,USEFLAG useFLAG,GROUP_QC,
        DACBIET dacbiet,VUOTNCC FROM nlg.BOM
`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
quicach.get('/delete', (req, res, next) => {
    const id = req.query.id

    new mssql.Request()
        .query(`
DELETE FROM nlg.BOM
WHERE ID = ${id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
quicach.get('/heso', (req, res, next) => {


    new mssql.Request()
        .query(`
select * FROM nlg.HESOCAP
`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
quicach.post('/', model.quicach.insert)

quicach.put('/:id', model.quicach.updateById)

quicach.delete('/:id', model.quicach.deleteById)



module.exports = quicach