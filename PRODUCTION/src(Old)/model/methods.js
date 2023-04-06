

const interface = {
    create(schema) {
        return {
            _data: [schema],
            begin() {
                return this
            },
            create({},callback) {
                return schema
            },
            reload() {
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


const methods = {
    create (object) {
        this.addFind(object)
        this.addFilter(object)
        this.addFindAll(object)
        this.addBegin(object)
        return object
    },
    addFind: function (object) {
        object.find = function (func) {
            return Object.assign({}, object._data.find(func))
        }
        return object
    },
    addFilter: function (object) {
        object.filter = function (func) {
            return [...object._data.filter(func)]
        }
        return object
    },
    addFindAll: function (object) {
        object.findAll = function () {
            return [...object._data]
        }
        return object
    },
    addBegin: function (object) {
        object.begin = function () {
            object.reload()
            return object
        }
        return object
    }
}


module.exports = {
    interface,
    methods
}