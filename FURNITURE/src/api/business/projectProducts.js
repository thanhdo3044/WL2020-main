const express = require('express')
const projectProducts = express.Router()
const model = require('../../core/model')

projectProducts.get('/', (req, res) => {
    model.projectProducts.findAll()
        .then(projectProducts => {
            res.api.sendData(projectProducts)
        })
})

projectProducts.get('/:id', (req, res) => {
    model.projectProducts.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})

projectProducts.post('/', (req, res) => {
    model.projectProducts.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})

projectProducts.put('/:id', (req, res) => {
    model.projectProducts.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

projectProducts.delete('/:id', (req,res)=>{
    model.projectProducts.destroy({
        where : {
            id : req.params.id
        }
    }).then(status =>{
        res.api.sendData(status)
    })
})

module.exports = projectProducts