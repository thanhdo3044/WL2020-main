const express = require('express')
const workTime = express.Router()
const model = require('../../data/model')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {getErrorMessage} = require('./../../core/config')
workTime.get('/', (req, res, next) => {
    if (req.query.from !== undefined && req.query.to !== undefined) {
        
        let from = new Date(req.query.from)
        let to = new Date(req.query.to)
        from.setDate(from.getDate() - 1)
        to.setDate(to.getDate() + 1)
        from = `${from.getFullYear()}-${(from.getMonth() + 1) < 10 ? '0' + (from.getMonth() + 1) : (from.getMonth() + 1)}-${from.getDate() < 10 ? '0' + from.getDate() : from.getDate()}`
        to = `${to.getFullYear()}-${(to.getMonth() + 1) < 10 ? '0' + (to.getMonth() + 1) : (to.getMonth() + 1)}-${to.getDate() < 10 ? '0' + to.getDate() : to.getDate()}`
        
        model.workTimes.findAll({
            where: {
                date: {
                    [Op.between]: [from, to]
                },
                createBy : req.query.createBy
            }
        }).then(instances => {
            res.api.sendData(instances)
        }).catch(err => {
            res.api.sendFail(getErrorMessage(4907))
        })
    } else {
        next()
    }
}, (req, res) => {
    model.workTimes.findAll({
            where: req.query
        })
        .then(instances => {
            res.api.sendData(instances)
        }).catch(err => {
            res.api.sendFail(getErrorMessage(4907))
        })
    //res.api.sendData('ok')
    //res.api.sendData(cache.accounts.findBy(req.query))
})

workTime.post('/', (req, res, next) => {
    req.body.createBy = req.token.accountId
    next()
}, model.workTimes.insert)

workTime.put('/:id', model.workTimes.updateById)

workTime.delete('/:id', model.workTimes.deleteById)

module.exports = workTime