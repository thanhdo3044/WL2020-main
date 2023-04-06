const express = require('express')
const productOfOrders = express.Router()
const model = require('../../../core/model')


productOfOrders.get('/', (req,res)=>{
    res.api.sendData(model.productOfOrders.findAll())
})

productOfOrders.post('/', (req, res) => {
    model.productOfOrders.create(req.body,(role)=>{
        res.api.sendData(role)
    })
})

productOfOrders.put('/:id', (req,res)=>{
    model.productOfOrders.updateById(req.params.id,req.body,(role)=>{
        res.api.sendData(role)
    })
})

productOfOrders.delete('/:id',(req,res)=>{
    model.productOfOrders.deleteById(req.params.id,(status)=>{
        res.api.sendData({status})
    })
})

module.exports = productOfOrders