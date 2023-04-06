const express = require('express')
const customers = express.Router()
const model = require('../../core/model')

customers.get('/', (req, res) => {
    model.customers.findAll()
        .then(customers => {
            res.api.sendData(customers)
        })
})

customers.get('/:id', (req, res) => {
    model.customers
        .findAll({
            where: {
                id: req.params.id
            }
        })
        .then(customer => {
            res.api.sendData(customer)
        })
})

customers.post('/', (req, res) => {
    model.customers
        .create(req.body)
        .then(customer => {
            customer.createDate = Date.now()
            res.api.sendData(customer)
        })
})

customers.put('/:id', (req, res) => {
    model.customers.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

customers.delete('/:id', (req, res) => {
    model.customers.destroy({
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status)
    })
})

module.exports = customers