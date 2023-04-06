const net = require('net')
const {
    encode,
    decode,
    cmd
} = require('../../../proto/TCP_protocol')
const {
    modelSubcribeChannel
} = require('../core/config')
var client = new net.Socket()


client.connect(process.env.PUBSUB_PORT, process.env.PUBSUB_HOST)


client.on('connect', () => {
    console.log('PUBSUB connected')
})

// client.on('data', function (data) {
//     console.log(decode(data).body)
//     //client.destroy(); // kill client after server's response
// })

client.on('close', function () {
    //reconnect sau 5s
    setTimeout(() => {
        client.connect(process.env.PUBSUB_PORT, process.env.PUBSUB_HOST)
    }, 5000)
    console.log('PUBSUB connect failse')
    client.destroy()
})

client.on('error', (err) => {
    //console.log('PUBSUB error : ', err)
})

module.exports = client