require('dotenv').config()
require('dotenv').config({
    path: require('path').join(__dirname, './../.env')
})
const redis = require('redis')

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

client.on('message', (channel, message)=>{
    console.log(message)
})

client.subscribe('logging')