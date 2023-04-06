const express = require('express')
const oscp = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')
const m2 = require('./../../../core/m2')

oscp.get('/', (req, res, next) => {
    new mssql.Request()
        .input('ITEM_ID', req.query.itemId)
        .input('DEPARTMENT_ID', req.query.departmentId)
        .query(getOSCP, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                e.department = e.departmentId
                e.item = e.itemId
                delete e.departmentId
                delete e.itemId
            })
            res.setHeader('x-response-description', JSON.stringify({
                field: {
                    item: 'itemId',
                    department: 'departmentId'
                }
            }))
            res.api.sendData(record.recordset)
        })
})


oscp.post('/', (req, res, next) => {
    new mssql.Request()
        .input('DEPARTMENT_ID', req.body.departmentId)
        .input('ITEM_ID', req.body.itemId)
        .input('TEN_MAY', req.body.tenMay)
        .input('SO_CONG_NHAN', req.body.soCongNhan)
        .input('THOI_GIAN_HOAN_THANH_CHI_TIET', req.body.thoiGianHoanThanhChiTiet)
        .input('SO_CONG_LAO_DONG_TREN_CHU_KY', req.body.soCongLaoDongTrenChuKy)
        .input('TONG_THOI_GIAN_CHU_KY', req.body.tongThoiGianChuKy)
        .input('CONG_SUAT_MAY', req.body.congSuatMay)
        .input('DIEN_NANG_TREN_CHU_KY', req.body.dienNangTrenChuKy)
        .input('TON_KHO_CONG_DOAN', req.body.tonKhoCongDoan)
        .input('THOI_GIAN_VAN_CHUYEN', req.body.thoiGianVanChuyen)
        .query(insertOSCP, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData([])
        })
})

oscp.put('/:id', (req, res, next) => {
    m2.oscp.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        .then(instance => res.api.sendData([]))
        .catch(err => res.api.sendFail(getErrorMessage(4907)))
})

oscp.delete('/:id', (req, res, next) => {
    new mssql.Request()
        .input('ID', req.params.id)
        .query(deleteOSCP, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData([])
        })
})

let getOSCP = `SELECT ID id,
DEPARTMENT_ID departmentId,
ITEM_ID itemId,
TEN_MAY tenMay,
SO_CONG_NHAN soCongNhan,
THOI_GIAN_HOAN_THANH_CHI_TIET thoiGianHoanThanhChiTiet,
SO_CONG_LAO_DONG_TREN_CHU_KY soCongLaoDongTrenChuKy,
TONG_THOI_GIAN_CHU_KY tongThoiGianChuKy,
CONG_SUAT_MAY congSuatMay,
DIEN_NANG_TREN_CHU_KY dienNangTrenChuKy,
TON_KHO_CONG_DOAN tonKhoCongDoan,
THOI_GIAN_VAN_CHUYEN thoiGianVanChuyen
FROM prod.OSCP
WHERE ITEM_ID = @ITEM_ID
AND DEPARTMENT_ID = @DEPARTMENT_ID`
let insertOSCP = `INSERT INTO prod.OSCP(DEPARTMENT_ID,ITEM_ID,TEN_MAY,SO_CONG_NHAN,THOI_GIAN_HOAN_THANH_CHI_TIET,SO_CONG_LAO_DONG_TREN_CHU_KY,TONG_THOI_GIAN_CHU_KY,CONG_SUAT_MAY,DIEN_NANG_TREN_CHU_KY,TON_KHO_CONG_DOAN,THOI_GIAN_VAN_CHUYEN)
VALUES (@DEPARTMENT_ID,@ITEM_ID,@TEN_MAY,@SO_CONG_NHAN,@THOI_GIAN_HOAN_THANH_CHI_TIET,@SO_CONG_LAO_DONG_TREN_CHU_KY,@TONG_THOI_GIAN_CHU_KY,@CONG_SUAT_MAY,@DIEN_NANG_TREN_CHU_KY,@TON_KHO_CONG_DOAN,@THOI_GIAN_VAN_CHUYEN)`

let deleteOSCP = `DELETE prod.OSCP
WHERE ID = @ID`



module.exports = oscp