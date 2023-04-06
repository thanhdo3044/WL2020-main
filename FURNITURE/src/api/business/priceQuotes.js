const express = require('express')
const priceQuotes = express.Router()
const model = require('../../core/model')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
    Items,
    Accounts,
    Customers
} = require('./../../model/protocol')
priceQuotes.get('/', (req, res, next) => {
    model.priceQuotes.findAll()
        .then(priceQuotes => {
            req.priceQuotes = JSON.parse(JSON.stringify(priceQuotes))
            next()
        })
}, (req, res, next) => {
    let ids = []
    req.priceQuotes.forEach(e => {
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
        req.priceQuotes.forEach((e, z) => {
            req.priceQuotes[z].project = projects.find(i => i.id == e.projectId) || {}
        })
        next()
    }).catch(err => {
        return res.api.sendFail({
            number: 4907,
            message: err
        })
    })
},(req,res,next)=>{
    let ids = []
    req.priceQuotes.forEach(e => {
        ids.push(e.createBy)
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
        req.priceQuotes.forEach((e,z)=>{
            req.priceQuotes[z].createById =  req.priceQuotes[z].createBy
            req.priceQuotes[z].createBy = accounts.find(i => i.id == req.priceQuotes[z].createBy) || {}
        })
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.priceQuotes)
})

priceQuotes.get('/:id', (req, res) => {
    model.priceQuotes.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})

priceQuotes.get('/:id/products', (req, res, next) => {
    model.priceQuoteProducts.findAll({
        where: {
            priceQuoteId: req.params.id
        }
    }).then(products => {
        req.products = JSON.parse(JSON.stringify(products))
        next()
    })
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
            req.products[i] = Object.assign({},e ,items.find(i => i.id == e.productId) || {}, )
        })
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.products)
})

priceQuotes.post('/', (req, res) => {
    req.body.createBy = req.token.accountId
    model.priceQuotes.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})

priceQuotes.put('/:id', (req, res) => {
    model.priceQuotes.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

priceQuotes.delete('/:id', (req, res) => {
    model.priceQuotes.destroy({
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status)
    })
})

module.exports = priceQuotes