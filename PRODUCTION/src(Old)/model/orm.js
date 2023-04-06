const mssql = require('mssql')
const schemaTable = require('./../core/config').schema
const orm = {
    create(schema, tableName, option) {
        return {
            _data: [schema],
            getShema() {
                return schema
            },
            getTableName() {
                return tableName
            },
            begin() {
                return this
            },
            create(data, callback) {
                return schema
            },
            updateById(id, data, callback) {
                return schema
            },
            deleteById(id, callback) {
                return 1
            },
            reload(callback) {
                return this
            },
            find(func) {
                return schema
            },
            filter(func) {
                return [schema]
            },
            findAll() {
                return [schema]
            },
        }
    }
}
const option = {
    exists: []
}

orm.create = function (schema, tableName, option = {}) {
    if (tableName === undefined)
        console.log('Thiếu tên bảng')
    tableName = `[${schemaTable}].${tableName}`
    return {
        _data: [schema],
        getShema() {
            return schema
        },
        getTableName() {
            return tableName
        },
        create(data, callback) {
            new mssql.Request().query(`SELECT CAST(NEWID() AS VARCHAR(36)) [GUID]`, (err, record) => {
                if (err) throw err
                let isExists = 0
                if (option.exists !== undefined) {
                    option.exists.forEach(e => {
                        let element = this._data.find(i => i[e] == data[e])
                        if (element !== undefined) {
                            isExists = 1
                        }
                    })
                }
                if (isExists == 1) {
                    return callback({
                        error: 420
                    })
                }
                let guid = record.recordset[0].GUID
                let request = new mssql.Request()
                let columns = ''
                let values = ''
                Object.keys(schema).forEach(e => {
                    if (e != 'id' && e != 'guid') {
                        request.input(schema[e], data[e] || null)
                        columns = columns + `[${schema[e]}],`
                        values = values + `@${schema[e]},`
                    }
                })
                columns = columns.substring(0, columns.length - 1)
                values = values.substring(0, values.length - 1)
                columns = `([GUID],${columns})`
                values = `('${guid}',${values})`
                let query = `INSERT INTO ${tableName} ${columns}
                                VALUES ${values}`
                request.query(query, (err, record) => {
                    if (err) throw err
                    new mssql.Request().query(`SELECT ID FROM ${tableName}
                    WHERE [GUID] = '${guid}'`, (err, record) => {
                        if (err) throw err
                        this.reload(() => {
                            if (typeof callback === 'function')
                                callback(this.find(i => i.id == record.recordset[0].ID))
                        })
                    })
                })
            })
        },
        updateById(id, data, callback) {
            let request = new mssql.Request()
            let values = ''
            Object.keys(schema).forEach(e => {
                if (e != 'id' && e != 'guid') {
                    if (data[e] !== undefined) { // Set những thuộc tính cần thay đổi
                        request.input(schema[e], data[e])
                        values = values + `[${schema[e]}]=@${schema[e]},`
                    }
                }
            })
            values = values.substring(0, values.length - 1)
            let query = `UPDATE ${tableName}
                        SET ${values}
                        WHERE ID = '${id}'`
            request.query(query, (err, record) => {
                if (err) throw err
                Object.keys(schema).forEach(e => { //update schema
                    if (e != 'id' && e != 'guid') {
                        if (data[e] !== undefined) {
                            let type = ''
                            let example = this._data.find(i => i[e] != null)
                            if (example !== undefined) {
                                type = typeof example[e]
                            }
                            if (type == 'number') {
                                this._data.find(i => i.id == id)[e] = parseFloat(data[e])
                            } else {
                                this._data.find(i => i.id == id)[e] = data[e]
                            }
                        }
                    }
                })
                if (typeof callback === 'function')
                    callback(this.find(i => i.id == id))
            })
        },
        deleteById(id, callback) {
            let query = `DELETE ${tableName} WHERE [ID] = ${id}`
            new mssql.Request()
                .query(query, (err, record) => {
                    if (err) throw err
                    callback(1)
                })
            this._data.splice(this._data.findIndex(e => e.id == id), 1)
        },
        reload(callback) {
            let columns = ''
            Object.keys(schema).forEach(e => {
                columns = columns + `[${schema[e]}],`
            })
            columns = columns.substring(0, columns.length - 1)

            let query = `SELECT ${columns} FROM ${tableName}`
            new mssql.Request().query(query, (err, record) => {
                if (err) throw err
                this._data = []
                record.recordset.forEach(e => {
                    let object = {}
                    Object.keys(schema).forEach(i => {
                        if(typeof e[schema[i]] == 'string'){
                            object[i] = e[schema[i]].trim()
                        }else{
                            object[i] = e[schema[i]]
                        }
                        
                    })
                    this._data.push(object)
                })
                this._data.sort((a, b) => a.id - b.id)
                if (typeof callback === 'function')
                    callback(this)
            })
        },
        begin(callback) {
            this.reload(callback)
            return this
        },
        find(func) {
            if (this._data.find(func) === undefined) {
                this.reload()
            }
            return Object.assign({}, this._data.find(func))
        },
        filter(func) {
            if (this._data.filter(func).length == 0) {
                this.reload()
            }
            return [...this._data.filter(func)]
        },
        findAll() {
            return [...this._data]
        }
    }
}

/*
const market = {
    id: 'ID',
    code: 'MARKET_CODE',
    name: 'MARKET_NAME',
    productId: 'PRODUCT_CODE'
}

let markets = orm.create(market, 'dbo.[MARKET]')

setTimeout(() => {
    markets.reload((o) => {

    })
}, 2000);

*/

module.exports = orm


// const mssql = require('mssql')
// const schemaTable = require('./../core/config').schema
// const orm = {
//     create(schema, tableName) {
//         return {
//             _data: [schema],
//             getShema() {
//                 return schema
//             },
//             getTableName() {
//                 return tableName
//             },
//             begin() {
//                 return this
//             },
//             create(data, callback) {
//                 return schema
//             },
//             updateById(id, data, callback) {
//                 return schema
//             },
//             deleteById(id, callback) {
//                 return 1
//             },
//             reload(callback) {
//                 return this
//             },
//             find(func) {
//                 return schema
//             },
//             filter(func) {
//                 return [schema]
//             },
//             findAll() {
//                 return [schema]
//             },
//         }
//     }
// }


// orm.create = function (schema, tableName) {
//     if (tableName === undefined)
//         console.log('Thiếu tên bảng')
//     tableName = `[${schemaTable}].${tableName}`
//     return {
//         _data: [schema],
//         getShema() {
//             return schema
//         },
//         getTableName() {
//             return tableName
//         },
//         create(data, callback) {
//             new mssql.Request().query(`SELECT CAST(NEWID() AS VARCHAR(36)) [GUID]`, (err, record) => {
//                 if (err) throw err
//                 let guid = record.recordset[0].GUID
//                 let request = new mssql.Request()
//                 let columns = ''
//                 let values = ''
//                 Object.keys(schema).forEach(e => {
//                     if (e != 'id' && e != 'guid') {
//                         request.input(schema[e], data[e] || null)
//                         columns = columns + `[${schema[e]}],`
//                         values = values + `@${schema[e]},`
//                     }
//                 })
//                 columns = columns.substring(0, columns.length - 1)
//                 values = values.substring(0, values.length - 1)
//                 columns = `([GUID],${columns})`
//                 values = `('${guid}',${values})`
//                 let query = `INSERT INTO ${tableName} ${columns}
//                                 VALUES ${values}`
//                 request.query(query, (err, record) => {
//                     if (err) throw err
//                     new mssql.Request().query(`SELECT ID FROM ${tableName}
//                     WHERE [GUID] = '${guid}'`, (err, record) => {
//                         if (err) throw err
//                         this.reload(() => {
//                             if (typeof callback === 'function')
//                                 callback(this.find(i => i.id == record.recordset[0].ID))
//                         })
//                     })
//                 })
//             })
//         },
//         updateById(id, data, callback) {
//             let request = new mssql.Request()
//             let values = ''
//             Object.keys(schema).forEach(e => {
//                 if (e != 'id' && e != 'guid') {
//                     if (data[e] !== undefined) { // Set những thuộc tính cần thay đổi
//                         request.input(schema[e], data[e])
//                         values = values + `[${schema[e]}]=@${schema[e]},`
//                     }
//                 }
//             })
//             values = values.substring(0, values.length - 1)
//             let query = `UPDATE ${tableName}
//                         SET ${values}
//                         WHERE ID = '${id}'`
//             request.query(query, (err, record) => {
//                 if (err) throw err
//                 Object.keys(schema).forEach(e => { //update schema
//                     if (e != 'id' && e != 'guid') {
//                         if (data[e] !== undefined) {
//                             let type = typeof this._data.find(i => i[e] != null)[e]
//                             if (type == 'number') {
//                                 this._data.find(i => i.id == id)[e] = parseFloat(data[e])
//                             } else {
//                                 this._data.find(i => i.id == id)[e] = data[e]
//                             }
//                         }
//                     }
//                 })
//                 if (typeof callback === 'function')
//                     callback(this.find(i => i.id == id))
//             })
//         },
//         deleteById(id, callback) {
//             let query = `DELETE ${tableName} WHERE [ID] = ${id}`
//             new mssql.Request()
//                 .query(query, (err, record) => {
//                     if (err) throw err
//                     callback(1)
//                 })
//             this._data.splice(this._data.findIndex(e => e.id == id), 1)
//         },
//         reload(callback) {
//             let columns = ''
//             Object.keys(schema).forEach(e => {
//                 columns = columns + `[${schema[e]}],`
//             })
//             columns = columns.substring(0, columns.length - 1)

//             let query = `SELECT ${columns} FROM ${tableName}`
//             new mssql.Request().query(query, (err, record) => {
//                 if (err) throw err
//                 this._data = []
//                 record.recordset.forEach(e => {
//                     let object = {}
//                     Object.keys(schema).forEach(i => {
//                         object[i] = e[schema[i]]
//                     })
//                     this._data.push(object)
//                 })
//                 this._data.sort((a, b) => a.id - b.id)
//                 if (typeof callback === 'function')
//                     callback(this)
//             })
//         },
//         begin(callback) {
//             this.reload(callback)
//             return this
//         },
//         find(func) {
//             if (this._data.find(func) === undefined) {
//                 this.reload()
//             }
//             return Object.assign({}, this._data.find(func))
//         },
//         filter(func) {
//             if (this._data.filter(func).length == 0) {
//                 this.reload()
//             }
//             return [...this._data.filter(func)]
//         },
//         findAll() {
//             return [...this._data]
//         }
//     }
// }

// /*
// const market = {
//     id: 'ID',
//     code: 'MARKET_CODE',
//     name: 'MARKET_NAME',
//     productId: 'PRODUCT_CODE'
// }

// let markets = orm.create(market, 'dbo.[MARKET]')

// setTimeout(() => {
//     markets.reload((o) => {

//     })
// }, 2000);

// */

// module.exports = orm