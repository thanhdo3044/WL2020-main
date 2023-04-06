const express = require('express')
const accepts = express.Router()
const model = require('../../core/model')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const {
    Items,
    Accounts,
    Customers
} = require('./../../model/protocol')
accepts.get('/', (req, res, next) => {
    model.accepts.findAll()
        .then(accepts => {
            req.result = JSON.parse(JSON.stringify(accepts))
            next()
        })
}, (req, res, next) => {
    req.result.forEach((e,i)=>{
        Object.assign(req.result[i],{
            customer : {
                customerId : e.customerId
            },
            project : e.projectId,
            verifyBy : {
                accountId : e.verifyBy
            },
            createBy : {
                accountId : e.createBy
            }
        })
        delete req.result[i].projectId
        delete req.result[i].customerId
    })
    next()
}, (req, res, next) => {
    res.setHeader('x-response-description', JSON.stringify({
        field: {
            project: 'projectId'
        }
    }))
    res.api.sendData(req.result)
})

accepts.get('/:id', (req, res) => {
    model.accepts.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})


accepts.get('/:id/products', (req, res, next) => {
    model.acceptProducts.findAll({
        where: {
            acceptId: req.params.id
        }
    }).then(products => {
        req.products = JSON.parse(JSON.stringify(products))
        next()
    })
}, (req, res, next) => {
    req.products.forEach((e,i)=>{
        req.products[i].itemId = req.products[i].productId
    })
    next()
    // let ids = []
    // req.products.forEach(e => {
    //     ids.push(e.productId)
    // })
    // ids = [...new Set(ids)]
    // Items.getByIds({
    //     data: JSON.stringify({
    //         data: ids
    //     })
    // }, (err, response) => {
    //     let items = []
    //     if (response !== undefined) {
    //         items = JSON.parse(response.data).data
    //     }
    //     req.products.forEach((e, i) => {
    //         let item = items.find(i => i.id == e.productId) || {}
    //         item.itemId = item.id
    //         delete item.id
    //         req.products[i] = Object.assign({}, item, e)
    //     })
    //     next()
    // })
}, (req, res, next) => {
    res.api.sendData(req.products)
})


accepts.post('/', (req, res) => {
    req.body.createBy = req.token.accountId
    model.accepts.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})

accepts.put('/:id', (req, res) => {
    model.accepts.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

accepts.put('/:id/verify', (req, res, next) => {
    model.accepts.update({
        verifyBy: req.token.accountId,
        verifyDate: Sequelize.fn('GETDATE')
    }, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(
            status[0]
        )
    })
})

accepts.delete('/:id', (req, res) => {
    model.accepts.destroy({
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

module.exports = accepts