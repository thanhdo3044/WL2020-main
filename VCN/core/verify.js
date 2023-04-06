const jwt = require('jsonwebtoken')
const {
    errorMessage,
} = require('../config/global')
const lowercaseKeys = require('lowercase-keys')
const mssql = require('mssql')

function verify(req, res, next) {
    let request = new mssql.Request()
    request.output('ERROR')
    addMethod(request, req)
    req.token = {}
    if (req.headers['x-gateway-account-id']) {
        req.token.accountId = req.headers['x-gateway-account-id']
        request.input('ACCOUNT_ID', req.headers['x-gateway-account-id'])
        next()
    } else {
        next()
        // var token = req.query.token || req.query.access_token || req.body.token || req.header.token ||
        //     ((req.headers.authorization !== undefined) ? req.headers.authorization.replace("Bearer ", "") : "")
        // jwt.verify(token, secretCode, (err, result) => {
        //     if (err)
        //         return res.api.sendFail(getErrorMessage(4905))
        //     req.token.accountId = result.id
        //     request.input('ACCOUNT_ID', result.id)
        //     next()
        // })
    }
}

function addMethod(request, req) {
    req.input = function (param, value) {
        request.input(param, value)
        return req
    }
    req.execute = function (proc) {
        request.execute(proc, (err, record) => {
            if (err)
                return req.api.sendFail(err)
            if (record.output.ERROR > 0 && record.output.ERROR != null)
                return req.api.sendFail({
                    number: record.output.ERROR,
                    message: errorMessage[record.output.ERROR]
                })
            let result = []
            if (record.recordset !== undefined) {
                record.recordset.forEach(e => {
                    result.push(lowercaseKeys(e))
                })
                return req.api.sendData(result)
            }
            return req.api.sendData([])
        })
    }

    req.error = function (err) {
        req.api.sendFail(err)
    }
}
module.exports = verify