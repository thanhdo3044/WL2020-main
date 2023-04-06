module.exports = function (productionTimeNorms, productionOrder) {
    productionOrder.forEach((e, i) => {
        let productionTimeNorm = productionTimeNorms.find(x => x.stepId == e.stepId && x.itemId == e.itemId) || {}
        productionOrder[i].oscp = productionTimeNorm.quantity || 0
        productionOrder[i].counts = Math.ceil(e.quantity / (productionTimeNorm.quantity || e.quantity))
    })
    return productionOrder
}