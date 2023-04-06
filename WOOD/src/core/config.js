const config = require('./../../../config/global')
config.port = process.env.WOOD_PORT || 226

module.exports = config