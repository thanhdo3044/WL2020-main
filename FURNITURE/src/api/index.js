const express = require('express')
const api = express.Router()

//Dự án
api.use('/projects', require('./business/projects'))
api.use('/project-products', require('./business/projectProducts'))
//Báo giá
api.use('/price-quotes', require('./business/priceQuotes'))
api.use('/price-quote-products', require('./business/priceQuoteProducts'))
//Hợp đồng
api.use('/contracts', require('./business/contracts'))
//Biên lai
api.use('/receipts', require('./business/receipts'))
api.use('/receipt-products', require('./business/receiptProducts'))
//Nghiệm thu
api.use('/accepts', require('./business/accepts'))
api.use('/accept-products', require('./business/acceptProducts'))
//Khách hàng
api.use('/customers', require('./business/customers'))

module.exports = api