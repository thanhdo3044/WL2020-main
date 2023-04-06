const cache = require('./cache')

const view = {
    accountId: cache.accounts,
    customerId: cache.customers,
    roleId: cache.roles,
    vendorId: cache.vendors,
    stepId: cache.departments,
    departmentId: cache.departments,
    xuongId: cache.departments,
    factoryId: cache.departments,
    marketId: cache.markets,
    createBy: {
        getById(id) {
            return {
                createName: cache.accounts.getById(id).lastName
            }
        }
    },
    verifyBy : {
        getById(id){
            return {
                verifyBy : cache.accounts.getById(id).lastName
            }
        }
    },
    itemId : {
        getById(id){
            let item = cache.items.getById(id)
            if(!item)
                return {}
            item.unit = cache.units.getById(item.unitId)
            item.type = cache.itemTypes.getById(item.typeId)
            return item
        }
    },
    itemIdVCN : {
        getById(id){
            let item = cache.itemsVCN.getById(id)
            if(!item)
                return {}
            item.unit = cache.units.getById(item.unitId)
            item.type = cache.itemTypes.getById(item.typeId)
            return item
        }
    }
}

module.exports = view