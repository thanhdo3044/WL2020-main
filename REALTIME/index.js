require('dotenv').config()
require('dotenv').config({
    path: require('path').join(__dirname, './../.env')
})


require('./src/redis/production')