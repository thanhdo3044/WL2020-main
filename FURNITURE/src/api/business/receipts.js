const express = require('express')
const receipts = express.Router()
const model = require('../../core/model')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
    Items,
    Accounts,
    Customers
} = require('./../../model/protocol')

receipts.get('/', (req, res, next) => {
    model.receipts.findAll()
        .then(receipts => {
            req.receipts = JSON.parse(JSON.stringify(receipts))
            next()
        })
}, (req, res, next) => {
    let ids = []
    req.receipts.forEach(e => {
        ids.push(e.projectId)
    })
    ids = [...new Set(ids)]
    model.projects.findAll({
        where: {
            id: {
                [Op.in]: ids
            }
        }
    }).then(projects => {
        projects = JSON.parse(JSON.stringify(projects))
        req.receipts.forEach((e, z) => {
            req.receipts[z].project = projects.find(i => i.id == e.projectId) || {}
        })
        next()
    }).catch(err => {
        return res.api.sendFail({
            number: 4907,
            message: err
        })
    })
}, (req, res, next) => {
    let ids = []
    req.receipts.forEach(e => {
        ids.push(e.customerId)
    })
    ids = [...new Set(ids)]
    Customers.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let customers = []
        if (response !== undefined) {
            customers = JSON.parse(response.data).data
        }
        req.receipts.forEach((e, z) => {
            req.receipts[z].customer = customers.find(i => i.id == req.receipts[z].customerId) || {}
        })
        next()
    })
}, (req, res, next) => {
    let ids = []
    req.receipts.forEach(e => {
        ids.push(e.createBy)
        ids.push(e.verifyBy)
    })
    ids = [...new Set(ids)]
    Accounts.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let accounts = []
        if (response !== undefined) {
            accounts = JSON.parse(response.data).data
        }
        req.receipts.forEach((e,z)=>{
            req.receipts[z].createById =  req.receipts[z].createBy
            req.receipts[z].createBy = accounts.find(i => i.id == req.receipts[z].createBy) || {}
            req.receipts[z].verifyById =  req.receipts[z].verifyBy
            req.receipts[z].verifyBy = accounts.find(i => i.id == req.receipts[z].verifyBy) || {}
        })
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.receipts)
})

receipts.get('/:id', (req, res) => {
    model.receipts.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})

receipts.get('/:id/products', (req, res, next) => {
    model.receiptProducts.findAll({
        where: {
            receiptId: req.params.id
        }
    }).then(receiptProducts => {
        req.receiptProducts = JSON.parse(JSON.stringify(receiptProducts))
        next()
    })
}, (req, res, next) => {
    let ids = []
    req.receiptProducts.forEach(e => {
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
        req.receiptProducts.forEach((e, i) => {
            req.receiptProducts[i] = Object.assign({}, e, items.find(i => i.id == e.productId) || {}, )
        })
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.receiptProducts)
})

receipts.post('/', (req, res) => {
    req.body.createBy = req.token.accountId
    model.receipts.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})
receipts.put('/:id/verify', (req,res,next)=>{
    model.receipts.update({
        verifyBy : req.token.accountId,
        verifyDate : Sequelize.fn('GETDATE')
    },{
        where : {
            id : req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

receipts.put('/:id', (req, res) => {
    model.receipts.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

receipts.delete('/:id', (req, res) => {
    model.receipts.destroy({
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status)
    })
})

module.exports = receipts