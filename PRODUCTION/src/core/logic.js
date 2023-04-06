const {
    errorMessage
} = require('./../core/config')
const mssql = require('mssql')
const {
    Markets
} = require('./../model/protocol')

function solveMarket(code) {
    code = format(code)
    if (code.length < 20) {
        return {
            error: 1
        }
    }
    let startMarket = code.substring(0, 3)
    let indexOf1971791 = code.indexOf('1971791')
    let market = code.substring(3, indexOf1971791)
    let week = code.substring(indexOf1971791 + 7, 22)
    let quantity = code.substring(indexOf1971791 + 13)
    if (startMarket != 240 || quantity > 10000 || indexOf1971791 == -1) {
        return {
            error: 1
        }
    } else {
        return {
            market: market,
            week: week,
            vendor: 19717,
            quantity: quantity,
        }
    }
}

function format(code) {
    codes = code.split('')
    reuslt = ''
    codes.forEach(e => {
        if (e > -1 && e < 10) {
            reuslt = reuslt + e
        }
    })
    return reuslt
}


module.exports.ikea = {
    decode(req, res, next) {
        let code = req.params.ikeaCode || req.body.ikeaCode
        if (code == undefined) {
            return res.api.sendFail({
                number: 4900,
                message: errorMessage['4900']
            })
        }

        let solve = solveMarket(code)
        if (solve.error)
            return req.api.sendFail({
                number: 4800,
                message: errorMessage['4800']
            })
        Markets.getByCode({
            code: solve.market
        }, (err, response) => {
            if (response !== undefined)
                if (response.productId !== undefined && response.productId > 10)
                    return next({
                        market: solve.market,
                        marketName: response.name,
                        vendor: solve.vendor,
                        week: solve.week,
                        quantity: solve.quantity,
                        itemId: response.productId
                    })
            res.api.sendFail({
                number: 430,
                message: errorMessage['430']
            })
        })
    },
    checkGuid(req, res, next) {
        mssql.query(`SELECT ID FROM prod.[PALLET] WHERE IKEA_GUID = '${req.body.ikeaGuid}'`, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            if (record.recordset.length > 0) {
                res.api.sendFail({
                    number: 4801,
                    message: errorMessage['4801']
                })
            } else {
                next()
            }
        })
    }
}