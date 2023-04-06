module.exports.database = {
    user : process.env.WMSDB_USER,
    password : process.env.WMSDB_PASSWORD,
    server : process.env.WMSDB_SERVER,
    database : process.env.WMSDB_DATABASE
}

module.exports.rpc = {
    service : {
        base : {
            host : '127.0.0.1',
            port : 50001
        }
    }
}
module.exports.schema = 'lgt'

module.exports.port = process.env.PORT || 226

module.exports.portMongo = 27017
module.exports.mongodbString = 'mongodb+srv://sa:Vanhieu182@wl-ncsqt.mongodb.net/wl'

module.exports.secretCode = 'secret'


//set timeout cua ma token
module.exports.tokenLife = '15 days'

// Tạo saltRounds  của bcrypt
module.exports.saltRounds = 10


module.exports.apiFormater = {
    name: 'Woodsland Restful API',
    version: 'v1',
    httpError: true
}
module.exports.documentLink = "https://documenter.getpostman.com/view/7506351/S1LyVnxj"

module.exports.param = {
    default_min: 1,
    defaull_max: 32,
    min1: 1,
    max50: 50,
    max100: 100,
    max500: 500,
    id_max: 900000,
    id_min: 100000,
    msg: {
        length: "Độ dài không hợp lệ",
        email: "Email không hợp lệ",
        id: "Id không hợp lệ",
    }
}

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

module.exports.validatorOption = {
    customValidators: {
        isArray: function (value) {
            return Array.isArray(value);
        },
        gte: function (param, num) {
            return param >= num;
        },
        lessThanEqual: (param, number) => {
            return param <= number
        },
        greaterThanEqual: (param, number) => {
            return param >= number
        },
        isTrue: (param, bool) => {
            if (typeof bool === 'boolean')
                return bool
            return false
        }
    }
}

module.exports.errorMessage = require('./../../../config/error')