const config = require('./../../../config/global')
config.port = process.env.NLG_PORT || 228

module.exports = config

//quasar dev