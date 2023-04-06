const Sequelize = require('sequelize')
const {
    database
} = require('./../core/config')

/*========================= CONNECT ================================*/
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
        console.error(`Sequelize connect failse : ${err}`)
        throw err
    })

/*========================= CONNECT ================================*/


/*========================= MODEL ================================*/
const model = {
        provider: require('../model/PROVIDERS')(sequelize, Sequelize),
        churung: require('../model/RUNG')(sequelize, Sequelize),
        malogo: require('../model/MALOGO')(sequelize, Sequelize),
        makho: require('../model/MAKHO')(sequelize, Sequelize),
        kho: require('../model/PHIEUNHAPKHO')(sequelize, Sequelize),
        khodt: require('../model/KHO')(sequelize, Sequelize),
        quicach: require('../model/QUICACH')(sequelize, Sequelize),
        typeHaCap: require('../model/TYPE_HACAP')(sequelize, Sequelize),
        vung: require('../model/VUNG')(sequelize, Sequelize),
        vungVanChuyen: require('../model/VUNGVANCHUYEN')(sequelize, Sequelize),
        reqCost: require('../model/REQ_COST')(sequelize, Sequelize),
        dinhMucKho: require('../model/DINHMUCKHO')(sequelize, Sequelize),
        hesocapgo: require('../model/HESOCAPGO')(sequelize, Sequelize),
        bangGia: require('../model/BANGGIANVL')(sequelize, Sequelize),
        haCap: require('../model/HACAP')(sequelize, Sequelize),
        groupQuiCach: require('../model/GROUP_QUICACH')(sequelize, Sequelize),
        planNLG: require('./../model/PLAN_NLG')(sequelize, Sequelize),
        nguyenLieuGo: require('./../model/NLGO')(sequelize, Sequelize),
        nhaptuan: require('../model/PLAN_WEEK')(sequelize, Sequelize)
    }
    /*========================= MODEL ================================*/

/*========================= ADD FUNCTION ================================*/
Object.keys(model).forEach(key => {
        model[key].select = function(req, res, next) {
            model[key].findAll({
                    where: req.query
                })
                .then(data => {
                    res.api.sendData(data)
                    next()
                })
                .catch(err => {
                    res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                })
        }




        model[key].insert = function(req, res, next) {
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

        model[key].updateById = function(req, res) {
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

        model[key].deleteById = function(req, res) {
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