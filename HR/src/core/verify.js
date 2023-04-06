function verify(req, res, next) {
    req.token = {}
    if (req.headers['x-gateway-account-id']) {
        req.token.accountId = req.headers['x-gateway-account-id']
    }
    next()
}
module.exports = verify