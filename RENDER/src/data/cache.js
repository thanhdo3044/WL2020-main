const model = require('./model')
// Khởi tạo class cache
class CacheApp {
    constructor() {
        this.data = []
    }
    add(e) {
        this.data.push({
            ...e
        })
        this[e.id] = {
            ...e
        }
        return Object.assign({}, this[e.id])
    }
    mAdd(es) {
        es.forEach(e => {
            this.data.push(e)
            this[e.id] = e
        })
        return true
    }
    getById(id) {
        return Object.assign({}, this[id])
    }
    find(fn) {
        return Object.assign({}, this.data.find(fn))
    }
    filter(fn) {
        let result = []
        this.data.filter(fn).forEach(e => {
            result.push(Object.assign({}, e))
        })
        return result
    }
    findAll() {
        let result = []
        this.data.forEach(e => {
            result.push(Object.assign({}, e))
        })
        return result
    }
    updateById(id, e) {
        let index = this.data.findIndex(i => i.id == id)
        if (index != -1) {
            this.data[index] = e
            this[id] = e
        }
    }
    deleteById(id) {
        delete this[id]
        let index = this.data.findIndex(i => i.id == id)
        this.data.splice(index, 1)
    }
    flush() {
        this.data = []
        Object.keys(this).forEach(key => {
            if (key != 'data')
                delete this[key]
        })
    }
}

const cache = {
    accounts: new CacheApp(),
    roles: new CacheApp(),
    roleTypes: new CacheApp(),
    roleGroups: new CacheApp(),
    roleValues: new CacheApp(),
    modules: new CacheApp(),
    customers: new CacheApp(),
    departments: new CacheApp(),
    items: new CacheApp(),
    itemsVCN: new CacheApp(),
    itemTypes: new CacheApp(),
    units: new CacheApp(),
    markets: new CacheApp(),
    vendors: new CacheApp()
}

// get data
Object.keys(model).forEach(key => {
    console.log(model)

    model[key].findAll()
        .then(data => {
            cache[key].mAdd(data.map(i => i.dataValues))
        })
})

module.exports = cache