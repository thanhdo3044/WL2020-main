const config = require('./../../../config/global')

config.schema = 'hr'

config.port = process.env.HR_PORT || 227

module.exports = config
