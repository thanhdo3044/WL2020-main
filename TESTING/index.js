const request = require('request')

const server = 'http://127.0.0.1:222'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMTMxLCJpYXQiOjE1NzM1MjMyMDYsImV4cCI6MTU3NDgxOTIwNn0.8ICjXJjSFbttP_8WVO5ZBNuTcvf2FobiBvXPc4-ILDg'
const apis = require('./api')
const chalk = require('chalk');
const logSymbols = require('log-symbols');


let a = 10
console.log("hoang van hieu")

const check = {
    schema(res) {
        let result = []
        let title = 'Kiểm tra lược đồ'
        res.body.hasOwnProperty('meta') ? result : result.push('Thiếu trường meta')
        res.body.hasOwnProperty('data') ? result : result.push('Thiếu trường data')

        res.body.meta.success == true || res.body.meta.success == false ? result : result.push('Giá trị không đúng')

        if (res.body.success == false) {
            res.body.meta.messages.hasOwnProperty('number') ? result : result.push('Thiếu trường number')
            res.body.meta.messages.hasOwnProperty('message') ? result : result.push('Thiếu trường message')
        }

        if (result.length == 0) {
            console.log('   ', logSymbols.success, chalk.gray(title))
        } else {
            console.log('   ', logSymbols.error, chalk.red(title))
            result.forEach((e, i) => {
                console.log('       ', chalk.gray(i), chalk.gray(e))
            })
        }
    }
}


/*
async function testing() {
    for (let i = 0, length = apis.length; i < length; i++) {
        let api = apis[i]
        await new Promise((resolve, reject) => {
            let start = new Date()
            let method = 'GET'
            let uri = `${server}/api/v2${api}`
            request({
                method: method,
                uri: uri,
                headers: {
                    authorization: `Bearer ${token}`
                },
                timeout: 2000
            }, (err, res) => {
                console.log('\r\n', i, method, api)
                if (err) {
                    resolve()
                    return console.log('    ', logSymbols.error, chalk.red('Request', err))
                }
                try {
                    res.body = JSON.parse(res.body)
                } catch (error) {
                    resolve()
                    return console.log('    ', logSymbols.error, chalk.red(error))
                }
                res.time = new Date() - start
                console.log('   ', logSymbols.info, res.statusCode == 200 ? chalk.blue(res.statusCode) : chalk.yellow(res.statusCode),
                    //res.statusCode == 200 ? chalk.blue(res.statusMessage) : chalk.yellow(res.statusMessage),
                    res.time < 200 ? chalk.blue(res.time) : chalk.yellow(res.time), 'ms',
                )
                if (res.statusCode != 200) {
                    let number = res.body.meta.messages.number
                    let message = res.body.meta.messages.message
                    console.log('   ', logSymbols.info, {
                        number,
                        message
                    })
                }

                check.schema(res)

                resolve()
            })
        })
    }
}
*/
console.log("hieu")
//testing()
