const net = require('net')
const {
    encode
} = require('./src/logic')
const {
    cmd
} = require('./src/config')
const Event = require('./src/Event')

const tcp = net.createServer()

tcp.on('listening', () => console.log('TCP started', process.env.NET_PORT))
tcp.on('close', () => console.log('TCP close'))
tcp.on('error', (err) => console.log(`TCP err ${err}`))

tcp.on('connection', connection)


function connection(socket) {
    console.log('new connect')
    socket.kernel = tcp.kernel
    const event = Event(socket)

    socket.on('data', event.onData)
    socket.on('close', event.onClose)
    socket.on('error', (err) => {
        //console.log(err)
    })

    socket.sendMessage = function (message) {
        socket.write(encode({
            header: cmd.DATA,
            body: JSON.stringify({
                message
            })
        }))
    }
}

// giới hạn quyền truy cập từ đâu tới
//tcp.listen(process.env.NET_PORT, '127.0.0.1')

tcp.listen(process.env.NET_PORT)

module.exports = tcp