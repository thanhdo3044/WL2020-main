const {
    cmd
} = require('./config')
const {
    decode,
    encode
} = require('./logic')

const Event = (socket) => {
    const channels = []

    function handle(req) {
        if(!req) return
        // if (req.header == cmd.LOGIN) {
        //     return login(req.body.account, req.body.password, (err, node) => {
        //         socket.device = socket.kernel.hasReceiver(node, socket)
        //         console.log(`device : ${socket.device.id} connected`)
        //         socket.sendMessage(`device ${socket.device.id}`)
        //     })
        // }
        switch (req.header) {
            case cmd.DATA:
            case cmd.PUBLISH:
                socket.kernel.publish(req.body.channel, req.body.message || req.body.data)
                if(req.body.message%10000 == 0)
                console.log(req.body.message)
                break
            case cmd.SUBCRIBE:
                let id = socket.kernel.subcribe(req.body.channel, (message) => {
                    socket.write(encode({
                        header: cmd.DATA,
                        body: JSON.stringify({
                            message
                        })
                    }))
                })
                channels.push({
                    id: req.body.channel,
                    listentId: id
                })
                break
            case cmd.UNSUBCRIBE:
                let channel = channels.find(i => i.id == req.body.channel) || {}
                socket.kernel.unsubcribe(req.body.channel, channel.listentId)
                break
            default:
                break;
        }
    }

    return {
        onData(data) {
            if (data[0] != 1) return
            handle(decode(data))
        },
        //The argument hadError is a boolean which says if the socket was closed due to a transmission error.
        onClose(hadError) {
            channels.forEach(channel => {
                socket.kernel.unsubcribe(channel.id, channel.listentId)
            })
            console.log(`TCP socket closed`)
        }
    }

}


module.exports = Event