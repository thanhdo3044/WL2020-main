const config = require('./../../../config/global')

config.port = process.env.RENDER_PORT || 229

module.exports = config