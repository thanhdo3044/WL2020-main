const express = require('express')
const productionOrdersType = express.Router()
const model = require('../../../core/model')


productionOrdersType.get('/', (req,res)=>{
    res.api.sendData(model.productionOrdersType.findAll())
})

productionOrdersType.post('/', (req, res) => {
    model.productionOrdersType.create(req.body,(role)=>{
        res.api.sendData(role)
    })
})

productionOrdersType.put('/:id', (req,res)=>{
    model.productionOrdersType.updateById(req.params.id,req.body,(role)=>{
        res.api.sendData(role)
    })
})

productionOrdersType.delete('/:id',(req,res)=>{
    model.productionOrdersType.deleteById(req.params.id,(status)=>{
        res.api.sendData({status})
    })
})

module.exports = productionOrdersType