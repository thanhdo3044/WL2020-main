const Sequelize = require('sequelize')
const {
    database
} = require('../core/config')

const sequelize = new Sequelize(database.database, database.user, database.password, {
    host: database.server,
    port: database.port,
    dialect: 'mssql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    timestamps: false,
})
sequelize
    .authenticate()
    .then(() => {
        console.log('Sequelize conneted')
    })
    .catch(err => {
        console.error(`Sequelize failse : ${err}`)
        throw err
    })

/*========================= MODEL ================================*/
const model = {
    oscp: require('../model/oscp')(sequelize, Sequelize),
    roleMenu: require('../model/roleMenu')(sequelize, Sequelize),
    deliveryPlan: require('../model/deliveryPlan')(sequelize, Sequelize),
    machine: require('../model/machine')(sequelize, Sequelize),
    slcn: require('../model/slcn')(sequelize, Sequelize),
    ptn: require('../model/ptn')(sequelize, Sequelize),
    dinhMucTon : require('../model/dinhMucTon')(sequelize, Sequelize),
}

/*========================= ADD FUNCTION ================================*/
Object.keys(model).forEach(key => {
    model[key].insert = function (req, res, next) {
        model[key].create(req.body)
            .then(instance => {
                res.api.sendData(instance.dataValues)
                next()
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
            .then(instance => res.api.sendData([]))
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
            }).then(status => res.api.sendData([]))
            .catch(err => res.api.sendFail({
                number: 4907,
                message: err
            }))
    }
})
/*========================= ADD FUNCTION ================================*/

module.exports = model