const express = require('express')
const app = express.Router()
const proxy = require('./proxy')
const LoadBalancer = require('./LoadBalancer')
const MasterSalve = require('./MasterSalve')
const getErrorMessage = require('../core/config').getErrorMessage
const fs = require('fs')
const yaml = require('js-yaml')


let conf
try {
    conf = yaml.safeLoad(fs.readFileSync(require('path').join(__dirname, './../../conf.yaml'), 'utf8'))
} catch (err) {
    throw err
}

conf.routers.forEach(router => {
    if (Array.isArray(conf.endPoint[router.endPoint])) {
        let master = conf.endPoint[router.endPoint].find(i => i.type == 'master')
            if (master) {
                // Chính phụ
                const masterSalve = new MasterSalve(conf.endPoint[router.endPoint])
                app[router.method || 'use'](router.path, (req, res, next) => {
                    req.url = req.originalUrl
                    let target = {
                        ...masterSalve.get(),
                        name: router.endPoint
                    }
                    proxy.web(req, res, {
                        target: target,
                        selfHandleResponse: true
                    }, err => {
                        res.api.sendFail(getErrorMessage(4921))
                        masterSalve.error()
                    })
                })
            } else {
                // Cân bằng tải
                const loadBalancer = new LoadBalancer(conf.endPoint[router.endPoint])
                app[router.method || 'use'](router.path, (req, res, next) => {
                    req.url = req.originalUrl
                    let target = {
                        ...loadBalancer.get(),
                        name: router.endPoint
                    }
                    proxy.web(req, res, {
                        target: target,
                        selfHandleResponse: true
                    }, err => {
                        res.api.sendFail(getErrorMessage(4921))
                        loadBalancer.error()
                    })
                })
            }
    } else {
        // Đẩy về bình thường
        app[router.method || 'use'](router.path, (req, res, next) => {
            req.url = req.originalUrl
            proxy.web(req, res, {
                target: {
                    ...conf.endPoint[router.endPoint],
                    name: router.endPoint
                },
                selfHandleResponse: true
            }, err => {
                res.api.sendFail(getErrorMessage(4921))
            })
        })
    }
})


app.use((req, res, next) => {
    req.params
    res.api.sendFail(getErrorMessage(404))
})



module.exports = app