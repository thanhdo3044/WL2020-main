const express = require('express')
const wood = express.Router()
const request = require('request')
wood.get('/getmakho', (req, res) => {
    request({
        uri: 'http://192.168.1.45:5231/getmakho',
        method: 'GET'
    }, (err, response, body) => {
        if (err) return res.api.sendFail({
            number: err.code,
            message: err.message
        })
        let bodyJson = JSON.parse(body)
        res.api.sendData(bodyJson.data)
    })
})

wood.get('/ton-nvl', (req, res) => {
    request({
        uri: 'http://192.168.1.45:5231/api-bctonkhov3?wh=' + req.query.warehouse || 'all',
        method: 'GET'
    }, (err, response, body) => {
        if (err) return res.api.sendFail({
            number: err.code,
            message: err.message
        })
        let bodyJson = JSON.parse(body)
        res.api.sendData(bodyJson.data)
    })
})

module.exports = wood