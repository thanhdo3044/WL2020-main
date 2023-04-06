const net = require('net')
const {
    encode,
    decode,
    cmd
} = require('./../../../../proto/TCP_protocol')
const chalk = require('chalk');
var client = new net.Socket()

client.connect(1883, '192.168.2.21', function () {
    console.log('Connected')
    client.write(encode({
        header: cmd.SUBCRIBE,
        body: JSON.stringify({
            channel: 'logging'
        })
    }))
})

client.on('data', function (data) {
    let body = decode(data).body
    if (body) {
        let message
        try {
            message = JSON.parse(body.message)
        } catch (error) {
            console.log('JSON ERROR : ', body)
        }
        if (message) {
            console.log(chalk.green(message.service).padEnd(20), chalk.green('|'), message.message)
        }
    } else {
        let messages = data.toString().split("} {")
        messages[0] = messages[0] + '}'
        messages[messages.length - 1] = '{' + messages[messages.length - 1]
        for (let i = 1, length = messages.length - 1; i < length; i++) {
            messages[i] = '{' + messages[i] + '}'
        }
        messages.forEach(message => {
            try {
                message = JSON.parse(message)
                if (message) {
                    console.log(chalk.green(message.service).padEnd(20), chalk.green('|'), message.message)
                }
            } catch (error) {
                console.log('client loi json')
            }
        })
    }
})

client.on('close', function () {
    console.log('Connection closed');
})

client.on('error', (err) => {
    console.log(err)
})