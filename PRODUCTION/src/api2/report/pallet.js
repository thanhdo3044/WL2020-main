const express = require('express')
const pallet = express.Router()
const mssql = require('mssql')
const {
    Items,
    Steps,
    Accounts,
    Markets
} = require('./../../model/protocol')

const {
    date
} = require('./../../core/config')

pallet.get('/created', (req, res, next) => {
    req.data = Object.assign({}, req.body || {}, req.params || {}, req.query || {})
    next()
}, (req, res, next) => {
    let buf = ''
    if (req.data.createBy || req.data.stepId || (req.data.fromDate && req.data.toDate)) {
        buf = 'WHERE'
        if (req.data.createBy) {
            buf = `${buf} CREATE_BY = ${req.data.createBy} AND `
        }
        if (req.data.stepId) {
            buf = `${buf} STEP_ID = ${req.data.stepId} AND `
        }
        if (req.data.fromDate && req.data.toDate) {
            buf = `${buf} CREATE_DATE BETWEEN '${req.data.fromDate}' AND '${req.data.toDate}' AND `
        }
        buf = buf.substring(0, buf.length - 5)
    }
    let query = 'SELECT * FROM View_getPalletCreated ' + buf
    new mssql.Request()
        .query(query, (err, record) => {

            for (let i = 0, length = record.recordset.length; i < length; i++) {
                let e = record.recordset[i]
                e.CREATE_DATE = date.get(e.CREATE_DATE).substring(0, 19)
                e.VERIFY_DATE = date.get(e.VERIFY_DATE).substring(0, 19)
            }
            req.result = []
            req.result = record.recordset
            next()
        })
}, (req, res, next) => { // Lấy tài khoản
    let accounts = []
    req.result.forEach(e => {
        accounts.push(e.CREATE_BY)
        accounts.push(e.VERIFY_BY)
    })
    ids = [...new Set(accounts)]
    Accounts.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let accounts = []
        if (response !== undefined) {
            accounts = JSON.parse(response.data).data
        }
        for (let i = 0, length = req.result.length; i < length; i++) {
            let e = req.result[i]
            let create = accounts.find(i => i.id == e.CREATE_BY)
            let verify = accounts.find(i => i.id == e.VERIFY_BY)
            if (create === undefined) create = {}
            if (verify === undefined) verify = {}
            req.result[i].createAccount = create.account
            req.result[i].createName = create.lastName
            req.result[i].verifyAccount = verify.account
            req.result[i].verifyName = verify.lastName
            if (e.VERIFY_BY == null) {
                e.status = 'Chưa nhận'
            } else {
                e.status = 'Đã nhận'
            }
        }
        next()
    })
}, (req, res, next) => { // Lấy công đoạn
    let steps = []
    req.result.forEach(e => {
        steps.push(e.STEP_ID)
        steps.push(e.STEP_NEXT_ID)
    })
    ids = [...new Set(steps)]

    Steps.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let steps = []
        if (response !== undefined) {
            steps = JSON.parse(response.data).data
        }
        for (let i = 0, length = req.result.length; i < length; i++) {
            let e = req.result[i]
            let step = steps.find(i => i.id == e.STEP_ID)
            let stepNext = steps.find(i => i.id == e.STEP_NEXT_ID)
            if (step === undefined) step = {}
            if (stepNext === undefined) stepNext = {}

            e.stepName = step.name
            e.stepCode = step.code
            e.stepId = step.id
            e.stepNextName = stepNext.name
            e.stepNextCode = stepNext.code
            e.stepNextId = stepNext.id
        }
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.result)
})

pallet.get('/ikea-created', (req, res, next) => {
    req.data = Object.assign({}, req.body || {}, req.params || {}, req.query || {})
    next()
}, (req, res, next) => {
    let dateRange = ''
    if (req.data.fromDate && req.data.toDate) {
        dateRange = `AND P.CREATE_DATE BETWEEN @FROM_DATE AND @TO_DATE`
    }
    let query = `SELECT P.ID, P.CODE,IIP.ITEM_ID, IIP.QUANTITY,SOP.STEP_ID,SOP.STEP_NEXT_ID, P.CREATE_BY,P.CREATE_DATE,P.IKEA_CODE
    FROM dbo.PALLET P
    LEFT JOIN dbo.[ITEM_IN_PALLET] IIP ON IIP.PALLET_ID = P.ID
    LEFT JOIN dbo.[STEP_OF_PALLET] SOP ON SOP.PALLET_ID = P.ID
    WHERE P.IKEA_CODE IS NOT NULL
    ${dateRange}
    ORDER BY P.ID DESC`

    new mssql.Request()
        .input('FROM_DATE', req.data.fromDate)
        .input('TO_DATE', req.data.toDate)
        .query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            req.result = []
            record.recordset.forEach(e => {
                req.result.push({
                    id: e.ID,
                    code: e.CODE,
                    itemId: e.ITEM_ID,
                    quantity: e.QUANTITY,
                    stepId: e.STEP_ID,
                    stepNextId: e.STEP_NEXT_ID,
                    createById: e.CREATE_BY,
                    createDate: e.CREATE_DATE,
                    ikeaCode: e.IKEA_CODE
                })
            })
            next()
        })
}, (req, res, next) => { //Lay item
    let ids = []
    req.result.forEach(e => {
        ids.push(e.itemId)
    })
    ids = [...new Set(ids)]
    Items.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let items = []
        if (response !== undefined) {
            items = JSON.parse(response.data).data
        }
        for (let i = 0, length = req.result.length; i < length; i++) {
            let e = req.result[i]
            let item = items.find(i => i.id == e.itemId) || {}
            e.item = item
        }
        next()
    })
}, (req, res, next) => { // Coong ddoanj
    let ids = []
    req.result.forEach(e => {
        ids.push(e.stepId)
        ids.push(e.stepNextId)
    })
    ids = [...new Set(ids)]
    Steps.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let steps = []
        if (response !== undefined) {
            steps = JSON.parse(response.data).data
        }
        for (let i = 0, length = req.result.length; i < length; i++) {
            let e = req.result[i]
            let step = steps.find(i => i.id == e.stepId) || {}
            let stepNext = steps.find(i => i.id == e.stepNextId) || {}
            e.step = step
            e.stepNext = stepNext
        }
        next()
    })

}, (req, res, next) => { // thông tin user
    let ids = []
    req.result.forEach(e => {
        ids.push(e.createById)
    })
    ids = [...new Set(ids)]
    Accounts.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let accounts = []
        if (response !== undefined) {
            accounts = JSON.parse(response.data).data
        }
        for (let i = 0, length = req.result.length; i < length; i++) {
            let e = req.result[i]
            let account = accounts.find(i => i.id == e.createById) || {}
            delete account.password
            e.createBy = account
        }
        next()
    })
}, (req, res, next) => { // Giai ma ikea
    for (let i = 0, length = req.result.length; i < length; i++) {
        let e = req.result[i]
        let ikeaDecode = solveMarket(e.ikeaCode) || {}
        if (ikeaDecode.error === undefined) {
            e.ikeaDecode = ikeaDecode || {}
        }
    }
    next()
}, (req, res, next) => {
    let codes = []
    for (let i = 0, length = req.result.length; i < length; i++) {
        let e = req.result[i]
        if (e.ikeaDecode !== undefined) {
            codes.push(e.ikeaDecode.market)
        }
    }
    codes = [...new Set(codes)]
    Markets.getByCodes({
        data: JSON.stringify({
            data: codes
        })
    }, (err, response) => {
        let markets = []
        if (response !== undefined) {
            markets = JSON.parse(response.data).data
        }
        for (let i = 0, length = req.result.length; i < length; i++) {
            let e = req.result[i]
            if (e.ikeaDecode !== undefined) {
                let market = markets.find(i => i.code == e.ikeaDecode.market) || {}
                e.ikeaDecode.market = market
            }
        }
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.result)
})

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
module.exports = pallet