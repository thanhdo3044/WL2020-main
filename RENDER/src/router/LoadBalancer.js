class LoadBalancer {
    constructor(endPoint) {
        this.endPoint = []
        this.index = 0
        endPoint.forEach(e => {
            this.endPoint.push({
                host: e.host,
                port: e.port,
                weight: e.weight || 1,
                current_turn: 0,
            })
        })
    }
    get() {
        let endPoint = this.endPoint[this.index]
        this.endPoint[this.index].current_turn++
        if (!(this.endPoint[this.index].current_turn < this.endPoint[this.index].weight)) {
            this.endPoint[this.index].current_turn = 0
            this.index++
            if (!(this.index < this.endPoint.length)) {
                this.index = 0
            }
        }
        return endPoint
    }
    error() {
        let endPointError = this.endPoint[this.index > 0 ? (this.index - 1) : (this.endPoint.length - 1)]
        this.endPoint.splice(this.index - 1, 1)
        setTimeout(() => {
            this.endPoint.push(endPointError)
        }, 10 * 60 * 1000) // 10 phút Thời gian chèn lại endpoint lỗi đó vào
    }
}


module.exports = LoadBalancer