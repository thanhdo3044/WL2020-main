require('dotenv').config()
const http = require('http')
const app = require('./src/middleware/app')
const {
    port
} = require('./src/core/config')

const argv = process.execArgv.join()
const isDebug = argv.includes('inspect') || argv.includes('debug')

const server = http.createServer(app).listen(isDebug ? 221 : port, () => {
    console.log(`Server : open port ${server.address().port}`)
    
})
