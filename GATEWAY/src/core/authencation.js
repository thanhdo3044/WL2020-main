const jwt = require('jsonwebtoken')
const {secretCode,getErrorMessage} = require('./config')

module.exports = function authencation(req, res, next) {
    // creteadBy HTHIEU(2021-04-09)
    if(req.body.forgetPassword === 1){ // nếu tìm mật khẩu thì cho call api hệ thống bỏ qua check token
        next();
    }else{
        const token = req.query.token ||
        req.query.access_token ||
        req.headers.token ||
        ((req.headers.authorization !== undefined) ? req.headers.authorization.replace("Bearer ", "") : null)||
        req.body.token
    if (token)
        jwt.verify(token, secretCode, (err, result) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4905))
            req.accountId = result.id
            req.isAuthencation = true
            next()
        })
    else {
        res.api.sendFail(getErrorMessage(4905))
    }
    }
    
}