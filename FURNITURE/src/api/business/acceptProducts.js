const express = require('express')
const acceptProducts = express.Router()
const model = require('../../core/model')

acceptProducts.get('/', (req, res) => {
    model.acceptProducts.findAll()
        .then(acceptProducts => {
            res.api.sendData(acceptProducts)
        })
})

acceptProducts.get('/:id', (req, res) => {
    model.acceptProducts.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})

acceptProducts.post('/', (req, res) => {
    model.acceptProducts.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})

acceptProducts.put('/:id', (req, res) => {
    model.acceptProducts.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

acceptProducts.delete('/:id', (req,res)=>{
    model.acceptProducts.destroy({
        where : {
            id : req.params.id
        }
    }).then(status =>{
        res.api.sendData(status)
    })
})

module.exports = acceptProducts