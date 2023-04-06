function calculate(code, index, productionOrders) {
    productionOrders.find(i => i.code == code).order = index
    productionOrders.filter(i => i.parent == code).forEach(e => {
        calculate(e.code, index + 1, productionOrders)
    })
}

module.exports = function (code, productionOrders) {
    calculate(code,1,productionOrders)
    return productionOrders
}