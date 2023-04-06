const express = require('express')
const route = express.Router()
const mssql = require('mssql')

const {
    Gate_Pass,
    Gate_Pass_Table,
    Gate_Pass_Create,
} = require('../../../models')
const moment = require('moment')

//hien thi phieu xuat hang
route.get('/gate-pass', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .query(`
        select * from prod.GATE_PASS
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.get('/gate-pass-table', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .query(`
        select a.ID,a.CODE_ID,a.CREATED_AT,a.ID_TABELE
        ,a.PRODUCT_NAME,a.PRODUCT_CODE,a.DVT,a.LXH
        ,a.REALITY,a.NOTE
        from prod.GATE_PASS_TABLE a
        INNER JOIN  prod.GATE_PASS b 
        on a.ID_TABELE = b.ID_TABLE        
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.get('/get-gate-pass-create-account', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .query(`
        SELECT a.TENBOPHAN , a.TENNGUOITAOPHIEU , b.ID FROM  prod.GATE_PASS_CREATE a
        INNER JOIN base.ACCOUNT b ON a.MANV = b.ACCOUNT
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.get('/get-gate-pass-create', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .query(`
        SELECT * FROM  prod.GATE_PASS_CREATE
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


//tao phieu xuat hang
route.post('/post-gate-pass-table', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .input('CODE_ID', req.body.ID)
        .input('PRODUCT_NAME', req.body.tenSP)
        .input('PRODUCT_CODE', req.body.quyCach)
        .input('DVT', req.body.dvt)
        .input('LXH', req.body.lxh)
        .input('REALITY', req.body.thucTe)
        .input('NOTE', req.body.ghiChu)
        .input('CREATED_AT', req.body.date)
        .input('ID_TABELE', req.body.tabelId)
        .query(`
        INSERT INTO prod.GATE_PASS_TABLE( CODE_ID,PRODUCT_NAME,PRODUCT_CODE,DVT,LXH,REALITY,NOTE,CREATED_AT,ID_TABELE)
            VALUES ( @CODE_ID,@PRODUCT_NAME,@PRODUCT_CODE,@DVT,@LXH,@REALITY,@NOTE,@CREATED_AT,@ID_TABELE)     
        `)
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.post('/post-gate-pass', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .input('CREATED_AT', req.body.date)
        .input('LOCATION_COMPANY', req.body.diaChiCT)
        .input('BALLOT_NUMBER', req.body.so)
        .input('CONTRACT_NUMBER', req.body.tenHopDong)
        .input('CUSTOMER_OR_CUSTOMER', req.body.tenKhachHang)
        .input('CUSTOMER_ADDRESS', req.body.diaChiaKH)
        .query(`
        INSERT INTO prod.GATE_PASS( CREATED_AT,LOCATION_COMPANY,BALLOT_NUMBER,CONTRACT_NUMBER,CUSTOMER_OR_CUSTOMER,CUSTOMER_ADDRESS)
            VALUES ( @CREATED_AT,@LOCATION_COMPANY,@BALLOT_NUMBER,@CONTRACT_NUMBER,@CUSTOMER_OR_CUSTOMER,@CUSTOMER_ADDRESS)     
        `)
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

//sua du lieu bang phieu xuat hang
route.put('/put-gate-pass-table', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .query(`
        UPDATE prod.GATE_PASS_TABLE
        SET 
        PRODUCT_NAME = '${req.body.tenSP}',
        PRODUCT_CODE = '${req.body.quyCach}',
        DVT = '${req.body.dvt}',
        LXH = ${req.body.lxh},
        REALITY = ${req.body.thucTe},
        NOTE = '${req.body.ghiChu}',
        CREATED_AT = '${req.body.date}'
        WHERE CODE_ID = '${req.body.ID}'
        `)
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.put('/put-gate-pass-create', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .query(`
        UPDATE prod.GATE_PASS_CREATE
        SET 
        MANV = N'${req.body.maNV}',
        TENNGUOITAOPHIEU = N'${req.body.tenNguoiTaoPhieu}'
        WHERE ID = '${req.body.ID}'
        `)
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

//xoa bang xuat hang
route.delete('/delete-gate-pass-table/:id', async(req, res) => {
    try {
        // console.log("hie nthi da xoa thanh ong",req.params.id);
        const data = await new mssql.Request()
        .query(`
        DELETE prod.GATE_PASS_TABLE
        WHERE CODE_ID = '${req.params.id}'
        `)
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
route.delete('/delete-gate-pass-create/:id', async(req, res) => {
    try {
        // console.log("hie nthi da xoa thanh ong",req.params.id);
        const data = await new mssql.Request()
        .query(`
        DELETE prod.GATE_PASS_CREATE
        WHERE ID = '${req.params.id}'
        `)
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

//tao bang nguoi ky xuat phieu ra cong 
route.post('/post-gate-pass-create', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .input('MANV', req.body.maNV)
        .input('TENBOPHAN', req.body.tenBoPhan)
        .input('TENNGUOITAOPHIEU', req.body.tenNguoiTaoPhieu)
        .query(`
        INSERT INTO prod.GATE_PASS_CREATE( MANV,TENBOPHAN,TENNGUOITAOPHIEU)
            VALUES ( @MANV,@TENBOPHAN,@TENNGUOITAOPHIEU)     
        `)
        res.status(200).send([])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

//hien thi nguoi phu chach phieu ra cong
route.get('/get-base-account-gate-pass', async(req, res) => {
    try {
        const data = await new mssql.Request()
        .query(`SELECT ID,LAST_NAME,POSITION,ACCOUNT,departmentId FROM base.ACCOUNT `)
        res.status(200).send(data.recordset)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = route