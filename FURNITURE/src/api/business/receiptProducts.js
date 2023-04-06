const express = require('express')
const receiptProducts = express.Router()
const model = require('../../core/model')

receiptProducts.get('/', (req, res) => {
    model.receiptProducts.findAll()
        .then(receiptProducts => {
            res.api.sendData(receiptProducts)
        })
})

receiptProducts.get('/:id', (req, res) => {
    model.receiptProducts.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})

receiptProducts.post('/', (req, res) => {
    model.receiptProducts.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})

receiptProducts.put('/:id', (req, res) => {
    model.receiptProducts.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

receiptProducts.delete('/:id', (req,res)=>{
    model.receiptProducts.destroy({
        where : {
            id : req.params.id
        }
    }).then(status =>{
        res.api.sendData(status)
    })
})

module.exports = receiptProducts