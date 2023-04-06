module.exports = function(productionTimeNorms , productionOrders){
    productionOrders.forEach(e=>{
        let counts = e.counts
        let productionTimeNorm = productionTimeNorms.find(x => x.stepId == e.stepId && x.itemId == e.itemId) || {}
        for(let i = 1; i < counts; i++){
            let quantity = productionTimeNorm.quantity
            productionOrders.push({
                code : `${e.code}.${i}`,
                parent : (i == 1) ? (e.code) : (`${e.code}.${i-1}`),
                stepId : e.stepId,
                itemId : e.itemId,
                quantity : quantity,
                counts : 1
            })
            e.counts = e.counts - 1
            e.quantity = e.quantity - quantity
        }
    })
    return productionOrders
}