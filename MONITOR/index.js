require('dotenv').config()
require('dotenv').config({
    path: require('path').join(__dirname, './../.env')
})
const redis = require('redis')
const chalk = require('chalk')
let service = process.argv[process.argv.indexOf('-s') + 1]

if (!service || process.argv.indexOf('-s') == -1) {
    throw new Error('Không tìm thấy service')
}

console.log('Listen : ', service)

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)


client.on('message', function (channel, message) {
    // console.log(message)
    let data = message.split("|")
    if (data[0].trim() == service) {
        console.log(message)
    }
})

client.on("error", function (err) {
    console.log("Error " + err)
});


client.subscribe('logging')