const express = require('express')
const goodsIssues = express.Router()
const model = require('../../core/model')
const Sequelize = require('sequelize')
const mssql = require('mssql')
const {
    getGoodsIssueNumberMax
} = require('./../../core/query/index')

const {
    Items,
    Accounts,
    Customers
} = require('./../../model/protocol')

goodsIssues.get('/', (req, res, next) => {
    model.goodsIssues.findAll()
        .then(goodsIssue => {
            res.api.sendData(goodsIssue)
        })
})

goodsIssues.get('/:id/products', (req, res, next) => {
    model.goodsIssueProducts.findAll({
        where: {
            goodsIssueId: req.params.id
        }
    }).then(products => {
        req.products = JSON.parse(JSON.stringify(products))
        next()
    }).catch(err => res.api.sendFail({
        number: 4907,
        message: err
    }))
}, (req, res, next) => {
    let ids = []
    req.products.forEach(e => {
        ids.push(e.productId)
    })
    ids = [...new Set(ids)]
    Items.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let items = []
        if (response !== undefined) {
            items = JSON.parse(response.data).data
        }
        req.products.forEach((e, i) => {
            let item = {...items.find(i => i.id == e.productId) || {}}
            item.itemId = item.id
            delete item.id
            req.products[i] = Object.assign({}, item, e)
        })
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.products)
})

goodsIssues.post('/:id/qc/verify', (req, res, next) => {
    model.goodsIssues.update({
        qcVerify: req.token.accountId,
        qcDate: Sequelize.fn('GETDATE')
    }, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData({
            status: status[0]
        })
    }).catch(err =>
        res.api.sendFail({
            number: 0,
            message: err
        })
    )
})

goodsIssues.post('/:id/factory/verify', (req, res, next) => {
    model.goodsIssues.update({
        factoryBy: req.token.accountId,
        factoryDate: Sequelize.fn('GETDATE')
    }, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData({
            status: status[0]
        })
    }).catch(err =>
        res.api.sendFail({
            number: 0,
            message: err
        })
    )
})

goodsIssues.post('/:id/reciver/verify', (req, res, next) => {
    model.goodsIssues.update({
        reciverBy: req.token.accountId,
        reciverDate: Sequelize.fn('GETDATE')
    }, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData({
            status: status[0]
        })
    }).catch(err =>
        res.api.sendFail({
            number: 0,
            message: err
        })
    )
})

goodsIssues.post('/:id/completed', (req, res, next) => {
    model.goodsIssues.update({
        completed : 1
    }, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData({
            status: status[0]
        })
    }).catch(err =>
        res.api.sendFail({
            number: 0,
            message: err
        })
    )
})

goodsIssues.post('/', (req, res, next) => {
    req.body.stockkeeperVerify = req.token.accountId
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    new mssql.Request()
        .input('YEAR', year)
        .input('MONTH', month)
        .query(getGoodsIssueNumberMax, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            let number = record.recordset[0].NUMBER
            if (!number)
                number = 1
            else
                number++
            Object.assign(req.body, {
                year,
                month,
                number,
                goodsIssueNumber: `${number}/${month}/${year}`
            })
            model.goodsIssues.create(req.body)
                .then(goodsIssue => {
                    res.api.sendData(goodsIssue)
                })
        })
})

module.exports = goodsIssues