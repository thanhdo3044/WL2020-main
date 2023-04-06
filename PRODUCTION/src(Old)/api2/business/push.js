// const redis = require("redis")
// const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)


// client.on("error", function (err) {
//     //bỏ qua thông báo reconnect, hệ thống sẽ tự động connect ngầm, các thông báo lỗi khác sẽ vẫn hiển thị
//     if (err.code != 'ETIMEDOUT' && err.code != 'ECONNREFUSED')
//         console.log(err)
// });

// client.on('connect', () => {
//     console.log('REDIS : connected');
// })


module.exports = function push(option){
    //client.publish('production', JSON.stringify(option))
}
