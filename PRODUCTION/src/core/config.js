const config = require('./../../../config/global')

config.schema = 'prod'

config.rpc.service = {
    base: {
        host: '127.0.0.1',
        port: process.env.BASE_GRPC_PORT || 50001
    }
}

config.port = process.env.PROD_PORT || 222

module.exports = config