require('dotenv').config()
require('dotenv').config({
    path: require('path').join(__dirname, './../.env')
})
//require('./src/core/event')

const http = require('http')
const {
    port
} = require('./src/core/config')

http.createServer(require('./src/middleware/app')).listen(port, () => {
    console.log(`RENDER HTTP running on port ${port}`)
})