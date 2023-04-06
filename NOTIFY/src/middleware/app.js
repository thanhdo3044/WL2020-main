const express = require('express')
const app = express()
const {Api} = require('api-formatter')
const bodyParser = require('body-parser')
const router = require('../router/index')
const cors = require('cors')
const path = require("path");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use("/Attached", express.static(path.join(__dirname, "./../Attached")));
app.use(Api.middleware(require('./../core/config').apiFormater))
app.use('/',loging,router)
app.use('/ping',(req,res,next)=>{
    res.status(200).send('pong')
    next()
})
app.use(cors());
function loging(req, res, next){
    console.log(`${require('./../core/config').date.time()}  ${req.method} : ${req.path}`)
    next()
}


module.exports = app