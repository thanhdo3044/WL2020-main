const express = require('express')
const projects = express.Router()
const model = require('../../core/model')
const multer = require('multer')
const formidable = require('formidable')
const util = require('util')
var fs = require('fs')
const crypto = require('crypto')
const mssql = require('mssql')

const {
    Items,
    Accounts,
    Customers
} = require('./../../model/protocol')

projects.get('/', (req, res, next) => {
    let getProject = `
    SELECT P.ID id,P.PROJECT_PARENT_ID parentId,PP.CODE parentCode,PP.[NAME] parentName,P.CODE code,P.[NAME] [name],P.[DESCRIPTION] [description],P.CUSTOMER_ID customerId,P.CREATE_BY createBy,P.CREATE_DATE createDate
    FROM fpm.PROJECT P
    LEFT JOIN fpm.PROJECT PP ON PP.ID = P.PROJECT_PARENT_ID`
    req.projects = []
    new mssql.Request()
        .query(getProject, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            record.recordset.forEach(e => {
                req.projects.push(e)
            })
            next()
        })
    // model.projects.findAll()
    //     .then(projects => {
    //         req.projects = JSON.parse(JSON.stringify(projects))

    //     })
}, (req, res, next) => {
    let ids = []
    req.projects.forEach(e => {
        ids.push(e.createBy)
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
        req.projects.forEach((e, z) => {
            req.projects[z].createById = req.projects[z].createBy
            req.projects[z].createBy = accounts.find(i => i.id == req.projects[z].createBy)
        })
        next()
    })
}, (req, res, next) => {
    let ids = []
    req.projects.forEach(e => {
        ids.push(e.customerId)
    })
    ids = [...new Set(ids)]
    Customers.getByIds({
        data: JSON.stringify({
            data: ids
        })
    }, (err, response) => {
        let customers = []
        if (response !== undefined) {
            customers = JSON.parse(response.data).data
        }
        req.projects.forEach((e, z) => {
            req.projects[z].customer = customers.find(i => i.id == req.projects[z].customerId) || {}
        })
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.projects)
})

projects.get('/:id', (req, res) => {
    model.projects.findAll({
        where: {
            id: req.params.id
        }
    }).then(project => {
        res.api.sendData(project)
    })
})

projects.get("/:id/files", (req, res) => {
    model.contracts.findAll({
        where: {
            projectId: req.params.id
        }
    }).then(files => {
        res.api.sendData(files)
    })
})


projects.get('/:id/products', (req, res, next) => {
    model.projectProducts.findAll({
        where: {
            projectId: req.params.id
        }
    }).then(products => {
        req.products = JSON.parse(JSON.stringify(products))
        next()
    })
}, (req, res, next) => {
    let ids = []
    req.products.forEach(e => {
        ids.push(e.productId)
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
        req.products.forEach((e, i) => {
            let item = {
                ...items.find(i => i.id == e.productId) || {}
            }
            item.itemId = item.id
            delete item.id
            req.products[i] = Object.assign({}, item, e)
        })
        next()
    })
}, (req, res, next) => {
    res.api.sendData(req.products)
})

projects.post('/', (req, res) => {
    req.body.createBy = req.token.accountId
    model.projects.create(req.body)
        .then(project => {
            res.api.sendData(project)
        })
})

projects.put('/:id', (req, res) => {
    model.projects.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status[0])
    })
})

projects.delete('/:id', (req, res) => {
    model.projects.destroy({
        where: {
            id: req.params.id
        }
    }).then(status => {
        res.api.sendData(status)
    })
})

projects.post("/:id/files", handleUpload, (req, res) => {
    res.api.sendData(req.body)
})

function handleUpload(req, res, next) {
    let form = new formidable.IncomingForm()
    form.uploadDir = process.env.DIR_PUBLIC
    form.parse(req, function (err, fields, files) {
        let nameHash = files.file.path.split('/').pop().split('\\').pop()
        let name = files.file.name
        let type = name.split('.').pop()
        model.contracts.create({
            projectId: req.params.id,
            url: `${nameHash}.${type}`,
            fileName: name,
            createBy: req.token.accountId
        }).then(contract => {
            console.log(contract)
            req.body = Object.assign({}, req.body, fields, files)
            next()
        }).catch(err => console.log(err))

        fs.rename(files.file.path, `${files.file.path}.${type}`, function (err) {
            if (err) return console.log(err)
        })

    })
}


function hash() {
    return crypto.createHash('md5')
        .update(`file.${Date.now()}.${Math.floor(Math.random() * (9999 - 1000) + 1000)}`)
        .digest('hex')
}


module.exports = projects