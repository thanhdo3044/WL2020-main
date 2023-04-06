const express = require('express')
const priceQuoteProducts = express.Router()
const model = require('../../core/model')

priceQuoteProducts.get('/', (req, res) => {
    model.priceQuoteProducts.findAll()
        .then(priceQuoteProducts => {
            res.api.sendData(priceQuoteProducts)
        })
})

priceQuoteProducts.get('/:id', (req, res) => {
    model.priceQuoteProducts.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})

priceQuoteProducts.post('/', (req, res) => {
    model.priceQuoteProducts.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})

priceQuoteProducts.put('/:id', (req, res) => {
    model.priceQuoteProducts.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

priceQuoteProducts.delete('/:id', (req,res)=>{
    model.priceQuoteProducts.destroy({
        where : {
            id : req.params.id
        }
    }).then(status =>{
        res.api.sendData(status)
    })
})

module.exports = priceQuoteProducts