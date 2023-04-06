const express = require('express')
const contracts = express.Router()
const model = require('../../core/model')

contracts.get('/', (req, res) => {
    model.contracts.findAll()
        .then(contracts => {
            res.api.sendData(contracts)
        })
})

contracts.get('/:id', (req, res) => {
    model.contracts.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})

contracts.post('/', (req, res) => {
    model.contracts.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})

contracts.put('/:id', (req, res) => {
    model.contracts.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

contracts.delete('/:id', (req,res)=>{
    model.contracts.destroy({
        where : {
            id : req.params.id
        }
    }).then(status =>{
        res.api.sendData(status)
    })
})

module.exports = contracts