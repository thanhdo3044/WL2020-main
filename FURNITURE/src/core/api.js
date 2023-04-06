const logging = function (req) {
    // if (req.log !== undefined) {
    //     let data = Object.assign({}, req.params, req.query, req.body)
    //     delete data.token
    //     req.log.data = JSON.stringify(data)
    //     req.log.err = JSON.stringify(req.error)
    //     req.log.resTime = require('./config').date.now()
    //     req.log.save()
    // }
}

const Api = {
    middleware: function (option) {
        this.option = option
        return (req, res, next) => {
            let api = {
                res: res,
                req: req,
                option: new Object(),
                sendData: function (data, status) {
                    logging(req)
                    this.res.status(status || 200)
                        .send({
                            meta: {
                                success: true,
                                messages: [],
                                status: status || 200,
                                name: this.option.name,
                                version: this.option.version,
                                counts : data.length || 0
                            },
                            data: data || []
                        })
                },
                sendFail: function (message, status) {
                    req.error = message
                    logging(req)
                    this.res.status(status || 400)
                        .send({
                            meta: {
                                success: false,
                                messages: message,
                                status: status || 400,
                                name: this.option.name,
                                version: this.option.version
                            },
                            data: []
                        })
                }
            }
            api.option = this.option
            req.api = api
            res.api = api
            next()
        }
    },
    option: new Object()
}

module.exports = Api