const io = require('socket.io')(process.env.SOCKET_IO_PORT || 1337, {
    pingTimeout: 1000 * 60 * 5,
    pingInterval: 1000 * 60 * 60 * 24,
})

io.on('connection', function (socket) {
    console.log('new connect', socket.id)
    socket.io = io
    const channels = []
    socket.on('subcriber', function (channel) {
        channels.push(channel)
        socket.receiverId = socket.io.kernel.subcribe(channel, (message) => {
            socket.emit('data', message)
        })
        console.log(channel, '|', socket.receiverId)
    })

    socket.on('publish', function (channel, message) {
        console.log(channel, message)
        socket.io.kernel.publish(channel, message)
    })
    socket.on('disconnect', (reason) => {
        //console.log(`socket ${socket.id} disconnect with ${reason}`)
        channels.forEach(channel => {
            socket.io.kernel.unsubcribe(channel, socket.receiverId)
        })

    })
    socket.on('error', (err) => {
        console.log(`socket ${socket.id} error with ${err}`)
    })
})

console.log('SOCKET.IO running on ', process.env.SOCKET_IO_PORT)

module.exports = io