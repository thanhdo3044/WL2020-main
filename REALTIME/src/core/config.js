const config = require('./../../../config/global')

config.schema = 'app'

//config.port = process.env.REAL_TIME || 221

config.rpc = {
    host: '127.0.0.1',
    port: 50001
}
module.exports = config