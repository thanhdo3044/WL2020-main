var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', function (socket) {
    socket.on('/production', function (msg) {
        io.emit(`/production/${msg}`, io.getDepartment(msg))
    })
    socket.on('disconnect', function () {
    })
})
http.listen(8080, function () {
    console.log('listening on *:8080');
})

module.exports = io