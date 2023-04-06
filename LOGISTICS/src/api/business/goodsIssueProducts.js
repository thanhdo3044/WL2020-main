const express = require('express')
const goodsIssueProducts = express.Router()
const model = require('../../core/model')
const Sequelize = require('sequelize')


const {
    Items,
    Accounts,
    Customers
} = require('./../../model/protocol')



goodsIssueProducts.get('/', (req, res, next) => {
    model.goodsIssueProducts.findAll()
        .then(goodsIssueProduct => {
            res.api.sendData(goodsIssueProduct)
        })
})


goodsIssueProducts.post('/', (req, res, next) => {
    req.body.createBy = req.token.accountId
    model.goodsIssueProducts.create(req.body)
        .then(goodsIssueProduct => {
            res.api.sendData(goodsIssueProduct)
        })
})

module.exports = goodsIssueProducts