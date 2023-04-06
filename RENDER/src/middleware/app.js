const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(require('api-formatter').Api.middleware(require('./../core/config').apiFormater))
app.use('/ping', (req,res)=>{
    res.status(200).send('pong').end()
})
app.use(require('./logging'))
app.use('/api/v2', require('../router/router'))
app.use('/api/v3', require('../router/router'))

module.exports = app