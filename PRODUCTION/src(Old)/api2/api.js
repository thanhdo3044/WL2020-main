const express = require('express')
const api = express.Router()
const mssql = require('mssql')
    //category
api.use('/machine', require('./category/resources/machine'))
api.use('/slcn', require('./category/resources/slcn'))

//resources
api.use('/package-type', require('./category/resources/packageType'))
api.use('/ranges', require('./category/resources/range'))

api.use('/parcel-woods', require('./category/resources/parcelWoods'))
api.use('/parcels', require('./category/resources/parcel'))
api.use('/remedies', require('./category/resources/remedies'))

api.use('/wood-types', require('./category/resources/woodTypes'))


api.use('/delivery-plan', require('./category/config/deliveryPlan'))
api.use('/production-order', require('./category/resources/productionOrder'))
api.use('/production-orders', require('./category/resources/productionOrders'))
api.use('/production-orders-type', require('./category/resources/productionOrdersType'))
api.use('/production-orders-status', require('./category/resources/productionOrdersStatus'))
api.use('/product-of-orders', require('./category/resources/productOfOrders'))

api.use('/dinh-muc-ton', require('./category/resources/dinhMucTon'))

//config
api.use('/oscp', require('./category/config/oscp'))
api.use('/boms', require('./category/config/bom'))
api.use('/routings', require('./category/config/routing'))
api.use('/routing-name', require('./category/config/routings'))
api.use('/production-time', require('./category/config/ptn'))

//bussines

api.use('/ballets', require('./business/ballet'))
api.use('/packages', require('./business/package'))
api.use('/kilns', require('./business/kiln'))
api.use('/kiln-batch', require('./business/kilnBatch'))
api.use('/plans', require('./business/plan'))
api.use('/san-luong', require('./business/san-luong'))

//report
api.use('/reports/step', require('./report/step'))
api.use('/reports/inventory-qc', require('./other/inventoryQC'))
api.use('/reports/ikea-code', require('./report/ikeaCode'))
api.use('/reports/inventory', require('./report/inventory'))
api.use('/reports/wood', require('./report/wood'))
api.use('/reports/plan', require('./report/plan'))
api.use('/reports/pallet', require('./report/pallet'))
api.use('/reports/bao-cao-tinh-hinh-thuc-hien', require('./report/baoCaoTinhHinhThucHien'))
api.use('/bao-cao-tinh-hinh-thuc-hien-excel', require('./report/export'))
api.use('/bao-cao-raw-data', require('./report/export-raw-data'))
api.use('/bao-cao-ton', require('./report/export-ton'))
api.use('/bao-cao-qc', require('./report/baoCaoQC'))
api.use('/bao-cao-me-say', require('./report/baoCaoMeSay'))
api.use('/bao-cao-phoi-theo-me-say', require('./report/baoCaoPhoiTheoMeSay'))
api.use('/bao-cao-so-sanh-ty-le-dat-qc-va-lua-phoi', require('./report/baoCaoTyLeDatQCVaLuaPhoi'))
api.use('/ke-hoach-san-xuat', require('./report/plan'))

//other
api.use('/bien-ban', require('./other/bienban'))
api.use('/bieu-mau-kiem-tra-do-am', require('./other/bieuMauKiemTraDoAm'))
api.use('/bao-cao-khuyet-tat', require('./other/baoBaoKhuyetTat'))
api.use('/coc', require('./other/coc'))
api.use('/ton-dau-ky', require('./category/resources/tonDauKy'))
api.use('/lich-su-cap-phoi', require('./category/resources/lichsucapphoi'))
api.use('/ton-dau-ky-chi-tiet', require('./report/baoCaoNhapTon'))
api.use('/dinh-muc-phoi', require('./items/item'))
api.use('/khsx', require('./pos'))
api.use('/cong-doan', require('./departments'))

//gate pass 
api.use('/gatepass', require('./gatepass'))
module.exports = api