require('dotenv').config()
require('dotenv').config({
    path: require('path').join(__dirname, './../.env')
})
//require('./src/core/event')
const http = require('http')
const app = require('./src/middleware/app')

const server = http.createServer(app).listen(228, () => {
    console.log(`Server : open port ${server.address().port}`)
})