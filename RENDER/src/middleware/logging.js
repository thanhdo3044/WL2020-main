module.exports = function (req,res,next){
    let start = new Date()
    res.on('finish', () => {
        req.finish = new Date()
        req.time = req.finish - req.timestamp
        console.log(`${require('../core/config').date.now().slice(0,19)} | ${req.headers['x-gateway-request-no'] || 0} | ${req.method.padEnd(4)}: ${req._parsedUrl.pathname.padEnd(20)} => ${(req.target ? (req.target.name+':'+ req.target.port) : '').padEnd(8)} ${res.statusCode} ${new Date() - start}ms`)
    })
    next()
}