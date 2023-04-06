const Sequelize = require('sequelize')
const {
    sequelize,
    mssql
} = require('./connect')

/*========================= MODEL ================================*/
const model = {
    workTimes: require('../model/WORK_TIME')(sequelize, Sequelize),
}
/*========================= MODEL ================================*/

/*========================= ADD FUNCTION ================================*/
Object.keys(model).forEach(key => {
    model[key].insert = function (req, res) {
        model[key].create(req.body)
            .then(instance => {
                res.api.sendData(instance.dataValues)
            })
            .catch(err => {
                res.api.sendFail({
                    number: 4907,
                    message: err
                })
            })
    }

    model[key].updateById = function (req, res) {
        model[key].update(req.body, {
                where: {
                    id: req.params.id || req.account.id
                }
            })
            .then(instance => res.api.sendData({}))
            .catch(err => res.api.sendFail({
                number: 4907,
                message: err
            }))
    }

    model[key].deleteById = function (req, res) {
        model[key].destroy({
                where: {
                    id: req.params.id
                }
            }).then(status => res.api.sendData({}))
            .catch(err => res.api.sendFail({
                number: 4907,
                message: err
            }))
    }
})
/*========================= ADD FUNCTION ================================*/
module.exports = model