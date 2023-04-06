class MasterSalve {
    constructor(endPoint) {
        this.master = endPoint.find(i => i.type == 'master')
        this.backup = endPoint.find(i => i.type != 'master')
        this.masterIsAvailable = true
    }
    get() {
        if (this.masterIsAvailable)
            return this.master
        else
            return this.backup
    }
    error() {
        if (this.masterIsAvailable) { // master đang lỗi thì không cần check nữa, bởi nó đang được check ngầm rồi
            this.checkMaster()
        }
    }
    checkMaster() {
        const request = require('request')
        request.get(`http://${this.master.host}:${this.master.port}/ping`, (err, res, body) => {
            if (res) {
                if (res.statusCode == 200) {
                    return this.masterIsAvailable = true
                }
            }
            this.masterIsAvailable = false
            setTimeout(() => {
                this.checkMaster()
            }, 5 * 1000) // 5 giay
        })
    }
}

module.exports = MasterSalve