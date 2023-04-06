function createTimes(firtTime) {
    let times = []
    firtTime = new Date(firtTime)
    let buf = firtTime

    for (let i = 0; i < 100; i++) {
        times.push({
            order: i * 2,
            time: buf.toLocaleDateString(),
            shift: 2
        })
        times.push({
            order: i * 2 + 1,
            time: buf.toLocaleDateString(),
            shift: 1
        })
        buf = prevDate(buf)
    }
    return times
}

// Lấy ra số ngày trước đó
function prevDate(ngay) {
    let date = new Date(ngay)
    date.setDate(date.getDate() - 1)
    return date
}

module.exports = function (firtTime, productionOrders) {
    let times = createTimes(firtTime)
    productionOrders.forEach(e => {
        let time = times.find(i => i.order == e.order - 1)
        e.time = time.time
        e.shift = time.shift
    })
    return productionOrders
}