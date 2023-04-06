const express = require('express')
const api = express.Router()

//category

api.use('/qui-cach', require('./category/quicach'))
api.use('/type-ha-cap', require('./category/typeHaCap'))
api.use('/vung', require('./category/vung'))
api.use('/vung-van-chuyen', require('./category/vungVanChuyen'))
api.use('/req-cost', require('./category/reqCost'))
api.use('/dinh-muc-kho', require('./category/dinhMucKho'))
api.use('/nlg-he-so-cap-go', require('./category/hesocapgo'))
api.use('/ke-hoach-tuan', require('./category/nhaptuan'))
api.use('/nha-cung-cap', require('./category/provider'))
api.use('/chu-rung', require('./category/churung'))
api.use('/ma-lo-go', require('./category/malogo'))
api.use('/nha-cung-cap-thang', require('./business/planNCCthang'))
api.use('/nha-cung-cap-thang1', require('./business/planNCCthang1'))
api.use('/nha-cung-cap-thang2', require('./business/planNCCthang2'))
api.use('/khoi-luong-ncc-thang', require('./business/phieu/kho5'))
api.use('/ma-kho', require('./category/makho'))
api.use('/bang-gia', require('./category/bangGia'))
api.use('/chinh-pham', require('./category/hacapchinhpham'))
api.use('/ha-cap', require('./category/haCap'))
api.use('/group-qui-cach', require('./category/groupQuiCach'))
api.use('/nguyen-lieu-go', require('./category/nguyenLieuGo'))

//reports
api.use('/reports-nlg', require('./reports/raw'))

//business
api.use('/plan-nlg', require('./business/planNLG'))
api.use('/plan-nlg1', require('./business/planNLG1'))

api.use('/bien-ban-nghiem-thu', require('./business/bbnghiemthu'))
api.use('/bien-ban-tinh-tien', require('./business/bbTinhtien'))
api.use('/bien-ban-tinh-tien1', require('./business/bbTinhtien1'))
api.use('/bien-ban-tinh-tien2', require('./business/bbTinhtien3'))
api.use('/nlg-phieu-nhap-kho', require('./business/phieu/kho'))
api.use('/nlg-phieu-nhap-kho1', require('./business/phieu/kho1'))
api.use('/nlg-phieu-nhap-kho2', require('./business/phieu/kho2'))
api.use('/nlg-phieu-nhap-kho3', require('./business/phieu/kho3'))
api.use('/nlg-phieu-nhap-kho4', require('./business/phieu/kho4'))
api.use('/nlg-nha-cung-cap', require('./category/provider'))
api.use('/nlg-detail-nk', require('./business/phieu/phieunhapkho_dt'))
api.use('/nlg-nhap-kho', require('./business/phieu/phieunhapkho_dt1'))
api.use('/nlg-ds-de-lai', require('./business/phieu/danhsachdelai'))

//api.use('/wood-input',require('./category/makho'))
// api.use('/wood-type',require('./woodType'))
// api.use('/wood-payment',require('./payment'))
// api.use('/wood-price',require('./price'))
// api.use('/wood-dtype',require('./dType'))
// api.use('/wood-req-price',require('./reqPrice'))
// api.use('/wood-region',require('./region'))
// api.use('/wood-report',require('./report'))

module.exports = api