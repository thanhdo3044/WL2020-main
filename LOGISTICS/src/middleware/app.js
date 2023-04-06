const express = require('express')
const app = express()
const cors = require('cors')
const Api = require('./../core/api')
const bodyParser = require('body-parser')
const path = require('path')
const model = require('./../core/model')
const router = require('./../controllers/router')
const {
    apiFormater
} = require('./../core/config')



app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(Api.middleware(apiFormater))

app.use('/', (req, res, next) => {
    console.log(`${require('./../core/config').date.time()}  ${req.method} : ${req.path}`)
    next()
})

app.use('/', router)

app.use('/', (req,res)=>{
    res.api.sendFail({
        number: 404
    })
})


module.exports = app