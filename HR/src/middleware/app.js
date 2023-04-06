const express = require('express')
const app = express()
const bodyParser = require('body-parser')
//fix trả về 304
app.disable('etag')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(require('api-formatter').Api.middleware(require('./../core/config').apiFormater))
app.use('/ping', (req,res)=>{
    res.status(200).send('pong').end()
})
app.use('/api/v2', require('../controllers/router.js'))

app.use((req, res, next) => {
    res.api.sendFail(require('./../core/config').getErrorMessage(404))
})

module.exports = app