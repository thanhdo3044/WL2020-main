const io = require('./../socket/index')
const {
    Items,
    Departments
} = require('./../rpc/index')


// Items.getById({
//     id: 109308
// }, (err, response) => {
//     if (err)
//         throw err
//     console.log(response)
// })



class Production {
    constructor(io) {
        this.io = io
        this.transaction = {}
        this.department = {}

        this.io.getDepartment = (id) => {
            return this.department[id] || {}
        }
    }
    hasTransaction(event, no) {
        this.transaction[no] = event
        event.forEach(e => {
            this.handleRecord(e)
        })

        let departments = []
        event.forEach(e => {
            departments.push(e.fromId)
        })
        departments = [...new Set(departments)]
        departments.forEach(e => {
            io.emit(`/production/${e}`, this.department[e])
        })

    }
    handleRecord(record) {
        // check department
        this.checkDepartment(record.fromId)
        record.items.forEach(e => {
            this.checkItem(record.fromId, e.itemId)
            let current = this.department[record.fromId].exports[e.itemId].quantity
            this.department[record.fromId].exports[e.itemId].quantity = current + e.quantity
        })
    }
    checkDepartment(id) {
        if (this.department[id] == undefined) {
            this.department[id] = {
                exports: {}
            }
            Departments.getById({
                id
            }, (err, department) => {
                if (err)
                    throw err
                Object.assign(this.department[id], department)
            })
        }
    }
    checkItem(departmentId, id) {
        if (this.department[departmentId].exports[id] == undefined) {
            this.department[departmentId].exports[id] = {
                quantity: 0
            }
            Items.getById({
                id
            }, (err, item) => {
                Object.assign(this.department[departmentId].exports[id], item)
            })
        }
    }
}

// Bởi vì cái này là theo ngày, nên ko cần thông tin ngày.
// 
const department = {
    '100000': {
        name: 'Thuận hưng sơ chế',
        exports: {
            100000: {
                name: '720x58x19',
                quantity: 100
            }
        }
    }
}


const production = new Production(io)



module.exports = production