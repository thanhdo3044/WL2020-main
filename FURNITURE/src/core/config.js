module.exports.port = 223

module.exports.apiFormater = {
    name: 'Woodsland Restful API',
    version: 'v1',
    httpError: true
}
module.exports.secretCode = 'secret'

module.exports.modelSubcribeChannel = 'render'

module.exports.rpc = {
    service : {
        base : {
            host : '127.0.0.1',
            port : 50001
        }
    }
}

//set timeout cua ma token
module.exports.tokenLife = '15 days'

module.exports.date = {
    now() {
        let date = new Date()
        let year = date.getFullYear()
        let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)
        let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
        let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
        let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
        let milliseconds
        if (date.getMilliseconds() < 10) {
            milliseconds = `00${date.getMilliseconds()}`
        } else if (date.getMilliseconds() < 100) {
            milliseconds = `0${date.getMilliseconds()}`
        } else {
            milliseconds = date.getMilliseconds()
        }
        return year + '-' + month + '-' + day + ' ' +
            hours + ':' + minutes + ':' + seconds + ':' + milliseconds
    },
    get(d){
        let date = new Date(d)
        let year = date.getFullYear()
        let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)
        let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
        let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
        let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
        let milliseconds
        if (date.getMilliseconds() < 10) {
            milliseconds = `00${date.getMilliseconds()}`
        } else if (date.getMilliseconds() < 100) {
            milliseconds = `0${date.getMilliseconds()}`
        } else {
            milliseconds = date.getMilliseconds()
        }
        return year + '-' + month + '-' + day + ' ' +
            hours + ':' + minutes + ':' + seconds + ':' + milliseconds
    },
    time() {
        let date = new Date()
        let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
        let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
        let milliseconds
        if (date.getMilliseconds() < 10) {
            milliseconds = `00${date.getMilliseconds()}`
        } else if (date.getMilliseconds() < 100) {
            milliseconds = `0${date.getMilliseconds()}`
        } else {
            milliseconds = date.getMilliseconds()
        }
        return hours + ':' + minutes + ':' + seconds + ':' + milliseconds
    }
}
