const httpProxy = require('http-proxy')
const render = require('../core/render')
const proxy = httpProxy.createServer()
const getErrorMessage = require('./../core/config').getErrorMessage

proxy.on('start', (req, res, target) => {
    req.passTime = new Date()
    req.endPoint = target.port
    req.target = target
})

proxy.on('econnreset', (err, req, res, target) => {
    res.api.sendFail(getErrorMessage(4922))
})

proxy.on('proxyReq', (proxyReq, req, res, option) => {
    let bodyData = JSON.stringify(req.body)
    proxyReq.setHeader('x-gateway-render-service', 100000)
    proxyReq.setHeader('Content-Type', 'application/json')
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
    proxyReq.write(bodyData)
})

proxy.on('proxyRes', function (proxyRes, req, res) {
    let body = []
    let option = JSON.parse(proxyRes.headers['x-response-description'] || "{}")

    proxyRes.on('data', function (chunk) {
        body.push(chunk)
    })
    proxyRes.on('end', function () {
        try {
            body = JSON.parse(Buffer.concat(body).toString())
            if(body.meta.success){
                let result = render(body.data, option)
                res.api.sendData(result || [])
            }else{
                res.api.sendFail(body.meta.messages)
            }
        } catch (err) {
            res.api.sendFail(getErrorMessage(4931))
        }
    })
})

module.exports = proxy