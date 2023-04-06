const express = require('express')
const api = express.Router()

api.use('/goods-issues', require('./business/goodsIssues'))
api.use('/goods-issue-products', require('./business/goodsIssueProducts'))

module.exports = api
