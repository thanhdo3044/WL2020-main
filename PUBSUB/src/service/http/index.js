const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const {
    apiFormater
} = require('./src/config')
const Api = require('./src/Api')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(Api.middleware(apiFormater))

const port = process.env.HTTP_PORT || 80
// client socket io
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

app.get('/channels/:id', (req, res, next) => {
    req.id = req.app.kernel.subcribe(req.params.id, (message) => {
        res.api.sendData({
            message
        })
    })
    next()
}, (req, res, next) => {
    function finish() {
        req.app.kernel.unsubcribe(req.params.id, req.id)
        clearTimeout(timeout)
    }
    let timeout = setTimeout(() => {
        res.api.sendData({
            message: ''
        })
    }, 1000 * 5)
    res.on('finish', finish)
})

app.post('/channels/:id', (req, res, next) => {
    req.app.kernel.publish(req.params.id, req.body.message)
    res.api.sendData([])
})

app.use('/ping', (req, res, next) => {
    res.api.sendData({
        message: 'pong'
    })
})

app.use((req, res, next) => {
    res.api.sendFail({
        number: 404,
        message: ''
    })
})

app.listen(port, () => {
    console.log('HTTP running on', port)
})

module.exports = app