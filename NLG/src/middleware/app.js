const express = require('express')
const app = express()
const {Api} = require('api-formatter')
const bodyParser = require('body-parser')
const router = require('../router/index')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(Api.middleware(require('./../core/config').apiFormater))
app.use('/',loging,router)
app.use('/ping',(req,res,next)=>{
    res.status(200).send('pong')
    next()
})
function loging(req, res, next){
    console.log(`${require('./../core/config').date.time()}  ${req.method} : ${req.path}`)
    next()
}

module.exports = app